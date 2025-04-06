
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
      } catch (error) {
        console.error(`Error updating sync status for ${key}:`, error);
      }
    }
  }
}

/**
 * Check if there is unsynced data that needs to be synchronized
 */
export function hasUnsyncedData(): boolean {
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  if (!lastSync) return true;
  
  // Check each data type to see if it has been updated since the last sync
  for (const key of Object.keys(STORAGE_KEYS) as Array<keyof typeof STORAGE_KEYS>) {
    if (key === 'LAST_SYNC') continue;
    
    const updateTime = getLastUpdateTime(key as keyof StorableData);
    if (updateTime && updateTime > lastSync) {
      return true;
    }
  }
  
  return false;
}

/**
 * Clear all stored data (useful for logout)
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Sync data with the server (to be implemented with actual API calls)
 */
export async function syncData(): Promise<boolean> {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    // Here you would implement actual API calls to sync data
    // This is a placeholder for the actual implementation
    
    // For example:
    // const skills = loadData('skills', []);
    // await api.updateUserSkills(skills);
    
    // Pretend we've synced successfully
    markSynced();
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
