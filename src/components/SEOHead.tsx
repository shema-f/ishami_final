import { useEffect } from 'react';
import { type Article } from '../data/articles';
import { useTranslation } from '../contexts/I18nContext';

interface SEOHeadProps {
  article: Article;
}

export default function SEOHead({ article }: SEOHeadProps) {
  const { lang } = useTranslation();
  
  const title = lang === 'rw' ? article.title_rw : article.title_en;
  const description = lang === 'rw' ? article.excerpt_rw : article.excerpt_en;
  const metaTitle = lang === 'rw' ? (article.seo?.metaTitleRw || title) : (article.seo?.metaTitle || title);
  const metaDescription = lang === 'rw' ? (article.seo?.metaDescriptionRw || description) : (article.seo?.metaDescription || description);
  const ogImage = article.seo?.ogImage || article.image;
  const keywords = article.seo?.keywords?.join(', ') || `${article.category}, Rwanda traffic rules, driving, ${lang === 'rw' ? 'amategeko y\'umuhanda' : 'road safety'}`;
  
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ishami.rw';
  const articleUrl = `${siteUrl}/blog/${article.slug}`;

  useEffect(() => {
    // Update document title
    document.title = `${metaTitle} | ISHAMI`;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', metaDescription);
    updateMeta('keywords', keywords);
    updateMeta('author', article.author);
    
    // Open Graph tags
    updateMeta('og:title', metaTitle, true);
    updateMeta('og:description', metaDescription, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:url', articleUrl, true);
    updateMeta('og:type', 'article', true);
    updateMeta('og:site_name', 'ISHAMI', true);
    updateMeta('og:locale', lang === 'rw' ? 'rw_RW' : 'en_US', true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', metaTitle);
    updateMeta('twitter:description', metaDescription);
    updateMeta('twitter:image', ogImage);
    
    // Article specific tags
    updateMeta('article:published_time', article.date, true);
    updateMeta('article:author', article.author, true);
    updateMeta('article:section', article.category, true);
    if (article.seo?.keywords) {
      article.seo.keywords.forEach(keyword => {
        updateMeta('article:tag', keyword, true);
      });
    }
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', articleUrl);

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'ISHAMI - Rwanda Traffic Rules Learning Platform';
    };
  }, [article, metaTitle, metaDescription, ogImage, keywords, articleUrl, lang]);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISHAMI',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/apple-touch-icon.png`,
      },
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: article.seo?.keywords?.join(', ') || article.category,
    articleSection: article.category,
    inLanguage: lang === 'rw' ? 'rw' : 'en',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
