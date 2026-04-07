import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { useCartStore } from '@/stores/cartStore'

export const Route = createRootRoute({
  component: RootLayout,
})

function CartCheckoutBar() {
  const { totalCount, totalPrice } = useCartStore()
  if (totalCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 max-w-lg mx-auto" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
      <Link
        to="/checkout"
        className="flex items-center justify-between text-[#FCF9F0] px-5 py-4 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, #384527, #4f5d3d)', boxShadow: '0 8px 24px rgba(56,69,39,0.2)' }}
      >
        <span className="font-semibold text-sm">Оформить заказ</span>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-[#FCF9F0]/20 px-2.5 py-1 rounded-full font-medium">
            {totalCount} позиц.
          </span>
          <span className="font-bold">{totalPrice} ₽</span>
        </div>
      </Link>
    </div>
  )
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isProductPage = pathname.startsWith('/product/')
  const isCartPage = pathname === '/cart'
  const isCheckoutPage = pathname === '/checkout'

  const isSearchPage = pathname === '/search'
  const isProfileSection = pathname === '/profile' || pathname.startsWith('/orders') || pathname === '/addresses'
  const showBottomNav = !isProductPage && !isCartPage && !isCheckoutPage && !isSearchPage && !isProfileSection
  const showCartBar = isCartPage

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <Header />
      <main className={isProductPage ? '' : 'pb-24'}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
      {showCartBar && <CartCheckoutBar />}
    </div>
  )
}
