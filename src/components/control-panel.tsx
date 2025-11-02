"use client";

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';

interface ControlPanelProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

const ControlPanel = ({
  isStreaming,
  onToggleStreaming,
}: ControlPanelProps) => {
  return (
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stream-url">YouTube Stream URL</Label>
          <Input id="stream-url" placeholder="https://youtube.com/live/..." />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
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
  );
};

export default ControlPanel;
