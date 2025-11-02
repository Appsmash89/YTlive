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
  id: string;
  comment: Comment;
  command: string | undefined;
  feedback: string | undefined;
  timestamp: Date;
};
