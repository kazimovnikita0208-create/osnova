import { Icon, addCollection } from '@iconify/react'
import { cn } from '@/lib/utils'

// Регистрируем только 5 нужных иконок (вместо 1.8MB всего набора)
// Streamline icon set — CC BY 4.0
addCollection({
  prefix: 'streamline',
  width: 14,
  height: 14,
  icons: {
    'coffee-mug': {
      body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3 5.5h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a1 1 0 0 1 1-1m6 1h.5a2.5 2.5 0 0 1 0 5H9M4 .5v2m3-2v2"/>',
    },
    'leaf': {
      body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M11.51 5.391c2 2.817.47 6.043-.27 7.301a1.42 1.42 0 0 1-1 .66c-1.45.25-5.06.529-7-2.288c-1.91-2.656-1.83-7.33-1.66-9.558A1.048 1.048 0 0 1 3 .568c2.15.619 6.63 2.167 8.51 4.823"/><path d="M4.77 4.463a52 52 0 0 1 6 8.719"/></g>',
    },
    'milkshake': {
      body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M3.5 6.5V6a3.5 3.5 0 1 1 7 0v.5l-.434 6.071a1 1 0 0 1-.997.929H4.93a1 1 0 0 1-.997-.929zm-1 0h9M8.72 2.951L9.5.5M3.684 9h6.602"/>',
    },
    'cake-slice': {
      body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12.5 6.5h-11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1m-9 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4m-3 3h13m-10-7s0-2 1.5-2"/>',
    },
    'serving-dome': {
      body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7 3h0a6.5 6.5 0 0 1 6.5 6.5v0a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v0A6.5 6.5 0 0 1 7 3Zm0 0V1.5m-6.5 11h13"/>',
    },
  },
})

// Короткие имена иконок
const ICONS = {
  coffee: 'streamline:coffee-mug',
  tea:    'streamline:leaf',
  fresh:  'streamline:milkshake',
  dessert:'streamline:cake-slice',
  food:   'streamline:serving-dome',
} as const

// ── Группы display-категорий ───────────────────────────────────────────────

export interface DisplayGroup {
  id: string
  label: string
  icon: string
  matchName: (catName: string) => boolean
}

export const COFFEE_DISPLAY_GROUPS: DisplayGroup[] = [
  {
    id: 'kofe',
    label: 'Кофе',
    icon: ICONS.coffee,
    matchName: (name) => /кофе|какао|милкш/i.test(name),
  },
  {
    id: 'chai',
    label: 'Чаи',
    icon: ICONS.tea,
    matchName: (name) => /чай|матча/i.test(name),
  },
  {
    id: 'freshi',
    label: 'Фреши',
    icon: ICONS.fresh,
    matchName: (name) => /сок|смузи|фреш/i.test(name),
  },
  {
    id: 'deserty',
    label: 'Десерты',
    icon: ICONS.dessert,
    matchName: (name) => /десерт|круассан|торт|выпечк/i.test(name),
  },
  {
    id: 'eda',
    label: 'Еда',
    icon: ICONS.food,
    matchName: (name) => /кулинар|тиксон|фабрик/i.test(name),
  },
]

// ── Компонент ──────────────────────────────────────────────────────────────

interface DiscoverSectionProps {
  activeGroup: string | null
  onGroupChange: (id: string | null) => void
}

export function DiscoverSection({ activeGroup, onGroupChange }: DiscoverSectionProps) {
  return (
    <section className="px-4 mt-8">
      {/* Заголовок */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h3 className="font-heading text-[26px] font-semibold tracking-normal text-[#1c1c17]">Меню</h3>
          <p className="font-sans text-[11px] text-muted-foreground mt-0.5 tracking-wide">Категории кофейни</p>
        </div>
        {activeGroup && (
          <button
            className="font-sans text-sm font-semibold text-accent active:opacity-60 transition-opacity"
            onClick={() => onGroupChange(null)}
          >
            Все
          </button>
        )}
      </div>

      {/* Пилюли — выравниваем по ширине экрана */}
      <div className="grid grid-cols-5 gap-1">
        {COFFEE_DISPLAY_GROUPS.map(({ id, label, icon }) => {
          const isActive = activeGroup === id
          return (
            <button
              key={id}
              onClick={() => onGroupChange(isActive ? null : id)}
              className="flex flex-col items-center gap-2"
            >
              {/* Иконка */}
              <div
                className={cn(
                  'w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all duration-200',
                  isActive
                    ? 'shadow-md'
                    : 'bg-white border border-[rgba(28,28,23,0.07)] shadow-sm'
                )}
                style={
                  isActive
                    ? { background: 'linear-gradient(145deg, #384527, #4f5d3d)', boxShadow: '0 4px 14px rgba(56,69,39,0.30)' }
                    : undefined
                }
              >
                <Icon
                  icon={icon}
                  width={22}
                  height={22}
                  color={isActive ? '#FCF9F0' : '#384527'}
                />
              </div>

              {/* Подпись — Manrope, micro-label style */}
              <span
                className={cn(
                  'font-sans text-[10px] font-medium uppercase whitespace-nowrap',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-[#384527]'
                    : 'text-[#b0aca4]'
                )}
                style={{ letterSpacing: '0.11em' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
