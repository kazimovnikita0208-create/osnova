import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { CategoryChips } from '@/features/catalog/CategoryChips'
import { ProductCard } from '@/features/catalog/ProductCard'
import { CurationCard } from '@/features/catalog/CurationCard'
import { useProducts, useCategories } from '@/hooks/useCatalog'
import { gastronomyCategories as fallbackCategories, gastronomyProducts as fallbackProducts } from '@/data/mock-gastronomy'

export const Route = createFileRoute('/gastronomy')({
  component: GastronomyCatalog,
})

function GastronomyCatalog() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { data: dbProducts } = useProducts({ sectionSlug: 'gastronomy' })
  const { data: dbCategories } = useCategories('gastronomy')

  const categories = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) return fallbackCategories
    return [
      { id: 'g-all', slug: 'all', name: 'All', icon: '🛒' },
      ...dbCategories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        icon: c.icon ?? '📦',
      })),
    ]
  }, [dbCategories])

  const products = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) {
      return fallbackProducts.map((p) => ({
        ...p,
        imageUrl: p.imageUrl,
        categorySlug: p.categorySlug,
      }))
    }
    return dbProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      imageUrl: p.image_url ?? '',
      categorySlug: p.category?.slug ?? '',
      availability: p.availability,
      description: p.description ?? '',
      weight: p.weight ? Number(p.weight) : undefined,
      weightUnit: p.weight_unit as 'г' | 'мл' | undefined,
      composition: p.composition ?? undefined,
      calories: p.calories ? Number(p.calories) : undefined,
      proteins: p.proteins ? Number(p.proteins) : undefined,
      fats: p.fats ? Number(p.fats) : undefined,
      carbs: p.carbs ? Number(p.carbs) : undefined,
    }))
  }, [dbProducts])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products
    return products.filter((p) => p.categorySlug === activeCategory)
  }, [activeCategory, products])

  const firstHalf = filteredProducts.slice(0, 4)
  const secondHalf = filteredProducts.slice(4)

  return (
    <div className="pb-4">
      {/* Editorial heading */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-3xl font-heading font-bold leading-tight tracking-tight">
          В основе —{' '}
          <em className="text-accent not-italic font-bold italic">хороший</em>
          {' '}вкус.
        </h1>
      </div>

      {/* Category chips */}
      <div className="px-4 mt-5">
        <CategoryChips
          categories={categories}
          activeSlug={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {/* First batch of products */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-6">
        {firstHalf.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Special Curation card */}
      <CurationCard
        tag="Special Curation"
        title="The Cheese Tasting Kit"
        description="Explore five regional specialties curated by our master sommelier."
        ctaText="EXPLORE NOW"
      />

      {/* Second batch of products */}
      {secondHalf.length > 0 && (
        <div className="grid grid-cols-2 gap-4 px-4 mt-6">
          {secondHalf.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
