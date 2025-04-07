"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface TooltipStep {
  targetId: string
  title: string
  content: string
  position?: "top" | "right" | "bottom" | "left"
}

interface TooltipTourProps {
  steps: TooltipStep[]
  tourId: string
  startAutomatically?: boolean
  onComplete?: () => void
}

export function TooltipTour({
  steps,
  tourId,
  startAutomatically = false,
  onComplete
}: TooltipTourProps) {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(startAutomatically)
  const [completedTours, setCompletedTours] = useLocalStorage<string[]>("completed-tours", [])
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const hasCompletedTour = completedTours.includes(tourId)

  useEffect(() => {
    if (hasCompletedTour) return
    
    // Start after a short delay if automatic
    if (startAutomatically) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [startAutomatically, hasCompletedTour])

  useEffect(() => {
    if (!isVisible) return

    const updatePosition = () => {
      const targetElement = document.getElementById(steps[currentStep]?.targetId)
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const position = steps[currentStep]?.position || "bottom"
      
      const tooltipWidth = 280
      const tooltipHeight = 150
      const margin = 15

      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = rect.top - tooltipHeight - margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + margin
          break
        case "bottom":
          top = rect.bottom + margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - margin
          break
      }

      // Keep tooltip in viewport
      top = Math.max(10, Math.min(window.innerHeight - tooltipHeight - 10, top))
      left = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, left))

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)

    // Add a highlight to the target element
    const targetElement = document.getElementById(steps[currentStep]?.targetId)
    if (targetElement) {
      targetElement.classList.add("tour-highlight")
      targetElement.setAttribute("aria-describedby", `tooltip-${tourId}-${currentStep}`)
    }

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
      
      // Remove highlight
      if (targetElement) {
        targetElement.classList.remove("tour-highlight")
        targetElement.removeAttribute("aria-describedby")
      }
    }
  }, [isVisible, currentStep, steps])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    setCurrentStep(0)
    
    // Mark tour as completed
    if (!hasCompletedTour) {
      setCompletedTours(prev => [...prev, tourId])
    }
    
    if (onComplete) {
      onComplete()
    }
  }

  // Function to manually start the tour
  const startTour = () => {
    setCurrentStep(0)
    setIsVisible(true)
  }

  if (!isVisible || !steps[currentStep]) return null

  return (
    <>
      {/* Backdrop overlay for better focus */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]" />
      
      <div
        id={`tooltip-${tourId}-${currentStep}`}
        className="fixed z-[70] w-[280px] rounded-lg shadow-lg bg-background border border-border p-4"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`tooltip-title-${tourId}-${currentStep}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleSkip}
          aria-label="Close tooltip"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h3
          id={`tooltip-title-${tourId}-${currentStep}`}
          className="text-lg font-semibold mb-2"
        >
          {steps[currentStep].title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {steps[currentStep].content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full ${
                  index === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
              >
                Previous
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Export a hook to control the tooltip tour externally
export function useTooltipTour(tourId: string) {
  const [isActive, setIsActive] = useState(false)
  const [completedTours, setCompletedTours] = useLocalStorage<string[]>("completed-tours", [])
  
  const startTour = () => setIsActive(true)
  const endTour = () => setIsActive(false)
  const resetTour = () => {
    setCompletedTours(prev => prev.filter(id => id !== tourId))
  }
  
  const hasCompleted = completedTours.includes(tourId)
  
  return {
    isActive,
    startTour,
    endTour,
    resetTour,
    hasCompleted
  }
}
