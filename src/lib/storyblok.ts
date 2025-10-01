//src/lib/storyblok.ts
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import Page from "@/components/storyblok/Page";
import Feature from "@/components/storyblok/Feature";
import Grid from "@/components/storyblok/Grid";
import Teaser from "@/components/storyblok/Teaser";
import BlogPost from "@/components/storyblok/BlogPost";

export const getStoryblokAPi = storyblokInit({
    accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
    use: [apiPlugin],
    components: {
        page: Page,
        feature: Feature,
        grid: Grid,
        teaser: Teaser,
        blog_post: BlogPost,
    },
    apiOptions: {
        region: "eu",
    },
});