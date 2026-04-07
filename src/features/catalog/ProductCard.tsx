import { Link } from '@tanstack/react-router'
import { Heart, Plus, Minus } from 'lucide-react'
import type { Product } from '@/data/mock-coffee'
import { useCartStore, buildCartKey } from '@/stores/cartStore'

interface ProductCardProps {
  product: Product
}

// Дефолтные опции для кофе при добавлении из каталога
const DEFAULT_COFFEE_OPTS = {
  size: 'M',
  milk: 'Цельное',
  syrup: 'Без сиропа',
  temp: 'Горячий',
  sugar: '1',
}

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = product.availability === 'out_of_stock'
  const isComingSoon = product.availability === 'coming_soon'
  const isDrink = ['coffee', 'fresh', 'kofe', 'chai', 'freshi'].includes(product.categorySlug)

  const { addItem, updateQuantity, items } = useCartStore()

  const opts = isDrink ? DEFAULT_COFFEE_OPTS : undefined
  const cartKey = buildCartKey(product.slug, opts)
  const cartItem = items.find((i) => i.key === cartKey)
  const qty = cartItem?.quantity ?? 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      key: cartKey,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      categorySlug: product.categorySlug,
      unitPrice: product.price,
      ...opts,
    })
  }

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(cartKey, -1)
  }

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="block group"
    >
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#f0ede4] aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
        >
          <Heart className="w-4 h-4 text-[#1c1c17]/60" />
        </button>
        {isComingSoon && (
          <div className="absolute top-3 left-3 bg-[#9D4048] text-[#FCF9F0] text-[10px] font-semibold px-2 py-1 rounded-full">
            Скоро
          </div>
        )}
      </div>

      {/* Info row */}
      <div className="mt-2.5 px-0.5">
        <h4 className="text-sm font-medium text-[#1c1c17] leading-tight">{product.name}</h4>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-semibold text-[#1c1c17]">{product.price} ₽</span>

          {!isUnavailable && !isComingSoon && (
            qty > 0 ? (
              // Счётчик +/−
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              >
                <button
                  onClick={handleMinus}
                  className="w-7 h-7 rounded-full bg-[#f0ede4] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5 text-[#384527]" />
                </button>
                <span className="text-sm font-bold text-[#384527] w-4 text-center">{qty}</span>
                <button
                  onClick={handleAdd}
                  className="w-7 h-7 rounded-full bg-[#384527] text-[#FCF9F0] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              // Кнопка +
              <button
                onClick={handleAdd}
                className="w-7 h-7 rounded-full bg-[#384527] text-[#FCF9F0] flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </Link>
  )
}
