import { Icon, addCollection } from '@iconify/react'
import streamlineData from '@iconify-json/streamline/icons.json'
import { cn } from '@/lib/utils'

// Регистрируем иконки локально — без запросов к API
addCollection(streamlineData)

// Имена иконок из набора Streamline (CC BY 4.0)
const ICONS = {
  coffee: 'streamline:coffee-mug',
  tea:    'streamline:leaf',
  fresh:  'streamline:milkshake',
  dessert:'streamline:cake-slice',
  food:   'streamline:food-kitchenware-serving-dome-cook-tool-dome-kitchen-serving-paltter-dish-tools-food',
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
