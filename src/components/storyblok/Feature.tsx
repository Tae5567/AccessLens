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
    <div className="feature p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800">{blok.name}</h3>
    </div>
  );
}