"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, VideoOff, Sparkles, Paintbrush, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { TarotCard, DisplayMode, CarState, MazeState, ActiveMedia } from '@/lib/types';
import DriveAnimation from './drive-animation';
import FindWayPuzzle from './find-way-puzzle';


interface DisplayViewportProps {
  activeMedia: ActiveMedia | null;
  activeTarotCard: TarotCard | null;
  displayMode: DisplayMode;
  carState?: CarState;
  mazeState?: MazeState;
}

const DisplayViewport = ({ activeMedia, activeTarotCard, displayMode, carState, mazeState }: DisplayViewportProps) => {
  const isFastFood = displayMode === 'fastfood' && activeMedia;
  const isTarot = displayMode === 'tarot' && activeTarotCard;
  const isDrive = displayMode === 'drive';
  const isFindWay = displayMode === 'findway';


  let content: ActiveMedia | null = null;
  if (isFastFood) {
    content = activeMedia;
  } else if (isTarot) {
    content = {
      key: activeTarotCard.name,
      url: activeTarotCard.imageUrl,
      command: activeTarotCard.name,
      hint: activeTarotCard.imageHint,
      authorName: activeMedia?.authorName || 'a wanderer',
      type: 'image'
    };
  }


  return (
    <Card className="w-full h-[480px]">
      <CardHeader className="flex flex-row items-center gap-2">
        <Clapperboard className="h-5 w-5" />
        <CardTitle>Display Viewport</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-72px)] items-center justify-center bg-muted/30 rounded-b-lg overflow-hidden relative">
        <AnimatePresence mode="wait">
          {content ? (
            <motion.div
              key={content.url}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
                <div className="relative w-full h-full">
                    {isTarot && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent z-10" />
                    )}
                    <Image
                        src={content.url}
                        alt={content.command}
                        fill
                        className="object-cover"
                        data-ai-hint={content.hint}
                    />
                     <div className="absolute bottom-4 left-4 z-20 bg-black/50 text-white px-3 py-1.5 rounded-lg">
                        <p className="text-sm font-semibold">
                            Requested by: <span className="font-bold">{content.authorName}</span>
                        </p>
                    </div>

                    {isTarot && activeTarotCard && (
                         <div className="absolute bottom-12 left-0 right-0 p-6 text-white z-20 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight">{activeTarotCard.name}</h3>
                                <p className="text-sm uppercase font-medium text-amber-300">{activeTarotCard.arcana} - {activeTarotCard.suit}</p>
                                <ul className="mt-4 space-y-1 text-base">
                                    {activeTarotCard.meanings.light.slice(0, 2).map((meaning, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Sparkles className="h-4 w-4 mt-1 shrink-0 text-amber-300" />
                                            <span>{meaning}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 md:mt-0 md:pt-12 space-y-3 text-right">
                                <div className="flex justify-end items-start gap-2">
                                    <div className="text-right">
                                        <p className="font-semibold">Favorable Color</p>
                                        <p className="text-sm text-muted-foreground">{activeTarotCard.favorableColor}</p>
                                    </div>
                                    <Paintbrush className="h-5 w-5 mt-0.5 shrink-0" />
                                </div>
                                <div className="flex justify-end items-start gap-2">
                                   <div className="text-right">
                                      <p className="font-semibold">To Overcome Obstacles</p>
                                      <p className="text-sm text-muted-foreground">{activeTarotCard.obstacleAdvice}</p>
                                   </div>
                                    <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
          ) : isDrive ? (
              <DriveAnimation carState={carState!} />
          ) : isFindWay ? (
              <FindWayPuzzle mazeState={mazeState!} />
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
