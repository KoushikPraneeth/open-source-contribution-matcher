
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Listen for keyboard shortcut to show help dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show keyboard shortcuts on shift+?
      if (e.shiftKey && e.key === '?') {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsOpen(true)}
        aria-label="View keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden md:inline">Keyboard Shortcuts</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate the application quickly.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="navigation" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="navigation" className="flex-1">Navigation</TabsTrigger>
              <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
              <TabsTrigger value="accessibility" className="flex-1">Accessibility</TabsTrigger>
            </TabsList>
            
            <TabsContent value="navigation" className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Alt + D</div>
                <div>Go to Dashboard</div>
                
                <div className="font-medium">Alt + R</div>
                <div>Go to Recommendations</div>
                
                <div className="font-medium">Alt + C</div>
                <div>Go to Contributions</div>
                
                <div className="font-medium">Alt + S</div>
                <div>Go to Saved Issues</div>
                
                <div className="font-medium">Alt + K</div>
                <div>Go to Skills</div>
                
                <div className="font-medium">Alt + P</div>
                <div>Go to Profile</div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Shift + ?</div>
                <div>Show this help dialog</div>
                
                <div className="font-medium">Alt + T</div>
                <div>Toggle dark/light mode</div>
                
                <div className="font-medium">Ctrl + /</div>
                <div>Focus search</div>
                
                <div className="font-medium">Esc</div>
                <div>Close modal or popover</div>
              </div>
            </TabsContent>
            
            <TabsContent value="accessibility" className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Tab</div>
                <div>Navigate between interactive elements</div>
                
                <div className="font-medium">Shift + Tab</div>
                <div>Navigate backward between elements</div>
                
                <div className="font-medium">Enter / Space</div>
                <div>Activate buttons, links, or controls</div>
                
                <div className="font-medium">Arrow keys</div>
                <div>Navigate within components (e.g., dropdown menu)</div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Press Shift+? anytime to view this dialog
            </div>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default KeyboardShortcutsHelp;
