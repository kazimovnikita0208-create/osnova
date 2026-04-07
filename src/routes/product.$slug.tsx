import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Heart, ShoppingBag, Thermometer, Milk, Candy, Droplets, Plus, Minus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getProductBySlug } from '@/data/products'
import { useProductBySlug } from '@/hooks/useCatalog'
import { useCartStore, buildCartKey } from '@/stores/cartStore'

export const Route = createFileRoute('/product/$slug')({
  component: ProductDetail,
})

// ─── Option configs ───────────────────────────────────────────────────────────

type OptionKey = 'temp' | 'milk' | 'syrup' | 'sugar'

interface OptionItem {
  value: string
  label: string
  price: number
}

const OPTION_CONFIGS: Record<OptionKey, { title: string; options: OptionItem[] }> = {
  temp: {
    title: 'Температура',
    options: [
      { value: 'Горячий', label: 'Горячий', price: 0 },
      { value: 'Со льдом', label: 'Со льдом', price: 0 },
    ],
  },
  milk: {
    title: 'Молоко',
    options: [
      { value: 'Цельное', label: 'Цельное', price: 0 },
      { value: 'Овсяное', label: 'Овсяное', price: 50 },
      { value: 'Соевое', label: 'Соевое', price: 40 },
      { value: 'Миндальное', label: 'Миндальное', price: 60 },
    ],
  },
  syrup: {
    title: 'Сироп',
    options: [
      { value: 'Без сиропа', label: 'Без', price: 0 },
      { value: 'Ваниль', label: 'Ваниль', price: 30 },
      { value: 'Карамель', label: 'Карамель', price: 30 },
      { value: 'Лесной орех', label: 'Лесной орех', price: 30 },
    ],
  },
  sugar: {
    title: 'Сахар',
    options: [
      { value: '0', label: 'Без', price: 0 },
      { value: '1', label: '1 лож.', price: 0 },
      { value: '2', label: '2 лож.', price: 0 },
      { value: '3', label: '3 лож.', price: 0 },
    ],
  },
}

const DRINK_SLUGS = new Set(['coffee', 'fresh', 'kofe', 'chai', 'freshi'])
const MILK_PRICES: Record<string, number> = { Цельное: 0, Овсяное: 50, Соевое: 40, Миндальное: 60 }
const SYRUP_PRICES: Record<string, number> = {
  'Без сиропа': 0, Ваниль: 30, Карамель: 30, 'Лесной орех': 30,
}

const SIZES = [
  { label: 'S', ml: '300', extra: 0 },
  { label: 'M', ml: '400', extra: 50 },
  { label: 'L', ml: '500', extra: 100 },
]

// ─── Option tile ──────────────────────────────────────────────────────────────

interface TileProps {
  icon: React.ReactNode
  label: string
  value: string
  extra?: number
  isOpen: boolean
  accent?: boolean
  onClick: () => void
}

function OptionTile({ icon, label, value, extra, isOpen, accent, onClick }: TileProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 transition-all active:scale-95',
        isOpen
          ? 'bg-[#384527]'           // primary — открыт
          : accent
            ? 'bg-[#9D4048]/8'       // бургундский тинт — платный доп выбран
            : 'bg-[#f0ede4]'         // surface-container
      )}
    >
      <div className={cn(
        'w-6 h-6 flex items-center justify-center',
        isOpen ? 'text-[#FCF9F0]' : accent ? 'text-[#9D4048]' : 'text-[#384527]'
      )}>
        {icon}
      </div>
      <span className={cn(
        'text-[8px] font-semibold uppercase tracking-widest leading-none',
        isOpen ? 'text-[#FCF9F0]/65' : 'text-[#6b6960]'
      )}>
        {label}
      </span>
      <span className={cn(
        'text-[10.5px] font-bold leading-tight text-center px-0.5 line-clamp-1',
        isOpen ? 'text-[#FCF9F0]' : accent ? 'text-[#9D4048]' : 'text-[#1c1c17]'
      )}>
        {value}
      </span>
      {extra !== undefined && (
        <span className={cn(
          'text-[9px] font-medium leading-none',
          isOpen
            ? 'text-[#FCF9F0]/55'
            : extra > 0
              ? accent ? 'text-[#9D4048]/70' : 'text-[#6b6960]'
              : 'text-[#6b6960]/45'
        )}>
          {extra > 0 ? `+${extra} ₽` : 'бесплатно'}
        </span>
      )}
    </button>
  )
}

