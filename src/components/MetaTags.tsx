import { useEffect } from 'react';

export interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  urlPath?: string;
  type?: 'website' | 'article';
}

function updateMetaTag(selector: string, attribute: 'content' | 'href', value: string) {
  let element = document.querySelector(selector);
  if (!element) {
    if (selector.startsWith('meta[')) {
      element = document.createElement('meta');
      // Extract attribute name and value from selector e.g. meta[property="og:image"]
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

export function useMetaTags({
  title,
  description,
  image = '/og-home.png',
  imageAlt = 'Hero Keg Service and Trading PLC',
  urlPath = '/',
  type = 'website',
}: MetaTagsProps) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title.includes('Hero Keg')
      ? title
      : `${title} | Hero Keg Service and Trading PLC`;
    document.title = fullTitle;

    // 2. Resolve absolute URL and absolute Image URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.herokegservice.com';
    const absoluteUrl = urlPath.startsWith('http') ? urlPath : `${origin}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;

    // 3. Standard Meta Description
    updateMetaTag('meta[name="description"]', 'content', description);

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

    // 6. Canonical Link
    updateMetaTag('link[rel="canonical"]', 'href', absoluteUrl);
  }, [title, description, image, imageAlt, urlPath, type]);
}

export default function MetaTags(props: MetaTagsProps) {
  useMetaTags(props);
  return null;
}
