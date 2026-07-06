export interface Project {
  index: string
  title: string
  year: string
  description: string
  tags: string[]
  shotLabel: string
  /** Path to the project's cover image under /public, shown in the shot area. */
  cover?: string
  /** Route to a live subpage or external URL, if the project is playable/interactive. */
  href?: string
  /** Set when href points off-site, so the link doesn't go through client-side routing. */
  external?: boolean
  /** Link to the project's source on GitHub, shown alongside the live/demo link. */
  githubHref?: string
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'Property CRM',
    year: '2026',
    description:
      'A mini property-management CRM with full CRUD for properties, built on Next.js and Postgres, deployed against Supabase.',
    tags: ['NEXT.JS', 'TYPESCRIPT', 'POSTGRES', 'DRIZZLE'],
    shotLabel: '[ VIEW THE CRM → ]',
    cover: '/covers/property-crm.png',
    href: 'https://property-crm.pablopaliza.com',
    external: true,
    githubHref: 'https://github.com/pfpaliza/property-crm',
  },
  {
    index: '02',
    title: 'Web Synth',
    year: '2026',
    description:
      'A playable subtractive synth built on the Web Audio API. Oscillators, filter, ADSR, LFO and FX, driven live from an oscilloscope-lit panel and your keyboard.',
    tags: ['TYPESCRIPT', 'REACT', 'WEB AUDIO', 'CANVAS'],
    shotLabel: '[ LAUNCH THE SYNTH → ]',
    cover: '/covers/web-synth.png',
    href: '/synth',
    githubHref: 'https://github.com/pfpaliza/portfolio-new/tree/main/src/synth',
  },
  {
    index: '03',
    title: 'Tiny Survival',
    year: '2025',
    description:
      'A browser-playable survival game built in Godot and exported to HTML5.',
    tags: ['GODOT', 'GDSCRIPT', 'HTML5'],
    shotLabel: '[ PLAY ON ITCH.IO → ]',
    cover: '/covers/tiny-survival.png',
    href: 'https://pfpaliza.itch.io/tiny-survival',
    external: true,
  },
  {
    index: '04',
    title: 'Cancer Detection',
    year: '2025',
    description:
      'A convolutional neural network that classifies histopathologic scans for signs of cancer, trained on a 220k-image Kaggle dataset with Keras and TensorFlow.',
    tags: ['PYTHON', 'TENSORFLOW', 'KERAS', 'CNN'],
    shotLabel: '[ VIEW THE NOTEBOOK → ]',
    cover: '/covers/cancer-detection.png',
    href: 'https://github.com/pfpaliza/cancer-cnn/blob/main/cnn-cancer-detection.ipynb',
    external: true,
  },
]

export interface ExperienceRole {
  role: string
  range: string
}

export interface ExperienceEntry {
  company: string
  location: string
  range: string
  roles: ExperienceRole[]
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Westland Real Estate Group',
    location: 'Remote',
    range: '2022—NOW',
    roles: [
      { role: 'Software Development Lead', range: '2024—NOW' },
      { role: 'Software Developer', range: '2023—2024' },
      { role: 'Junior Software Developer', range: '2022—2023' },
    ],
  },
  {
    company: 'Synergy Associates',
    location: 'Los Angeles',
    range: '2021—2022',
    roles: [{ role: 'IT Engineer', range: '2021—2022' }],
  },
  {
    company: 'Paliza Consulting',
    location: 'Remote',
    range: '2020—2025',
    roles: [{ role: 'Software Developer (Part-time)', range: '2020—2025' }],
  },
]

export interface ToolkitGroup {
  label: string
  items: string[]
}

export const toolkit: ToolkitGroup[] = [
  { label: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Bash'] },
  { label: 'FRAMEWORKS', items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'] },
  { label: 'CLOUD & DATA', items: ['GCP', 'Cloud Run', 'BigQuery', 'PostgreSQL', 'Pub/Sub'] },
]

export const contact = {
  email: 'pf.paliza@gmail.com',
  links: [
    { label: 'GITHUB', href: 'https://github.com/pfpaliza' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/pablo-paliza-carre-029676134/' },
  ],
}
