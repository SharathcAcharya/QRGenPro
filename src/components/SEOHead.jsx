import React, { useEffect } from 'react';

// SEO-optimized head component for consistent metadata across the app
const SEOHead = ({ 
  title = 'QRloop - Advanced QR Code Generator',
  description = 'Create beautiful, customizable QR codes with logo embedding, 3D effects, and analytics',
  canonicalUrl,
  ogImage = '/images/qrloop-social-card.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  children
}) => {
  // Get current URL for canonical link
  const siteUrl = 'https://qrloop.app';
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  
  // Default structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QRloop",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "357"
    },
    "description": description
  };
  
  const finalStructuredData = structuredData || defaultStructuredData;

  // Update document head elements
  useEffect(() => {
    // Set title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('description', description);
    
    // Update Open Graph / Facebook tags
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', `${siteUrl}${ogImage}`);
    updateMetaTag('og:site_name', 'QRloop');
    
    // Update Twitter tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${siteUrl}${ogImage}`);
    
    // Update PWA related tags
    updateMetaTag('theme-color', '#3b82f6');
    
    // Update canonical link
    updateLink('canonical', currentUrl);
    
    // Update Structured Data / JSON-LD
    updateStructuredData(finalStructuredData);
    
    // Cleanup function
    return () => {
      // No cleanup needed for meta tags as they will be overwritten
    };
  }, [title, description, currentUrl, ogImage, ogType, twitterCard, finalStructuredData]);
  
  // Helper function to update meta tags
  function updateMetaTag(name, content) {
    let meta;
    // Check if the tag is a property (og: and others) or regular name attribute
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta = document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', name);
        document.head.appendChild(meta);
      }
    } else {
      meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
    }
    meta.setAttribute('content', content);
  }
  
  // Helper function to update link tags
  function updateLink(rel, href) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
  
  // Helper function to update structured data
  function updateStructuredData(data) {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  return <>{children}</>;
};

export default SEOHead;
