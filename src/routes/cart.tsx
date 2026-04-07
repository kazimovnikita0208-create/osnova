import { createFileRoute, Link } from '@tanstack/react-router'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, removeItem, updateQuantity, totalCount } = useCartStore()

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <div className="w-20 h-20 bg-[#f0ede4] rounded-full flex items-center justify-center mb-5">
          <ShoppingBag className="w-9 h-9 text-[#6b6960]" />
        </div>
        <h2 className="font-heading text-xl font-bold text-[#1c1c17] mb-2">Корзина пуста</h2>
        <p className="text-sm text-[#6b6960] leading-relaxed mb-6">
          Добавьте что-нибудь из каталога, чтобы сделать заказ
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#FCF9F0] font-semibold px-6 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.15)' }}
        >
          Перейти в каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Heading */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-heading text-2xl font-bold text-[#1c1c17]">Корзина</h1>
        <p className="text-sm text-[#6b6960] mt-0.5">{totalCount} позиц.</p>
      </div>

      {/* Items */}
      <div className="px-4 space-y-3 mt-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="bg-[#f0ede4] rounded-2xl p-3.5 flex gap-3"
          >
            {/* Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1c1c17] text-sm leading-tight truncate">
                {item.name}
              </p>

              {item.size && (
                <p className="text-[11px] text-[#6b6960] mt-0.5 leading-snug">
                  {item.size} · {item.milk}
                  {item.syrup && item.syrup !== 'Без сиропа' ? ` · ${item.syrup}` : ''}
                  {item.temp ? ` · ${item.temp}` : ''}
                </p>
              )}

              <p className="text-sm font-bold text-[#384527] mt-1.5">
                {item.unitPrice} ₽
              </p>

              {/* Quantity row */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => updateQuantity(item.key, -1)}
                  className="w-8 h-8 rounded-xl bg-[#FCF9F0] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5 text-[#384527]" />
                </button>
                <span className="text-sm font-bold text-[#1c1c17] w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.key, 1)}
                  className="w-8 h-8 rounded-xl bg-[#FCF9F0] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5 text-[#384527]" />
                </button>

                <span className="ml-auto text-sm font-bold text-[#1c1c17]">
                  {item.unitPrice * item.quantity} ₽
                </span>
              </div>
            </div>

            {/* Delete — бургундский для деструктивных действий */}
            <button
              onClick={() => removeItem(item.key)}
              className="w-8 h-8 shrink-0 rounded-xl bg-[#9D4048]/10 flex items-center justify-center self-start active:scale-95 transition-transform"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#9D4048]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
