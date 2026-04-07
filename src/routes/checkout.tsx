import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ArrowLeft, MapPin, User, Phone, MessageSquare, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

const checkoutSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер'),
  delivery: z.enum(['pickup', 'delivery']),
  address: z.string().optional(),
  comment: z.string().optional(),
}).refine(
  (data) => data.delivery === 'pickup' || (data.address && data.address.length >= 5),
  { message: 'Введите адрес доставки', path: ['address'] }
)

type CheckoutForm = z.infer<typeof checkoutSchema>

const inputBase = 'w-full pl-10 pr-4 py-3.5 bg-[#f0ede4] rounded-2xl text-sm text-[#1c1c17] placeholder:text-[#6b6960]/50 outline-none transition-shadow'
const inputFocus = 'focus:ring-2 focus:ring-[#384527]/10'
const inputError = 'ring-2 ring-[#9D4048]/30'

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalCount, totalPrice, clearCart } = useCartStore()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema as any),
    defaultValues: {
      name: '',
      phone: '',
      delivery: 'pickup',
      address: '',
      comment: '',
    },
  })

  const deliveryMethod = watch('delivery')

  if (totalCount === 0 && !orderNumber) {
    navigate({ to: '/cart' })
    return null
  }

  // ── Экран подтверждения ──
  if (orderNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.2)' }}
        >
          <Check className="w-9 h-9 text-[#FCF9F0]" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#1c1c17] mb-2">
          Заказ принят!
        </h1>
        <p className="text-sm text-[#6b6960] leading-relaxed mb-1">
          Номер заказа
        </p>
        <p className="font-heading text-xl font-bold text-[#384527] mb-6">
          #{orderNumber}
        </p>
        <p className="text-sm text-[#6b6960] leading-relaxed mb-8">
          {deliveryMethod === 'pickup'
            ? 'Мы сообщим, когда заказ будет готов к самовывозу'
            : 'Курьер доставит ваш заказ в ближайшее время'}
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-[#FCF9F0] font-semibold px-8 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.15)' }}
        >
          На главную
        </button>
      </div>
    )
  }

  const onSubmit = (_data: CheckoutForm) => {
    const num = String(Math.floor(100000 + Math.random() * 900000))
    setOrderNumber(num)
    clearCart()
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/cart' })}
          className="w-10 h-10 shrink-0 rounded-xl bg-[#f0ede4] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-[#384527]" />
        </button>
        <h1 className="font-heading text-xl font-bold text-[#1c1c17]">Оформление</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 space-y-6 mt-3">

        {/* Delivery method */}
        <div>
          <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-2.5">
            Способ получения
          </p>
          <div className="flex gap-2">
            {[
              { value: 'pickup' as const, label: 'Самовывоз' },
              { value: 'delivery' as const, label: 'Доставка' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex-1 flex items-center justify-center py-3.5 rounded-2xl cursor-pointer transition-all text-sm font-semibold',
                  deliveryMethod === opt.value
                    ? 'text-[#FCF9F0]'
                    : 'bg-[#f0ede4] text-[#1c1c17]'
                )}
                style={deliveryMethod === opt.value
                  ? { background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.15)' }
                  : undefined
                }
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('delivery')}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-1.5 block">
            Имя
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6960]" />
            <input
              {...register('name')}
              placeholder="Ваше имя"
              className={cn(inputBase, errors.name ? inputError : inputFocus)}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-[#9D4048] mt-1 ml-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-1.5 block">
            Телефон
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6960]" />
            <input
              {...register('phone')}
              placeholder="+7 (900) 000-00-00"
              type="tel"
              className={cn(inputBase, errors.phone ? inputError : inputFocus)}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-[#9D4048] mt-1 ml-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        {deliveryMethod === 'delivery' && (
          <div>
            <label className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-1.5 block">
              Адрес доставки
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6960]" />
              <input
                {...register('address')}
                placeholder="Улица, дом, квартира"
                className={cn(inputBase, errors.address ? inputError : inputFocus)}
              />
            </div>
            {errors.address && (
              <p className="text-xs text-[#9D4048] mt-1 ml-1">{errors.address.message}</p>
            )}
          </div>
        )}

        {/* Comment */}
        <div>
          <label className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-1.5 block">
            Комментарий
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-[#6b6960]" />
            <textarea
              {...register('comment')}
              rows={2}
              placeholder="Пожелания к заказу..."
              className={cn(inputBase, inputFocus, 'resize-none !py-3.5')}
            />
          </div>
        </div>

        {/* Order summary */}
        <div>
          <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-3">
            Ваш заказ
          </p>
          <div className="bg-[#f0ede4] rounded-2xl px-4 py-3 space-y-3">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1c1c17] truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-[11px] text-[#6b6960]">{item.size} · {item.milk}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold text-[#384527]">{item.unitPrice * item.quantity} ₽</p>
                  <p className="text-[11px] text-[#6b6960]">×{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4">
            <span className="text-sm font-semibold text-[#6b6960]">Итого</span>
            <span className="font-heading text-xl font-bold text-[#384527]">{totalPrice} ₽</span>
          </div>
        </div>
      </form>

      {/* Fixed CTA — gradient 135° */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 max-w-lg mx-auto">
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center gap-2 text-[#FCF9F0] font-semibold py-4 rounded-2xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.2)' }}
        >
          Оплатить · {totalPrice} ₽
        </button>
      </div>
    </div>
  )
}
