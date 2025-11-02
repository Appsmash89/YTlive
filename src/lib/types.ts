export type Author = {
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  author: Author;
  text: string;
};

export type CommandLog = {
  id:string;
  comment: Comment;
  command: string | undefined;
  feedback: string | undefined;
  timestamp: Date;
};

export type TarotCard = {
  name: string;
  number: string;
  arcana: string;
  suit: string;
  imageUrl: string;
  imageHint: string;
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  favorableColor: string;
  obstacleAdvice: string;
  description: string;
};

export type DisplayMode = 'fastfood' | 'tarot';
