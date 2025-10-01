// src/components/storyblok/BlogPost.tsx
import { storyblokEditable, SbBlokData } from "@storyblok/react/rsc";

interface BlogPostBlok extends SbBlokData {  // Extend SbBlokData
  component: "blog_post";
  title?: string;
  author?: string;
  featured_image?: { filename?: string; alt?: string };
  content?: any;
  tags?: string[];
}

interface BlogPostProps {
  blok: BlogPostBlok;
}

export default function BlogPost({ blok }: BlogPostProps) {
  return (
    <article 
      style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }} 
      {...storyblokEditable(blok)}
    >
      {/* Intentionally missing alt text for testing */}
      {blok.featured_image?.filename && (
        <img 
          src={blok.featured_image.filename} 
          style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '24px' }}
        />
      )}
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#111' }}>
        {blok.title}
      </h1>
      
      {/* Low contrast text - accessibility issue */}
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '24px' }}>
        By {blok.author || 'Unknown Author'}
      </p>
      
      {/* Content without proper semantic HTML */}
      <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
        <div dangerouslySetInnerHTML={{ __html: blok.content || '' }} />
      </div>
      
      {/* Link without descriptive text */}
      <a href="#" style={{ color: 'blue', marginTop: '20px', display: 'inline-block' }}>
        Click here
      </a>
      
      {/* Button without aria-label */}
      <button style={{ 
        marginTop: '20px', 
        padding: '12px 24px', 
        background: '#3b82f6', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Subscribe
      </button>
    </article>
  );
}