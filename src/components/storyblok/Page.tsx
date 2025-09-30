// src/components/storyblok/Page.tsx
import { StoryblokServerComponent } from "@storyblok/react/rsc";

interface PageBlok {
  _uid: string;
  component: "page";
  body?: any[];
}

interface PageProps {
  blok: PageBlok;
}

export default function Page({ blok }: PageProps) {
  return (
    <main className="min-h-screen">
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}