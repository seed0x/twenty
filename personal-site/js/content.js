/* ==========================================================================
   content.js — everything on the site that is *about you* lives here.
   Change the text, reload, done. Blog posts are Markdown files in /posts.
   Optional fields can be left empty ('' or []) and the site hides them.
   ========================================================================== */

const SITE = {
  // ---- Identity -----------------------------------------------------------
  name: 'Vlad Kolesnik',
  handle: 'vlad',                    // terminal user name
  role: 'Software developer & consultant',
  tagline: 'I build the systems that run a business — website, operations software, marketing tracking — and stay on to keep them working.',
  location: 'Vancouver, WA',
  email: '',                         // ← add your email to enable the Contact form
  links: [
    { label: 'GitHub', url: 'https://github.com/seed0x' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/…' },
  ],
  contactNote: 'I take on a few clients at a time. Tell me about your business.',
  sourceUrl: '',                     // Help ▸ View Source (leave empty to hide)

  // ---- The fake computer --------------------------------------------------
  systemName: 'Mac OS',
  systemVersion: '7.5.3',
  diskName: 'Macintosh HD',
  bootText: 'Welcome to Macintosh.',

  // ---- Read Me ------------------------------------------------------------
  about: {
    intro: [
      'I work with a small number of businesses at a time, one-to-one. Owners who want their website, their internal tools and their marketing data to work as one system — not a pile of one-off projects from different vendors.',
      'A typical engagement: a website built to generate calls, operations software for the office and the field crew, and tracking that shows what actually brings customers in. Then ongoing work to improve it. Most of my clients are service businesses in the Pacific Northwest.',
      'Full-stack: Next.js and TypeScript up front, Python or Node behind, PostgreSQL underneath, deployed on Vercel, Render and Fly.io.',
      // 'Studying software engineering at Clark College.',
    ],
    toolbox: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Vercel', 'GA4 & Tag Manager'],
    now: [],
  },

  // ---- Services ------------------------------------------------------------
  services: {
    lead: 'One developer, a few clients at a time, on an ongoing basis. Not a one-off website.',
    items: [
      {
        name: 'A website that brings in customers',
        text: 'Built for calls and bookings: fast, search-led page structure, structured data for Google, sticky call and quote actions, and tracking wired in from day one.',
      },
      {
        name: 'Operations software',
        text: 'Custom tools for the office and the field: scheduling, jobs, customers, bids, review requests and reporting — built around how your business actually runs, not around a generic SaaS.',
      },
      {
        name: 'Marketing tracking & automation',
        text: 'Analytics, ad conversions and attribution you can trust, plus automation for review requests and social posting, so every marketing dollar is accounted for.',
      },
    ],
    how: [
      'One-to-one. You work with me, not an account manager.',
      'Ongoing. I stay on after launch to measure, fix and improve.',
      'Straight answers about what will and will not move the needle.',
    ],
  },

  // ---- Résumé (optional) ---------------------------------------------------
  resume: null,

  // ---- Applications -------------------------------------------------------
  apps: [
    {
      id: 'plumbing-ops',
      name: 'Plumbing Ops Platform',
      tagline: 'Operations software for plumbing companies',
      year: '2025 – present',
      role: 'Design, development, ongoing',
      stack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'SQLAlchemy', 'PostgreSQL'],
      color: '#d9ecff',
      description: [
        'Runs the day-to-day of a plumbing business: service calls with workflows and follow-ups, construction jobs with phases and contacts, customers with service history, daily technician schedules, and bids from draft to won or lost.',
        'Carries the marketing side too: social scheduling across accounts, automated review requests after completed jobs, and an analytics dashboard. Built for two plumbing companies in Southwest Washington and still growing with them.',
      ],
      highlights: [
        'Service calls, jobs, customers, technician schedules and bids in one place',
        'Automated review requests and multi-account social scheduling',
        'Next.js frontend on Vercel, FastAPI backend on Render, PostgreSQL',
      ],
      links: [],
      image: '',
    },
    {
      id: 'life-tracker',
      name: 'Life Tracker',
      tagline: 'A personal “life OS” that turns a sentence into a scheduled day',
      year: '2026',
      role: 'Solo project',
      stack: ['Node.js', 'Express', 'PostgreSQL', 'Telegram Bot API', 'Google Calendar API', 'Claude API', 'Docker', 'Fly.io'],
      color: '#e2f4e0',
      description: [
        'Type “fix prod bug by friday urgent” or “gym every morning”. It parses the deadline, priority and category, drops the task into a free calendar slot, and nudges you on Telegram. No forms.',
        'Rule-based natural-language parser, auto-scheduler, two-way Google Calendar sync, habits, goals and time tracking. Exposes an MCP server so Claude can manage it in conversation.',
      ],
      highlights: [
        'Natural-language capture with no paid ML',
        'Installable PWA, Telegram bot, MCP server for AI agents',
        'About 9,400 lines across modular services, deployed with Docker on Fly.io',
      ],
      links: [{ label: 'Open the app', url: 'https://life-tracker-vladkolesnik.fly.dev' }],
      image: '',
    },
    // FinanceFlow (team project, CSE 310) — uncomment to show it:
    // { id: 'financeflow', name: 'FinanceFlow', tagline: 'Team finance tracker with bank sync', year: '2025',
    //   role: 'Team project with Derek and David', stack: ['Flask', 'SQLAlchemy', 'React 19', 'Vite', 'Plaid API', 'Recharts'],
    //   color: '#fdebd3', description: ['Income and expenses per user, monthly budgets by category. Bank accounts connect through Plaid and transactions import and categorize themselves.'],
    //   highlights: ['Plaid Link with de-duplicated imports', 'Keyword categorization for 100+ merchants', 'Per-category budgets with live progress'], links: [], image: '' },
  ],

  // ---- Client Work ---------------------------------------------------------
  // Engagements are described by industry and region. To name a client, fill in
  // `client` and add a link, e.g. links: [{ label: 'Visit site', url: 'https://…' }].
  // (All County Plumbing — allcountyplumbers.com; H2O Plumbing — h2oplumbers.com;
  //  Felts Customs — feltscustoms.com)
  marketing: [
    {
      id: 'plumbing-contractor',
      name: 'Plumbing contractor',
      client: 'Family-owned · Southwest Washington',
      type: 'Website, local SEO, ops platform',
      year: '2025 – present',
      icon: 'globe',
      description: [
        'A family-owned plumbing contractor doing service and repair, commercial work and new construction across two counties. Started with the website; now covers their operations software too.',
        'The site is built to generate calls: service-area pages, sticky call-and-book bar, promotions, LocalBusiness structured data, per-page canonicals, Google Analytics with attribution capture, and performance monitoring.',
      ],
      highlights: [
        'Website with service-area landing pages and structured data',
        'Call and booking actions, promotions, attribution tracking',
        'Operations platform for the office and field technicians',
      ],
      results: [],
      links: [],
    },
    {
      id: 'plumbing-company',
      name: 'Plumbing company',
      client: 'Vancouver, WA',
      type: 'Website, analytics & tracking',
      year: '2025 – present',
      icon: 'chart',
      description: [
        'A plumbing company focused on same-day residential and commercial work. Website plus a tracking stack that supports real marketing decisions.',
        'Google Tag Manager loaded lazily so it doesn’t cost page speed, PostHog product analytics, a Facebook pixel, structured data, and domain verification for Google, Facebook and Trustpilot.',
      ],
      highlights: [
        'Deferred tag loading for performance',
        'GTM, PostHog and Facebook pixel for attribution',
        'Structured data and review-platform verification',
      ],
      results: [],
      links: [],
    },
    {
      id: 'patio-screen-dealer',
      name: 'Patio screen dealer',
      client: 'Authorized dealer · WA, OR & MT',
      type: 'Website, SEO & ads tracking',
      year: '2026 – present',
      icon: 'star',
      description: [
        'An authorized dealer installing motorized patio screens across three states. The website is search-led from the start: category terms people actually search ahead of the brand name.',
        'Per-page canonicals, LocalBusiness and FAQ structured data, GA4 with Google Ads conversion tracking, Bing and Pinterest verification, and a Google Business Profile review flow.',
      ],
      highlights: [
        'Keyword-led structure for products, services and service areas',
        'GA4 + Google Ads conversions, LocalBusiness and FAQ schema',
        'Sticky quote action and Google review flow',
      ],
      results: [],
      links: [],
    },
    {
      id: 'reviews-and-social',
      name: 'Review & social automation',
      client: 'Part of the Plumbing Ops Platform',
      type: 'Marketing automation',
      year: '2025 – present',
      icon: 'megaphone',
      description: [
        'Schedule social posts across several accounts from one calendar, and generate and track review requests after completed jobs, so happy customers turn into public reviews without anyone remembering to ask.',
      ],
      highlights: [
        'Multi-account social content calendar',
        'Automated review request generation and tracking',
        'Reporting next to jobs and service calls',
      ],
      results: [],
      links: [{ label: 'See the platform', url: '#/apps/plumbing-ops' }],
    },
  ],

  // ---- Blog ----------------------------------------------------------------
  posts: [
    {
      slug: 'hello',
      title: 'Hello',
      date: '2026-09-06',
      summary: 'Who I am, what I do, and why this site looks like a computer from 1995.',
      tags: ['meta'],
    },
    {
      slug: 'how-this-site-works',
      title: 'How this site works',
      date: '2026-09-06',
      summary: 'A desktop, a window manager and a blog in plain HTML, CSS and JavaScript.',
      tags: ['web'],
    },
  ],

  // ---- Trash ---------------------------------------------------------------
  trash: [],
};
