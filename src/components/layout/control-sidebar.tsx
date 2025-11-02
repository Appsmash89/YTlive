"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
}

const ControlSidebar = (props: ControlSidebarProps) => {
  return (
    <Accordion type="multiple" className="w-full space-y-6">
      <AccordionItem value="stream-controls" className="border-none">
        <Card>
          <AccordionTrigger className="p-6 hover:no-underline">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Stream Controls
              </CardTitle>
              <CardDescription>Connect to your stream and manage settings.</CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <ControlPanel
              isStreaming={props.isStreaming}
              onToggleStreaming={props.onToggleStreaming}
            />
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="keyword-recognition" className="border-none">
        <Card>
          <AccordionTrigger className="p-6 hover:no-underline">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Keyword Recognition
              </CardTitle>
              <CardDescription>Add or remove keywords for command recognition.</CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <KeywordEditor
              keywords={props.keywords}
              onAddKeyword={props.onAddKeyword}
              onRemoveKeyword={props.onRemoveKeyword}
            />
          </AccordionContent>
        </Card>
      </AccordionItem>

      <AccordionItem value="dev-tools" className="border-none">
        <Card>
          <AccordionTrigger className="p-6 hover:no-underline">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Dev Tools
              </CardTitle>
              <CardDescription>Manually send comments & change modes.</CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <DevTools
              onManualComment={props.onManualComment}
              keywords={props.keywords}
              displayMode={props.displayMode}
              onModeChange={props.onModeChange}
            />
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

export default ControlSidebar;
