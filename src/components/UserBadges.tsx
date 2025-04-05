
import React from 'react';
import { Badge as BadgeType, BadgeCategory } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { format } from 'date-fns';

interface UserBadgesProps {
  badges: BadgeType[];
}

const UserBadges = ({ badges }: UserBadgesProps) => {
  const getCategoryColor = (category: BadgeCategory) => {
    switch (category) {
      case BadgeCategory.Achievement:
        return "bg-amber-100 border-amber-300";
      case BadgeCategory.Contribution:
        return "bg-green-100 border-green-300";
      case BadgeCategory.Skill:
        return "bg-blue-100 border-blue-300";
      case BadgeCategory.Community:
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };
  
  if (!badges || badges.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Badges & Achievements</h3>
      
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex gap-3">
          <TooltipProvider>
            {badges.map((badge) => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 p-1 cursor-help
                      ${getCategoryColor(badge.category)}`}
                  >
                    <img 
                      src={badge.iconUrl} 
                      alt={badge.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="space-y-1">
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <p className="text-xs">Earned on {format(new Date(badge.dateEarned), 'MMM d, yyyy')}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserBadges;
