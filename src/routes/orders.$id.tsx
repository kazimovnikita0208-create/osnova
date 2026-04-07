import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Check, Clock, ChefHat, PackageCheck, CircleCheckBig, Truck, ShoppingBag, RotateCcw } from 'lucide-react'
import { getOrderById, ORDER_STEPS, ORDER_STATUS_META } from '@/data/mock-orders'
import type { OrderStatus } from '@/data/mock-orders'
import { useCartStore } from '@/stores/cartStore'

export const Route = createFileRoute('/orders/$id')({
  component: OrderDetailPage,
})

const STEP_ICONS: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  accepted: Check,
  preparing: ChefHat,
  ready: PackageCheck,
  completed: CircleCheckBig,
  cancelled: Clock,
}

const STEP_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает',
  accepted: 'Принят',
  preparing: 'Готовится',
  ready: 'Готов к выдаче',
  completed: 'Выполнен',
  cancelled: 'Отменён',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OrderDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const order = getOrderById(id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <h2 className="font-heading text-xl font-bold text-[#1c1c17] mb-2">Заказ не найден</h2>
        <button
          onClick={() => navigate({ to: '/orders' })}
          className="text-sm text-[#384527] font-semibold mt-4"
        >
          К списку заказов
        </button>
      </div>
    )
  }

  const isCancelled = order.status === 'cancelled'
  const isActive = !isCancelled && order.status !== 'completed'
  const currentStepIdx = isCancelled ? -1 : ORDER_STEPS.indexOf(order.status)

  const handleRepeatOrder = () => {
    order.items.forEach((item) => {
      addItem({
        key: item.name,
        productId: item.id,
        slug: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        imageUrl: item.imageUrl,
        categorySlug: '',
        unitPrice: item.price,
        size: item.size,
        milk: item.milk,
      })
    })
    navigate({ to: '/cart' })
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-56px)] pb-28">
      {/* Olive header */}
      <div
        className="mx-4 mt-3 rounded-2xl px-5 pt-4 pb-4 relative overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, #384527, #4f5d3d)'
            : undefined,
          backgroundColor: isActive ? undefined : '#f0ede4',
        }}
      >
        {isActive && (
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-[#FCF9F0]/[0.04] -translate-y-10 translate-x-10" />
        )}

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => navigate({ to: '/orders' })}
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isActive ? 'bg-[#FCF9F0]/10' : 'bg-[#FCF9F0]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isActive ? 'text-[#FCF9F0]' : 'text-[#384527]'}`} />
          </button>
          <div>
            <p className={`text-[10.5px] font-semibold uppercase tracking-[0.15em] ${
              isActive ? 'text-[#FCF9F0]/50' : 'text-[#6b6960]'
            }`}>
              {formatDate(order.createdAt)}
            </p>
            <h1 className={`font-heading text-xl font-bold -mt-0.5 ${
              isActive ? 'text-[#FCF9F0]' : 'text-[#1c1c17]'
            }`}>
              Заказ #{order.orderNumber}
            </h1>
          </div>

          {isActive && (
            <span className="ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#FCF9F0]/15 text-[#FCF9F0] shrink-0">
              {ORDER_STATUS_META[order.status].label}
            </span>
          )}
        </div>
      </div>

      {/* Progress steps */}
      <div className="px-4 mt-4">
        <div className="bg-[#f0ede4] rounded-2xl p-5">
          {isCancelled ? (
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(157,64,72,0.12)' }}
              >
                <Clock className="w-5 h-5 text-[#9D4048]" />
              </div>
              <div>
                <p className="font-heading text-base font-bold text-[#9D4048]">Заказ отменён</p>
                <p className="text-[12px] text-[#6b6960] mt-0.5 leading-snug">
                  Свяжитесь с поддержкой для уточнения
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {ORDER_STEPS.map((step, idx) => {
                const StepIcon = STEP_ICONS[step]
                const isPassed = idx <= currentStepIdx
                const isCurrent = idx === currentStepIdx
                const isLast = idx === ORDER_STEPS.length - 1

                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isCurrent
                            ? 'text-[#FCF9F0]'
                            : isPassed
                              ? 'bg-[#384527]/12 text-[#384527]'
                              : 'bg-[#FCF9F0] text-[#6b6960]/25'
                        }`}
                        style={
                          isCurrent
                            ? {
                                background: 'linear-gradient(135deg, #384527, #4f5d3d)',
                                boxShadow: '0 4px 16px rgba(56,69,39,0.25)',
                              }
                            : undefined
                        }
                      >
                        <StepIcon className="w-[18px] h-[18px]" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-5 my-1.5 rounded-full ${
                            isPassed && idx < currentStepIdx
                              ? 'bg-[#384527]/20'
                              : 'bg-[#1c1c17]/[0.05]'
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-2.5">
                      <p
                        className={`text-[13px] font-semibold ${
                          isCurrent
                            ? 'text-[#384527]'
                            : isPassed
                              ? 'text-[#1c1c17]'
                              : 'text-[#6b6960]/25'
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delivery info */}
      <div className="px-4 mt-5">
        <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em] mb-2.5 px-1">
          Способ получения
        </p>
        <div className="bg-[#f0ede4] rounded-2xl px-4 py-4 flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #384527, #4f5d3d)',
            }}
          >
            {order.deliveryMethod === 'delivery' ? (
              <Truck className="w-[18px] h-[18px] text-[#FCF9F0]" />
            ) : (
              <ShoppingBag className="w-[18px] h-[18px] text-[#FCF9F0]" />
            )}
          </div>
          <span className="text-sm font-semibold text-[#1c1c17]">
            {order.deliveryMethod === 'delivery' ? 'Доставка курьером' : 'Самовывоз'}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="px-4 mt-5">
        <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em] mb-2.5 px-1">
          Состав заказа
        </p>
        <div className="bg-[#f0ede4] rounded-2xl px-4 py-3.5 space-y-3.5">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1c1c17] truncate">{item.name}</p>
                  {item.size && (
                    <p className="text-[11px] text-[#6b6960] mt-0.5">
                      {item.size}
                      {item.milk ? ` · ${item.milk}` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-bold text-[#384527]">{item.price * item.quantity} ₽</p>
                <p className="text-[11px] text-[#6b6960]">×{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-4 mt-5">
        <div className="bg-[#f0ede4] rounded-2xl px-4 py-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6b6960]">Товары</span>
            <span className="text-[13px] font-medium text-[#1c1c17]">{order.subtotal} ₽</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6b6960]">Доставка</span>
              <span className="text-[13px] font-medium text-[#1c1c17]">{order.deliveryFee} ₽</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2.5">
            <span className="text-sm font-semibold text-[#6b6960]">Итого</span>
            <span className="font-heading text-xl font-bold text-[#384527]">{order.total} ₽</span>
          </div>
        </div>
      </div>

      {/* Repeat order button */}
      {(order.status === 'completed' || order.status === 'cancelled') && (
        <div className="px-4 mt-6">
          <button
            onClick={handleRepeatOrder}
            className="w-full flex items-center justify-center gap-2.5 text-[#FCF9F0] font-semibold py-4 rounded-2xl active:scale-[0.98] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #384527, #4f5d3d)',
              boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Повторить заказ
          </button>
        </div>
      )}
    </div>
  )
}
