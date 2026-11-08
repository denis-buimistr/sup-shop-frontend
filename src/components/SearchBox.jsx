import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../api/client';
import { BoardPlaceholder } from './ProductCard';
import { formatPrice, getPrimaryImage } from '../utils/format';

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 250;

// Поиск в шапке: подсказки появляются по мере ввода, Enter ведёт на страницу результатов
function SearchBox() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    const term = query.trim();

    // жду паузу в наборе, чтобы не слать запрос на каждую букву
    useEffect(() => {
        if (term.length < MIN_LENGTH) return;
        let active = true;
        const timer = setTimeout(() => {
            api.get('/products', { params: { q: term, size: 6 } })
                .then(({ data }) => active && setResult({ term, ...data }))
                .catch(() => active && setResult({ term, content: [], page: { totalElements: 0 } }));
        }, DEBOUNCE_MS);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [term]);

    useEffect(() => {
        if (!open) return;
        const onClick = e => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
        const onKey = e => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!term) return;
        setOpen(false);
        navigate(`/catalog?q=${encodeURIComponent(term)}`);
    }

    // показываю ответ только на текущий запрос, а не на старый, который пришёл позже
    const current = result?.term === term ? result : null;
    const showPanel = open && term.length >= MIN_LENGTH;

    return (
        <form ref={boxRef} role="search" onSubmit={handleSubmit} className="relative order-last flex w-full min-w-0 lg:order-none lg:w-auto lg:flex-[999_1_380px]">
            <label htmlFor="site-search" className="sr-only">Search the shop</label>
            <Search size={18} className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-ink-400" />
            <input
                id="site-search"
                type="search"
                autoComplete="off"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search for paddleboards, paddles, accessories…"
                aria-expanded={showPanel}
                aria-controls="search-results"
                className="h-12 w-full rounded-full border border-line bg-surface-50 pl-[46px] pr-11 text-[15px] text-ink-900 outline-none focus:border-brand-600 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        setQuery('');
                        setResult(null);
                    }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 hover:bg-surface-100 hover:text-ink-900"
                >
                    <X size={16} strokeWidth={2} />
                </button>
            )}

            {showPanel && (
                <div
                    id="search-results"
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_18px_36px_-12px_rgba(14,42,51,0.25)]"
                >
                    {!current && <p className="px-5 py-4 text-sm text-ink-400">Searching…</p>}

                    {current && current.content.length === 0 && (
                        <p className="px-5 py-4 text-sm text-ink-600">
                            Nothing found for <span className="font-semibold text-ink-900">“{term}”</span>. Try a brand or a board type.
                        </p>
                    )}

                    {current?.content.map(product => {
                        const image = getPrimaryImage(product.images);
                        return (
                            <Link
                                key={product.id}
                                to={`/products/${product.slug}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3.5 border-b border-surface-100 px-4 py-2.5 hover:bg-surface-50"
                            >
                                <span className="flex h-12 w-14 flex-none items-center justify-center rounded-lg bg-surface-100">
                                    {image ? (
                                        <img src={image.imageUrl} alt="" className="max-h-full max-w-full object-contain p-1 mix-blend-multiply" />
                                    ) : (
                                        <BoardPlaceholder width={40} />
                                    )}
                                </span>
                                <span className="min-w-0 flex-grow">
                                    <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">{product.brandName}</span>
                                    <span className="block truncate text-sm font-semibold text-ink-900">{product.name}</span>
                                </span>
                                <span className="flex-none text-sm font-bold tabular-nums text-ink-900">{formatPrice(product.price)}</span>
                            </Link>
                        );
                    })}

                    {current && current.page.totalElements > 0 && (
                        <Link to={`/catalog?q=${encodeURIComponent(term)}`} onClick={() => setOpen(false)} className="block px-5 py-3.5 text-sm font-bold text-brand-600 hover:bg-surface-50">
                            See all {current.page.totalElements} results for “{term}” →
                        </Link>
                    )}
                </div>
            )}
        </form>
    );
}

export default SearchBox;
