// src/components/storyblok/Teaser.tsx
interface TeaserBlok {
  _uid: string;
  component: "teaser";
  headline?: string;
}

interface TeaserProps {
  blok: TeaserBlok;
}

export default function Teaser({ blok }: TeaserProps) {
  return (
    <div className="teaser p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">{blok.headline}</h2>
    </div>
  );
}