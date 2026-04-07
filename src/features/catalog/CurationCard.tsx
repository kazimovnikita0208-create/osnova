import { Link } from '@tanstack/react-router'

interface CurationCardProps {
  tag: string
  title: string
  description: string
  ctaText: string
  to?: string
}

export function CurationCard({ tag, title, description, ctaText, to = '/' }: CurationCardProps) {
  return (
    <section className="mx-4 mt-6 mb-2 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[var(--primary-container)] p-6">
      <span className="text-[10px] font-semibold tracking-[0.2em] text-primary-foreground/60 uppercase">
        {tag}
      </span>
      <h3 className="text-2xl font-heading font-bold text-primary-foreground leading-tight mt-2">
        {title}
      </h3>
      <p className="text-sm text-primary-foreground/70 mt-3 leading-relaxed max-w-[220px]">
        {description}
      </p>
      <Link
        to={to}
        className="inline-block mt-4 bg-card text-foreground text-xs font-semibold px-5 py-2.5 rounded-full tracking-wider hover:bg-card/90 transition-colors"
      >
        {ctaText}
      </Link>
    </section>
  )
}
