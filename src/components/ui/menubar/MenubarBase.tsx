
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { cn } from "@/lib/utils"

// Base Menubar component
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

// Menubar Menu component
const MenubarMenu = MenubarPrimitive.Menu

// Menubar Group component
const MenubarGroup = MenubarPrimitive.Group

// Menubar Portal component
const MenubarPortal = MenubarPrimitive.Portal

// Menubar Sub component
const MenubarSub = MenubarPrimitive.Sub

// Menubar Radio Group component
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

// Menubar Trigger component
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
}
