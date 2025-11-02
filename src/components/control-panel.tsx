"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Youtube } from 'lucide-react';

interface ControlPanelProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

const ControlPanel = ({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  isStreaming,
  onToggleStreaming,
}: ControlPanelProps) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddClick = () => {
    onAddKeyword(newKeyword);
    setNewKeyword('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            Stream Controls
          </CardTitle>
          <CardDescription>Connect to your stream and manage settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stream-url">YouTube Stream URL</Label>
            <Input id="stream-url" placeholder="https://youtube.com/live/..." />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="stream-status">Live Comments</Label>
              <p className="text-xs text-muted-foreground">
                {isStreaming ? 'Simulating live comments.' : 'Simulation paused.'}
              </p>
            </div>
            <Switch
              id="stream-status"
              checked={isStreaming}
              onCheckedChange={onToggleStreaming}
              aria-label="Toggle comment stream"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Keyword Recognition</CardTitle>
          <CardDescription>Add or remove keywords for command recognition.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
            />
            <Button onClick={handleAddClick} size="icon" aria-label="Add keyword">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-grow h-32">
            <div className="flex flex-wrap gap-2">
              {keywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="text-sm font-medium">
                  {keyword}
                  <button onClick={() => onRemoveKeyword(keyword)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
