import { Link } from '@tanstack/react-router'
import { User, ShoppingBag, Search } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'

export function Header() {
  const totalCount = useCartStore((s) => s.totalCount)

  return (
    <header className="sticky top-0 z-50 bg-[#FCF9F0]/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-[#f0ede4] transition-colors"
        >
          <User className="w-5 h-5 text-[#1c1c17]" />
        </Link>

        <Link to="/" className="flex items-center justify-center">
          <img
            src="/logo-osnova.png"
            alt="Osnova"
            className="h-7 w-auto"
          />
        </Link>

        <div className="flex items-center gap-1 -mr-2">
          <Link
            to="/search"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f0ede4] transition-colors"
          >
            <Search className="w-5 h-5 text-[#1c1c17]" />
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f0ede4] transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-[#1c1c17]" />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#9D4048] text-[#FCF9F0] text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
