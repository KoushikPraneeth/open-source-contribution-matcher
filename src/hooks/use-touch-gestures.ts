
import { useEffect, useState, useRef } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  horizontal: 'left' | 'right' | null;
  vertical: 'up' | 'down' | null;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseTouchGesturesOptions extends SwipeHandlers {
  threshold?: number; // Minimum distance for a swipe to be registered
  preventDefault?: boolean; // Whether to prevent default behavior
}

/**
 * Hook for handling touch gestures
 * @param elementRef The ref of the element to attach the touch handlers to
 * @param options Configuration options
 */
export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  options: UseTouchGesturesOptions = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = true
  } = options;
  
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({
    horizontal: null,
    vertical: null
  });
  
  const startPosition = useRef<TouchPosition | null>(null);
  const currentPosition = useRef<TouchPosition | null>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (preventDefault) {
        // Only prevent default if we're handling this swipe
        if (onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown) {
          e.preventDefault();
        }
      }
      
      const touch = e.touches[0];
      startPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      currentPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      setIsSwiping(true);
      setSwipeDirection({ horizontal: null, vertical: null });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!startPosition.current) return;
      
      const touch = e.touches[0];
      currentPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      // Calculate direction
      const deltaX = currentPosition.current.x - startPosition.current.x;
      const deltaY = currentPosition.current.y - startPosition.current.y;
      
      const direction: SwipeDirection = {
        horizontal: null,
        vertical: null
      };
      
      // Determine horizontal direction if movement is significant
      if (Math.abs(deltaX) > threshold / 2) {
        direction.horizontal = deltaX > 0 ? 'right' : 'left';
      }
      
      // Determine vertical direction if movement is significant
      if (Math.abs(deltaY) > threshold / 2) {
        direction.vertical = deltaY > 0 ? 'down' : 'up';
      }
      
      setSwipeDirection(direction);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startPosition.current || !currentPosition.current) return;
      
      const deltaX = currentPosition.current.x - startPosition.current.x;
      const deltaY = currentPosition.current.y - startPosition.current.y;
      
      // Only trigger handlers if swipe distance exceeds threshold
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
      
      // Reset state
      startPosition.current = null;
      currentPosition.current = null;
      setIsSwiping(false);
      setSwipeDirection({ horizontal: null, vertical: null });
    };
    
    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Remove event listeners on cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    elementRef, 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    threshold, 
    preventDefault
  ]);
  
  return {
    isSwiping,
    swipeDirection
  };
}

// Helper hook for swipeable lists
export function useSwipeableList<T>(
  items: T[],
  options: {
    onSwipeLeft?: (item: T, index: number) => void;
    onSwipeRight?: (item: T, index: number) => void;
  }
) {
  const { onSwipeLeft, onSwipeRight } = options;
  
  const getHandlers = (item: T, index: number) => {
    return {
      onSwipeLeft: onSwipeLeft ? () => onSwipeLeft(item, index) : undefined,
      onSwipeRight: onSwipeRight ? () => onSwipeRight(item, index) : undefined
    };
  };
  
  return { getHandlers };
}
