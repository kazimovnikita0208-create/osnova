import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { HeroSection } from '@/features/catalog/HeroSection'
import { DiscoverSection, COFFEE_DISPLAY_GROUPS } from '@/features/catalog/DiscoverSection'
import { CategoryRow } from '@/features/catalog/CategoryRow'
import { ProductCard } from '@/features/catalog/ProductCard'
import { useProducts, useCategories } from '@/hooks/useCatalog'

// Заглушка-изображение для товаров без фото
const PLACEHOLDER_IMAGES: Record<string, string> = {
  kofe: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80',
  chai: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80',
  freshi: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=400&fit=crop&q=80',
  deserty: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=400&fit=crop&q=80',
  eda: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&q=80',
}

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=80'

export const Route = createFileRoute('/')({
  component: CoffeeHome,
})

function CoffeeHome() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const { data: dbCategories } = useCategories('coffee')
  const { data: dbProducts } = useProducts({ sectionSlug: 'coffee' })

  // Карта: slug категории → название категории
  const catNameBySlug = useMemo(() => {
    if (!dbCategories) return new Map<string, string>()
    return new Map(dbCategories.map((c) => [c.slug, c.name]))
  }, [dbCategories])

  // Определяем группу для каждого продукта по имени его категории
  const getGroupId = (categorySlug: string): string | null => {
    const catName = catNameBySlug.get(categorySlug) ?? ''
    for (const group of COFFEE_DISPLAY_GROUPS) {
      if (group.matchName(catName)) return group.id
    }
    return null
  }

  // Маппинг DB-продуктов → локальный тип Product
  const products = useMemo(() => {
    if (!dbProducts) return []
    return dbProducts.map((p) => {
      const groupId = getGroupId(p.category?.slug ?? '')
      const placeholder = PLACEHOLDER_IMAGES[groupId ?? ''] ?? DEFAULT_PLACEHOLDER
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.image_url || placeholder,
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
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbProducts, catNameBySlug])

  // Продукты, сгруппированные по display-группам
  const groupedProducts = useMemo(() => {
    const result: Record<string, typeof products> = {}
    for (const group of COFFEE_DISPLAY_GROUPS) {
      result[group.id] = products.filter((p) => {
        const catName = catNameBySlug.get(p.categorySlug) ?? ''
        return group.matchName(catName)
      })
    }
    return result
  }, [products, catNameBySlug])

  // Популярное: первые 5 товаров из Кофе + Фреши с ценой > 0,
  // если нет — просто первые 5 из кофе
  const popularProducts = useMemo(() => {
    const kofe = groupedProducts['kofe'] ?? []
    const freshi = groupedProducts['freshi'] ?? []
    const candidates = [...kofe, ...freshi]
    const withPrice = candidates.filter((p) => p.price > 0)
    return (withPrice.length >= 3 ? withPrice : candidates).slice(0, 5)
  }, [groupedProducts])

  // Видимые группы (по фильтру или все)
  const visibleGroups = useMemo(() => {
    if (!activeGroup) return COFFEE_DISPLAY_GROUPS
    return COFFEE_DISPLAY_GROUPS.filter((g) => g.id === activeGroup)
  }, [activeGroup])

  return (
    <div className="pb-4">
      {/* Баннер */}
      <HeroSection />

      {/* Пилюли категорий */}
      <DiscoverSection activeGroup={activeGroup} onGroupChange={setActiveGroup} />

      {/* Популярное — только без активного фильтра */}
      {!activeGroup && popularProducts.length > 0 && (
        <section className="mt-8">
          <div className="px-4 mb-3">
            <h3 className="font-heading text-[22px] font-semibold tracking-normal text-primary">Популярное</h3>
            <p className="font-sans text-[11px] text-muted-foreground mt-0.5">Выбор гостей</p>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
            {popularProducts.map((p) => (
              <div key={p.id} className="flex-none w-[160px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Категории */}
      {visibleGroups.map((group) => {
        const groupProds = groupedProducts[group.id] ?? []
        if (groupProds.length === 0) return null
        return (
          <CategoryRow
            key={group.id}
            title={group.label}
            products={groupProds}
            onViewAll={
              activeGroup !== group.id
                ? () => setActiveGroup(group.id)
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
