import { placeholderImages } from './placeholder-images';

type MediaItem = {
  type: 'image';
  url: string;
  hint: string;
};

export const mediaMap: Record<string, MediaItem> = placeholderImages.reduce(
  (acc, image) => {
    acc[image.id] = {
      type: 'image',
      url: image.imageUrl,
      hint: image.imageHint,
    };
    return acc;
  },
  {} as Record<string, MediaItem>
);
