// Every string on the site lives here. Anything wrapped in tbc('...') is a
// fact that still needs confirming. It renders highlighted in development
// and is hidden in production builds, so nothing unconfirmed ships by accident.

export const tbc = (note) => ({ tbc: note })

export const site = {
  name: 'Victory Bedford',
  firstName: 'Victory',
  lastName: 'Bedford',
  line: 'Frontend developer. I build mobile and web products end to end, from the screen down to the backend that runs it.',
  location: 'Lagos, Nigeria',
  timezone: 'Africa/Lagos',
  email: tbc('Public email address'),
  github: 'https://github.com/victory1069',
  linkedin: 'https://www.linkedin.com/in/victory-bedford',
  cv: '/Victory-Bedford-CV.pdf',
  phoneHint: 'Tap the screen. Everything in here works.',
  statement:
    'I build products people hold in their hands. Five of them are on this page. You don’t have to read about them, you can use them.',
  marquee: ['React Native', 'Expo', 'React', 'Next.js', 'TypeScript', 'Fastify', 'Postgres', 'Drizzle', 'Tailwind', 'Framer Motion', 'Figma'],
}

export const experience = [
  {
    company: 'Interswitch Group',
    role: 'Software Engineer (NYSC)',
    dates: 'Mar 2025 – Mar 2026',
    detail: tbc('One line on what you worked on at Interswitch'),
  },
  {
    company: 'Meristem Securities',
    role: 'Frontend Developer / Systems Engineering Intern',
    dates: 'Aug – Nov 2024',
    detail: tbc('One line on what you worked on at Meristem'),
  },
]

