import { create } from 'zustand'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  key: string
  productId: string
  slug: string
  name: string
  imageUrl: string
  categorySlug: string
  unitPrice: number
  quantity: number
  size?: string
  milk?: string
  syrup?: string
  temp?: string
  sugar?: string
}

interface CartStore {
  items: CartItem[]
  totalCount: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, delta: number) => void
  clearCart: () => void
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function totals(items: CartItem[]) {
  return {
    totalCount: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
  }
}

export function buildCartKey(
  slug: string,
  opts?: { size?: string; milk?: string; syrup?: string; temp?: string; sugar?: string }
): string {
  if (!opts) return slug
  return [slug, opts.size, opts.milk, opts.syrup, opts.temp, opts.sugar]
    .filter(Boolean)
    .join('|')
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalCount: 0,
  totalPrice: 0,

  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.key === newItem.key)
      const next = existing
        ? state.items.map((i) =>
            i.key === newItem.key ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...newItem, quantity: 1 }]
      return { items: next, ...totals(next) }
    }),

  removeItem: (key) =>
    set((state) => {
      const next = state.items.filter((i) => i.key !== key)
      return { items: next, ...totals(next) }
    }),

  updateQuantity: (key, delta) =>
    set((state) => {
      const next = state.items
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
      return { items: next, ...totals(next) }
    }),

  clearCart: () => set({ items: [], totalCount: 0, totalPrice: 0 }),
}))
