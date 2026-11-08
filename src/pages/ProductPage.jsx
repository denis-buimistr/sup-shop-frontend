import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../i18n/routing';
import { useNavigate } from '../i18n/hooks';
import { ChevronLeft, ChevronRight, Heart, CircleCheck, Truck, ShieldCheck, RotateCcw, Store, Minus, Plus } from 'lucide-react';
import api from '../api/client';
import Container from '../components/Container';
import ProductCard, { BoardPlaceholder } from '../components/ProductCard';
import { useAddToCart, FREE_DELIVERY_FROM } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../hooks/useCatalogData';
import { getPath } from '../utils/categories';
import { formatPrice, formatBoardType, getStock, sortImages } from '../utils/format';

// тексты в product.assurances.<key>
const ASSURANCES = [
    { icon: Truck, key: 'delivery' },
    { icon: ShieldCheck, key: 'warranty' },
    { icon: RotateCcw, key: 'returns' },
    { icon: Store, key: 'test' },
];

// key={slug} пересоздаёт страницу при переходе на другой товар — галерея, количество и вкладка сбрасываются сами
function ProductPage() {
    const { slug } = useParams();
    return <ProductView key={slug} slug={slug} />;
}

function ProductView({ slug }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const addToCart = useAddToCart();
    const wishlist = useWishlist();
    const categories = useCategories();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState('specs');
    const [added, setAdded] = useState(false);

    useEffect(() => {
        // старые ссылки вида /products/12 (закладки, товары в заказах профиля) переводим на адрес со slug
        const isLegacyId = /^\d+$/.test(slug);

        api.get(isLegacyId ? `/products/${slug}` : `/products/slug/${slug}`)
            .then(({ data }) => {
                if (isLegacyId) {
                    navigate(`/products/${data.slug}`, { replace: true });
                    return;
                }
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug, navigate]);

    // похожие беру из той же категории; если там пусто — просто другие товары
    const categoryPath = categories && product?.categoryName
        ? getPath(categories, categories.find(c => c.name === product.categoryName)?.slug)
        : [];
    const categorySlug = categoryPath[categoryPath.length - 1]?.slug;

    useEffect(() => {
        if (!product) return;
        const params = { size: 5, ...(categorySlug ? { category: categorySlug } : {}) };
        api.get('/products', { params })
            .then(({ data }) => setRelated(data.content.filter(p => p.slug !== product.slug).slice(0, 4)))
            .catch(() => setRelated([]));
    }, [product, categorySlug]);

    if (loading) return <Container className="py-16 text-ink-400">{t('product.loading')}</Container>;
    if (!product) {
        return (
            <Container className="py-20 text-center">
                <h1 className="mb-3 text-[32px] font-extrabold tracking-[-0.02em] text-ink-900">{t('product.notFound.title')}</h1>
                <p className="mb-6 text-base text-ink-600">{t('product.notFound.body')}</p>
                <Link to="/catalog" className="inline-flex rounded-full bg-brand-600 px-7 py-[15px] text-[15px] font-bold text-white hover:bg-brand-700">
                    {t('product.notFound.back')}
                </Link>
            </Container>
        );
    }

    const images = sortImages(product.images);
    const saved = wishlist.has(product.id);
    const image = images[imageIndex];
    const stock = getStock(product.quantity);
    const isSoldOut = product.quantity === 0;
    const boardType = formatBoardType(product.boardType);

    const specs = [
        ...(boardType ? [{ name: t('product.boardType'), value: boardType }] : []),
        ...(product.attributes ?? []),
    ];

    const tabs = [
        { id: 'specs', hidden: specs.length === 0 },
        { id: 'description', hidden: !product.description },
    ].filter(item => !item.hidden);
    const activeTab = tabs.some(item => item.id === tab) ? tab : tabs[0]?.id;

    function showImage(step) {
        setImageIndex(current => (current + step + images.length) % images.length);
    }

    const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : null;

    function handleAdd() {
        addToCart({ ...product, image: images[0]?.imageUrl }, qty);
        setAdded(true);
    }

    // «купить сейчас» — кладу в корзину и сразу веду на оформление
    function handleBuyNow() {
        addToCart({ ...product, image: images[0]?.imageUrl }, qty);
        navigate('/checkout');
    }

    return (
        <>
            <Container className="pt-5">
                <nav aria-label={t('product.breadcrumb')} className="text-[13px] text-ink-400">
                    <Link to="/" className="hover:text-ink-900">{t('common.home')}</Link>
                    <span className="mx-2">/</span>
                    <Link to="/catalog" className="hover:text-ink-900">{t('common.catalog')}</Link>
                    {categoryPath.map(category => (
                        <span key={category.id}>
                            <span className="mx-2">/</span>
                            <Link to={`/catalog/${category.slug}`} className="hover:text-ink-900">{category.name}</Link>
                        </span>
                    ))}
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-ink-900">{product.name}</span>
                </nav>
            </Container>

            <Container className="pt-6">
                <div className="flex flex-wrap items-start gap-10">
                    {/* галерея: на белом фоне фото крупнее и не сидит в серой коробке, миниатюры на десктопе столбиком слева */}
                    <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5 lg:flex-row-reverse lg:gap-5">
                        <div className="relative flex h-[340px] min-w-0 flex-grow items-center justify-center bg-white sm:h-[520px] lg:h-[620px]">
                            {image ? (
                                <img src={image.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <BoardPlaceholder width={320} />
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label={t('product.prevImage')}
                                        onClick={() => showImage(-1)}
                                        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 hover:bg-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={t('product.nextImage')}
                                        onClick={() => showImage(1)}
                                        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 hover:bg-white"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex flex-none gap-2.5 overflow-x-auto lg:max-h-[620px] lg:flex-col lg:overflow-y-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={img.imageUrl}
                                        type="button"
                                        aria-label={t('product.photo', { n: i + 1 })}
                                        onClick={() => setImageIndex(i)}
                                        className={`flex h-[76px] w-[76px] flex-none items-center justify-center overflow-hidden rounded-xl border-2 bg-white ${
                                            i === imageIndex ? 'border-brand-600' : 'border-line hover:border-ink-400'
                                        }`}
                                    >
                                        <img src={img.imageUrl} alt="" className="max-h-full max-w-full object-contain p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* блок покупки */}
                    <div className="min-w-0 flex-[1_1_380px]">
                        <div className="mb-3.5 flex flex-wrap items-center gap-3">
                            {product.brandName && (
                                <span className="text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink-900">
                                    {product.brandName}
                                </span>
                            )}
                            {discount && (
                                <span className="rounded-full bg-alert px-[11px] py-[5px] text-[11px] font-bold text-white">{t('product.sale')}</span>
                            )}
                            {boardType && (
                                <span className="rounded-full bg-badge-info-bg px-[11px] py-[5px] text-[11px] font-bold text-badge-info-ink">
                                    {boardType}
                                </span>
                            )}
                        </div>

                        <h1 className="mb-5 text-[30px] font-extrabold sm:text-[38px] leading-[1.12] tracking-[-0.025em] text-ink-900">
                            {product.name}
                        </h1>

                        <p className="mb-1.5 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                            <span className={`text-[38px] font-extrabold tracking-[-0.02em] tabular-nums ${discount ? 'text-alert' : 'text-ink-900'}`}>
                                {formatPrice(product.price)}
                            </span>
                            {discount && (
                                <>
                                    <s className="text-lg tabular-nums text-ink-400">{formatPrice(product.compareAtPrice)}</s>
                                    <span className="rounded-full bg-badge-warm-bg px-[11px] py-[5px] text-[13px] font-bold text-badge-warm-ink">−{discount}%</span>
                                </>
                            )}
                        </p>
                        <p className="mb-[22px] text-[13px] text-ink-400">
                            {t('product.vatAndDelivery', { price: formatPrice(FREE_DELIVERY_FROM) })}
                        </p>

                        {product.description && (
                            <p className="mb-6 text-[17px] leading-[1.65] text-ink-600">{product.description}</p>
                        )}

                        <div className="mb-[18px] flex flex-wrap items-center gap-3.5">
                            <div className="flex items-center gap-1 rounded-full border-[1.5px] border-line-input p-1">
                                <button
                                    type="button"
                                    aria-label={t('product.decrease')}
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-ink-900 hover:bg-surface-100"
                                >
                                    <Minus size={18} />
                                </button>
                                <span aria-live="polite" className="min-w-9 text-center text-base font-bold">{qty}</span>
                                <button
                                    type="button"
                                    aria-label={t('product.increase')}
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
                                {isSoldOut ? t('card.soldOut') : t('common.addToCart')}
                            </button>

                            <button
                                type="button"
                                aria-label={saved ? t('card.removeFromWishlist') : t('card.addToWishlist')}
                                aria-pressed={saved}
                                onClick={() => wishlist.toggle(product)}
                                className={`flex h-14 w-14 flex-none items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white hover:text-alert ${saved ? 'text-alert' : ''}`}
                            >
                                <Heart size={22} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {!isSoldOut && (
                            added ? (
                                <Link
                                    to="/cart"
                                    className="mb-5 flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-7 py-[15px] text-base font-bold text-ink-900 hover:bg-surface-50"
                                >
                                    {t('product.added')}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    className="mb-5 flex w-full items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-7 py-[15px] text-base font-bold text-ink-900 hover:bg-surface-50"
                                >
                                    {t('product.buyNow')}
                                </button>
                            )
                        )}

                        <p className={`mb-6 flex items-center gap-2 text-[15px] font-semibold ${stock.className}`}>
                            <CircleCheck size={18} strokeWidth={1.8} />
                            {stock.label}
                        </p>

                        <div className="overflow-hidden rounded-[18px] border border-line">
                            {ASSURANCES.map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.key} className="flex items-start gap-3.5 border-b border-surface-100 px-[18px] py-4 last:border-b-0">
                                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-surface-100 text-brand-600">
                                            <Icon size={18} strokeWidth={1.8} />
                                        </span>
                                        <span>
                                            <span className="block text-[15px] font-bold text-ink-900">{t(`product.assurances.${item.key}.title`)}</span>
                                            <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-400">{t(`product.assurances.${item.key}.body`, { price: formatPrice(FREE_DELIVERY_FROM) })}</span>
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
                        {tabs.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={item.id === activeTab}
                                onClick={() => setTab(item.id)}
                                className={`py-4 text-[17px] font-bold ${
                                    item.id === activeTab
                                        ? 'text-ink-900 shadow-[inset_0_-3px_0_0_#0B7A91]'
                                        : 'text-ink-400 hover:text-ink-900'
                                }`}
                            >
                                {t(`product.tabs.${item.id}`)}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-12 pt-8">
                        <div className="min-w-0 flex-[999_1_520px]">
                            {activeTab === 'specs' && (
                                <>
                                    <h2 className="mb-[18px] text-2xl font-extrabold tracking-[-0.02em]">{t('product.tabs.specs')}</h2>
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
                                    <h2 className="mb-[18px] text-2xl font-extrabold tracking-[-0.02em]">{t('product.tabs.description')}</h2>
                                    <p className="text-[17px] leading-[1.7] text-ink-600">{product.description}</p>
                                </>
                            )}
                        </div>

                        <aside className="min-w-0 flex-[1_1_300px]">
                            <div className="rounded-[20px] bg-surface-100 p-[26px]">
                                <h3 className="mb-2.5 text-[19px] font-extrabold">{t('product.help.title')}</h3>
                                <p className="mb-[18px] text-[15px] leading-[1.6] text-ink-600">
                                    {t('product.help.body')}
                                </p>
                                <Link
                                    to="/contacts"
                                    className="inline-flex rounded-full bg-brand-600 px-6 py-[13px] text-[15px] font-bold text-white hover:bg-brand-700"
                                >
                                    {t('catalog.help.cta')}
                                </Link>
                            </div>
                        </aside>
                    </div>
                </Container>
            )}

            {related.length > 0 && (
                <Container as="section" className="pb-16 pt-14">
                    <h2 className="mb-6 text-[30px] font-extrabold tracking-[-0.02em]">
                        {categoryPath.length ? t('product.moreIn', { name: categoryPath[categoryPath.length - 1].name }) : t('product.youMayLike')}
                    </h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {related.map(item => <ProductCard key={item.id} product={item} />)}
                    </div>
                </Container>
            )}
        </>
    );
}

export default ProductPage;
