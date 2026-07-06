export interface Project {
  index: string
  title: string
  year: string
  description: string
  tags: string[]
  shotLabel: string
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
      'A mini property-management CRM with full CRUD for properties, built on Next.js Server Actions and Postgres. Zod-validated writes end to end, deployed against Supabase.',
    tags: ['NEXT.JS', 'TYPESCRIPT', 'POSTGRES', 'DRIZZLE'],
    shotLabel: '[ VIEW THE CRM → ]',
    href: 'https://property-crm.pablopaliza.com',
    external: true,
    githubHref: 'https://github.com/pfpaliza/property-crm',
  },
  {
    index: '02',
    title: 'Monolith',
    year: '2026',
    description:
      'A playable web-based synthesizer — a warm analog voice built on the Web Audio API. Oscillators, filter, ADSR, LFO and FX, driven live from an oscilloscope-lit panel and your keyboard.',
    tags: ['TYPESCRIPT', 'REACT', 'WEB AUDIO', 'CANVAS'],
    shotLabel: '[ LAUNCH THE SYNTH → ]',
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
    href: 'https://github.com/pfpaliza/cancer-cnn/blob/main/cnn-cancer-detection.ipynb',
    external: true,
  },
]

export interface ExperienceEntry {
  role: string
  detail: string
  range: string
}

export const experience: ExperienceEntry[] = [
  { role: 'Software Development Lead', detail: 'Westland Real Estate Group · Remote', range: '2024—NOW' },
  { role: 'Software Developer', detail: 'Westland Real Estate Group · Remote', range: '2023—2024' },
  { role: 'Junior Software Developer', detail: 'Westland Real Estate Group · Remote', range: '2022—2023' },
  { role: 'IT Engineer', detail: 'Synergy Associates · Los Angeles', range: '2021—2022' },
  { role: 'Software Developer', detail: 'Paliza Consulting · Part-time', range: '2020—2025' },
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
