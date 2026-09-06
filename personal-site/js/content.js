/* ==========================================================================
   content.js — EVERYTHING you would want to edit lives in this file.
   No build step: change the text below, reload, done.
   Blog posts are Markdown files in /posts, listed under `posts` at the bottom.
   ========================================================================== */

const SITE = {
  // ---- Identity -----------------------------------------------------------
  name: 'Vlad',                 // used all over the desktop ("Vlad HD", "About Vlad", …)
  handle: 'vlad',               // terminal username
  role: 'Software Developer',
  tagline: 'I build web applications — and the marketing that gets them in front of people.',
  systemName: 'Vlad OS',        // the fake OS name shown at boot and in "About This Mac"
  systemVersion: '7.5',
  location: 'Planet Earth',
  email: 'hello@example.com',   // ← change me
  links: [
    { label: 'GitHub',   url: 'https://github.com/seed0x' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle' },
    { label: 'X',        url: 'https://x.com/your-handle' },
  ],
  // Where the site's source lives (Help ▸ View Source). Leave empty to hide.
  sourceUrl: 'https://github.com/seed0x',

  // ---- About Me (the "Read Me" document) ----------------------------------
  about: {
    intro: [
      'Hi, I’m Vlad. I’m a software developer who spent a good chunk of his career in marketing before writing code full-time — which means I care as much about whether people *find* and *understand* a product as I do about how it’s built.',
      'These days I build web applications end to end: TypeScript on both sides, React on the front, Node and Postgres on the back, and enough DevOps to ship without drama. I like small teams, clear briefs, and products that solve one problem really well.',
      'This site is a working desktop: open the folders to browse my applications and marketing work, read the blog, or launch the Terminal if you’d rather type.',
    ],
    // "Memory usage" bars in About This Mac. level is 0–100.
    skills: [
      { name: 'TypeScript',     level: 92 },
      { name: 'React',          level: 88 },
      { name: 'Node.js',        level: 85 },
      { name: 'PostgreSQL',     level: 76 },
      { name: 'Growth & analytics', level: 82 },
      { name: 'Copywriting',    level: 74 },
    ],
    toolbox: [
      'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker',
      'Playwright', 'Figma', 'Google Analytics', 'HubSpot', 'Webflow',
    ],
    now: [
      'Building a small SaaS on the side (see Applications ▸ Ledgerly).',
      'Writing more — one blog post a month is the goal.',
      'Open to freelance and full-time work. Say hello in Contact.',
    ],
  },

  // ---- Résumé --------------------------------------------------------------
  resume: {
    summary: 'Software developer with a marketing background. Six years shipping web products for startups and agencies; comfortable owning a feature from customer interview to deploy.',
    pdf: '',                     // e.g. 'assets/resume.pdf' — shows a Download button when set
    experience: [
      {
        role: 'Senior Software Developer',
        company: 'Acme Analytics',
        period: '2023 — present',
        bullets: [
          'Lead developer on the customer-facing dashboard (React, TypeScript, GraphQL).',
          'Cut p95 page load from 4.1s to 1.3s by moving reporting to server-side aggregation.',
          'Built the self-serve onboarding flow that lifted trial-to-paid conversion by 18%.',
        ],
      },
      {
        role: 'Full-stack Developer',
        company: 'Northwind Digital (agency)',
        period: '2020 — 2023',
        bullets: [
          'Shipped 20+ marketing sites and web apps for clients in fintech, retail and SaaS.',
          'Introduced a shared component library that halved build time on new projects.',
        ],
      },
      {
        role: 'Marketing Manager',
        company: 'Contoso Software',
        period: '2017 — 2020',
        bullets: [
          'Owned demand generation: SEO, paid, lifecycle email and launch campaigns.',
          'Taught myself to code to stop waiting on the dev team for landing pages. Never stopped.',
        ],
      },
    ],
    education: [
      { school: 'University of Somewhere', degree: 'B.A. Marketing & Communications', period: '2013 — 2017' },
    ],
  },

  // ---- Applications folder -------------------------------------------------
  // icon: 'app' draws a little window with the first letter; color tints it.
  // image: optional screenshot path, e.g. 'assets/ledgerly.png'.
  apps: [
    {
      id: 'ledgerly',
      name: 'Ledgerly',
      tagline: 'Plain-text budgeting for people who hate spreadsheets',
      year: '2025',
      role: 'Design & development',
      stack: ['TypeScript', 'React', 'SQLite', 'Tauri'],
      color: '#cfe8ff',
      description: [
        'Ledgerly is a desktop budgeting app that treats your finances like a text file: type transactions in a simple syntax, get charts, forecasts and a monthly review for free.',
        'I built it because every budgeting tool I tried wanted my bank login. Ledgerly works offline, stores everything in one SQLite file, and syncs through whatever folder-sync you already use.',
      ],
      highlights: [
        'Parser for a small transaction language with helpful error messages',
        'Native desktop builds for macOS, Windows and Linux via Tauri',
        'Under 8 MB installed; opens in ~300 ms',
      ],
      links: [
        { label: 'Visit site', url: 'https://example.com/ledgerly' },
        { label: 'Source code', url: 'https://github.com/seed0x' },
      ],
      image: '',
    },
    {
      id: 'shipmate',
      name: 'Shipmate',
      tagline: 'Release notes that write themselves from your Git history',
      year: '2024',
      role: 'Solo developer',
      stack: ['Node.js', 'GitHub API', 'PostgreSQL', 'Next.js'],
      color: '#ffe3c2',
      description: [
        'Shipmate watches your repositories, groups merged pull requests by label, and drafts customer-friendly release notes you can edit and publish to a changelog page or email.',
        'Started as an internal tool at an agency; now used by a handful of small SaaS teams.',
      ],
      highlights: [
        'GitHub App with webhook ingestion and a job queue',
        'Public changelog pages with custom domains',
        'Draft-then-publish workflow with review comments',
      ],
      links: [{ label: 'Visit site', url: 'https://example.com/shipmate' }],
      image: '',
    },
    {
      id: 'pixelpress',
      name: 'PixelPress',
      tagline: 'A tiny static-site generator for people who write in Markdown',
      year: '2023',
      role: 'Open source maintainer',
      stack: ['TypeScript', 'Markdown', 'CLI'],
      color: '#dff5d8',
      description: [
        'PixelPress turns a folder of Markdown into a fast site with zero configuration. One command, one output folder, no framework.',
        'This very website’s blog is powered by the same ideas: Markdown in, HTML out, nothing in between.',
      ],
      highlights: [
        '1.2k stars on GitHub',
        'Plugin API for custom shortcodes',
        'Full-text search index generated at build time',
      ],
      links: [{ label: 'Source code', url: 'https://github.com/seed0x' }],
      image: '',
    },
  ],

  // ---- Marketing folder ---------------------------------------------------
  // icon: 'megaphone' | 'chart' | 'mail' | 'star' | 'globe' | 'doc'
  marketing: [
    {
      id: 'ledgerly-launch',
      name: 'Ledgerly 1.0 launch',
      client: 'Ledgerly (own product)',
      type: 'Launch campaign',
      year: '2025',
      icon: 'megaphone',
      description: [
        'A four-week launch built around one idea: “your budget is a text file.” Teaser thread, a waitlist with a referral loop, a Product Hunt launch and a founder-written email sequence.',
      ],
      highlights: [
        'Positioning, landing page copy and design',
        'Referral waitlist (built in an afternoon with the Ledgerly stack)',
        'Product Hunt launch — #3 product of the day',
      ],
      results: [
        { value: '4,200', label: 'waitlist signups in 3 weeks' },
        { value: '38%', label: 'waitlist → download' },
        { value: '#3', label: 'Product Hunt, launch day' },
      ],
      links: [{ label: 'Read the case study', url: '#/blog/hello-world' }],
    },
    {
      id: 'acme-content',
      name: 'Content & SEO program',
      client: 'Acme Analytics',
      type: 'Content strategy',
      year: '2023 — 2024',
      icon: 'chart',
      description: [
        'Rebuilt the blog around what customers actually search for: comparison pages, “how to” guides tied to product features, and a monthly benchmark report that became the company’s best-performing lead magnet.',
      ],
      highlights: [
        'Keyword research and a 12-month editorial calendar',
        'Programmatic comparison pages generated from product data',
        'Benchmark report with an interactive web version',
      ],
      results: [
        { value: '3.4×', label: 'organic traffic in 12 months' },
        { value: '61%', label: 'of demo requests from organic' },
        { value: '19k', label: 'report downloads' },
      ],
      links: [],
    },
    {
      id: 'northwind-lifecycle',
      name: 'Lifecycle email redesign',
      client: 'Northwind Digital',
      type: 'Email marketing',
      year: '2022',
      icon: 'mail',
      description: [
        'Replaced a one-size-fits-all newsletter with behaviour-based sequences: onboarding, activation nudges, win-back and a plain-text “from the founder” series that outperformed every designed template.',
      ],
      highlights: [
        'Event tracking plan and segmentation model',
        'Copy and templates for 6 automated sequences',
        'A/B testing framework with a shared results dashboard',
      ],
      results: [
        { value: '+27%', label: 'activation within 7 days' },
        { value: '2.1×', label: 'reply rate on plain-text emails' },
      ],
      links: [],
    },
    {
      id: 'contoso-brand',
      name: 'Brand refresh & website',
      client: 'Contoso Software',
      type: 'Branding & web',
      year: '2019',
      icon: 'star',
      description: [
        'Led the refresh from a dated “enterprise” look to something people actually wanted to click on: new messaging, a design system, and a website rebuilt from the ground up — the project that got me into code for good.',
      ],
      highlights: [
        'Messaging framework and voice guidelines',
        'Design system in Figma, implemented as a component library',
        'Website rebuild with a 96 Lighthouse performance score',
      ],
      results: [
        { value: '+44%', label: 'demo requests, first quarter' },
        { value: '−52%', label: 'bounce rate on the homepage' },
      ],
      links: [],
    },
  ],

  // ---- Blog ----------------------------------------------------------------
  // Each post is /posts/<slug>.md. Newest first is handled automatically.
  posts: [
    {
      slug: 'hello-world',
      title: 'Hello, world (again)',
      date: '2026-09-01',
      summary: 'A new site, a new blog, and why the whole thing looks like a computer from 1994.',
      tags: ['meta'],
    },
    {
      slug: 'why-my-portfolio-is-an-operating-system',
      title: 'Why my portfolio is a fake operating system',
      date: '2026-08-18',
      summary: 'Folders as navigation, a window manager in 300 lines of vanilla JavaScript, and a terminal for people who hate clicking.',
      tags: ['web', 'design'],
    },
    {
      slug: 'what-marketing-taught-me-about-software',
      title: 'What marketing taught me about writing software',
      date: '2026-07-12',
      summary: 'Nobody reads your README, positioning is an API, and other lessons from the other side of the fence.',
      tags: ['marketing', 'craft'],
    },
  ],

  // ---- Trash (purely for fun) ---------------------------------------------
  trash: [
    { name: 'old-portfolio-2019.html', icon: 'doc' },
    { name: 'jquery-plugins.zip', icon: 'doc' },
    { name: 'todo-app-v37', icon: 'folder' },
  ],
};
