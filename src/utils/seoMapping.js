export const slugToSeoKeyMap = {
  // Service category slugs
  "fitted-wardrobes": "fitted-wardrobes",
  "bespoke-wardrobes": "bespoke-wardrobes",
  "sliding-wardrobes": "sliding-wardrobes",
  "bedroom-furniture": "bedroom-furniture",
  "built-in-wardrobes": "built-in-wardrobes",
};

// Route to SEO key mapping for use in components
export const routeToSeoKeyMap = {
  "/": "home",
  "/aboutus": "about",
  "/services": "services",
  "/thankyou": "thankyou",
  "/404": "404",
  // Service routes
  "/services/fitted-wardrobes": "fitted-wardrobes",
  "/services/bespoke-wardrobes": "bespoke-wardrobes",
  "/services/sliding-wardrobes": "sliding-wardrobes",
  "/services/bedroom-furniture": "bedroom-furniture",
  "/services/built-in-wardrobes": "built-in-wardrobes",
};

// Helper function to get SEO key from current path
export const getSeoKeyFromPath = (pathname) => {
  // Exact match first
  if (routeToSeoKeyMap[pathname]) {
    return routeToSeoKeyMap[pathname];
  }
  
  // Check for service category routes
  if (pathname.startsWith('/services/')) {
    const slug = pathname.split('/services/')[1];
    return slugToSeoKeyMap[slug] || "services";
  }
  
  // Default to home for root path
  if (pathname === '/') {
    return "home";
  }
  
  return "home"; // fallback
};