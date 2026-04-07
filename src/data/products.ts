import { coffeeProducts } from './mock-coffee'
import { gastronomyProducts } from './mock-gastronomy'
import type { Product } from './mock-coffee'

const allProducts = [...coffeeProducts, ...gastronomyProducts]

const coffeeSlugs = new Set(coffeeProducts.map((p) => p.slug))

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug)
}

export function getProductSection(slug: string): 'coffee' | 'gastronomy' {
  return coffeeSlugs.has(slug) ? 'coffee' : 'gastronomy'
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return allProducts.filter((p) =>
    p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  )
}
