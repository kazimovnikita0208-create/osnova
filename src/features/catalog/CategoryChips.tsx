import { cn } from '@/lib/utils'
import type { Category } from '@/data/mock-coffee'

interface CategoryChipsProps {
  categories: Category[]
  activeSlug: string
  onChange: (slug: string) => void
}

export function CategoryChips({ categories, activeSlug, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-none px-4 pb-1 -mx-4">
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug

        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            className={cn(
              'flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
