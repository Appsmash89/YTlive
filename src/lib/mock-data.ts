import type { Author } from './types';

const authors: Author[] = [
  { name: 'StreamFan22', avatar: 'https://picsum.photos/seed/1/40/40' },
  { name: 'GamerGod', avatar: 'https://picsum.photos/seed/2/40/40' },
  { name: 'JustChatting', avatar: 'https://picsum.photos/seed/3/40/40' },
  { name: 'DevDude', avatar: 'https://picsum.photos/seed/4/40/40' },
  { name: 'ArtLover', avatar: 'https://picsum.photos/seed/5/40/40' },
  { name: 'SpeedRunnerX', avatar: 'https://picsum.photos/seed/6/40/40' },
  { name: 'CasualViewer', avatar: 'https://picsum.photos/seed/7/40/40' },
  { name: 'TechieTom', avatar: 'https://picsum.photos/seed/8/40/40' },
];

const commentTemplates: string[] = [
  'This is awesome!',
  'LOL that was unexpected.',
  'Can you try moving to the right?',
  'Go forward!',
  'I think you should go back a bit.',
  'Let\'s see a jump!',
  'Please stop for a moment.',
  'Love this stream!',
  'Could you move left please?',
  'What happens if you go back?',
  'Amazing play!',
  'Let\'s gooooo!',
  'Maybe try to jump over that.',
  'I dare you to go forward into the cave!',
  'This is my favorite streamer.',
  'Turn left at the next corner.',
  'Don\'t stop now, you\'re so close!',
  'How do you do that?',
  'Nice move to the right.',
  'The graphics are incredible.',
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMockComment = () => {
  return {
    id: crypto.randomUUID(),
    author: getRandomItem(authors),
    text: getRandomItem(commentTemplates),
  };
};
