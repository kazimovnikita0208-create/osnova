import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, ArrowLeft, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSearchProducts } from '@/hooks/useCatalog'
import { searchProducts as fallbackSearch } from '@/data/products'
import { getProductSection } from '@/data/products'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { data: dbResults } = useSearchProducts(query)
  const hasQuery = query.trim().length > 0

  type SearchResult = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    description: string
    _section: string
  }

  const results: SearchResult[] = dbResults && dbResults.length > 0
    ? dbResults.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.image_url ?? '',
        description: p.description ?? '',
        _section: p.category?.section?.slug ?? 'coffee',
      }))
    : hasQuery
      ? fallbackSearch(query).map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          imageUrl: p.imageUrl,
          description: p.description,
          _section: getProductSection(p.slug),
        }))
      : []

  return (
    <div className="min-h-screen pb-4">
      {/* Search bar */}
      <div className="sticky top-14 z-40 bg-[#FCF9F0] px-4 pt-3 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: '/' })}
            className="w-10 h-10 shrink-0 rounded-full bg-[#f0ede4] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#384527]" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6960]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти товар..."
              className="w-full pl-10 pr-10 py-3 bg-[#f0ede4] rounded-2xl text-sm text-[#1c1c17] placeholder:text-[#6b6960]/60 outline-none focus:ring-2 focus:ring-[#384527]/10 transition-shadow"
            />
            {hasQuery && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1c1c17]/10 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-[#6b6960]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 mt-2">
        {!hasQuery && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-16 h-16 bg-[#f0ede4] rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-[#6b6960]" />
            </div>
            <p className="text-sm text-[#6b6960]">
              Введите название товара для поиска
            </p>
          </div>
        )}

        {hasQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-16 h-16 bg-[#f0ede4] rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-[#6b6960]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#1c1c17] mb-1">
              Ничего не найдено
            </h3>
            <p className="text-sm text-[#6b6960]">
              Попробуйте изменить запрос
            </p>
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <p className="text-xs text-[#6b6960] mb-3">
              Найдено: {results.length}
            </p>
            <div className="space-y-2">
              {results.map((product) => {
                const section = product._section
                return (
                  <Link
                    key={product.id}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-2xl shadow-sm shadow-black/5 active:scale-[0.99] transition-transform"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1c1c17] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#6b6960] mt-0.5 line-clamp-1">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-[#384527]">
                          {product.price} ₽
                        </span>
                        <span className={cn(
                          'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                          section === 'coffee'
                            ? 'bg-[#384527]/10 text-[#384527]'
                            : 'bg-[#9D4048]/10 text-[#9D4048]'
                        )}>
                          {section === 'coffee' ? 'Кофейня' : 'Гастроном'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
