import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SECTIONS } from '@/data/mock-catalog'

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  !import.meta.env.VITE_SUPABASE_URL

export interface Section {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
}

export interface Category {
  id: string
  section_id: string
  slug: string
  name: string
  icon: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface Product {
  id: string
  category_id: string
  slug: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  availability: 'in_stock' | 'out_of_stock' | 'coming_soon'
  is_active: boolean
  sort_order: number
  weight: number | null
  weight_unit: string | null
  composition: string | null
  calories: number | null
  proteins: number | null
  fats: number | null
  carbs: number | null
  iiko_id: string | null
  category?: Category
}

export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_SECTIONS as Section[]

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data as Section[]
    },
  })
}

export function useCategories(sectionSlug?: string) {
  return useQuery({
    queryKey: ['categories', sectionSlug],
    queryFn: async () => {
      if (USE_MOCK) {
        return MOCK_CATEGORIES.filter(
          (c) => !sectionSlug || c.section.slug === sectionSlug
        )
      }

      let query = supabase
        .from('categories')
        .select('*, section:sections!inner(slug)')
        .eq('is_active', true)
        .order('sort_order')

      if (sectionSlug) {
        query = query.eq('section.slug', sectionSlug)
      }

      const { data, error } = await query
      if (error) throw error
      return data as (Category & { section: { slug: string } })[]
    },
  })
}

export function useProducts(options?: { categorySlug?: string; sectionSlug?: string }) {
  const { categorySlug, sectionSlug } = options ?? {}

  return useQuery({
    queryKey: ['products', categorySlug, sectionSlug],
    queryFn: async () => {
      if (USE_MOCK) {
        return MOCK_PRODUCTS.filter((p) => {
          if (sectionSlug && p.category.section.slug !== sectionSlug) return false
          if (categorySlug && categorySlug !== 'all' && p.category.slug !== categorySlug) return false
          return true
        })
      }

      let query = supabase
        .from('products')
        .select('*, category:categories!inner(slug, section:sections!inner(slug))')
        .eq('is_active', true)
        .order('sort_order')

      if (categorySlug && categorySlug !== 'all') {
        query = query.eq('category.slug', categorySlug)
      }

      if (sectionSlug) {
        query = query.eq('category.section.slug', sectionSlug)
      }

      const { data, error } = await query
      if (error) throw error
      return data as (Product & { category: { slug: string; section: { slug: string } } })[]
    },
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (USE_MOCK) {
        const found = MOCK_PRODUCTS.find((p) => p.slug === slug)
        if (!found) throw new Error(`Product "${slug}" not found`)
        return found
      }

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories!inner(slug, section:sections!inner(slug))')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      if (error) throw error
      return data as Product & { category: { slug: string; section: { slug: string } } }
    },
    enabled: !!slug,
  })
}

export function useSearchProducts(queryStr: string) {
  return useQuery({
    queryKey: ['search', queryStr],
    queryFn: async () => {
      const q = queryStr.trim().toLowerCase()
      if (!q) return []

      if (USE_MOCK) {
        return MOCK_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        ).slice(0, 20)
      }

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories!inner(slug, section:sections!inner(slug))')
        .eq('is_active', true)
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .order('sort_order')
        .limit(20)

      if (error) throw error
      return data as (Product & { category: { slug: string; section: { slug: string } } })[]
    },
    enabled: queryStr.trim().length > 0,
  })
}
