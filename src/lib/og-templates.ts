export const DEFAULT_OG_TAGS = `<meta property="og:title" content="OGPlayground - Open Graph Protocol Testing Playground" />
<meta property="og:description" content="Test, validate, and preview your Open Graph meta tags with live previews for Facebook, X, LinkedIn, Slack, and more." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ogplayground.kanishkk.me/" />
<meta property="og:image" content="https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="OGPlayground" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="OGPlayground - Test Your Open Graph Tags" />
<meta name="twitter:description" content="The playground for testing and validating Open Graph meta tags with real-time social media previews." />
<meta name="twitter:image" content="https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png" />`;

export const OG_TEMPLATES: Record<string, { name: string; content: string }> = {
  blog: {
    name: "Blog Post",
    content: `<meta property="og:title" content="Amazing Blog Post Title" />
<meta property="og:description" content="This is a compelling description of your blog post that will appear when shared on social media." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://yourblog.com/amazing-post" />
<meta property="og:image" content="https://yourblog.com/images/blog-featured.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Your Blog Name" />
<meta property="article:author" content="Your Name" />
<meta property="article:published_time" content="2024-01-15T08:00:00.000Z" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
  product: {
    name: "Product",
    content: `<meta property="og:title" content="Amazing Product Name" />
<meta property="og:description" content="Discover this incredible product that will change your life. Premium quality, amazing features." />
<meta property="og:type" content="product" />
<meta property="og:url" content="https://yourstore.com/products/amazing-product" />
<meta property="og:image" content="https://yourstore.com/images/product-hero.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Your Store" />
<meta property="product:price:amount" content="99.99" />
<meta property="product:price:currency" content="USD" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
  event: {
    name: "Event",
    content: `<meta property="og:title" content="Tech Conference 2024" />
<meta property="og:description" content="Join us for the biggest tech conference of the year. Learn from industry experts and network with peers." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://techconf2024.com" />
<meta property="og:image" content="https://techconf2024.com/images/event-banner.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Tech Conference" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
  docs: {
    name: "Docs",
    content: `<meta property="og:title" content="Getting Started — Acme Docs" />
<meta property="og:description" content="Learn how to install, configure, and ship with Acme in under ten minutes. Official documentation." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://docs.acme.com/getting-started" />
<meta property="og:image" content="https://docs.acme.com/og/getting-started.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Acme Docs" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
  saas: {
    name: "SaaS",
    content: `<meta property="og:title" content="Acme — Ship faster with fewer tabs" />
<meta property="og:description" content="The workspace for modern product teams. Plan, build, and launch without switching tools." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://acme.com" />
<meta property="og:image" content="https://acme.com/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Acme" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Acme — Ship faster with fewer tabs" />
<meta name="twitter:description" content="The workspace for modern product teams." />`,
  },
};
