// src/app/preview/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SimulationOverlay } from "@/components/accessibility/SimulationOverlay";
import { getStoryblokAPi } from "@/lib/storyblok";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const storySlug = searchParams.get("story");
  const [storyContent, setStoryContent] = useState<string>("");
  const [storyId, setStoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (storySlug) {
      loadStoryContent(storySlug);
    }
  }, [storySlug]);

  const loadStoryContent = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const storyblokApi = getStoryblokAPi();
      const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
        version: "draft",
      });

      // Convert Storyblok content to HTML for analysis
      const htmlContent = renderStoryblokContentToHTML(data.story.content);
      setStoryContent(htmlContent);
      setStoryId(data.story.id.toString());
    } catch (err) {
      console.error("Error loading story:", err);
      setError("Failed to load story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStoryblokContentToHTML = (content: any): string => {
    // This is a simplified converter - you'll need to expand this based on your components
    let html = "";

    if (content.body && Array.isArray(content.body)) {
      content.body.forEach((blok: any) => {
        html += renderBlokToHTML(blok);
      });
    }

    return html;
  };

  const renderBlokToHTML = (blok: any): string => {
    switch (blok.component) {
      case "feature":
        return `<div class="feature"><h3>${blok.name || ""}</h3></div>`;
      case "grid":
        const columns = blok.columns
          ?.map((col: any) => renderBlokToHTML(col))
          .join("");
        return `<div class="grid">${columns || ""}</div>`;
      case "teaser":
        return `<div class="teaser"><h2>${blok.headline || ""}</h2></div>`;
      case "page":
        const body = blok.body?.map((b: any) => renderBlokToHTML(b)).join("");
        return `<main>${body || ""}</main>`;
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-lg text-gray-700">Loading story content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!storySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">♿</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AccessLens</h1>
          <p className="text-gray-600 mb-4">
            Open this tool from within Storyblok to analyze your content accessibility.
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-left">
            <p className="font-semibold text-blue-900 mb-2">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Install the AccessLens plugin in Storyblok</li>
              <li>Open any story in the visual editor</li>
              <li>Click the AccessLens button in the toolbar</li>
              <li>Start analyzing and fixing accessibility issues!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SimulationOverlay
      storyContent={storyContent}
      storyId={storyId}
      onClose={() => window.close()}
    />
  );
}