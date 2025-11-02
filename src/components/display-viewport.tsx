
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, VideoOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface DisplayViewportProps {
  activeMedia: {
    url: string;
    type: string;
    command: string;
    hint?: string;
  } | null;
}

const DisplayViewport = ({ activeMedia }: DisplayViewportProps) => {
  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Clapperboard className="h-5 w-5" />
        <CardTitle>Display Viewport</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center bg-muted/30 rounded-b-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {activeMedia ? (
            <motion.div
              key={activeMedia.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={activeMedia.url}
                alt={activeMedia.command}
                fill
                className="object-contain"
                data-ai-hint={activeMedia.hint || activeMedia.command}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground text-center p-8">
              <VideoOff className="h-12 w-12 mb-4" />
              <p className="font-medium text-lg">Display is offline</p>
              <p className="text-sm">Commands from user comments will appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DisplayViewport;
