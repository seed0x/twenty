/* ==========================================================================
   content.js — everything on the site that is *about you* lives here.
   Change the text, reload, done. Blog posts are Markdown files in /posts.
   Optional fields can be left empty ('' or []) and the site hides them.
   ========================================================================== */

const SITE = {
  // ---- Identity -----------------------------------------------------------
  name: 'Vlad Kolesnik',
  handle: 'vlad',                    // terminal user name
  role: 'Software developer',
  tagline: 'Hi. I build websites and software for small businesses, mostly around Vancouver, Washington.',
  location: 'Vancouver, WA',
  email: '',                         // ← add your email to enable the Contact form
  links: [
    { label: 'GitHub', url: 'https://github.com/seed0x' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/…' },
  ],
  contactNote: 'Questions, work, or just to say hi.',
  sourceUrl: '',                     // Help ▸ View Source (leave empty to hide)

  // ---- The fake computer --------------------------------------------------
  systemName: 'Mac OS',
  systemVersion: '7.5.3',
  diskName: 'Macintosh HD',
  bootText: 'Welcome to Macintosh.',

  // ---- Read Me ------------------------------------------------------------
  about: {
    intro: [
      'Most of what I do is for local service companies: a website that gets them calls, the internal tools that run the office and the crews, and the tracking to see what’s working. I usually keep working with people after the first project.',
      'I’m also studying software engineering at Clark College, and I build things for myself on the side — like a task app that runs on a Telegram bot.',
      'This site is a small homage to classic Mac OS, because I like it. Poke around.',
    ],
    toolbox: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Vercel', 'GA4 & Tag Manager'],
    now: [],
  },

  // ---- Services ------------------------------------------------------------
  services: {
    title: 'What I do',
    lead: 'If you run a small business and need a website or some software, this is roughly what I can help with.',
    items: [
      {
        name: 'Websites',
        text: 'A site that loads fast, shows up in local search, and makes it easy to call or book.',
      },
      {
        name: 'Internal tools',
        text: 'Scheduling, jobs, customers, bids, review requests, reporting. Built around how you actually work.',
      },
      {
        name: 'Tracking',
        text: 'Analytics and ad tracking set up properly, so you know where customers come from.',
      },
    ],
    how: [],
    note: 'I work with a few people at a time and usually stick around after launch. If that sounds useful, send me a note.',
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
      role: 'Design & development',
      stack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'SQLAlchemy', 'PostgreSQL'],
      color: '#d9ecff',
      description: [
        'Runs the day-to-day of a plumbing business: service calls with workflows and follow-ups, construction jobs with phases and contacts, customers with service history, daily technician schedules, and bids from draft to won or lost.',
        'It also handles the marketing side: social scheduling across accounts, automated review requests after completed jobs, and an analytics dashboard. Built for two plumbing companies in Southwest Washington and still being built out.',
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
        'A family-owned plumbing contractor doing service and repair, commercial work and new construction across two counties. It started with the website and now includes their operations software.',
        'The site is built to get calls: service-area pages, a sticky call-and-book bar, promotions, LocalBusiness structured data, per-page canonicals, Google Analytics with attribution capture, and performance monitoring.',
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
        'A plumbing company focused on same-day residential and commercial work. The website plus a tracking setup they can actually make decisions from.',
        'Google Tag Manager loaded lazily so it doesn’t slow the page, PostHog analytics, a Facebook pixel, structured data, and domain verification for Google, Facebook and Trustpilot.',
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
        'An authorized dealer installing motorized patio screens across three states. The website is built around what people actually search for, with the brand name second.',
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
        'Schedule social posts across several accounts from one calendar, and send and track review requests after completed jobs, so nobody has to remember to ask.',
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
      summary: 'Who I am, and why this site looks like a computer from 1995.',
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
