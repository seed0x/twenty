/* ==========================================================================
   content.js — everything on the site that is *about you* lives here.
   Change the text, reload, done. Blog posts are Markdown files in /posts.
   Optional fields can be left empty ('' or []) and the site hides them.
   ========================================================================== */

const SITE = {
  // ---- Identity -----------------------------------------------------------
  name: 'Vlad Kolesnik',
  handle: 'vlad',                    // terminal user name
  role: 'Software Developer',
  tagline: 'I build websites for local businesses and the software that runs them.',
  location: 'Vancouver, WA',
  email: '',                         // ← add your email to enable the Contact form
  links: [
    { label: 'GitHub', url: 'https://github.com/seed0x' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/…' },
  ],
  contactNote: 'Work, internships, or just to say hi.',
  sourceUrl: '',                     // Help ▸ View Source (leave empty to hide)

  // ---- The fake computer --------------------------------------------------
  systemName: 'Mac OS',
  systemVersion: '7.5.3',
  diskName: 'Macintosh HD',
  bootText: 'Welcome to Macintosh.',

  // ---- Read Me ------------------------------------------------------------
  about: {
    intro: [
      'I’m a software developer in Vancouver, Washington. I build websites for local service businesses — plumbers, contractors, installers — and the internal tools that run those businesses: scheduling, jobs, customers, reviews and reporting.',
      'Most of my work is full-stack: Next.js and TypeScript on the front, Python (FastAPI, Flask) or Node on the back, PostgreSQL underneath, deployed on Vercel, Render and Fly.io. On the marketing side I handle local SEO, analytics and conversion tracking for the sites I build.',
      'I’m studying software engineering at Clark College and I’m open to software engineering roles and internships.',
    ],
    toolbox: [
      'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'FastAPI', 'Flask',
      'PostgreSQL', 'SQLAlchemy', 'Tailwind CSS', 'Docker', 'Vercel', 'Render', 'Fly.io',
      'Google Analytics & Tag Manager', 'Claude API & MCP',
    ],
    now: [
      'Building an operations platform for plumbing companies (see Applications).',
      'Running and improving the client sites in the Marketing folder.',
      'Open to software engineering roles and internships — say hello in Contact.',
    ],
  },

  // ---- Résumé (optional) ---------------------------------------------------
  // Set to an object to add a Résumé document to the desktop:
  // resume: { summary: '…', pdf: 'assets/resume.pdf',
  //   experience: [{ role, company, period, bullets: [] }],
  //   education: [{ school, degree, period }] },
  resume: null,

  // ---- Applications -------------------------------------------------------
  apps: [
    {
      id: 'plumbing-ops',
      name: 'Plumbing Ops Platform',
      tagline: 'Operations software for plumbing companies',
      year: '2025 – 2026',
      role: 'Design & development',
      stack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'SQLAlchemy', 'PostgreSQL'],
      color: '#d9ecff',
      description: [
        'An internal platform that runs the day-to-day of a plumbing business: service calls with workflows and follow-up tasks, construction jobs with phases and contacts, a customer database with service history, daily schedules for field technicians, and bids tracked from draft to won or lost.',
        'It also carries the marketing side of the business — planning and scheduling social posts across accounts, automated review requests after completed jobs, and an analytics dashboard.',
        'Built for two plumbing companies in Southwest Washington. Frontend on Vercel, API on Render, PostgreSQL behind it.',
      ],
      highlights: [
        'Service calls, jobs, customers, technician schedules and bids in one place',
        'Marketing module: social media scheduling and automated review requests',
        'Next.js frontend, FastAPI backend with Alembic migrations, JWT auth',
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
      stack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'PWA', 'Telegram Bot API', 'Google Calendar API', 'Claude API', 'Docker', 'Fly.io'],
      color: '#e2f4e0',
      description: [
        'Type “fix prod bug by friday urgent” or “gym every morning” and it works out the deadline, priority and category, places the task in a free calendar slot, and nudges you on Telegram. No forms, no menus.',
        'Under the hood: a rule-based natural-language parser, an auto-scheduler that fills open slots by priority and duration, two-way Google Calendar sync, habits with streaks, goals, time tracking and a little gamification. It also exposes an MCP server, so Claude can manage the whole thing in conversation.',
      ],
      highlights: [
        'Natural-language capture with no paid ML — intent classifier and parser are rule-based',
        'Installable PWA, Telegram bot, and an MCP server for AI agents',
        'Around 9,400 lines across modular services, deployed with Docker on Fly.io',
      ],
      links: [{ label: 'Open the app', url: 'https://life-tracker-vladkolesnik.fly.dev' }],
      image: '',
    },
    {
      id: 'financeflow',
      name: 'FinanceFlow',
      tagline: 'Team finance tracker with bank sync',
      year: '2025',
      role: 'Team project with Derek and David (CSE 310)',
      stack: ['Flask', 'SQLAlchemy', 'SQLite', 'React 19', 'Vite', 'Plaid API', 'Recharts'],
      color: '#fdebd3',
      description: [
        'Track income and expenses per user, set monthly budgets by category, and see the month’s income, spending and net at a glance. Bank accounts connect through Plaid, and transactions import and categorize themselves.',
      ],
      highlights: [
        'Plaid Link integration with de-duplicated transaction imports',
        'Keyword-based categorization covering 100+ merchants',
        'Per-category budgets with live progress',
      ],
      links: [],
      image: '',
    },
  ],

  // ---- Marketing ----------------------------------------------------------
  // icon: 'globe' | 'megaphone' | 'chart' | 'mail' | 'star' | 'doc' (or an emoji)
  marketing: [
    {
      id: 'all-county-plumbing',
      name: 'All County Plumbing',
      client: 'All County Plumbing, Vancouver WA',
      type: 'Website, local SEO & tracking',
      year: '2025 – 2026',
      icon: 'globe',
      description: [
        'Website for a family-owned plumbing company serving Southwest Washington — service and repair, commercial work and new construction, with service-area pages across Clark and Cowlitz counties.',
        'Built to generate calls: a sticky call-and-book bar, promotions, LocalBusiness and service structured data for Google, per-page canonicals, Google Analytics with attribution capture, and Vercel Analytics and Speed Insights.',
      ],
      highlights: [
        'Next.js site with structured data, sitemap and per-page canonicals',
        'Call and booking CTAs, promotions, service-area landing pages',
        'Analytics, attribution capture and performance monitoring',
      ],
      results: [],
      links: [{ label: 'Visit site', url: 'https://www.allcountyplumbers.com' }],
    },
    {
      id: 'h2o-plumbing',
      name: 'H2O Plumbing',
      client: 'H2O Plumbing, Vancouver WA',
      type: 'Website, local SEO & tracking',
      year: '2025 – 2026',
      icon: 'globe',
      description: [
        'Website for a Vancouver, WA plumber: same-day repairs, drain cleaning, water heaters, pipe repair and replacement for homes and businesses.',
        'Tracking is set up for real marketing decisions: Google Tag Manager loaded lazily so it doesn’t hurt page speed, PostHog product analytics, a Facebook pixel, LocalBusiness structured data, and domain verification for Google, Facebook and Trustpilot.',
      ],
      highlights: [
        'Next.js site with deferred tag loading for performance',
        'GTM, PostHog and Facebook pixel for attribution',
        'Structured data and review-platform verification',
      ],
      results: [],
      links: [{ label: 'Visit site', url: 'https://www.h2oplumbers.com' }],
    },
    {
      id: 'felts-customs',
      name: 'Felts Customs',
      client: 'Felts Customs — MagnaTrack dealer',
      type: 'Website, SEO & ads tracking',
      year: '2026',
      icon: 'globe',
      description: [
        'Website for an authorized MagnaTrack dealer installing motorized patio screens across Southwest Washington, Portland and Western Montana.',
        'Search-led from the start: category terms people actually search ahead of the brand name, per-page canonicals, LocalBusiness and FAQ structured data, GA4 with Google Ads conversion tracking, Bing and Pinterest verification, and a Google Business Profile review flow.',
      ],
      highlights: [
        'Keyword-led page structure for products, services and service areas',
        'GA4 + Google Ads conversions, JSON-LD LocalBusiness and FAQ schema',
        'Sticky quote CTA and Google review flow',
      ],
      results: [],
      links: [{ label: 'Visit site', url: 'https://feltscustoms.com' }],
    },
    {
      id: 'social-and-reviews',
      name: 'Social scheduling & review requests',
      client: 'Plumbing Ops Platform',
      type: 'Marketing automation',
      year: '2025 – 2026',
      icon: 'megaphone',
      description: [
        'The marketing module inside the Plumbing Ops Platform: plan and schedule social media content across several accounts from one calendar, and generate and track review requests after completed jobs so happy customers turn into public reviews.',
      ],
      highlights: [
        'Multi-account social content calendar',
        'Automated review request generation and tracking',
        'Reporting in the same dashboard as jobs and service calls',
      ],
      results: [],
      links: [{ label: 'See the platform', url: '#/apps/plumbing-ops' }],
    },
  ],

  // ---- Blog ----------------------------------------------------------------
  // One Markdown file per post in /posts. Newest first is automatic.
  posts: [
    {
      slug: 'hello',
      title: 'Hello',
      date: '2026-09-06',
      summary: 'A short introduction, and why this site looks like a computer from 1995.',
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
