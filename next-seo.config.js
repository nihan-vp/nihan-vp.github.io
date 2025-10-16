// next-seo.config.js
const SEO = {
  title: "Nihan Ali VP | Full-Stack Developer, IoT & AI Enthusiast",
  description: "Official portfolio of Nihan Ali VP — Full-Stack Developer skilled in React, Node.js, MongoDB, IoT, and AI projects. Explore projects, skills, and contact info.",
  canonical: "https://nihan-vp.me",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nihan-vp.me',
    title: 'Nihan Ali VP | Full-Stack Developer',
    description: 'Explore the projects, skills, and portfolio of Nihan Ali VP, a Full-Stack Developer and tech enthusiast.',
    images: [
      {
        url: 'https://nihan-vp.me/profile.jpg',
        width: 1200,
        height: 630,
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
    { name: 'keywords', content: 'Full-Stack Developer, React, Node.js, IoT, AI, Portfolio, Nihan Ali VP' },
    { name: 'author', content: 'Nihan Ali VP' },
  ],
  additionalLinkTags: [
    { rel: 'icon', href: '/assets/briefcase-CBlQRsIR.png' },
  ],
  // Structured data for AI & Google
  additionalJSONLD: [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nihan Ali VP",
      "url": "https://nihan-vp.me",
      "jobTitle": "Full-Stack Developer",
      "image": "https://nihan-vp.me/profile.jpg",
      "sameAs": [
        "https://github.com/nihan-vp",
        "https://in.linkedin.com/in/nihan-ali-vp-b902ab382",
        "https://twitter.com/nihan_vp"
      ]
    }
  ]
};

export default SEO;
