
/**
 * Utility for managing data persistence between sessions
 * and synchronizing between online and offline states
 */

// Types for different storable data
type StorableData = {
  skills: any[];
  experienceLevel: string;
  projectTypes: string[];
  contributionGoals: string[];
  savedRepositories: any[];
  userPreferences: Record<string, any>;
  contributionHistory: any[];
};

// Keys for different data types
const STORAGE_KEYS: Record<keyof StorableData | 'LAST_SYNC', string> = {
  skills: 'user-skills',
  experienceLevel: 'user-experience-level',
  projectTypes: 'user-project-types',
  contributionGoals: 'user-contribution-goals',
  savedRepositories: 'saved-repositories',
  userPreferences: 'user-preferences',
  contributionHistory: 'contribution-history',
  LAST_SYNC: 'last-sync-timestamp',
};

/**
 * Save data to localStorage with a timestamp
 * @param key The storage key
 * @param data The data to store
 */
export function saveData<K extends keyof StorableData>(
  key: K, 
  data: StorableData[K]
): void {
  try {
    const item = {
      data,
      timestamp: new Date().toISOString(),
    };
    
    const storageKey = STORAGE_KEYS[key];
    localStorage.setItem(storageKey, JSON.stringify(item));
    
    // Dispatch an event so other components can update
    window.dispatchEvent(new CustomEvent('local-data-updated', {
      detail: { key, data }
    }));

    // Queue sync if online, otherwise mark as needing sync
    if (navigator.onLine) {
      queueDataForSync(key, data);
    } else {
      markPendingSync(key);
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Load data from localStorage
 * @param key The storage key
 * @param defaultValue Default value if no data exists
 */
export function loadData<K extends keyof StorableData>(
  key: K, 
  defaultValue: StorableData[K]
): StorableData[K] {
  try {
    const storageKey = STORAGE_KEYS[key];
    const storedItem = localStorage.getItem(storageKey);
    if (!storedItem) return defaultValue;
    
    const { data } = JSON.parse(storedItem);
    return data;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Get the timestamp of the last data update
 * @param key The storage key
 */
export function getLastUpdateTime(key: keyof StorableData): string | null {
  try {
    const storedItem = localStorage.getItem(STORAGE_KEYS[key]);
    if (!storedItem) return null;
    
    const { timestamp } = JSON.parse(storedItem);
    return timestamp;
  } catch (error) {
    console.error(`Error getting timestamp for ${key}:`, error);
    return null;
  }
}

/**
 * Mark a sync operation as completed
 * @param key Optional specific data key that was synced
 */
export function markSynced(key?: keyof StorableData): void {
  const timestamp = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
  
  if (key) {
    const storedItem = localStorage.getItem(STORAGE_KEYS[key]);
    if (storedItem) {
      try {
        const parsed = JSON.parse(storedItem);
        parsed.lastSynced = timestamp;
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(parsed));
        
        // Remove from pending sync queue
        removePendingSync(key);
      } catch (error) {
        console.error(`Error updating sync status for ${key}:`, error);
      }
    }
  }
}

// Pending sync tracking
const PENDING_SYNC_KEY = 'pending-sync-items';

/**
 * Mark data as pending sync when offline
 */
function markPendingSync(key: keyof StorableData): void {
  try {
    const pendingSyncs = JSON.parse(localStorage.getItem(PENDING_SYNC_KEY) || '[]');
    if (!pendingSyncs.includes(key)) {
      pendingSyncs.push(key);
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingSyncs));
    }
  } catch (error) {
    console.error('Error marking pending sync:', error);
  }
}

/**
 * Remove item from pending sync
 */
function removePendingSync(key: keyof StorableData): void {
  try {
    const pendingSyncs = JSON.parse(localStorage.getItem(PENDING_SYNC_KEY) || '[]');
    const updatedSyncs = pendingSyncs.filter((k: string) => k !== key);
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(updatedSyncs));
  } catch (error) {
    console.error('Error removing pending sync:', error);
  }
}

/**
 * Get items that need to be synced
 */
export function getPendingSyncs(): Array<keyof StorableData> {
  try {
    return JSON.parse(localStorage.getItem(PENDING_SYNC_KEY) || '[]');
  } catch (error) {
    console.error('Error getting pending syncs:', error);
    return [];
  }
}

/**
 * Queue data for sync with the server when online
 */
function queueDataForSync<K extends keyof StorableData>(key: K, data: StorableData[K]): void {
  // Here you would implement logic to queue for sync
  // For now we'll just use the browser's built-in sync manager if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      // @ts-ignore - TypeScript doesn't recognize SyncManager yet
      registration.sync.register('sync-data');
    }).catch(error => {
      console.error('Error registering sync:', error);
    });
  } else {
    // Fall back to immediate sync attempt
    syncData().catch(error => {
      console.error('Error syncing data:', error);
      markPendingSync(key);
    });
  }
}

/**
 * Check if there is unsynced data that needs to be synchronized
 */
export function hasUnsyncedData(): boolean {
  return getPendingSyncs().length > 0;
}

/**
 * Clear all stored data (useful for logout)
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem(PENDING_SYNC_KEY);
}

/**
 * Sync data with the server (to be implemented with actual API calls)
 */
export async function syncData(): Promise<boolean> {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    const pendingSyncs = getPendingSyncs();
    
    if (pendingSyncs.length === 0) {
      return true;
    }
    
    console.log('Syncing data:', pendingSyncs);
    
    // Here you would implement actual API calls to sync data
    // For example:
    // for (const key of pendingSyncs) {
    //   const data = loadData(key as keyof StorableData, []);
    //   await apiService.syncData(key, data);
    //   markSynced(key as keyof StorableData);
    // }
    
    // For now, we'll just pretend we've synced successfully
    pendingSyncs.forEach(key => {
      markSynced(key as keyof StorableData);
    });
    
    return true;
  } catch (error) {
    console.error('Error syncing data:', error);
    return false;
  }
}

/**
 * Listen for data changes
 * @param callback Function to call when data changes
 */
export function subscribeToDataChanges(
  callback: (key: keyof StorableData, data: any) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail) {
      const { key, data } = customEvent.detail;
      callback(key, data);
    }
  };
  
  window.addEventListener('local-data-updated', handler);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('local-data-updated', handler);
  };
}

/**
 * Listen for online/offline status changes
 * @param callback Function to call when online status changes
 */
export function subscribeToOnlineStatus(
  callback: (isOnline: boolean) => void
): () => void {
  const onlineHandler = () => callback(true);
  const offlineHandler = () => callback(false);
  
  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('online', onlineHandler);
    window.removeEventListener('offline', offlineHandler);
  };
}

// Automatically attempt to sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Device is online, attempting to sync data');
    syncData().then(success => {
      if (success) {
        console.log('Data synchronized successfully');
      }
    });
  });
}
