// src/app/preview/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { SimulationOverlay } from "@/components/accessibility/SimulationOverlay";

function PreviewContent() {
  const searchParams = useSearchParams();
  const storySlug = searchParams.get("story") || "home";
  const [storyContent, setStoryContent] = useState<string>("");
  const [storyId, setStoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoryContent(storySlug);
  }, [storySlug]);

  const loadStoryContent = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/storyblok?slug=${slug}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Story not found");
      }

      const data = await response.json();
      const story = data.story;

      console.log('Fetched story:', story); // Debug log

      // Convert Storyblok content to HTML
      const htmlContent = convertStoryblokToHTML(story.content);
      setStoryContent(htmlContent);
      setStoryId(story.id.toString());
    } catch (err: any) {
      console.error("Error loading story:", err);
      setError(err.message || "Failed to load story. Make sure the story exists and your API token is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  const convertStoryblokToHTML = (content: any): string => {
    console.log('Converting content:', content); // Debug log
    
    let html = '<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">';

    // Handle blog_post component
    if (content.component === "blog_post") {
      html += renderBlogPost(content);
    } 
    // Handle page with body
    else if (content.component === "page" && content.body) {
      html += '<main style="max-width: 1200px; margin: 0 auto; padding: 20px;">';
      content.body.forEach((blok: any) => {
        html += renderBlok(blok);
      });
      html += '</main>';
    }
    // Handle direct body array
    else if (Array.isArray(content.body)) {
      content.body.forEach((blok: any) => {
        html += renderBlok(blok);
      });
    }
    // Fallback
    else {
      html += `<div style="padding: 20px;">Content type: ${content.component || 'unknown'}</div>`;
    }

    html += '</div>';
    return html;
  };

  const renderBlogPost = (blok: any): string => {
    let contentHTML = '';
    if (blok.content) {
      if (typeof blok.content === 'string') {
        contentHTML = blok.content;
      } else if (blok.content.content) {
        contentHTML = renderRichText(blok.content);
      }
    }

    return `
      <article style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        ${blok.title ? `<h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 16px; color: #111;">${blok.title}</h1>` : ''}
        
        <!-- Low contrast text - accessibility issue -->
        ${blok.author ? `<p style="color: #aaa; font-size: 0.9rem; margin-bottom: 24px;">By ${blok.author}</p>` : ''}
        
        <!-- Image missing alt text - accessibility issue -->
        ${blok.featured_image?.filename ? `
          <img 
            src="${blok.featured_image.filename}"
            style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;"
          />
        ` : ''}
        
        <div style="line-height: 1.8; font-size: 1.1rem; color: #333;">
          ${contentHTML}
        </div>
        
        <!-- Link without descriptive text - accessibility issue -->
        <a href="#" style="color: blue; margin-top: 20px; display: inline-block;">
          Click here
        </a>
        
        <!-- Button without aria-label - accessibility issue -->
        <button style="margin-top: 20px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Subscribe
        </button>
        
        <!-- Low contrast box - accessibility issue -->
        <div style="background: red; color: darkred; padding: 10px; margin-top: 20px;">
          Low contrast text
        </div>
      </article>
    `;
  };

  const renderRichText = (doc: any): string => {
    if (!doc || !doc.content) return '';
    
    let html = '';
    
    doc.content.forEach((node: any) => {
      switch (node.type) {
        case 'paragraph':
          html += '<p>' + renderMarks(node) + '</p>';
          break;
        case 'heading':
          const level = node.attrs?.level || 2;
          html += `<h${level}>` + renderMarks(node) + `</h${level}>`;
          break;
        case 'bullet_list':
          html += '<ul>' + node.content?.map((item: any) => renderRichText(item)).join('') + '</ul>';
          break;
        case 'list_item':
          html += '<li>' + renderMarks(node) + '</li>';
          break;
        case 'ordered_list':
          html += '<ol>' + node.content?.map((item: any) => renderRichText(item)).join('') + '</ol>';
          break;
        case 'code_block':
          html += '<pre><code>' + renderMarks(node) + '</code></pre>';
          break;
        case 'horizontal_rule':
          html += '<hr />';
          break;
        case 'blockquote':
          html += '<blockquote>' + renderMarks(node) + '</blockquote>';
          break;
        default:
          if (node.content) {
            html += renderMarks(node);
          }
      }
    });
    
    return html;
  };

  const renderMarks = (node: any): string => {
    if (!node.content) return '';
    
    return node.content.map((item: any) => {
      if (item.type === 'text') {
        let text = item.text || '';
        
        // Apply marks (bold, italic, etc.)
        if (item.marks) {
          item.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`;
                break;
              case 'italic':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'strike':
                text = `<s>${text}</s>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
              case 'link':
                const href = mark.attrs?.href || '#';
                text = `<a href="${href}">${text}</a>`;
                break;
            }
          });
        }
        
        return text;
      } else if (item.type === 'hard_break') {
        return '<br />';
      }
      return '';
    }).join('');
  };

  const renderBlok = (blok: any): string => {
    switch (blok.component) {
      case "blog_post":
        return renderBlogPost(blok);
        
      case "feature":
        return `
          <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 24px; margin: 16px 0; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #1e40af; margin: 0;">${blok.name || "Feature"}</h3>
          </div>
        `;
        
      case "grid":
        const columns = blok.columns?.map((col: any) => renderBlok(col)).join("") || "";
        return `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin: 24px 0;">
            ${columns}
          </div>
        `;
        
      case "teaser":
        return `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="font-size: 1.875rem; font-weight: bold; color: #111827; margin: 0 0 12px 0;">${blok.headline || "Heading"}</h2>
          </div>
        `;
        
      default:
        return `<div style="padding: 12px; background: #f3f4f6; border-radius: 8px; margin: 8px 0;">
          <strong>Component:</strong> ${blok.component}
        </div>`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-lg text-white">Loading story from Storyblok...</p>
          <p className="text-sm text-gray-400 mt-2">Slug: {storySlug}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Story</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400 mb-4">Trying to load: {storySlug}</p>
          <button
            onClick={() => loadStoryContent(storySlug)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <SimulationOverlay
      storyContent={storyContent}
      storyId={storyId}
      onClose={() => window.history.back()}
    />
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}