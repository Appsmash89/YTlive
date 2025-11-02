"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Utensils, Sparkles, Car, Waypoints } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { DisplayMode } from '@/lib/types';
import { KEYWORDS_MAP } from '@/lib/constants';

interface DevToolsProps {
  onManualComment: (comment: string) => void;
  keywords: string[];
  displayMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

const DevTools = ({ onManualComment, keywords, displayMode, onModeChange }: DevToolsProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSendComment = () => {
    if (commentText.trim()) {
      onManualComment(commentText.trim());
      setCommentText('');
    }
  };
  
  const relevantKeywords = KEYWORDS_MAP[displayMode] || keywords.filter(k => !Object.values(KEYWORDS_MAP).flat().includes(k));

  return (
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Display Mode</Label>
            <RadioGroup
              defaultValue="fastfood"
              className="grid grid-cols-2 gap-4"
              onValueChange={(value: DisplayMode) => onModeChange(value)}
              value={displayMode}
            >
              <div>
                <RadioGroupItem value="fastfood" id="fastfood" className="peer sr-only" />
                <Label
                  htmlFor="fastfood"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Utensils className="mb-3 h-6 w-6" />
                  FastFood
                </Label>
              </div>
              <div>
                <RadioGroupItem value="tarot" id="tarot" className="peer sr-only" />
                <Label
                  htmlFor="tarot"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Sparkles className="mb-3 h-6 w-6" />
                  Tarot
                </Label>
              </div>
              <div>
                <RadioGroupItem value="drive" id="drive" className="peer sr-only" />
                <Label
                  htmlFor="drive"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Car className="mb-3 h-6 w-6" />
                  Drive
                </Label>
              </div>
              <div>
                <RadioGroupItem value="findway" id="findway" className="peer sr-only" />
                <Label
                  htmlFor="findway"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Waypoints className="mb-3 h-6 w-6" />
                  Find Way
                </Label>
              </div>
            </RadioGroup>
        </div>

        <div className="space-y-2">
           <Label>Manual Comment</Label>
          <Textarea
            placeholder="Type a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
          />
          <Button onClick={handleSendComment} className="w-full">
            <Send className="mr-2" />
            Send Comment
          </Button>
        </div>
        
        {relevantKeywords.length > 0 && (
          <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Click to send a keyword comment:</p>
              <ScrollArea className="h-24">
                  <div className="flex flex-wrap gap-2">
                      {relevantKeywords.map((keyword) => (
                          <Badge 
                              key={keyword} 
                              variant="secondary" 
                              className="cursor-pointer hover:bg-primary/20"
                              onClick={() => onManualComment(keyword)}
                          >
                              {keyword}
                          </Badge>
                      ))}
                  </div>
              </ScrollArea>
          </div>
        )}
      </CardContent>
  );
};

export default DevTools;
