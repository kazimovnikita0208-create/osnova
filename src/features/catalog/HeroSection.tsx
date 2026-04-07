import { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop&q=80',
    tag: 'Кофейня',
    title: 'Свежеобжаренный\nкофе',
    cta: 'В меню',
    to: '/',
  },
  {
    id: 2,
    image: '/images/banner-interior.png',
    tag: 'Атмосфера',
    title: 'Место, где\nхочется\nостаться',
    cta: 'В меню',
    to: '/',
  },
  {
    id: 3,
    image: '/images/banner-desserts.png',
    tag: 'Гастроном',
    title: 'Авторские\nдесерты',
    cta: 'Выбрать',
    to: '/gastronomy',
  },
]

const INTERVAL = 4500

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(idx)
    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden h-56">
      {/* Слои изображений */}
      {BANNERS.map((banner, idx) => (
        <img
          key={banner.id}
          src={banner.image}
          alt={banner.title}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
            idx === current ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}

      {/* Градиент — левый для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      {/* Дополнительный снизу */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Контент */}
      {BANNERS.map((banner, idx) => (
        <div
          key={banner.id}
          className={cn(
            'absolute inset-0 flex flex-col justify-end px-5 pb-5 transition-opacity duration-700',
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Тег — тонкая линия + Manrope wide tracking */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-px bg-white/40" />
            <span className="text-[9px] font-sans font-medium tracking-[0.25em] uppercase text-white/50">
              {banner.tag}
            </span>
          </div>

          {/* Заголовок — Epilogue display-lg, крупный, editorial */}
          <h2
            className="font-heading font-bold text-white whitespace-pre-line"
            style={{
              fontSize: '30px',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 12px rgba(0,0,0,0.25)',
            }}
          >
            {banner.title}
          </h2>

          {/* CTA — signature gradient */}
          <Link
            to={banner.to}
            className="mt-4 self-start text-[#FCF9F0] text-[12px] font-sans font-semibold tracking-wide uppercase px-5 py-2 rounded-xl active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 4px 16px rgba(56,69,39,0.4)' }}
          >
            {banner.cta}
          </Link>
        </div>
      ))}

      {/* Точки-индикаторы */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={cn(
              'rounded-full transition-all duration-300',
              idx === current
                ? 'w-5 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/35'
            )}
          />
        ))}
      </div>
    </section>
  )
}
