import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  center?: boolean
}

export function SectionHeading({ title, subtitle, className, center }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 flex gap-3', center && 'justify-center', className)}>
      <div className="w-[3px] shrink-0 self-stretch bg-chess-green" />
      <div className={cn(center && 'text-center')}>
        <h2 className="font-display text-3xl tracking-[2px] text-chess-cream uppercase md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-chess-muted">{subtitle}</p>}
      </div>
    </div>
  )
}
