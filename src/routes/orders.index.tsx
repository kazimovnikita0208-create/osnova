import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Package, ChevronRight, Truck, ShoppingBag, ArrowRight } from 'lucide-react'
import { mockOrders, ORDER_STATUS_META } from '@/data/mock-orders'
import type { Order, OrderStatus } from '@/data/mock-orders'

export const Route = createFileRoute('/orders/')({
  component: OrdersListPage,
})

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status]

  const styleMap: Record<OrderStatus, { bg: string; color: string }> = {
    pending:   { bg: '#e8e5dc', color: '#6b6960' },
    accepted:  { bg: 'rgba(56,69,39,0.12)', color: '#384527' },
    preparing: { bg: 'rgba(157,64,72,0.12)', color: '#9D4048' },
    ready:     { bg: 'rgba(56,69,39,0.12)', color: '#384527' },
    completed: { bg: '#e8e5dc', color: '#6b6960' },
    cancelled: { bg: 'rgba(157,64,72,0.08)', color: '#9D4048' },
  }

  const s = styleMap[status]

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      {meta.label}
    </span>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function ActiveOrderCard({ order }: { order: Order }) {
  return (
    <Link
      to="/orders/$id"
      params={{ id: order.id }}
      className="block rounded-2xl p-4 active:scale-[0.99] transition-transform relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #384527, #4f5d3d)',
      }}
    >
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-[#FCF9F0]/[0.04] -translate-y-10 translate-x-10" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[14px] font-bold text-[#FCF9F0]">
            #{order.orderNumber}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#FCF9F0]/15 text-[#FCF9F0]">
            {ORDER_STATUS_META[order.status].label}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#FCF9F0]/25 shrink-0" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-[#384527]"
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-[#FCF9F0]/60 truncate leading-snug">
            {order.items.map((i) => i.name).join(', ')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-[#FCF9F0]/50">
          {order.deliveryMethod === 'delivery' ? (
            <Truck className="w-3.5 h-3.5" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
          <span>{order.deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}</span>
          <span className="text-[#FCF9F0]/20 mx-0.5">·</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <span className="text-[14px] font-bold text-[#FCF9F0]">{order.total} ₽</span>
      </div>
    </Link>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to="/orders/$id"
      params={{ id: order.id }}
      className="block bg-[#f0ede4] rounded-2xl p-4 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[14px] font-bold text-[#1c1c17]">
            #{order.orderNumber}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <ChevronRight className="w-4 h-4 text-[#1c1c17]/15 shrink-0" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-[#f0ede4]"
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-11 h-11 rounded-xl bg-[#FCF9F0] ring-2 ring-[#f0ede4] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#6b6960]">
                +{order.items.length - 3}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-[#6b6960] truncate leading-snug">
            {order.items.map((i) => i.name).join(', ')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-[#6b6960]">
          {order.deliveryMethod === 'delivery' ? (
            <Truck className="w-3.5 h-3.5" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
          <span>{order.deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}</span>
          <span className="text-[#6b6960]/30 mx-0.5">·</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <span className="text-[14px] font-bold text-[#384527]">{order.total} ₽</span>
      </div>
    </Link>
  )
}

function OrdersListPage() {
  const navigate = useNavigate()

  const activeOrders = mockOrders.filter((o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready')
  const pastOrders = mockOrders.filter((o) => o.status === 'completed' || o.status === 'cancelled')

  if (mockOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, #384527, #4f5d3d)',
            boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
          }}
        >
          <Package className="w-9 h-9 text-[#FCF9F0]" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#1c1c17] mb-2">Заказов пока нет</h2>
        <p className="text-sm text-[#6b6960] leading-relaxed mb-8">
          Ваши заказы появятся здесь после оформления
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#FCF9F0] font-semibold px-8 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #384527, #4f5d3d)',
            boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
          }}
        >
          Перейти в каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-56px)]">
      {/* Header */}
      <div className="px-5 pt-3 pb-1 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/profile' })}
          className="w-10 h-10 shrink-0 rounded-xl bg-[#f0ede4] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-[#384527]" />
        </button>
        <div>
          <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em]">
            История
          </p>
          <h1 className="font-heading text-xl font-bold text-[#1c1c17] -mt-0.5">Мои заказы</h1>
        </div>
      </div>

      <div className="px-4 mt-4 pb-24">
        {/* Active orders — olive accent */}
        {activeOrders.length > 0 && (
          <div className="mb-5">
            <p className="text-[10.5px] font-semibold text-[#384527] uppercase tracking-[0.15em] mb-2.5 px-1">
              Активные
            </p>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <ActiveOrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Past orders */}
        {pastOrders.length > 0 && (
          <div>
            <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em] mb-2.5 px-1">
              Завершённые
            </p>
            <div className="space-y-3">
              {pastOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
