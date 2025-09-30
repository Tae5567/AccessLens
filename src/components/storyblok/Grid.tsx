// src/components/storyblok/Grid.tsx
import { StoryblokServerComponent } from "@storyblok/react/rsc";

interface GridBlok {
  _uid: string;
  component: "grid";
  columns?: any[];
}

interface GridProps {
  blok: GridBlok;
}

export default function Grid({ blok }: GridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {blok.columns?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}