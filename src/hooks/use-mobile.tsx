
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set the initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

// Add a debounced version for performance optimization
export function useIsMobileDebounced(delay = 250) {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    let timeoutId: NodeJS.Timeout | null = null
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }, delay)
    }
    
    // Set the initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [delay])
  
  return isMobile
}
