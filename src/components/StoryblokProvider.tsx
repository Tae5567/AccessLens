// src/components/StoryblokProvider.tsx
"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { ReactNode } from "react";
import Page from "@/components/storyblok/Page";
import Feature from "@/components/storyblok/Feature";
import Grid from "@/components/storyblok/Grid";
import Teaser from "@/components/storyblok/Teaser";
import BlogPost from "@/components/storyblok/BlogPost";

const components = {
    page: Page,
    feature: Feature,
    grid: Grid,
    teaser: Teaser,
    blog_post: BlogPost,
};

storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    components,
});

export default function StoryblokProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}