import { Link, useRouterState } from '@tanstack/react-router'
import { Coffee, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProductSection } from '@/data/products'

const tabs = [
  { to: '/' as const, label: 'COFFEE', icon: Coffee, section: 'coffee' },
  { to: '/gastronomy' as const, label: 'GASTRONOMY', icon: Leaf, section: 'gastronomy' },
]

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // When on a product page, determine which section the product belongs to
  const slugMatch = pathname.match(/^\/product\/(.+)$/)
  const productSection = slugMatch ? getProductSection(slugMatch[1]) : null

  const isActive = (section: string, to: string) => {
    if (productSection) {
      return productSection === section
    }
    return to === '/' ? pathname === '/' : pathname.startsWith(to)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FCF9F0]/90 backdrop-blur-md border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-center gap-3 px-5 py-3 max-w-lg mx-auto">
        {tabs.map(({ to, label, icon: Icon, section }) => {
          const active = isActive(section, to)

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-[13px] font-bold tracking-wide transition-all flex-1',
                active
                  ? 'bg-[#384527] text-[#FCF9F0] shadow-md shadow-[#384527]/25'
                  : 'bg-[#f0ede4] text-[#6b6960]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
