"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Terminal, MessageSquareWarning } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CommandLog } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface CommandLogProps {
  history: CommandLog[];
}

const CommandLogDisplay = ({ history }: CommandLogProps) => {
  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-2">
         <Terminal className="h-5 w-5" />
        <CardTitle>Command Log</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Terminal className="h-10 w-10 mb-4" />
                <p className="font-medium">Executed commands will be logged here</p>
                <p className="text-sm">Awaiting comments from the feed...</p>
            </div>
          ) : (
          <div className="p-4 space-y-4">
            {history.map(log => (
              <div key={log.id} className="flex gap-4 items-start">
                <div>
                  {log.command ? (
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  ) : (
                    <MessageSquareWarning className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {log.command ? (
                        <span className="text-accent">{log.feedback || 'Command Executed'}</span>
                      ) : (
                        <span className="text-muted-foreground">{log.feedback || 'No command'}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground p-2 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={log.comment.author.avatar} alt={log.comment.author.name} />
                        <AvatarFallback>{log.comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{log.comment.author.name}:</span>
                      <span>"{log.comment.text}"</span>
                    </div>
                  </div>
                  
                  {log.command && (
                    <p className="font-mono text-xs bg-muted/50 text-foreground p-1 rounded-sm w-fit">
                      &gt; {log.command}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommandLogDisplay;
