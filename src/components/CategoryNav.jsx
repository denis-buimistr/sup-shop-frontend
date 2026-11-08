import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useBrands, useCategories } from '../hooks/useCatalogData';
import { getChildren, getRoots } from '../utils/categories';

const topClass = 'flex items-center gap-1.5 py-4 text-[13px] font-bold uppercase tracking-[0.05em] transition-colors';
const linkClass = 'flex items-baseline justify-between gap-2.5 py-2 text-[15px] font-medium text-ink-900 hover:text-brand-600';

// Меню строится из категорий в БД: верхний уровень — разделы, в выпадающем блоке — подкатегории и бренды
function CategoryNav() {
    const categories = useCategories();
    const brands = useBrands();
    const navigate = useNavigate();
    const [openId, setOpenId] = useState(null);
    const navRef = useRef(null);
    const hoverTimer = useRef(null);

    // открываю по наведению с маленькой задержкой, чтобы меню не мигало, когда просто ведёшь мышь мимо
    function hoverOpen(id) {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setOpenId(id), openId ? 0 : 120);
    }

    function hoverClose() {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setOpenId(null), 200);
    }

    useEffect(() => () => clearTimeout(hoverTimer.current), []);

    useEffect(() => {
        if (!openId) return;

        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenId(null);
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') setOpenId(null);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [openId]);

    const roots = categories ? getRoots(categories) : [];
    const active = roots.find(root => root.id === openId);
    const subcategories = active ? getChildren(categories, active.id) : [];
    const close = () => setOpenId(null);

    return (
        <nav
            ref={navRef}
            aria-label="Product categories"
            onPointerLeave={e => e.pointerType === 'mouse' && hoverClose()}
            onPointerEnter={() => clearTimeout(hoverTimer.current)}
            className="relative hidden border-b border-line bg-white lg:block"
        >
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-[26px] gap-y-1 px-6">
                {roots.map(root => {
                    const isOpen = openId === root.id;
                    return (
                        <button
                            key={root.id}
                            type="button"
                            onClick={e => {
                                // мышью меню уже открыто наведением, поэтому клик ведёт в раздел; тап и Enter открывают меню
                                if (e.nativeEvent.pointerType === 'mouse') {
                                    setOpenId(null);
                                    navigate(`/catalog/${root.slug}`);
                                } else {
                                    setOpenId(isOpen ? null : root.id);
                                }
                            }}
                            // на планшете наведения нет — там меню открывается тапом через onClick
                            onPointerEnter={e => e.pointerType === 'mouse' && hoverOpen(root.id)}
                            aria-expanded={isOpen}
                            className={`${topClass} ${
                                isOpen ? 'text-brand-600 shadow-[inset_0_-3px_0_0_#0B7A91]' : 'text-ink-900 hover:text-brand-600'
                            }`}
                        >
                            {root.name}
                            <ChevronDown size={11} strokeWidth={2} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                    );
                })}
                <Link
                    to="/catalog?onSale=true"
                    onPointerEnter={e => e.pointerType === 'mouse' && hoverClose()}
                    className={`${topClass} text-alert hover:text-ink-900`}
                >
                    Sale
                </Link>
            </div>

            {active && (
                <div className="absolute left-0 right-0 top-full z-40 border-t border-line bg-white shadow-[0_18px_36px_-12px_rgba(14,42,51,0.22)]">
                    <div className="mx-auto flex max-w-[1320px] flex-wrap gap-8 px-6 pb-9 pt-8">
                        <div className="min-w-0 flex-[2_1_360px]">
                            <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">{active.name}</p>
                            <div className="grid gap-x-8 sm:grid-cols-2">
                                {subcategories.map(sub => (
                                    <Link key={sub.id} to={`/catalog/${sub.slug}`} onClick={close} className={linkClass}>
                                        <span>{sub.name}</span>
                                        <span className="text-xs text-ink-400">{sub.productCount}</span>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                to={`/catalog/${active.slug}`}
                                onClick={close}
                                className="mt-3 inline-flex text-sm font-bold text-brand-600 hover:text-brand-700"
                            >
                                Shop all {active.name} ({active.productCount}) →
                            </Link>
                        </div>

                        {brands?.length > 0 && (
                            <div className="min-w-0 flex-[1_1_200px]">
                                <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">Brands</p>
                                {brands.map(brand => (
                                    <Link
                                        key={brand.id}
                                        to={`/catalog/${active.slug}?brand=${brand.id}`}
                                        onClick={close}
                                        className={linkClass}
                                    >
                                        {brand.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {active.description && (
                            <div className="min-w-0 flex-[1_1_260px] rounded-[20px] bg-surface-100 p-6">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">{active.name}</p>
                                <p className="mb-[18px] text-lg font-extrabold leading-[1.3] text-ink-900">{active.description}</p>
                                <Link
                                    to={`/catalog/${active.slug}?onSale=true`}
                                    onClick={close}
                                    className="inline-flex rounded-full bg-brand-600 px-[22px] py-3 text-sm font-bold text-white hover:bg-brand-700"
                                >
                                    See the deals
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default CategoryNav;