export const projects = [
  {
    slug: 'quanti-hr',
    name: 'Quanti HR',
    app: 'Quanti',
    tagline: 'HR that fits the company, not the other way round.',
    card: 'An HR platform where each company sets its own rules during onboarding. Staff use a mobile app to check in, request leave and see payslips. HR runs everything from a web dashboard.',
    role: 'Mobile app and API',
    roleNote: tbc('Solo build? And did you also build the web admin?'),
    timeline: tbc('Start – end dates'),
    stack: ['React Native', 'Expo', 'TanStack Query', 'Zustand', 'Fastify', 'Drizzle', 'Postgres', 'Claude API'],
    live: null,
    repo: 'https://github.com/victory1069/quantihr',
    brand: { bg: '#F4F3FF', ink: '#14112E', primary: '#5B4BE8', accent: '#FF6B4A' },
    problem:
      'Small and mid-sized companies track attendance, leave and payroll across spreadsheets and WhatsApp. HR spends its week chasing people for information the system should already have.',
    built: [
      'A mobile app for staff: office check-in against a rotating code, leave requests that show who is covering, payslips, and goals and KPIs.',
      'An API that each company configures during onboarding: working hours, leave types, approval chains. One codebase, many sets of rules.',
    ],
    hard:
      'Letting each organisation customise the setup without every company turning into its own codebase. The rules are data, not code: onboarding writes a policy the API reads on every request.',
    hardNote: tbc('Confirm, or swap for the problem you actually found hardest. Offline check-in looks like a strong candidate from the repo.'),
    status: tbc('MVP / in testing / live with X companies'),
    next: 'AI meeting summaries that assign tasks, and automatic queries for lateness and missed meetings.',
  },
  {
    slug: 'bliss-waka',
    name: 'Bliss Waka',
    app: 'Waka',
    tagline: 'Lagos, sorted for tonight.',
    card: 'A going-out guide for Lagos covering events, food, nightlife and places, Island and Mainland, with real naira prices. I built the frontend. Launches 26 November 2026.',
    role: 'Frontend, team of three',
    roleNote: tbc('Which parts were yours: landing page, feed, search UI, admin?'),
    timeline: '2026',
    stack: [tbc('Next.js or React?'), 'PWA'],
    live: 'https://blisswaka.com',
    repo: null,
    brand: { bg: '#121010', ink: '#F6EEE8', primary: '#D2693C', accent: '#F2C14E' },
    problem:
      'Finding something to do in Lagos means digging through Instagram pages and group chats, usually with no prices. You find out it was ₦40,000 a head when you get there.',
    built: [
      'A “tonight near you” feed filtered by area and budget, and a search box that understands plain questions like “cheap rooftop on the Island this Friday”.',
      'A dark interface with a terracotta mark and animated type in the hero, built to feel like going out rather than like a directory.',
    ],
    hard:
      'Shipping as a PWA instead of two native apps, so one codebase covers the product, lead capture and the admin.',
    hardNote: tbc('Confirm, or tell me the part you actually found hardest'),
    status: 'Pre-launch page live at blisswaka.com. Public launch on 26 November 2026.',
    next: tbc('One honest line on what you would do next'),
  },
  {
    slug: 'taxeer-ng',
    name: 'Taxeer NG',
    app: 'Taxeer',
    tagline: 'Compliance autopilot for Nigerian founders.',
    card: 'Tells a founder where they stand on tax and filings and what is due next, so they stay out of trouble without hiring a full-time accountant.',
    role: tbc('Your role'),
    timeline: tbc('Dates'),
    stack: [tbc('Stack')],
    live: 'https://taxeerng.vercel.app',
    repo: null,
    brand: { bg: '#F3F7F2', ink: '#0F1F17', primary: '#0E7A4B', accent: '#E8A317' },
    problem: tbc('Founders miss filings because rules are unclear and deadlines are scattered. Say it in your own words.'),
    built: [tbc('Screens, features, your role')],
    hard: tbc('e.g. turning tax rules into something a founder can read in ten seconds'),
    status: 'Live at taxeerng.vercel.app.',
    next: tbc('One honest line'),
  },
  {
    slug: 'fundready',
    name: 'FundReady AI',
    app: 'FundReady',
    tagline: 'Know if your business is fund ready.',
    card: 'Founders go through a guided interview and get an audit of their business across eight areas, with scores, red flags and a 90-day plan, before investors look.',
    role: tbc('Mobile app / frontend?'),
    timeline: tbc('Dates'),
    stack: ['React Native', tbc('rest of stack'), 'AI'],
    live: 'https://fundreadyai.vercel.app',
    repo: null,
    credit: tbc('Built with Gtext Soft. Confirm how to credit the team'),
    brand: { bg: '#F6F4EE', ink: '#16130C', primary: '#1D3B8B', accent: '#E04F3A' },
    problem: 'Founders walk into investor meetings without knowing what will sink them in diligence.',
    built: [
      'The founder interview, in eight modules: company, market, product, traction, economics, team, compliance and the raise.',
      'The report: a score per area, the red flags an investor would find first, and a 90-day plan to fix them.',
    ],
    hard:
      'Making a 15–20 minute interview feel short, and presenting a score so it reads as advice rather than judgement.',
    hardNote: tbc('Confirm or replace'),
    status: 'Live at fundreadyai.vercel.app.',
    next: tbc('One honest line'),
  },
  {
    slug: 'the-bridge',
    name: 'The Bridge Pitch',
    app: 'Bridge',
    tagline: 'Connect to capital. Secure grants. Scale globally.',
    card: 'The marketing site for The Bridge Pitch Network, which connects high-growth founders to grants, private equity and a global VC network. I wrote the brand system into the code, so the site can’t drift off-brand.',
    role: tbc('Solo build?'),
    timeline: '2026',
    stack: ['React', 'Tailwind v4', 'Framer Motion', 'Vite'],
    live: tbc('Live URL'),
    repo: null,
    brand: { bg: '#0B0D10', ink: '#F5F2EC', primary: '#FF3B14', accent: '#D9A521' },
    problem:
      'A founder network has to look credible to investors and approachable to first-time founders at the same time, and it has to stay on-brand as more people edit the site.',
    built: [
      'A single-page site: hero, what the network is, the four pillars (monthly grants, private equity, a global VC network, FundReady AI intake), the process, and the call to apply.',
      'Every string lives in one content file, so copy changes never touch a component.',
    ],
    hard:
      'Enforcing the brand in code. The mark is generated from its unit grid rather than traced. Only the four approved colourways exist as options, and clear space is built into the lockup, so there is no way to use the logo wrong.',
    status: tbc('Live? Any outcome from the network launch?'),
    next: tbc('One honest line'),
  },
]

export const about = {
  bio: [
    'I studied Computer Science at Covenant University and graduated in 2024. I’m a frontend developer: I build React Native and web apps, and I handle the backend when a feature needs it.',
    'Before code I did graphic design and comms, which is why I care how the interfaces look.',
  ],
  community: [
    { title: 'Still Graphics Editor', org: 'SEALD Office' },
    { title: 'PRO', org: 'NACOS CU', dates: '2023 – 2024' },
    { title: 'PRO', org: 'CU Data Science Club' },
    { title: 'Media team', org: 'Chaplaincy' },
  ],
  stack: [
    { group: 'Mobile', items: ['React Native', 'Expo', 'Expo Router', 'TanStack Query', 'Zustand'] },
    { group: 'Web', items: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'] },
    { group: 'Backend', items: ['Node', 'Fastify', 'Drizzle', 'Postgres', 'Supabase'] },
    { group: 'Design', items: ['Figma', tbc('Photoshop / Illustrator?')] },
  ],
}
