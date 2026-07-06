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
        // Apply the offset only while hidden: `translate-y-6` and `translate-y-0`
        // both write --tw-translate-y, and Tailwind emits y-0 before y-6, so if
        // both were present y-6 would win and the element would never rise.
        'transition-[opacity,translate] duration-700 motion-reduce:!translate-y-0 motion-reduce:opacity-100',
        isInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
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
