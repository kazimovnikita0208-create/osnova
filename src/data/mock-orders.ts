export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  imageUrl: string
  price: number
  quantity: number
  size?: string
  milk?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  deliveryMethod: 'pickup' | 'delivery'
  createdAt: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Ожидает',    color: '#6b6960', bg: '#f0ede4' },
  accepted:  { label: 'Принят',     color: '#384527', bg: '#384527/15' },
  preparing: { label: 'Готовится',  color: '#9D4048', bg: '#9D4048/15' },
  ready:     { label: 'Готов',      color: '#384527', bg: '#384527/15' },
  completed: { label: 'Выполнен',   color: '#6b6960', bg: '#f0ede4' },
  cancelled: { label: 'Отменён',    color: '#9D4048', bg: '#9D4048/10' },
}

export const ORDER_STEPS: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed']

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '847291',
    status: 'preparing',
    deliveryMethod: 'pickup',
    createdAt: '2026-03-29T10:15:00',
    items: [
      {
        id: '1',
        name: 'Iced Latte',
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop&q=80',
        price: 220,
        quantity: 2,
        size: 'M',
        milk: 'Овсяное',
      },
      {
        id: '2',
        name: 'Круассан с миндалём',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=200&h=200&fit=crop&q=80',
        price: 280,
        quantity: 1,
      },
    ],
    subtotal: 720,
    deliveryFee: 0,
    total: 720,
  },
  {
    id: 'ord-2',
    orderNumber: '841055',
    status: 'completed',
    deliveryMethod: 'delivery',
    createdAt: '2026-03-28T16:42:00',
    items: [
      {
        id: '3',
        name: 'Камамбер «Maison»',
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=200&h=200&fit=crop&q=80',
        price: 890,
        quantity: 1,
      },
      {
        id: '4',
        name: 'Оливковое масло Extra Virgin',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop&q=80',
        price: 1250,
        quantity: 1,
      },
    ],
    subtotal: 2140,
    deliveryFee: 250,
    total: 2390,
  },
  {
    id: 'ord-3',
    orderNumber: '839710',
    status: 'completed',
    deliveryMethod: 'pickup',
    createdAt: '2026-03-27T09:30:00',
    items: [
      {
        id: '5',
        name: 'Cappuccino',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop&q=80',
        price: 190,
        quantity: 3,
        size: 'L',
        milk: 'Цельное',
      },
    ],
    subtotal: 570,
    deliveryFee: 0,
    total: 570,
  },
  {
    id: 'ord-4',
    orderNumber: '835482',
    status: 'cancelled',
    deliveryMethod: 'delivery',
    createdAt: '2026-03-25T14:10:00',
    items: [
      {
        id: '6',
        name: 'Прошутто ди Парма 24 мес.',
        imageUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=200&h=200&fit=crop&q=80',
        price: 1450,
        quantity: 1,
      },
    ],
    subtotal: 1450,
    deliveryFee: 250,
    total: 1700,
  },
]

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}
