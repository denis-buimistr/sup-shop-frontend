import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import { formatBoardType } from '../utils/format';

const PAGE_SIZE = 9;

const SORTS = {
    featured: { label: 'Featured', compare: () => 0 },
    priceAsc: { label: 'Price: low to high', compare: (a, b) => a.price - b.price },
    priceDesc: { label: 'Price: high to low', compare: (a, b) => b.price - a.price },
    newest: { label: 'Newest first', compare: (a, b) => b.id - a.id },
};

const GUIDE = [
    { title: 'Set your goal', body: 'Training, long-distance touring or competition decides shape and width.' },
    { title: 'Know your water', body: 'Flat lake, open water or downwind — each rewards a different nose.' },
    { title: 'Match your weight', body: 'Volume should be roughly twice your body weight in litres.' },
];

// Группы фильтров строятся из того, что реально пришло с бэкенда
const FILTER_GROUPS = [
    { key: 'brand', title: 'Brand', getValue: p => p.brandName },
    { key: 'category', title: 'Category', getValue: p => p.categoryName },
    { key: 'construction', title: 'Construction', getValue: p => formatBoardType(p.boardType) },
];

function countBy(products, getValue) {
    const counts = new Map();
    products.forEach(product => {
        const value = getValue(product);
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return [...counts.entries()];
}

function parsePrice(value) {
    const number = Number(String(value).replace(/\s/g, ''));
    return value === '' || Number.isNaN(number) ? null : number;
}

function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [picked, setPicked] = useState({});
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState('featured');
    const [page, setPage] = useState(1);

    useEffect(() => {
        api.get('/products', { params: { size: 200 } })
            .then(response => {
                setProducts(response.data.content);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить товары');
                setLoading(false);
            });
    }, []);

    const groups = useMemo(
        () => FILTER_GROUPS
            .map(group => ({ ...group, options: countBy(products, group.getValue) }))
            .filter(group => group.options.length > 0),
        [products]
    );

    const results = useMemo(() => {
        const min = parsePrice(priceMin);
        const max = parsePrice(priceMax);

        return products
            .filter(product => FILTER_GROUPS.every(group => {
                const selected = picked[group.key] ?? [];
                return selected.length === 0 || selected.includes(group.getValue(product));
            }))
            .filter(product => min === null || product.price >= min)
            .filter(product => max === null || product.price <= max)
            .filter(product => !inStockOnly || product.quantity > 0)
            .sort(SORTS[sort].compare);
    }, [products, picked, priceMin, priceMax, inStockOnly, sort]);

    const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function toggle(groupKey, value) {
        setPage(1);
        setPicked(current => {
            const selected = current[groupKey] ?? [];
            return {
                ...current,
                [groupKey]: selected.includes(value)
                    ? selected.filter(v => v !== value)
                    : [...selected, value],
            };
        });
    }

    function clearAll() {
        setPicked({});
        setPriceMin('');
        setPriceMax('');
        setInStockOnly(false);
        setPage(1);
    }

    const chips = [
        ...Object.entries(picked).flatMap(([groupKey, values]) =>
            values.map(value => ({ label: value, remove: () => toggle(groupKey, value) }))
        ),
        ...(inStockOnly ? [{ label: 'In stock only', remove: () => setInStockOnly(false) }] : []),
    ];

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="pb-9 pt-7">
                    <nav aria-label="Breadcrumb" className="mb-[18px] text-[13px] text-ink-400">
                        <Link to="/" className="hover:text-ink-900">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-ink-900">Catalog</span>
                    </nav>
                    <h1 className="mb-3 text-[48px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900">
                        All paddleboards
                    </h1>
                    <p className="max-w-[720px] text-[17px] leading-[1.6] text-ink-600">
                        Inflatable and hard SUP boards for training, touring and competition — stocked in Chișinău, delivered across Moldova.
                    </p>
                </Container>
            </section>

            <Container className="pt-7">
                <div className="flex flex-wrap items-start gap-8">
                    <aside aria-label="Filters" className="min-w-0 max-w-[320px] flex-[1_1_272px]">
                        <div className="mb-[18px] flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-ink-900">Filters</h2>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="py-1 text-sm font-semibold text-brand-600 underline hover:text-brand-700"
                            >
                                Clear all
                            </button>
                        </div>

                        {groups.map(group => (
                            <div key={group.key} className="border-t border-line py-[18px]">
                                <p className="mb-3 text-[15px] font-bold text-ink-900">{group.title}</p>
                                {group.options.map(([value, count]) => {
                                    const checked = picked[group.key]?.includes(value) ?? false;
                                    return (
                                        <label key={value} className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggle(group.key, value)}
                                                className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                            />
                                            <span className={`flex-grow ${checked ? 'font-semibold text-ink-900' : ''}`}>{value}</span>
                                            <span className="text-[13px] text-ink-400">({count})</span>
                                        </label>
                                    );
                                })}
                            </div>
                        ))}

                        <div className="border-t border-line py-[18px]">
                            <p className="mb-3.5 text-[15px] font-bold text-ink-900">Price, MDL</p>
                            <div className="flex items-center gap-2.5">
                                <label htmlFor="price-min" className="sr-only">Minimum price</label>
                                <input
                                    id="price-min"
                                    inputMode="numeric"
                                    placeholder="From"
                                    value={priceMin}
                                    onChange={e => { setPriceMin(e.target.value); setPage(1); }}
                                    className="h-11 min-w-0 flex-1 rounded-lg border border-line-input px-3 text-sm text-ink-900 outline-none focus:border-brand-600"
                                />
                                <span className="text-ink-400">—</span>
                                <label htmlFor="price-max" className="sr-only">Maximum price</label>
                                <input
                                    id="price-max"
                                    inputMode="numeric"
                                    placeholder="To"
                                    value={priceMax}
                                    onChange={e => { setPriceMax(e.target.value); setPage(1); }}
                                    className="h-11 min-w-0 flex-1 rounded-lg border border-line-input px-3 text-sm text-ink-900 outline-none focus:border-brand-600"
                                />
                            </div>
                        </div>

                        <div className="border-t border-line py-[18px]">
                            <label className="flex cursor-pointer items-center gap-[11px] py-[7px] text-sm text-ink-600">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={e => { setInStockOnly(e.target.checked); setPage(1); }}
                                    className="h-[18px] w-[18px] cursor-pointer accent-brand-600"
                                />
                                <span>In stock only</span>
                            </label>
                        </div>

                        <div className="mt-3 rounded-[18px] bg-surface-100 p-5">
                            <p className="mb-2 text-base font-bold text-ink-900">Need help choosing?</p>
                            <p className="mb-3.5 text-sm leading-[1.55] text-ink-600">
                                Tell us your weight and where you paddle — we'll shortlist three boards.
                            </p>
                            <Link
                                to="/contacts"
                                className="inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                            >
                                Ask an expert
                            </Link>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-[999_1_560px]">
                        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
                            <p className="text-[15px] text-ink-600">
                                <strong className="text-[17px] text-ink-900">{results.length}</strong> products
                            </p>
                            <div className="flex items-center gap-3.5">
                                <label htmlFor="sort" className="text-sm text-ink-400">Sort by</label>
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    className="h-11 cursor-pointer rounded-lg border border-line bg-white px-3.5 text-sm text-ink-900"
                                >
                                    {Object.entries(SORTS).map(([key, option]) => (
                                        <option key={key} value={key}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {chips.length > 0 && (
                            <div className="mb-[22px] flex flex-wrap items-center gap-2.5">
                                {chips.map(chip => (
                                    <button
                                        key={chip.label}
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

                        {loading && <p className="py-10 text-ink-400">Загрузка...</p>}
                        {error && <p className="py-10 text-danger">{error}</p>}

                        {!loading && !error && results.length === 0 && (
                            <div className="rounded-[22px] border border-line px-6 py-14 text-center">
                                <p className="mb-2.5 text-xl font-bold text-ink-900">Nothing matches these filters</p>
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-[15px] font-semibold text-brand-600 underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {visible.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {pageCount > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 pb-2 pt-9">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage(currentPage - 1)}
                                    className="h-11 min-w-11 rounded-full border border-ink-900 bg-white px-4 text-sm font-bold text-ink-900 disabled:border-line disabled:font-semibold disabled:text-ink-400"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        aria-current={n === currentPage ? 'page' : undefined}
                                        onClick={() => setPage(n)}
                                        className={`h-11 min-w-11 rounded-full border text-sm font-bold ${
                                            n === currentPage
                                                ? 'border-brand-600 bg-brand-600 text-white'
                                                : 'border-line bg-white text-ink-900'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage === pageCount}
                                    onClick={() => setPage(currentPage + 1)}
                                    className="h-11 min-w-11 rounded-full border border-ink-900 bg-white px-4 text-sm font-bold text-ink-900 disabled:border-line disabled:font-semibold disabled:text-ink-400"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

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
        </>
    );
}

export default CatalogPage;
