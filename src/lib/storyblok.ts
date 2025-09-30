//src/lib/storyblok.ts
import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";
import Page from "@/components/storyblok/Page";
import Feature from "@/components/storyblok/Feature";
import Grid from "@/components/storyblok/Grid";

export const getStoryblokAPi = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components: {
        page: Page,
        feature: Feature,
        grid: Grid,
    },
    apiOptions: {
        region: "eu",
    },
});