import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { seoConfig, pageSEO } from "../utils/seoConfig";
import { getSeoKeyFromPath } from "../utils/seoMapping";

export const useSEO = (customPage = null, additionalTags = {}) => {
  const location = useLocation();
  
  useEffect(() => {
    // Determine which page SEO data to use
    const pageKey = customPage || getSeoKeyFromPath(location.pathname);
    const pageData = pageSEO[pageKey] || pageSEO.home;
    
    const fullTitle = pageData.title.includes(seoConfig.siteName) 
      ? pageData.title 
      : `${pageData.title} | ${seoConfig.siteName}`;

    // Update document title
    document.title = fullTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = pageData.description;

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = pageData.keywords;

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `${seoConfig.baseUrl}${pageData.canonical}`;

    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: pageData.description },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: `${seoConfig.baseUrl}${location.pathname}`,
      },
      { property: "og:site_name", content: seoConfig.siteName },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: `${seoConfig.baseUrl}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ];

    // Twitter Card tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: seoConfig.twitterHandle },
      { name: "twitter:creator", content: seoConfig.twitterHandle },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: pageData.description },
      {
        name: "twitter:image",
        content: `${seoConfig.baseUrl}/twitter-image.jpg`,
      },
    ];

    // Create or update all meta tags
    [...ogTags, ...twitterTags].forEach((tag) => {
      let metaTag =
        document.querySelector(`meta[property="${tag.property}"]`) ||
        document.querySelector(`meta[name="${tag.name}"]`);

      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (tag.property) {
          metaTag.setAttribute("property", tag.property);
        } else {
          metaTag.setAttribute("name", tag.name);
        }
        document.head.appendChild(metaTag);
      }

      metaTag.content = tag.content;
    });

    // Add JSON-LD structured data for Local Business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "HomeGoodsStore",
      "@id": `${seoConfig.baseUrl}#organization`,
      name: seoConfig.siteName,
      url: seoConfig.baseUrl,
      description: seoConfig.defaultDescription,
      telephone: seoConfig.phone,
      email: seoConfig.email,
      logo: `${seoConfig.baseUrl}/logo.png`,
      image: `${seoConfig.baseUrl}/og-image.jpg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: seoConfig.address,
        addressLocality: "London",
        postalCode: "HA9 0XX",
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "51.5529",
        longitude: "-0.2969",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "00:00",
          closes: "00:00",
        },
      ],
      priceRange: "££",
      areaServed: {
        "@type": "City",
        name: "London"
      },
      knowssAbout: [
        "Fitted Wardrobes",
        "Bespoke Furniture",
        "Sliding Wardrobes",
        "Bedroom Furniture",
        "Custom Storage Solutions",
        "Made-to-Measure Furniture"
      ],
      foundingDate: "2015",
      sameAs: [
        "https://www.facebook.com/capitalbedrooms",
        "https://www.instagram.com/capitalbedrooms",
        "https://www.linkedin.com/company/capitalbedrooms"
      ]
    };

    // Remove existing structured data if any
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Additional custom tags
    if (additionalTags.robots) {
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.name = "robots";
        document.head.appendChild(robotsTag);
      }
      robotsTag.content = additionalTags.robots;
    }

  }, [location.pathname, customPage, additionalTags]);

  // Return current page data for use in components if needed
  return {
    title: document.title,
    description: pageSEO[getSeoKeyFromPath(location.pathname)]?.description || seoConfig.defaultDescription
  };
};