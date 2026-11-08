import { useEffect, useRef, useState } from 'react';
import { Link } from '../i18n/routing';
import { ChevronDown, ChevronRight, Phone, X } from 'lucide-react';
import { useAuth } from '../context/auth';
import { useCategories } from '../hooks/useCatalogData';
import { getChildren, getRoots } from '../utils/categories';
import { PHONE_HREF } from '../data/contacts';
import { LanguageButtons } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LINKS = [
    { key: 'menu.contacts', to: '/contacts' },
    { key: 'account.myOrders', to: '/profile' },
    { key: 'header.wishlist', to: '/wishlist' },
    { key: 'header.cart', to: '/cart' },
];

// Меню на телефоне: на весь экран, разделы раскрываются как аккордеон
function MobileMenu({ onClose }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const categories = useCategories();
    const [openId, setOpenId] = useState(null);
    const closeRef = useRef(null);

    // пока меню открыто, страница под ним не скроллится, Escape закрывает
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();

        const onKey = e => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const roots = categories ? getRoots(categories) : [];

    return (
        <div role="dialog" aria-modal="true" aria-label={t('menu.title')} className="fixed inset-0 z-50 flex flex-col bg-white">
            <div className="flex flex-none items-center gap-3 border-b border-line px-4 pb-3 pt-3.5">
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label={t('menu.close')}
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-50"
                >
                    <X size={18} strokeWidth={2} />
                </button>
                <span className="min-w-0 flex-grow text-lg font-extrabold tracking-[-0.01em]">{t('menu.title')}</span>
                <a href={PHONE_HREF} className="inline-flex flex-none items-center gap-[7px] rounded-full bg-deep-900 px-[15px] py-[9px] text-[13px] font-bold text-white">
                    <Phone size={13} strokeWidth={2} className="text-deep-accent" />
                    {t('menu.call')}
                </a>
            </div>

            <div className="min-h-0 flex-grow overflow-y-auto pb-6">
                <Link
                    to={user ? '/profile' : '/login'}
                    onClick={onClose}
                    className="mx-4 mt-3.5 flex items-center gap-3.5 rounded-[18px] bg-surface-100 px-4 py-3.5"
                >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-deep-900 text-[15px] font-bold uppercase text-white">
                        {user ? user.username.slice(0, 2) : '?'}
                    </span>
                    <span className="min-w-0 flex-grow">
                        <span className="block truncate text-[15px] font-bold">{user ? user.username : t('header.signIn')}</span>
                        <span className="mt-0.5 block text-[13px] text-ink-400">{user ? t('account.ordersAndSettings') : t('account.orCreate')}</span>
                    </span>
                    <ChevronRight size={16} strokeWidth={2} className="text-ink-400" />
                </Link>

                <nav aria-label={t('menu.categories')} className="px-4 pt-2.5">
                    {roots.map(root => {
                        const isOpen = openId === root.id;
                        const children = getChildren(categories, root.id);
                        return (
                            <div key={root.id} className="border-b border-surface-100">
                                <button
                                    type="button"
                                    onClick={() => setOpenId(isOpen ? null : root.id)}
                                    aria-expanded={isOpen}
                                    className={`flex w-full items-center justify-between gap-3 px-1 py-[15px] text-left text-base font-bold ${isOpen ? 'text-brand-600' : 'text-ink-900'}`}
                                >
                                    <span>{root.name}</span>
                                    <span className="flex items-center gap-2.5">
                                        <span className="text-[13px] font-medium text-ink-400">{root.productCount}</span>
                                        <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="pb-3.5 pt-0.5">
                                        {children.map(child => (
                                            <Link
                                                key={child.id}
                                                to={`/catalog/${child.slug}`}
                                                onClick={onClose}
                                                className="mb-1.5 flex items-center justify-between gap-3 rounded-xl bg-surface-50 px-3.5 py-[11px] text-[15px] text-ink-900"
                                            >
                                                <span>{child.name}</span>
                                                <span className="text-[13px] text-ink-400">{child.productCount}</span>
                                            </Link>
                                        ))}
                                        <Link to={`/catalog/${root.slug}`} onClick={onClose} className="ml-3.5 mt-1 inline-flex text-sm font-bold text-brand-600">
                                            {t('menu.seeAllIn', { name: root.name })}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <Link to="/catalog?onSale=true" onClick={onClose} className="block border-b border-surface-100 px-1 py-[15px] text-base font-bold text-alert">
                        {t('menu.sale')}
                    </Link>
                </nav>

                <div className="flex items-center justify-between gap-3 px-5 pt-6">
                    <span className="text-[13px] font-semibold text-ink-400">{t('topbar.language')}</span>
                    <LanguageButtons />
                </div>
            </div>

            <div className="flex flex-none flex-wrap gap-x-[18px] gap-y-2 border-t border-line px-4 pb-[18px] pt-3.5">
                {LINKS.map(link => (
                    <Link key={link.to} to={link.to} onClick={onClose} className="text-[13px] font-semibold text-ink-600">
                        {t(link.key)}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MobileMenu;
