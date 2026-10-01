// next-seo.config.js
const SEO = {
  title: "Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast",
  description: "Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, IoT, and AI. Explore innovative software projects, skills, and contact info.",
  canonical: "https://nihanvp.in/",
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://nihanvp.in/',
    title: 'Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast',
    description: 'Explore the projects, skills, and portfolio of Nihan Ali VP, a Full-Stack Developer and tech enthusiast.',
    images: [
      {
        url: 'https://nihanvp.in/profile.jpg',
        width: 800,
        height: 800,
        alt: 'Nihan Ali VP | Full-Stack Developer',
      },
    ],
  },
  twitter: {
    handle: '@nihan_vp',
    site: '@nihan_vp',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    { name: 'keywords', content: 'Full-Stack Developer, React, Node.js, IoT, AI, Portfolio, Nihan Ali VP, nihanvp.in' },
    { name: 'author', content: 'Nihan Ali VP' },
  ],
  additionalLinkTags: [
    { rel: 'icon', href: '/assets/briefcase-CBlQRsIR.png' },
    { rel: 'canonical', href: 'https://nihanvp.in/' },
  ],
  // Structured data for AI & Google
  additionalJSONLD: [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nihan Ali VP",
      "url": "https://nihanvp.in",
      "jobTitle": "Full-Stack Developer, IoT & AI Enthusiast",
      "image": "https://nihanvp.in/profile.jpg",
      "sameAs": [
        "https://github.com/nihan-vp",
        "https://in.linkedin.com/in/nihan-ali-vp-b902ab382",
        "https://twitter.com/nihan_vp",
        "https://www.instagram.com/nihan_vp/"
      ]
    }
  ]
};

export default SEO;
