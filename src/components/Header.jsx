import { useCallback, useState } from 'react';
import { Link } from '../i18n/routing';
import { Heart, ShoppingCart, Menu } from 'lucide-react';
import Logo from './Logo';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';
import SearchBox from './SearchBox';
import { useCart } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { useTranslation } from 'react-i18next';

function Header() {
    const { t } = useTranslation();
    const { count } = useCart();
    const wishlist = useWishlist();
    const [menuOpen, setMenuOpen] = useState(false);
    // useCallback, чтобы эффект внутри меню не перезапускался на каждый рендер шапки
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:gap-6 lg:py-4">
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label={t('header.openMenu')}
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-50 lg:hidden"
                >
                    <Menu size={20} strokeWidth={2} />
                </button>

                <Logo />

                {/* на телефоне поиск уходит отдельной строкой под логотип */}
                <SearchBox />

                <div className="ml-auto flex items-center gap-3 text-sm font-semibold sm:gap-[18px] lg:ml-0 lg:gap-[22px]">
                    <AccountMenu />

                    <Link to="/wishlist" aria-label={t('header.wishlist')} className="flex items-center gap-2 hover:text-brand-600">
                        <Heart size={22} strokeWidth={1.8} />
                        <span className="hidden md:inline">{t('header.wishlist')}</span>
                        {/* пустой счётчик на телефоне прячу, места в шапке мало */}
                        <span className={`rounded-full px-[7px] py-0.5 text-[11px] font-bold ${wishlist.count ? 'bg-alert text-white' : 'hidden bg-surface-100 sm:inline'}`}>
                            {wishlist.count}
                        </span>
                    </Link>

                    <Link to="/cart" className="flex items-center gap-2 hover:text-brand-600">
                        <ShoppingCart size={22} strokeWidth={1.8} />
                        <span className="hidden md:inline">{t('header.cart')}</span>
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