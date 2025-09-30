// src/components/storyblok/Feature.tsx
interface FeatureBlok {
  _uid: string;
  component: "feature";
  name: string;
}

interface FeatureProps {
  blok: FeatureBlok;
}

export default function Feature({ blok }: FeatureProps) {
  return (
    <div className="feature p-4 border rounded-lg">
      <span className="text-lg font-semibold">{blok.name}</span>
    </div>
  );
}