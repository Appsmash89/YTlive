import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <Bot className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Stream Control AI
        </h1>
      </div>
    </header>
  );
};

export default Header;
