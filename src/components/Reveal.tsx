import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const style = delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined

  return (
    <div
      ref={ref}
      className={[
        'translate-y-6 opacity-0 transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:opacity-100',
        isInView && 'translate-y-0 opacity-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
