"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Youtube, Bug, Languages } from 'lucide-react';
import ControlPanel from '@/components/control-panel';
import KeywordEditor from '@/components/keyword-editor';
import DevTools from '@/components/dev-tools';
import type { DisplayMode } from '@/lib/types';

interface ControlSidebarProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  onManualComment: (commentText: string) => void;
  displayMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  youtubeVideoId: string;
  onYoutubeVideoIdChange: (id: string) => void;
}

const ControlSidebar = (props: ControlSidebarProps) => {
  return (
    <Accordion type="multiple" defaultValue={['stream-controls', 'dev-tools']} className="w-full space-y-4">
      <AccordionItem value="stream-controls" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 hover:no-underline text-sm font-medium">
            <div className="flex items-center gap-3">
              <Youtube className="h-5 w-5 text-red-500" />
              <span>Stream Controls</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t">
            <ControlPanel
              isStreaming={props.isStreaming}
              onToggleStreaming={props.onToggleStreaming}
              youtubeVideoId={props.youtubeVideoId}
              onYoutubeVideoIdChange={props.onYoutubeVideoIdChange}
            />
          </AccordionContent>
      </AccordionItem>

      <AccordionItem value="keyword-recognition" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 hover:no-underline text-sm font-medium">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-primary" />
              <span>Keyword Recognition</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t">
            <KeywordEditor
              keywords={props.keywords}
              onAddKeyword={props.onAddKeyword}
              onRemoveKeyword={props.onRemoveKeyword}
            />
          </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dev-tools" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 hover:no-underline text-sm font-medium">
             <div className="flex items-center gap-3">
                <Bug className="h-5 w-5 text-accent" />
                <span>Dev Tools</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t">
            <DevTools
              onManualComment={props.onManualComment}
              keywords={props.keywords}
              displayMode={props.displayMode}
              onModeChange={props.onModeChange}
            />
          </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ControlSidebar;