// ─── Inline option chips ──────────────────────────────────────────────────────

interface InlinePickerProps {
  optionKey: OptionKey
  selected: string
  onSelect: (value: string) => void
}

function InlineOptionChips({ optionKey, selected, onSelect }: InlinePickerProps) {
  const config = OPTION_CONFIGS[optionKey]

  return (
    <div className="mt-2.5 flex flex-wrap justify-center gap-2 pb-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
      {config.options.map((opt) => {
        const isSelected = opt.value === selected
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              'shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl transition-all active:scale-95',
              isSelected
                // primary chip — selected
                ? 'bg-[#384527] text-[#FCF9F0] shadow-md shadow-[#384527]/15'
                // surface-container-lowest (белый) — floating lift над кремовым фоном
                : 'bg-white text-[#1c1c17] shadow-sm shadow-black/5'
            )}
          >
            <span className="text-sm font-semibold whitespace-nowrap">{opt.label}</span>
            <span className={cn('text-[10px] font-medium whitespace-nowrap', isSelected ? 'text-[#FCF9F0]/60' : 'text-[#6b6960]')}>
              {opt.price > 0 ? `+${opt.price} ₽` : 'бесплатно'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

function ProductDetail() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { data: dbProduct } = useProductBySlug(slug)
  const fallbackProduct = getProductBySlug(slug)

  const product = useMemo(() => {
    if (dbProduct) {
      return {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        price: Number(dbProduct.price),
        imageUrl: dbProduct.image_url ?? '',
        categorySlug: dbProduct.category?.slug ?? '',
        availability: dbProduct.availability,
        description: dbProduct.description ?? '',
        weight: dbProduct.weight ? Number(dbProduct.weight) : undefined,
        weightUnit: dbProduct.weight_unit as 'г' | 'мл' | undefined,
        composition: dbProduct.composition ?? undefined,
        calories: dbProduct.calories ? Number(dbProduct.calories) : undefined,
        proteins: dbProduct.proteins ? Number(dbProduct.proteins) : undefined,
        fats: dbProduct.fats ? Number(dbProduct.fats) : undefined,
        carbs: dbProduct.carbs ? Number(dbProduct.carbs) : undefined,
      }
    }
    return fallbackProduct ?? null
  }, [dbProduct, fallbackProduct])

  const [sizeIdx, setSizeIdx] = useState(1)
  const [temp, setTemp] = useState('Горячий')
  const [milk, setMilk] = useState('Цельное')
  const [syrup, setSyrup] = useState('Без сиропа')
  const [sugar, setSugar] = useState('1')
  const [openTile, setOpenTile] = useState<OptionKey | null>(null)

  const { addItem, items } = useCartStore()

  const totalPrice = useMemo(() => {
    if (!product) return 0
    if (!DRINK_SLUGS.has(product.categorySlug)) return product.price
    return product.price + SIZES[sizeIdx].extra + MILK_PRICES[milk] + SYRUP_PRICES[syrup]
  }, [product, sizeIdx, milk, syrup])

  const toggleTile = (key: OptionKey) => setOpenTile((prev) => (prev === key ? null : key))

  const selectOption = (key: OptionKey, value: string) => {
    if (key === 'temp') setTemp(value)
    else if (key === 'milk') setMilk(value)
    else if (key === 'syrup') setSyrup(value)
    else setSugar(value)
    setOpenTile(null)
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh px-4 bg-[#FCF9F0]">
        <p className="text-lg font-medium text-[#6b6960]">Товар не найден</p>
        <button onClick={() => navigate({ to: '/' })} className="mt-4 text-sm font-medium text-[#384527] underline">
          Вернуться в каталог
        </button>
      </div>
    )
  }

  const isDrink = DRINK_SLUGS.has(product.categorySlug)
  const isComingSoon = product.availability === 'coming_soon'
  const milkExtra = MILK_PRICES[milk]
  const syrupExtra = SYRUP_PRICES[syrup]

  const coffeeOpts = isDrink
    ? { size: SIZES[sizeIdx].label, milk, syrup, temp, sugar }
    : undefined
  const cartKey = buildCartKey(product.slug, coffeeOpts)
  const cartQty = items.find((i) => i.key === cartKey)?.quantity ?? 0

  const handleAddToCart = () => {
    addItem({
      key: cartKey,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      categorySlug: product.categorySlug,
      unitPrice: totalPrice,
      ...coffeeOpts,
    })
  }

  return (
    <div className="h-[calc(100dvh-56px-env(safe-area-inset-top))] max-w-lg mx-auto flex flex-col bg-[#FCF9F0] overflow-hidden">

      {/* ── Image — fills remaining space above content panel ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden transition-all duration-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

        {/* Back + Favourite overlay */}
        <div className="absolute top-3 inset-x-4 flex justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-white" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center active:scale-95 transition-transform">
            <Heart className="w-[18px] h-[18px] text-white/80" />
          </button>
        </div>

        {/* Name + description */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-8">
          {isComingSoon && (
            <span className="inline-block mb-2 text-[10px] font-semibold tracking-widest uppercase text-[#9D4048] bg-[#9D4048]/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Скоро в наличии
            </span>
          )}
          <h1 className="text-[22px] font-heading font-bold text-white leading-tight">{product.name}</h1>
          <p className="text-[13px] text-white/65 mt-0.5 leading-snug line-clamp-2">{product.description}</p>
        </div>
      </div>

      {/* ── Content panel — fixed at bottom, never scrolls ── */}
      <div className="shrink-0 flex flex-col px-4 pt-4 bg-[#FCF9F0] rounded-t-[1.5rem] -mt-5 relative z-10">

        {/* Price row */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <span className="text-xl font-heading font-bold text-[#384527]">{totalPrice} ₽</span>
          {isDrink && (
            <span className="text-xs text-[#6b6960] bg-white px-3 py-1.5 rounded-full font-medium shadow-sm shadow-black/5">
              {SIZES[sizeIdx].ml} мл
            </span>
          )}
          {!isDrink && product.weight && (
            <span className="text-xs text-[#6b6960] bg-[#f0ede4] px-3 py-1.5 rounded-full font-medium">
              {product.weight} {product.weightUnit ?? 'г'}
            </span>
          )}
        </div>

        {/* ── Gastronomy info block ── */}
        {!isDrink && (
          <div className="shrink-0">
            {/* Composition */}
            {product.composition && (
              <div className="mb-4">
                <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider mb-1.5">
                  Состав
                </p>
                <p className="text-[12.5px] text-[#1c1c17] leading-relaxed">
                  {product.composition}
                </p>
              </div>
            )}

            {/* Nutritional facts */}
            {product.calories !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-wider">
                    Пищевая ценность
                  </span>
                  <span className="text-[11px] text-[#6b6960]">на 100 г</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Ккал', value: product.calories, unit: '' },
                    { label: 'Белки', value: product.proteins, unit: 'г' },
                    { label: 'Жиры', value: product.fats, unit: 'г' },
                    { label: 'Углев.', value: product.carbs, unit: 'г' },
                  ].map(({ label, value, unit }) => (
                    <div
                      key={label}
                      className="bg-[#f0ede4] rounded-xl py-3 flex flex-col items-center gap-1"
                    >
                      <span className="text-[15px] font-bold text-[#384527] leading-none">
                        {value ?? '—'}{unit}
                      </span>
                      <span className="text-[9px] font-semibold text-[#6b6960] uppercase tracking-wider leading-none">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Coffee customisation block ── */}
        {isDrink && (
          <div className="shrink-0">
            <div className="grid grid-cols-4 gap-2">
              <OptionTile
                icon={<Thermometer className="w-4 h-4" />}
                label="Темп."
                value={temp}
                isOpen={openTile === 'temp'}
                onClick={() => toggleTile('temp')}
              />
              <OptionTile
                icon={<Milk className="w-4 h-4" />}
                label="Молоко"
                value={milk}
                extra={milkExtra}
                isOpen={openTile === 'milk'}
                accent={milkExtra > 0}
                onClick={() => toggleTile('milk')}
              />
              <OptionTile
                icon={<Candy className="w-4 h-4" />}
                label="Сироп"
                value={syrup === 'Без сиропа' ? 'Без' : syrup}
                extra={syrupExtra}
                isOpen={openTile === 'syrup'}
                accent={syrup !== 'Без сиропа'}
                onClick={() => toggleTile('syrup')}
              />
              <OptionTile
                icon={<Droplets className="w-4 h-4" />}
                label="Сахар"
                value={sugar === '0' ? 'Без' : `${sugar} лож.`}
                isOpen={openTile === 'sugar'}
                onClick={() => toggleTile('sugar')}
              />
            </div>

            {/* Inline chips */}
            {openTile && (
              <InlineOptionChips
                optionKey={openTile}
                selected={
                  openTile === 'temp' ? temp
                  : openTile === 'milk' ? milk
                  : openTile === 'syrup' ? syrup
                  : sugar
                }
                onSelect={(value) => selectOption(openTile, value)}
              />
            )}
          </div>
        )}

        {/* Size + CTA */}
        <div className="pb-[calc(0.75rem+env(safe-area-inset-bottom))] mt-3 shrink-0">
          {!isComingSoon ? (
            <div className="flex items-center gap-2.5">
              {isDrink && (
                <div className="flex gap-1.5 shrink-0">
                  {SIZES.map((s, i) => (
                    <button
                      key={s.label}
                      onClick={() => setSizeIdx(i)}
                      className={cn(
                        'w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95',
                        sizeIdx === i
                          ? 'bg-[#9D4048] text-[#FCF9F0] shadow-md shadow-[#9D4048]/20'
                          : 'bg-white text-[#384527] shadow-sm shadow-black/5'
                      )}
                    >
                      <span className="text-[13px] font-bold leading-none">{s.label}</span>
                      <span className="text-[8px] opacity-60 mt-0.5">{s.ml}</span>
                    </button>
                  ))}
                </div>
              )}

              {cartQty > 0 ? (
                <div className="flex-1 flex items-center bg-gradient-to-br from-[#384527] to-[#4f5d3d] rounded-2xl shadow-lg shadow-[#384527]/25 overflow-hidden">
                  <button
                    onClick={() => useCartStore.getState().updateQuantity(cartKey, -1)}
                    className="h-[46px] px-4 flex items-center justify-center text-[#FCF9F0]/80 active:bg-black/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-[#FCF9F0] font-bold text-sm leading-none">
                      {cartQty} шт
                    </span>
                    <span className="text-[#FCF9F0]/70 text-[11px] mt-0.5">
                      {cartQty * totalPrice} ₽
                    </span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="h-[46px] px-4 flex items-center justify-center text-[#FCF9F0]/80 active:bg-black/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#384527] to-[#4f5d3d] text-[#FCF9F0] font-semibold py-3 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-[#384527]/25"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>В корзину · {totalPrice} ₽</span>
                </button>
              )}
            </div>
          ) : (
            <button disabled className="w-full py-3.5 rounded-2xl bg-[#f0ede4] text-[#6b6960] font-semibold cursor-not-allowed">
              Скоро в наличии
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
