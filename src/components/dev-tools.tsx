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
      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="space-y-3">
            <Label>Display Mode</Label>
            <RadioGroup
              defaultValue="fastfood"
              className="grid grid-cols-2 gap-2"
              onValueChange={(value: DisplayMode) => onModeChange(value)}
              value={displayMode}
            >
              <div>
                <RadioGroupItem value="fastfood" id="fastfood" className="peer sr-only" />
                <Label
                  htmlFor="fastfood"
                  className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Utensils className="h-5 w-5" />
                  <span className="font-medium">FastFood</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="tarot" id="tarot" className="peer sr-only" />
                <Label
                  htmlFor="tarot"
                  className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Tarot</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="drive" id="drive" className="peer sr-only" />
                <Label
                  htmlFor="drive"
                  className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Car className="h-5 w-5" />
                  <span className="font-medium">Drive</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="findway" id="findway" className="peer sr-only" />
                <Label
                  htmlFor="findway"
                  className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Waypoints className="h-5 w-5" />
                  <span className="font-medium">Find Way</span>
                </Label>
              </div>
            </RadioGroup>
        </div>

        <div className="space-y-3">
           <Label>Manual Comment</Label>
           <div className="space-y-2">
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
        </div>
        
        {relevantKeywords.length > 0 && (
          <div className="space-y-3">
              <Label>Keyword Shortcuts</Label>
              <ScrollArea className="h-24 border rounded-md p-2">
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
