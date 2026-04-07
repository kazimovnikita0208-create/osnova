import { ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/data/mock-coffee'

interface CategoryRowProps {
  title: string
  products: Product[]
  onViewAll?: () => void
}

export function CategoryRow({ title, products, onViewAll }: CategoryRowProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-8">
      {/* Заголовок строки */}
      <div className="flex items-baseline justify-between px-4 mb-3">
        <h3 className="font-heading text-[22px] font-semibold tracking-normal text-primary">{title}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-0.5 font-sans text-sm font-semibold text-[#9D4048] active:opacity-70 transition-opacity"
          >
            Все
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Горизонтальный скролл */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[160px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
