// src/app/page.tsx
import { getStoryblokAPi } from "@/lib/storyblok";
import { StoryblokStory } from "@storyblok/react/rsc";

export default async function Home() {
  try {
    const storyblokApi = getStoryblokAPi();
    const { data } = await storyblokApi.get("cdn/stories/home", { 
      version: "draft" 
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <StoryblokStory story={data.story} />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to AccessLens</h1>
          <p className="text-gray-600 mb-6">
            The ultimate accessibility preview tool for Storyblok
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              No story found. Please configure a "home" story in your Storyblok space
              or access AccessLens from within the Storyblok visual editor.
            </p>
          </div>
        </div>
      </div>
    );
  }
}