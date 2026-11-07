import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import { useBrands, useCategories } from '../hooks/useCatalogData';
import { getChildren, getPath } from '../utils/categories';
import { formatPrice } from '../utils/format';

const PAGE_SIZE = 12;

// значение sort уходит в Pageable на бэкенде как есть: ?sort=price,asc
const SORTS = [
    { value: '', label: 'Featured' },
    { value: 'price,asc', label: 'Price: low to high' },
    { value: 'price,desc', label: 'Price: high to low' },
    { value: 'createdAt,desc', label: 'Newest first' },
];

const GUIDE = [
    { title: 'Set your goal', body: 'Training, long-distance touring or competition decides shape and width.' },
    { title: 'Know your water', body: 'Flat lake, open water or downwind — each rewards a different nose.' },
    { title: 'Match your weight', body: 'Volume should be roughly twice your body weight in litres.' },
];

const priceInputClass =
    'h-11 min-w-0 flex-1 rounded-lg border border-line-input px-3 text-sm text-ink-900 outline-none focus:border-brand-600';

// Все фильтры живут в URL: ссылку на «SUP, Starboard, до 20 000 MDL» можно скопировать и отправить
function CatalogPage() {
    const { slug } = useParams();
    const [params, setParams] = useSearchParams();
    const categories = useCategories();
    const brands = useBrands();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const selectedBrands = params.getAll('brand');
    const minPrice = params.get('minPrice') ?? '';
    const maxPrice = params.get('maxPrice') ?? '';
    const inStock = params.get('inStock') === 'true';
    const onSale = params.get('onSale') === 'true';
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
                setError(err.response?.status === 404 ? 'This category does not exist.' : 'Could not load products.');
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
    const categoryTitle = categories ? 'Category not found' : '\u00A0';
    const title = slug ? (current?.name ?? categoryTitle) : (onSale ? 'Sale' : 'All products');
    const description = slug
        ? (current?.description ?? '')
        : 'SUP boards, paddles and water sports gear — stocked in Chișinău, delivered across Moldova.';
    const total = result?.page?.totalElements ?? 0;
    const pageCount = result?.page?.totalPages ?? 0;
    const showGuide = !slug || path[0]?.slug === 'sup';

    const brandName = id => brands?.find(b => String(b.id) === id)?.name ?? `Brand ${id}`;
    const chips = [
        ...selectedBrands.map(id => ({ key: `b${id}`, label: brandName(id), remove: () => toggleBrand(id) })),
        ...(minPrice ? [{ key: 'min', label: `From ${formatPrice(minPrice)}`, remove: () => update({ minPrice: '' }) }] : []),
        ...(maxPrice ? [{ key: 'max', label: `To ${formatPrice(maxPrice)}`, remove: () => update({ maxPrice: '' }) }] : []),
        ...(inStock ? [{ key: 'stock', label: 'In stock only', remove: () => update({ inStock: false }) }] : []),
        ...(onSale ? [{ key: 'sale', label: 'On sale', remove: () => update({ onSale: false }) }] : []),
    ];

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="pb-9 pt-7">
                    <nav aria-label="Breadcrumb" className="mb-[18px] text-[13px] text-ink-400">
                        <Link to="/" className="hover:text-ink-900">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/catalog" className={path.length ? 'hover:text-ink-900' : 'font-semibold text-ink-900'}>Catalog</Link>
                        {path.map((category, i) => (
                            <span key={category.id}>
                                <span className="mx-2">/</span>
                                {i === path.length - 1 ? (
                                    <span className="font-semibold text-ink-900">{category.name}</span>
                                ) : (
                                    <Link to={`/catalog/${category.slug}`} className="hover:text-ink-900">{category.name}</Link>
                                )}
                            </span>
                        ))}
                    </nav>
                    <h1 className="mb-3 text-[48px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900">{title}</h1>
                    <p className="max-w-[720px] text-[17px] leading-[1.6] text-ink-600">{description}</p>
                </Container>
            </section>

            <Container className="pt-7">
                <div className="flex flex-wrap items-start gap-8">
                    <aside aria-label="Filters" className="min-w-0 max-w-[320px] flex-[1_1_272px]">
                        <div className="mb-[18px] flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-ink-900">Filters</h2>
                            <button type="button" onClick={clearAll} className="py-1 text-sm font-semibold text-brand-600 underline hover:text-brand-700">
                                Clear all
                            </button>
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
                                <p className="mb-3 text-[15px] font-bold text-ink-900">Brand</p>
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
                                <span>In stock only</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                <input
                                    type="checkbox"
                                    checked={onSale}
                                    onChange={e => update({ onSale: e.target.checked })}
                                    className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                />
                                <span>On sale</span>
                            </label>
                        </div>

                        <div className="mt-3 rounded-[18px] bg-surface-100 p-5">
                            <p className="mb-2 text-base font-bold text-ink-900">Need help choosing?</p>
                            <p className="mb-3.5 text-sm leading-[1.55] text-ink-600">
                                Tell us your weight and where you paddle — we'll shortlist three options.
                            </p>
                            <Link to="/contacts" className="inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">
                                Ask an expert
                            </Link>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-[999_1_560px]">
                        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[15px] text-ink-600">
                                <strong className="text-[17px] text-ink-900">{total}</strong> products
                            </p>
                            <div className="flex items-center gap-3.5">
                                <label htmlFor="sort" className="text-sm text-ink-400">Sort by</label>
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={e => update({ sort: e.target.value })}
                                    className="h-11 cursor-pointer rounded-lg border border-line bg-white px-3.5 text-sm text-ink-900"
                                >
                                    {SORTS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
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

                        {!result && <p className="py-10 text-ink-400">Loading products…</p>}
                        {error && <p className="py-10 text-danger">{error}</p>}

                        {result && !error && total === 0 && (
                            <div className="rounded-[22px] border border-line px-6 py-14 text-center">
                                <p className="mb-2.5 text-xl font-bold text-ink-900">Nothing matches these filters</p>
                                <button type="button" onClick={clearAll} className="text-[15px] font-semibold text-brand-600 underline">
                                    Clear all filters
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

            {showGuide && (
                <Container className="pb-16 pt-12">
                    <div className="flex flex-wrap gap-10 rounded-[26px] border border-line bg-surface-50 p-6 sm:p-10">
                        <div className="min-w-0 flex-[1_1_320px]">
                            <h2 className="mb-3.5 text-[28px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink-900">
                                Choosing the right paddleboard
                            </h2>
                            <p className="text-base leading-[1.7] text-ink-600">
                                The best board is the one that matches your goals, conditions and experience. Narrower boards are faster
                                but ask more of your balance; wider boards give stability in chop and suit heavier riders.
                            </p>
                        </div>
                        <div className="grid min-w-0 flex-[999_1_420px] grid-cols-1 gap-4 sm:grid-cols-3">
                            {GUIDE.map(item => (
                                <div key={item.title} className="rounded-[18px] border border-line bg-white p-[22px]">
                                    <p className="mb-2 text-base font-bold text-ink-900">{item.title}</p>
                                    <p className="text-sm leading-[1.55] text-ink-400">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            )}
            {!showGuide && <div className="pb-16" />}
        </>
    );
}

// Цена применяется по Enter или кнопке, а не на каждую цифру — иначе запрос уходил бы при каждом нажатии
function PriceFilter({ min, max, onApply }) {
    const [from, setFrom] = useState(min);
    const [to, setTo] = useState(max);

    function apply(e) {
        e.preventDefault();
        onApply({ minPrice: from.trim(), maxPrice: to.trim() });
    }

    return (
        <form onSubmit={apply} className="border-t border-line py-[18px]">
            <p className="mb-3.5 text-[15px] font-bold text-ink-900">Price, MDL</p>
            <div className="flex items-center gap-2.5">
                <label htmlFor="price-min" className="sr-only">Minimum price</label>
                <input id="price-min" inputMode="numeric" placeholder="From" value={from} onChange={e => setFrom(e.target.value.replace(/\D/g, ''))} className={priceInputClass} />
                <span className="text-ink-400">—</span>
                <label htmlFor="price-max" className="sr-only">Maximum price</label>
                <input id="price-max" inputMode="numeric" placeholder="To" value={to} onChange={e => setTo(e.target.value.replace(/\D/g, ''))} className={priceInputClass} />
            </div>
            <button type="submit" className="mt-3 text-sm font-bold text-brand-600 hover:text-brand-700">Apply price</button>
        </form>
    );
}

function Pagination({ page, pageCount, onChange }) {
    const go = n => {
        onChange(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const edgeClass =
        'h-11 min-w-11 rounded-full border border-ink-900 bg-white px-4 text-sm font-bold text-ink-900 disabled:border-line disabled:font-semibold disabled:text-ink-400';

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 pt-9">
            <button type="button" disabled={page === 1} onClick={() => go(page - 1)} className={edgeClass}>Previous</button>
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
            <button type="button" disabled={page === pageCount} onClick={() => go(page + 1)} className={edgeClass}>Next</button>
        </div>
    );
}

export default CatalogPage;
