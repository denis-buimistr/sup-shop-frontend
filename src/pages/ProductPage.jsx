import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, CircleCheck, Truck, ShieldCheck, RotateCcw, Store, Minus, Plus } from 'lucide-react';
import api from '../api/client';
import Container from '../components/Container';
import { BoardPlaceholder } from '../components/ProductCard';
import { useAddToCart, FREE_DELIVERY_FROM } from '../context/cart';
import { formatPrice, formatBoardType, getStock } from '../utils/format';

const ASSURANCES = [
    { icon: Truck, title: 'Free delivery', body: `Across Moldova on orders over ${formatPrice(FREE_DELIVERY_FROM)}, 1–3 days` },
    { icon: ShieldCheck, title: '2-year warranty', body: 'Official dealer, service in Chișinău' },
    { icon: RotateCcw, title: '14-day returns', body: 'Unused gear in original packaging' },
    { icon: Store, title: 'Test before you buy', body: 'Come to the showroom and try the board' },
];

// key={id} пересоздаёт страницу при переходе на другой товар — галерея, количество и вкладка сбрасываются сами
function ProductPage() {
    const { id } = useParams();
    return <ProductView key={id} id={id} />;
}

function ProductView({ id }) {
    const addToCart = useAddToCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState('specs');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        api.get('/products', { params: { size: 20 } })
            .then(response => setRelated(response.data.content.filter(p => String(p.id) !== id).slice(0, 4)))
            .catch(() => setRelated([]));
    }, [id]);

    if (loading) return <Container className="py-10 text-ink-400">Загрузка...</Container>;
    if (!product) return <Container className="py-10">Товар не найден</Container>;

    const images = product.images ?? [];
    const image = images[imageIndex];
    const stock = getStock(product.quantity);
    const isSoldOut = product.quantity === 0;
    const boardType = formatBoardType(product.boardType);

    const specs = [
        ...(boardType ? [{ name: 'Board type', value: boardType }] : []),
        ...(product.attributes ?? []),
    ];

    const tabs = [
        { id: 'specs', label: 'Specifications', hidden: specs.length === 0 },
        { id: 'description', label: 'Description', hidden: !product.description },
    ].filter(t => !t.hidden);
    const activeTab = tabs.some(t => t.id === tab) ? tab : tabs[0]?.id;

    function showImage(step) {
        setImageIndex(current => (current + step + images.length) % images.length);
    }

    function handleAdd() {
        addToCart({ ...product, image: images[0]?.imageUrl }, qty);
        setAdded(true);
    }

    return (
        <>
            <Container className="pt-5">
                <nav aria-label="Breadcrumb" className="text-[13px] text-ink-400">
                    <Link to="/" className="hover:text-ink-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/catalog" className="hover:text-ink-900">Catalog</Link>
                    {product.categoryName && (
                        <>
                            <span className="mx-2">/</span>
                            <Link to="/catalog" className="hover:text-ink-900">{product.categoryName}</Link>
                        </>
                    )}
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-ink-900">{product.name}</span>
                </nav>
            </Container>

            <Container className="pt-6">
                <div className="flex flex-wrap items-start gap-12">
                    {/* галерея */}
                    <div className="min-w-0 flex-[999_1_460px]">
                        <div className="relative flex h-[440px] items-center justify-center rounded-[22px] bg-surface-100">
                            {image ? (
                                <img src={image.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain p-10" />
                            ) : (
                                <BoardPlaceholder width={320} />
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        onClick={() => showImage(-1)}
                                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        onClick={() => showImage(1)}
                                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="mt-3.5 grid grid-cols-4 gap-3">
                                {images.map((img, i) => (
                                    <button
                                        key={img.imageUrl}
                                        type="button"
                                        aria-label={`Product photo ${i + 1}`}
                                        onClick={() => setImageIndex(i)}
                                        className={`flex h-[92px] items-center justify-center overflow-hidden rounded-[14px] border-2 bg-surface-100 ${
                                            i === imageIndex ? 'border-brand-600' : 'border-transparent'
                                        }`}
                                    >
                                        <img src={img.imageUrl} alt="" className="max-h-full max-w-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* блок покупки */}
                    <div className="min-w-0 flex-[1_1_420px]">
                        <div className="mb-3.5 flex flex-wrap items-center gap-3">
                            {product.brandName && (
                                <span className="text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink-900">
                                    {product.brandName}
                                </span>
                            )}
                            {boardType && (
                                <span className="rounded-full bg-badge-info-bg px-[11px] py-[5px] text-[11px] font-bold text-badge-info-ink">
                                    {boardType}
                                </span>
                            )}
                        </div>

                        <h1 className="mb-5 text-[38px] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink-900">
                            {product.name}
                        </h1>

                        <p className="mb-1.5 text-[38px] font-extrabold tracking-[-0.02em] tabular-nums text-ink-900">
                            {formatPrice(product.price)}
                        </p>
                        <p className="mb-[22px] text-[13px] text-ink-400">
                            VAT included · Free delivery for orders over {formatPrice(FREE_DELIVERY_FROM)}
                        </p>

                        {product.description && (
                            <p className="mb-6 text-[17px] leading-[1.65] text-ink-600">{product.description}</p>
                        )}

                        <div className="mb-[18px] flex flex-wrap items-center gap-3.5">
                            <div className="flex items-center gap-1 rounded-full border-[1.5px] border-line-input p-1">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-ink-900 hover:bg-surface-100"
                                >
                                    <Minus size={18} />
                                </button>
                                <span aria-live="polite" className="min-w-9 text-center text-base font-bold">{qty}</span>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    onClick={() => setQty(q => Math.min(product.quantity || 1, q + 1))}
                                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-ink-900 hover:bg-surface-100"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                type="button"
                                disabled={isSoldOut}
                                onClick={handleAdd}
                                className="flex min-w-0 flex-[999_1_160px] items-center justify-center rounded-full bg-brand-600 px-6 py-[17px] text-[17px] font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-surface-100 disabled:text-ink-400"
                            >
                                {isSoldOut ? 'Sold out' : 'Add to cart'}
                            </button>

                            <button
                                type="button"
                                aria-label="Add to wishlist"
                                className="flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white hover:text-alert"
                            >
                                <Heart size={22} strokeWidth={1.8} />
                            </button>
                        </div>

                        {added && (
                            <Link
                                to="/cart"
                                className="mb-5 flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-7 py-[15px] text-base font-bold text-ink-900 hover:bg-surface-50"
                            >
                                Added — go to cart
                            </Link>
                        )}

                        <p className={`mb-6 flex items-center gap-2 text-[15px] font-semibold ${stock.className}`}>
                            <CircleCheck size={18} strokeWidth={1.8} />
                            {stock.label}
                        </p>

                        <div className="overflow-hidden rounded-[18px] border border-line">
                            {ASSURANCES.map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="flex items-start gap-3.5 border-b border-surface-100 px-[18px] py-4 last:border-b-0">
                                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-100 text-brand-600">
                                            <Icon size={18} strokeWidth={1.8} />
                                        </span>
                                        <span>
                                            <span className="block text-[15px] font-bold text-ink-900">{item.title}</span>
                                            <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-400">{item.body}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>

            {tabs.length > 0 && (
                <Container as="section" className="pt-14">
                    <div role="tablist" className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                role="tab"
                                aria-selected={t.id === activeTab}
                                onClick={() => setTab(t.id)}
                                className={`py-4 text-[17px] font-bold ${
                                    t.id === activeTab
                                        ? 'text-ink-900 shadow-[inset_0_-3px_0_0_#0B7A91]'
                                        : 'text-ink-400 hover:text-ink-900'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-12 pt-8">
                        <div className="min-w-0 flex-[999_1_520px]">
                            {activeTab === 'specs' && (
                                <>
                                    <h2 className="mb-[18px] text-2xl font-extrabold tracking-[-0.02em]">Specifications</h2>
                                    <div className="overflow-hidden rounded-[18px] border border-line">
                                        {specs.map((row, i) => (
                                            <div
                                                key={row.name}
                                                className={`flex flex-wrap gap-x-6 gap-y-2 px-5 py-3.5 ${i % 2 ? 'bg-surface-50' : 'bg-white'}`}
                                            >
                                                <span className="flex-[1_1_200px] text-[15px] text-ink-400">{row.name}</span>
                                                <span className="flex-[2_1_260px] text-[15px] font-semibold text-ink-900">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTab === 'description' && (
                                <>
                                    <h2 className="mb-[18px] text-2xl font-extrabold tracking-[-0.02em]">Description</h2>
                                    <p className="text-[17px] leading-[1.7] text-ink-600">{product.description}</p>
                                </>
                            )}
                        </div>

                        <aside className="min-w-0 flex-[1_1_300px]">
                            <div className="rounded-[20px] bg-surface-100 p-[26px]">
                                <h3 className="mb-2.5 text-[19px] font-extrabold">Not sure it's the right board?</h3>
                                <p className="mb-[18px] text-[15px] leading-[1.6] text-ink-600">
                                    Send us your weight and home water and we'll confirm the size before you buy.
                                </p>
                                <Link
                                    to="/contacts"
                                    className="inline-flex rounded-full bg-brand-600 px-6 py-[13px] text-[15px] font-bold text-white hover:bg-brand-700"
                                >
                                    Ask an expert
                                </Link>
                            </div>
                        </aside>
                    </div>
                </Container>
            )}

            {related.length > 0 && (
                <Container as="section" className="pb-16 pt-14">
                    <h2 className="mb-6 text-[30px] font-extrabold tracking-[-0.02em]">Often bought together</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {related.map(item => (
                            <RelatedCard key={item.id} product={item} />
                        ))}
                    </div>
                </Container>
            )}
        </>
    );
}

function RelatedCard({ product }) {
    const addToCart = useAddToCart();
    const image = product.images?.[0];

    return (
        <article className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
            <Link to={`/products/${product.id}`} className="flex h-40 items-center justify-center bg-surface-100 p-5">
                {image ? (
                    <img src={image.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                ) : (
                    <BoardPlaceholder width={150} />
                )}
            </Link>
            <div className="flex flex-grow flex-col p-4">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">{product.brandName ?? '—'}</p>
                <h3 className="mb-2.5 text-[15px] font-bold leading-[1.35]">
                    <Link to={`/products/${product.id}`} className="text-ink-900 hover:text-brand-600">{product.name}</Link>
                </h3>
                <p className="mb-3 mt-auto text-[19px] font-extrabold tabular-nums">{formatPrice(product.price)}</p>
                <button
                    type="button"
                    disabled={product.quantity === 0}
                    onClick={() => addToCart({ ...product, image: image?.imageUrl })}
                    className="rounded-full bg-brand-600 p-3 text-sm font-bold text-white hover:bg-brand-700 disabled:bg-surface-100 disabled:text-ink-400"
                >
                    {product.quantity === 0 ? 'Sold out' : 'Add to cart'}
                </button>
            </div>
        </article>
    );
}

export default ProductPage;
