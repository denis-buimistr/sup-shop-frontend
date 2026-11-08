import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from '../i18n/routing';
import { SlidersHorizontal, X } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import { useBrands, useCategories } from '../hooks/useCatalogData';
import { getChildren, getPath } from '../utils/categories';
import { formatPrice } from '../utils/format';
import { findCategoryPhoto } from '../data/categoryPhotos';

const PAGE_SIZE = 12;

// значение sort уходит в Pageable на бэкенде как есть: ?sort=price,asc
const SORTS = [
    { value: '', key: 'featured' },
    { value: 'price,asc', key: 'priceAsc' },
    { value: 'price,desc', key: 'priceDesc' },
    { value: 'createdAt,desc', key: 'newest' },
];

const priceInputClass =
    'h-11 min-w-0 flex-1 rounded-lg border border-line-input px-3 text-sm text-ink-900 outline-none focus:border-brand-600';

// Все фильтры живут в URL: ссылку на «SUP, Starboard, до 20 000 MDL» можно скопировать и отправить
function CatalogPage() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const [params, setParams] = useSearchParams();
    const categories = useCategories();
    const brands = useBrands();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // пока панель фильтров открыта на телефоне, страница под ней не должна прокручиваться
    useEffect(() => {
        if (!filtersOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [filtersOpen]);

    const selectedBrands = params.getAll('brand');
    const minPrice = params.get('minPrice') ?? '';
    const maxPrice = params.get('maxPrice') ?? '';
    const inStock = params.get('inStock') === 'true';
    const onSale = params.get('onSale') === 'true';
    const searchTerm = params.get('q') ?? '';
    const sort = params.get('sort') ?? '';
    const page = Number(params.get('page') ?? 1);

    useEffect(() => {
        const query = new URLSearchParams(params);
        query.delete('page');
        if (slug) query.set('category', slug);
        query.set('page', String(page - 1));
        query.set('size', String(PAGE_SIZE));

        let active = true;
        api.get(`/products?${query}`)
            .then(({ data }) => {
                if (!active) return;
                setError(null);
                setResult(data);
            })
            .catch(err => {
                if (!active) return;
                setResult({ content: [], page: { totalElements: 0, totalPages: 0 } });
                setError(err.response?.status === 404 ? 'notFound' : 'loadFailed');
            });
        return () => {
            active = false;
        };
    }, [slug, params, page]);

    // меняем один параметр и сбрасываем страницу на первую
    function update(changes) {
        const next = new URLSearchParams(params);
        Object.entries(changes).forEach(([key, value]) => {
            next.delete(key);
            if (Array.isArray(value)) value.forEach(v => next.append(key, v));
            else if (value !== '' && value != null && value !== false) next.set(key, String(value));
        });
        if (!('page' in changes)) next.delete('page');
        setParams(next);
    }

    function toggleBrand(id) {
        const value = String(id);
        update({ brand: selectedBrands.includes(value) ? selectedBrands.filter(b => b !== value) : [...selectedBrands, value] });
    }

    function clearAll() {
        setParams(sort ? { sort } : {});
    }

    const path = categories && slug ? getPath(categories, slug) : [];
    const current = path[path.length - 1];
    // у листа показываем соседей, у раздела — его подкатегории
    const navParent = current ? (getChildren(categories, current.id).length > 0 ? current : path[path.length - 2]) : null;
    const navItems = categories && navParent ? getChildren(categories, navParent.id) : [];

    // пока категории грузятся, заголовок пустой — иначе на секунду мигнёт «All products»
    const categoryTitle = categories ? t('catalog.categoryNotFound') : '\u00A0';
    const title = searchTerm
        ? t('catalog.resultsFor', { term: searchTerm })
        : slug ? (current?.name ?? categoryTitle) : (onSale ? t('catalog.sale') : t('catalog.all'));
    const description = slug
        ? (current?.description ?? '')
        : t('catalog.description');
    // в поиске фото не показываю: там результаты из разных разделов
    const photo = searchTerm ? null : findCategoryPhoto(path);
    const strong = photo ? 'text-white' : 'text-ink-900';
    const linkHover = photo ? 'hover:text-white' : 'hover:text-ink-900';
    const total = result?.page?.totalElements ?? 0;
    const pageCount = result?.page?.totalPages ?? 0;

    const brandName = id => brands?.find(b => String(b.id) === id)?.name ?? t('catalog.brandFallback', { id });
    const chips = [
        ...selectedBrands.map(id => ({ key: `b${id}`, label: brandName(id), remove: () => toggleBrand(id) })),
        ...(minPrice ? [{ key: 'min', label: t('catalog.chips.from', { price: formatPrice(minPrice) }), remove: () => update({ minPrice: '' }) }] : []),
        ...(maxPrice ? [{ key: 'max', label: t('catalog.chips.to', { price: formatPrice(maxPrice) }), remove: () => update({ maxPrice: '' }) }] : []),
        ...(inStock ? [{ key: 'stock', label: t('catalog.inStockOnly'), remove: () => update({ inStock: false }) }] : []),
        ...(onSale ? [{ key: 'sale', label: t('catalog.onSale'), remove: () => update({ onSale: false }) }] : []),
        ...(searchTerm ? [{ key: 'q', label: t('catalog.chips.search', { term: searchTerm }), remove: () => update({ q: '' }) }] : []),
    ];

    return (
        <>
            <section className={`relative overflow-hidden border-b ${photo ? 'border-transparent bg-deep-900' : 'border-line bg-surface-100'}`}>
                {photo && (
                    <>
                        <img src={photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: photo.position }} />
                        {/* слева темню сильнее, чтобы белый текст читался на любом фото */}
                        <div className="absolute inset-0 bg-gradient-to-r from-deep-900/90 via-deep-900/60 to-deep-900/10" />
                    </>
                )}
                <Container className={`relative pb-9 pt-7 ${photo ? 'sm:pb-14 sm:pt-10' : ''}`}>
                    <nav aria-label="Breadcrumb" className={`mb-[18px] text-[13px] ${photo ? 'text-white/70' : 'text-ink-400'}`}>
                        <Link to="/" className={linkHover}>{t('common.home')}</Link>
                        <span className="mx-2">/</span>
                        <Link to="/catalog" className={path.length ? linkHover : `font-semibold ${strong}`}>{t('common.catalog')}</Link>
                        {path.map((category, i) => (
                            <span key={category.id}>
                                <span className="mx-2">/</span>
                                {i === path.length - 1 ? (
                                    <span className={`font-semibold ${strong}`}>{category.name}</span>
                                ) : (
                                    <Link to={`/catalog/${category.slug}`} className={linkHover}>{category.name}</Link>
                                )}
                            </span>
                        ))}
                    </nav>
                    <h1 className={`mb-3 text-[48px] font-extrabold leading-[1.05] tracking-[-0.03em] ${strong}`}>{title}</h1>
                    <p className={`max-w-[720px] text-[17px] leading-[1.6] ${photo ? 'text-white/85' : 'text-ink-600'}`}>{description}</p>
                </Container>
            </section>

            <Container className="pt-7">
                <div className="flex flex-wrap items-start gap-8">
                    {/* на телефоне фильтры прячу в панель на весь экран, иначе товары уезжают на пару экранов вниз */}
                    <aside
                        aria-label={t('catalog.filters')}
                        className={`${filtersOpen ? 'fixed inset-0 z-50 flex flex-col bg-white' : 'hidden'} min-w-0 lg:static lg:z-auto lg:block lg:max-w-[300px] lg:flex-[0_0_272px]`}
                    >
                        <div className="flex-grow overflow-y-auto px-4 pt-4 lg:overflow-visible lg:p-0">
                        <div className="mb-[18px] flex items-center justify-between gap-3">
                            <h2 className="text-xl font-extrabold text-ink-900">{t('catalog.filters')}</h2>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={clearAll} className="py-1 text-sm font-semibold text-brand-600 underline hover:text-brand-700">
                                    {t('catalog.clearAll')}
                                </button>
                                <button
                                    type="button"
                                    aria-label={t('catalog.closeFilters')}
                                    onClick={() => setFiltersOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-50 lg:hidden"
                                >
                                    <X size={18} strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {navItems.length > 0 && (
                            <div className="border-t border-line py-[18px]">
                                <p className="mb-3 text-[15px] font-bold text-ink-900">{navParent.name}</p>
                                {navItems.map(item => (
                                    <Link
                                        key={item.id}
                                        to={`/catalog/${item.slug}`}
                                        aria-current={item.slug === slug ? 'page' : undefined}
                                        className={`flex items-baseline justify-between gap-2 py-[7px] text-sm ${
                                            item.slug === slug ? 'font-bold text-brand-600' : 'text-ink-600 hover:text-brand-600'
                                        }`}
                                    >
                                        <span>{item.name}</span>
                                        <span className="text-[13px] text-ink-400">({item.productCount})</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {brands?.length > 0 && (
                            <div className="border-t border-line py-[18px]">
                                <p className="mb-3 text-[15px] font-bold text-ink-900">{t('catalog.brand')}</p>
                                {brands.map(brand => {
                                    const checked = selectedBrands.includes(String(brand.id));
                                    return (
                                        <label key={brand.id} className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleBrand(brand.id)}
                                                className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                            />
                                            <span className={checked ? 'font-semibold text-ink-900' : ''}>{brand.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        <PriceFilter key={`${minPrice}-${maxPrice}`} min={minPrice} max={maxPrice} onApply={update} />

                        <div className="border-t border-line py-[18px]">
                            <label className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                <input
                                    type="checkbox"
                                    checked={inStock}
                                    onChange={e => update({ inStock: e.target.checked })}
                                    className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                />
                                <span>{t('catalog.inStockOnly')}</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                <input
                                    type="checkbox"
                                    checked={onSale}
                                    onChange={e => update({ onSale: e.target.checked })}
                                    className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                />
                                <span>{t('catalog.onSale')}</span>
                            </label>
                        </div>

                        <div className="mt-3 rounded-[18px] bg-surface-100 p-5">
                            <p className="mb-2 text-base font-bold text-ink-900">{t('catalog.help.title')}</p>
                            <p className="mb-3.5 text-sm leading-[1.55] text-ink-600">
                                {t('catalog.help.body')}
                            </p>
                            <Link to="/contacts" className="inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">
                                {t('catalog.help.cta')}
                            </Link>
                        </div>
                        </div>

                        <div className="flex-none border-t border-line p-4 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="w-full rounded-full bg-brand-600 px-6 py-[15px] text-base font-bold text-white hover:bg-brand-700"
                            >
                                {result ? t('catalog.show', { count: total }) : t('catalog.showProducts')}
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-[999_1_560px]">
                        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[15px] text-ink-600">
                                <Trans i18nKey="catalog.count" count={total} components={{ b: <strong className="text-[17px] text-ink-900" /> }} />
                            </p>
                            <div className="flex items-center gap-2.5 sm:gap-3.5">
                                <button
                                    type="button"
                                    onClick={() => setFiltersOpen(true)}
                                    className="flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-ink-900 lg:hidden"
                                >
                                    <SlidersHorizontal size={16} strokeWidth={2} />
                                    {t('catalog.filters')}
                                    {chips.length > 0 && (
                                        <span className="rounded-full bg-brand-600 px-[7px] py-0.5 text-[11px] font-bold text-white">{chips.length}</span>
                                    )}
                                </button>
                                <label htmlFor="sort" className="hidden text-sm text-ink-400 sm:inline">{t('catalog.sortBy')}</label>
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={e => update({ sort: e.target.value })}
                                    className="h-11 cursor-pointer rounded-lg border border-line bg-white px-3.5 text-sm text-ink-900"
                                >
                                    {SORTS.map(option => <option key={option.value} value={option.value}>{t(`catalog.sort.${option.key}`)}</option>)}
                                </select>
                            </div>
                        </div>

                        {chips.length > 0 && (
                            <div className="mb-[22px] flex flex-wrap items-center gap-2.5">
                                {chips.map(chip => (
                                    <button
                                        key={chip.key}
                                        type="button"
                                        onClick={chip.remove}
                                        className="inline-flex items-center gap-2 rounded-full border border-tint-300 bg-tint-100 px-3.5 py-2 text-[13px] font-semibold text-tint-900"
                                    >
                                        {chip.label}
                                        <X size={12} strokeWidth={2.2} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {!result && <p className="py-10 text-ink-400">{t('catalog.loading')}</p>}
                        {error && <p className="py-10 text-danger">{t(`catalog.errors.${error}`)}</p>}

                        {result && !error && total === 0 && (
                            <div className="rounded-[22px] border border-line px-6 py-14 text-center">
                                <p className="mb-2.5 text-xl font-bold text-ink-900">{t('catalog.empty')}</p>
                                <button type="button" onClick={clearAll} className="text-[15px] font-semibold text-brand-600 underline">
                                    {t('catalog.clearFilters')}
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {result?.content.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>

                        {pageCount > 1 && (
                            <Pagination page={page} pageCount={pageCount} onChange={n => update({ page: n === 1 ? '' : n })} />
                        )}
                    </div>
                </div>
            </Container>
            {/* отступ до футера нужен всегда, иначе пагинация прилипает к полосе free delivery */}
            <div className="pb-16" />
        </>
    );
}

// Цена применяется по Enter или кнопке, а не на каждую цифру — иначе запрос уходил бы при каждом нажатии
function PriceFilter({ min, max, onApply }) {
    const { t } = useTranslation();
    const [from, setFrom] = useState(min);
    const [to, setTo] = useState(max);

    function commit() {
        if (from.trim() !== min || to.trim() !== max) onApply({ minPrice: from.trim(), maxPrice: to.trim() });
    }

    function apply(e) {
        e.preventDefault();
        commit();
    }

    // на телефоне Apply почти никто не жмёт, сразу тапают «Show products», поэтому применяю цену,
    // когда фокус уходит из блока. переход From → To не считается, иначе поле To потеряет фокус
    function handleBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) commit();
    }

    return (
        <form onSubmit={apply} onBlur={handleBlur} className="border-t border-line py-[18px]">
            <p className="mb-3.5 text-[15px] font-bold text-ink-900">{t('catalog.price.title')}</p>
            <div className="flex items-center gap-2.5">
                <label htmlFor="price-min" className="sr-only">{t('catalog.price.min')}</label>
                <input id="price-min" inputMode="numeric" placeholder={t('catalog.price.from')} value={from} onChange={e => setFrom(e.target.value.replace(/\D/g, ''))} className={priceInputClass} />
                <span className="text-ink-400">—</span>
                <label htmlFor="price-max" className="sr-only">{t('catalog.price.max')}</label>
                <input id="price-max" inputMode="numeric" placeholder={t('catalog.price.to')} value={to} onChange={e => setTo(e.target.value.replace(/\D/g, ''))} className={priceInputClass} />
            </div>
            <button type="submit" className="mt-3 text-sm font-bold text-brand-600 hover:text-brand-700">{t('catalog.price.apply')}</button>
        </form>
    );
}

function Pagination({ page, pageCount, onChange }) {
    const { t } = useTranslation();
    const go = n => {
        onChange(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const edgeClass =
        'h-11 min-w-11 rounded-full border border-ink-900 bg-white px-4 text-sm font-bold text-ink-900 disabled:border-line disabled:font-semibold disabled:text-ink-400';

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 pt-9">
            <button type="button" disabled={page === 1} onClick={() => go(page - 1)} className={edgeClass}>{t('catalog.pagination.prev')}</button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                <button
                    key={n}
                    type="button"
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => go(n)}
                    className={`h-11 min-w-11 rounded-full border text-sm font-bold ${
                        n === page ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-white text-ink-900'
                    }`}
                >
                    {n}
                </button>
            ))}
            <button type="button" disabled={page === pageCount} onClick={() => go(page + 1)} className={edgeClass}>{t('catalog.pagination.next')}</button>
        </div>
    );
}

export default CatalogPage;
