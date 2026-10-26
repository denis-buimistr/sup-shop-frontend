import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart } from 'lucide-react';
import Logo from './Logo';
import AccountMenu from './AccountMenu';
import { useCart } from '../context/cart';

function Header() {
    const { count } = useCart();

    return (
        <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-6 px-6 py-4">
                <Logo />

                <form
                    className="relative flex min-w-0 flex-[999_1_380px]"
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

                <div className="flex items-center gap-[22px] text-sm font-semibold">
                    <AccountMenu />

                    <Link to="/wishlist" className="flex items-center gap-2 hover:text-brand-600">
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
        </header>
    );
}

export default Header;