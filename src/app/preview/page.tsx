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

      console.log('=== FETCHED STORY ===');
      console.log('Full story:', JSON.stringify(story, null, 2));
      console.log('Story ID:', story.id);
      console.log('Story name:', story.name);
      console.log('Story slug:', story.slug);
      console.log('====================');

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
    console.log('=== CONTENT CONVERSION DEBUG ===');
    console.log('Component type:', content.component);
    console.log('All fields:', Object.keys(content));
    console.log('Full content:', JSON.stringify(content, null, 2));
    console.log('================================');
    
    let html = '<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">';

    const componentType = (content.component || "").toLowerCase();
    
    if (componentType === "blog_post" || content.component === "blog_post") {
      html += renderBlogPost(content);
    } 
    else if (componentType === "landing_page" || componentType === "plant landing" || content.component === "landing_page") {
      html += renderLandingPage(content);
    }
    else if (content.component === "page" && content.body) {
      html += '<main style="max-width: 1200px; margin: 0 auto; padding: 20px;">';
      content.body.forEach((blok: any) => {
        html += renderBlok(blok);
      });
      html += '</main>';
    }
    else if (Array.isArray(content.body)) {
      content.body.forEach((blok: any) => {
        html += renderBlok(blok);
      });
    }
    else {
      html += `
        <div style="padding: 40px; background: #fef2f2; border: 2px solid #dc2626; border-radius: 12px; margin: 20px;">
          <h2 style="color: #dc2626; margin: 0 0 16px 0;">Debug: Unhandled Content Type</h2>
          <p style="margin: 8px 0;"><strong>Component:</strong> ${content.component || 'undefined'}</p>
          <p style="margin: 8px 0;"><strong>Available Fields:</strong> ${Object.keys(content).join(', ')}</p>
          <details style="margin-top: 16px;">
            <summary style="cursor: pointer; font-weight: bold; color: #991b1b;">View Raw JSON</summary>
            <pre style="background: white; padding: 12px; border-radius: 6px; overflow: auto; font-size: 11px; margin-top: 8px;">${JSON.stringify(content, null, 2)}</pre>
          </details>
        </div>
      `;
    }

    html += '</div>';
    return html;
  };

  const renderLandingPage = (blok: any): string => {
    console.log('=== RENDERING LANDING PAGE ===');
    console.log('Hero title:', blok.hero_title);
    console.log('Hero subtitle:', blok.hero_subtitle);
    console.log('Features:', blok.features);
    console.log('Gallery:', blok.gallery);
    console.log('==============================');

    return `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0;">
        <!-- Hero Section - Intentional accessibility issues for testing -->
        <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 20px; text-align: center; color: white; position: relative;">
          ${blok.hero_image?.filename ? `
            <img 
              src="${blok.hero_image.filename}" 
              style="max-width: 500px; width: 100%; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
            />
          ` : ''}
          
          <h1 style="font-size: 3.5rem; font-weight: 800; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); line-height: 1.2;">
            ${blok.hero_title || 'Transform Your Space'}
          </h1>
          
          <p style="font-size: 1.5rem; opacity: 0.95; max-width: 600px; margin: 0 auto 40px; line-height: 1.5;">
            ${blok.hero_subtitle || 'Premium indoor plants delivered to your door'}
          </p>
          
          <!-- Button without proper contrast ratio - accessibility issue -->
          <button style="background: white; color: #667eea; padding: 18px 48px; font-size: 1.2rem; font-weight: bold; border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.3s ease; font-family: inherit;">
            ${blok.cta_button_text || 'Get Started'}
          </button>
        </section>

        <!-- Features Section -->
        <section style="padding: 100px 20px; background: white;">
          <div style="max-width: 1200px; margin: 0 auto;">
            ${blok.features && blok.features.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                ${blok.features.map((feature: any) => `
                  <div style="text-align: center; padding: 40px 30px; border-radius: 20px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); box-shadow: 0 10px 40px rgba(0,0,0,0.08); transition: transform 0.3s ease; border: 1px solid #e2e8f0;">
                    ${feature.icon_image?.filename ? `
                      <img 
                        src="${feature.icon_image.filename}" 
                        style="width: 80px; height: 80px; margin-bottom: 24px; border-radius: 50%; object-fit: cover;"
                      />
                    ` : `
                      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">
                        🌿
                      </div>
                    `}
                    
                    <h3 style="font-size: 1.5rem; color: #1e293b; margin: 0 0 12px 0; font-weight: 700;">
                      ${feature.title || 'Feature'}
                    </h3>
                    
                    <!-- Low contrast text - accessibility issue -->
                    <p style="color: #94a3b8; line-height: 1.7; font-size: 1rem; margin: 0;">
                      ${feature.description || 'Feature description goes here'}
                    </p>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="text-align: center; color: #64748b;">No features available</p>'}
          </div>
        </section>

        <!-- Gallery Section -->
        ${blok.gallery && blok.gallery.length > 0 ? `
          <section style="padding: 100px 20px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <h2 style="text-align: center; font-size: 2.75rem; margin: 0 0 60px 0; color: #0f172a; font-weight: 800;">
              Our Plant Collection
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto;">
              ${blok.gallery.map((img: any, index: number) => `
                <!-- Image ${index + 1} missing alt text - accessibility issue -->
                <div style="position: relative; overflow: hidden; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); transition: transform 0.3s ease;">
                  <img 
                    src="${img.filename}" 
                    style="width: 100%; height: 320px; object-fit: cover; display: block;"
                  />
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- CTA Section with contrast issues -->
        <section style="padding: 80px 20px; background: #fbbf24; text-align: center;">
          <h2 style="font-size: 2.5rem; color: #fef3c7; margin: 0 0 20px 0; font-weight: 800;">
            Ready to Go Green?
          </h2>
          <p style="font-size: 1.25rem; color: #fef3c7; margin: 0 0 30px 0;">
            Join thousands of happy plant parents
          </p>
          <button style="background: #f59e0b; color: #fef3c7; padding: 16px 40px; font-size: 1.1rem; font-weight: bold; border: none; border-radius: 50px; cursor: pointer;">
            Shop Now
          </button>
        </section>
      </div>
    `;
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
        
        ${blok.author ? `<p style="color: #aaa; font-size: 0.9rem; margin-bottom: 24px;">By ${blok.author}</p>` : ''}
        
        ${blok.featured_image?.filename ? `
          <img 
            src="${blok.featured_image.filename}"
            style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;"
          />
        ` : ''}
        
        <div style="line-height: 1.8; font-size: 1.1rem; color: #333;">
          ${contentHTML}
        </div>
        
        <a href="#" style="color: blue; margin-top: 20px; display: inline-block;">
          Click here
        </a>
        
        <button style="margin-top: 20px; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Subscribe
        </button>
        
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
    const componentType = (blok.component || "").toLowerCase();
    
    if (componentType === "blog_post" || blok.component === "blog_post") {
      return renderBlogPost(blok);
    }
    
    if (componentType === "landing_page" || componentType === "plant landing") {
      return renderLandingPage(blok);
    }
    
    switch (blok.component) {
        
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
        return `
          <div style="padding: 16px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 12px 0;">
            <strong>Unknown Component:</strong> ${blok.component}
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; color: #92400e;">Show fields</summary>
              <pre style="font-size: 11px; margin-top: 8px; color: #78350f;">${JSON.stringify(blok, null, 2)}</pre>
            </details>
          </div>
        `;
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