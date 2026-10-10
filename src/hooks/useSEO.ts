import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  urlPath?: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function updateMetaTag(selector: string, attribute: 'content' | 'href', value: string) {
  let element = document.querySelector(selector);
  if (!element) {
    if (selector.startsWith('meta[')) {
      element = document.createElement('meta');
      const match = selector.match(/meta\[([a-zA-Z0-9_-]+)=["']([^"']+)["']\]/);
      if (match) {
        element.setAttribute(match[1], match[2]);
      }
      document.head.appendChild(element);
    } else if (selector.startsWith('link[')) {
      element = document.createElement('link');
      const match = selector.match(/link\[([a-zA-Z0-9_-]+)=["']([^"']+)["']\]/);
      if (match) {
        element.setAttribute(match[1], match[2]);
      }
      document.head.appendChild(element);
    }
  }

  if (element) {
    element.setAttribute(attribute, value);
  }
}

export function useSEO({
  title,
  description,
  keywords,
  image = '/og-home.png',
  imageAlt = 'Hero Keg Service and Trading PLC',
  urlPath = '/',
  type = 'website',
  schema
}: SEOProps) {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title.includes('Hero Keg')
      ? title
      : `${title} | Hero Keg Service and Trading PLC`;
    document.title = fullTitle;

    // 2. URLs resolution
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.herokegservice.com';
    const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
    const absoluteUrl = urlPath.startsWith('http') ? urlPath : `${origin}${cleanPath}`;
    const absoluteImage = image.startsWith('http') 
      ? image 
      : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    // 3. Standard Description, Keywords & Robots
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // 4. Open Graph Tags
    updateMetaTag('meta[property="og:site_name"]', 'content', 'Hero Keg Service and Trading PLC');
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:url"]', 'content', absoluteUrl);
    updateMetaTag('meta[property="og:image"]', 'content', absoluteImage);
    updateMetaTag('meta[property="og:image:secure_url"]', 'content', absoluteImage);
    updateMetaTag('meta[property="og:image:alt"]', 'content', imageAlt);
    updateMetaTag('meta[property="og:image:width"]', 'content', '1200');
    updateMetaTag('meta[property="og:image:height"]', 'content', '630');

    // 5. Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', absoluteImage);
    updateMetaTag('meta[name="twitter:image:alt"]', 'content', imageAlt);

    // 6. Canonical URL
    updateMetaTag('link[rel="canonical"]', 'href', absoluteUrl);

    // 7. Schema.org JSON-LD Structured Data
    if (schema) {
      let scriptElement = document.getElementById('page-jsonld-schema') as HTMLScriptElement | null;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'page-jsonld-schema';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    }

    return () => {
      const scriptElement = document.getElementById('page-jsonld-schema');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [title, description, keywords, image, imageAlt, urlPath, type, schema]);
}

export default function MetaTags(props: SEOProps) {
  useSEO(props);
  return null;
}
