//src/types/storyblok.ts
export interface StoryblokStory {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    full_slug: string;
    content: any;
    created_at: string;
    published_at: string;
    first_published_at: string;
    lang: string;
}

export interface StoryblokResponse {
    story: StoryblokStory;
    cv: number;
    rels: any[];
    links: any[];
}