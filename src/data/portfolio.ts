export interface Project {
  index: string
  title: string
  year: string
  description: string
  tags: string[]
  shotLabel: string
  /** Internal route to a live subpage, if the project is playable/interactive. */
  href?: string
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'Monolith',
    year: '2026',
    description:
      'A playable web-based synthesizer — a warm analog voice built on the Web Audio API. Oscillators, filter, ADSR, LFO and FX, driven live from an oscilloscope-lit panel and your keyboard.',
    tags: ['TYPESCRIPT', 'REACT', 'WEB AUDIO', 'CANVAS'],
    shotLabel: '[ LAUNCH THE SYNTH → ]',
    href: '/synth',
  },
  {
    index: '02',
    title: 'Ledger',
    year: '2024',
    description:
      'A double-entry payments core processing $40M/month. Rebuilt the settlement engine to be idempotent and auditable end to end.',
    tags: ['GO', 'POSTGRES', 'KAFKA', 'GRPC'],
    shotLabel: '[ PROJECT SHOT — LEDGER DASHBOARD ]',
  },
  {
    index: '03',
    title: 'Northwind',
    year: '2023',
    description:
      'Real-time analytics dashboard for logistics fleets. Sub-second queries over a billion rows using a streaming materialized-view layer.',
    tags: ['TYPESCRIPT', 'REACT', 'CLICKHOUSE', 'D3'],
    shotLabel: '[ PROJECT SHOT — NORTHWIND ANALYTICS ]',
  },
  {
    index: '04',
    title: 'Cascade',
    year: '2022',
    description:
      'An open-source design-to-code compiler. Turns component specs into typed, accessible React — 3.2k stars and counting.',
    tags: ['RUST', 'WASM', 'AST'],
    shotLabel: '[ PROJECT SHOT — CASCADE COMPILER ]',
  },
]

export interface ExperienceEntry {
  role: string
  detail: string
  range: string
}

export const experience: ExperienceEntry[] = [
  { role: 'Staff Engineer · Vantage', detail: 'Payments platform & developer tooling', range: '2022—NOW' },
  { role: 'Senior Engineer · Meridian', detail: 'Data infrastructure for logistics', range: '2019—2022' },
  { role: 'Software Engineer · Bynel', detail: 'Full-stack product engineering', range: '2017—2019' },
]

export interface ToolkitGroup {
  label: string
  items: string[]
}

export const toolkit: ToolkitGroup[] = [
  { label: 'LANGUAGES', items: ['Go', 'TypeScript', 'Rust', 'Python', 'SQL'] },
  { label: 'FRAMEWORKS', items: ['React', 'Next.js', 'Node', 'gRPC', 'GraphQL'] },
  { label: 'INFRA', items: ['Postgres', 'Kafka', 'Kubernetes', 'Terraform', 'AWS'] },
]

export const contact = {
  email: 'pablo@paliza-carre.dev',
  links: ['GITHUB', 'LINKEDIN', 'X'],
}
