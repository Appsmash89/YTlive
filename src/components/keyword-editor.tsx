"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';


interface KeywordEditorProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const KeywordEditor = ({ keywords, onAddKeyword, onRemoveKeyword }: KeywordEditorProps) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddClick = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword);
      setNewKeyword('');
    }
  };

  return (
    <CardContent className="p-4 md:p-6 flex flex-col gap-4">
       <div className="space-y-2">
        <Label>Custom Keywords</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
          />
          <Button onClick={handleAddClick} size="icon" aria-label="Add keyword">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow h-32 border rounded-md p-2">
        <div className="flex flex-wrap gap-2">
          {keywords.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">No custom keywords added.</p>
          ) : (
            keywords.map(keyword => (
              <Badge key={keyword} variant="secondary" className="text-sm font-medium">
                {keyword}
                <button onClick={() => onRemoveKeyword(keyword)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default KeywordEditor;
