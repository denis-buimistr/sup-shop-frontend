import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import Logo from './Logo';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/cart';

function Header() {
    const { count } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    // useCallback, чтобы эффект внутри меню не перезапускался на каждый рендер шапки
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:gap-6 lg:py-4">
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-50 lg:hidden"
                >
                    <Menu size={20} strokeWidth={2} />
                </button>

                <Logo />

                {/* на телефоне поиск уходит отдельной строкой под логотип */}
                <form
                    className="relative order-last flex w-full min-w-0 lg:order-none lg:w-auto lg:flex-[999_1_380px]"
                    onSubmit={e => e.preventDefault()}
                >
                    <label htmlFor="site-search" className="sr-only">
                        Search the shop
                    </label>
                    <Search
                        size={18}
                        className="absolute left-[18px] top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                        id="site-search"
                        type="search"
                        placeholder="Search for paddleboards, paddles, accessories…"
                        className="h-12 w-full rounded-full border border-line bg-surface-50 pl-[46px] pr-5 text-[15px] text-ink-900 outline-none focus:border-brand-600"
                    />
                </form>

                <div className="ml-auto flex items-center gap-[18px] text-sm font-semibold lg:ml-0 lg:gap-[22px]">
                    <AccountMenu />

                    <Link to="/wishlist" className="hidden items-center gap-2 hover:text-brand-600 sm:flex">
                        <Heart size={22} strokeWidth={1.8} />
                        <span className="hidden md:inline">Wishlist</span>
                        <span className="rounded-full bg-surface-100 px-[7px] py-0.5 text-[11px] font-bold">
              0
            </span>
                    </Link>

                    <Link to="/cart" className="flex items-center gap-2 hover:text-brand-600">
                        <ShoppingCart size={22} strokeWidth={1.8} />
                        <span className="hidden md:inline">Cart</span>
                        <span className="rounded-full bg-alert px-[7px] py-0.5 text-[11px] font-bold text-white">
              {count}
            </span>
                    </Link>
                </div>
            </div>
            {menuOpen && <MobileMenu onClose={closeMenu} />}
        </header>
    );
}

export default Header;