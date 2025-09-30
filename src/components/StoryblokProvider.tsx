//src/components/StoryblokProvider.tsx
"use client";

import { getStoryblokAPi } from "@/lib/storyblok";
import { get } from "http";
import { ReactNode } from "react";

interface StoryblokProviderProps {
    children: ReactNode;
}

export default function StoryblokProvider({ children }: StoryblokProviderProps) {
    getStoryblokAPi();
    return <>{children}</>;
}