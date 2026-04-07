import { SlidersHorizontal } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/data/mock-coffee'

interface ProductGridProps {
  products: Product[]
  title: string
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="px-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-card border border-border hover:bg-muted transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
