import { createFileRoute, Link } from '@tanstack/react-router'
import { User, Phone, MapPin, ClipboardList, ChevronRight, LogIn, Heart, Settings, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const menuItems = [
  { to: '/orders', icon: ClipboardList, label: 'Мои заказы', desc: 'История и отслеживание', active: true },
  { to: '/addresses', icon: MapPin, label: 'Мои адреса', desc: 'Управление адресами доставки', active: true },
  { to: '#', icon: Heart, label: 'Избранное', desc: 'Скоро', active: false },
  { to: '#', icon: Settings, label: 'Настройки', desc: 'Скоро', active: false },
  { to: '#', icon: HelpCircle, label: 'Помощь', desc: 'Скоро', active: false },
] as const

function ProfilePage() {
  const isLoggedIn = false

  return (
    <div className="flex flex-col min-h-[calc(100dvh-56px)]">
      {/* Olive hero header */}
      <div
        className="mx-4 mt-3 rounded-2xl px-6 pt-7 pb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #384527, #4f5d3d)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#FCF9F0]/[0.04] -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#FCF9F0]/[0.03] translate-y-10 -translate-x-6" />

        <p className="text-[10.5px] font-semibold text-[#FCF9F0]/50 uppercase tracking-[0.2em] mb-2 relative">
          Личный кабинет
        </p>
        <h1 className="font-heading text-[26px] font-bold text-[#FCF9F0] leading-tight relative">
          {isLoggedIn ? 'Добрый день,' : 'Добро пожаловать'}
        </h1>
        {isLoggedIn && (
          <h1 className="font-heading text-[26px] font-bold text-[#FCF9F0] leading-tight relative">
            Никита
          </h1>
        )}
      </div>

      {/* Auth card */}
      <div className="px-4 mt-4">
        {isLoggedIn ? (
          <div className="bg-[#f0ede4] rounded-2xl p-5 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #384527, #4f5d3d)',
                boxShadow: '0 4px 12px rgba(56,69,39,0.25)',
              }}
            >
              <span className="font-heading text-lg font-bold text-[#FCF9F0]">Н</span>
            </div>
            <div className="min-w-0">
              <p className="font-heading text-lg font-bold text-[#1c1c17] truncate">
                Никита
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#6b6960]" />
                <span className="text-sm text-[#6b6960]">+7 (900) 000-00-00</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#f0ede4] rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF9F0] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#6b6960]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[#1c1c17]">
                  Войдите в аккаунт
                </p>
                <p className="text-[12px] text-[#6b6960] mt-0.5 leading-snug">
                  Чтобы видеть заказы и сохранять адреса
                </p>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 text-[#FCF9F0] text-[14px] font-semibold py-3.5 rounded-2xl mt-4 active:scale-[0.98] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #384527, #4f5d3d)',
                boxShadow: '0 8px 24px rgba(56,69,39,0.2)',
              }}
            >
              <LogIn className="w-4 h-4" />
              Войти по номеру телефона
            </button>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="px-4 mt-6 flex-1">
        <p className="text-[10.5px] font-semibold text-[#6b6960] uppercase tracking-[0.15em] mb-3 px-1">
          Меню
        </p>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const content = (
              <div
                className={`flex items-center gap-4 bg-[#f0ede4] rounded-2xl px-5 py-4.5 transition-transform ${
                  item.active ? 'active:scale-[0.99]' : 'opacity-35'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={
                    item.active
                      ? { background: 'linear-gradient(135deg, #384527, #4f5d3d)' }
                      : { background: '#e8e5dc' }
                  }
                >
                  <Icon
                    className="w-[18px] h-[18px]"
                    style={{ color: item.active ? '#FCF9F0' : '#6b6960' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1c1c17]">{item.label}</p>
                  <p className="text-[11px] text-[#6b6960] leading-snug mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#1c1c17]/15 shrink-0" />
              </div>
            )

            if (!item.active) {
              return <div key={item.label}>{content}</div>
            }

            return (
              <Link key={item.label} to={item.to}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Version */}
      <div className="px-5 py-8 text-center">
        <p className="text-[11px] text-[#6b6960]/40 font-medium tracking-wide">
          Osnova · v1.0.0
        </p>
      </div>
    </div>
  )
}
