import { useRef, useState } from 'react';
import { Link } from '../i18n/routing';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { formatPrice, getStock, formatBoardType, sortImages } from '../utils/format';
import { useAddToCart } from '../context/cart';
import { useWishlist } from '../context/wishlist';
import { useTranslation } from 'react-i18next';

// Бейдж в углу фото: распродано, скидка, мало осталось или тип доски
function getBadge(product, t) {
    if (product.quantity === 0) return { label: t('card.soldOut'), className: 'bg-surface-100 text-ink-600' };
    if (product.compareAtPrice) {
        const percent = Math.round((1 - product.price / product.compareAtPrice) * 100);
        return { label: `−${percent}%`, className: 'bg-alert text-white' };
    }
    if (product.quantity <= 2) return { label: t('card.limited'), className: 'bg-badge-warm-bg text-badge-warm-ink' };
    const type = formatBoardType(product.boardType);
    if (type) return { label: type, className: 'bg-badge-info-bg text-badge-info-ink' };
    return null;
}

// свайп короче этого считаю случайным касанием, а не листанием
const SWIPE_PX = 40;

function ProductCard({ product }) {
    const { t } = useTranslation();
    const addToCart = useAddToCart();
    const wishlist = useWishlist();
    const saved = wishlist.has(product.id);
    const images = sortImages(product.images);
    const [index, setIndex] = useState(0);
    const touchX = useRef(null);
    const image = images[index];
    const isSoldOut = product.quantity === 0;
    const specs = product.attributes?.slice(0, 3) ?? [];
    const stock = getStock(product.quantity);
    const badge = getBadge(product, t);

    function showImage(step) {
        setIndex(current => (current + step + images.length) % images.length);
    }

    function handleTouchEnd(e) {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > SWIPE_PX) showImage(dx < 0 ? 1 : -1);
    }

    return (
        <article className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
            <div
                className="group relative flex h-[240px] items-center justify-center bg-white"
                onTouchStart={images.length > 1 ? e => { touchX.current = e.touches[0].clientX; } : undefined}
                onTouchEnd={images.length > 1 ? handleTouchEnd : undefined}
            >
                {badge && (
                    <span className={`absolute left-3.5 top-3.5 z-10 rounded-full px-[11px] py-[5px] text-[11px] font-bold ${badge.className}`}>
                        {badge.label}
                    </span>
                )}

                <button
                    type="button"
                    aria-label={saved ? t('card.removeFromWishlist') : t('card.addToWishlist')}
                    aria-pressed={saved}
                    onClick={() => wishlist.toggle(product)}
                    className={`absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:text-alert ${saved ? 'text-alert' : 'text-ink-600'}`}
                >
                    <Heart size={17} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
                </button>

                <Link to={`/products/${product.slug}`} className="flex h-full w-full items-center justify-center px-4 pb-6 pt-4">
                    {image ? (
                        <img
                            src={image.imageUrl}
                            alt={product.name}
                            width={600}
                            height={600}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-[1.03]"
                        />
                    ) : (
                        <BoardPlaceholder />
                    )}
                </Link>

                {images.length > 1 && (
                    <>
                        {/* на десктопе стрелки появляются при наведении, на телефоне без мышки видны всегда */}
                        {[
                            { step: -1, label: t('card.prevPhoto'), Icon: ChevronLeft, side: 'left-2' },
                            { step: 1, label: t('card.nextPhoto'), Icon: ChevronRight, side: 'right-2' },
                        ].map(({ step, label, Icon, side }) => (
                            <button
                                key={step}
                                type="button"
                                aria-label={label}
                                onClick={() => showImage(step)}
                                className={`absolute ${side} top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink-900 opacity-0 transition-opacity hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100`}
                            >
                                <Icon size={16} strokeWidth={2} />
                            </button>
                        ))}

                        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
                            {images.map((img, i) => (
                                <span key={img.imageUrl} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-brand-600' : 'w-1.5 bg-line-divider'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-grow flex-col p-[18px]">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                    {product.brandName ?? '—'}
                </p>

                <h3 className="mb-2.5 text-base font-bold leading-[1.35] text-ink-900">
                    <Link to={`/products/${product.slug}`} className="hover:text-brand-600">
                        {product.name}
                    </Link>
                </h3>

                {specs.length > 0 && (
                    <ul className="mb-3.5 list-disc pl-[18px] text-[13px] leading-[1.75] text-ink-600">
                        {specs.map(spec => (
                            <li key={spec.name}>{spec.name}: {spec.value}</li>
                        ))}
                    </ul>
                )}

                <p className="mb-1.5 mt-auto flex flex-wrap items-baseline gap-x-2.5">
                    <span className={`text-[21px] font-extrabold tabular-nums ${product.compareAtPrice ? 'text-alert' : 'text-ink-900'}`}>
                        {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                        <s className="text-sm tabular-nums text-ink-400">{formatPrice(product.compareAtPrice)}</s>
                    )}
                </p>
                <p className={`mb-3.5 text-[13px] font-semibold ${stock.className}`}>{stock.label}</p>

                {isSoldOut ? (
                    <Link
                        to={`/products/${product.slug}`}
                        className="flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-[18px] py-3 text-[15px] font-bold text-ink-900 hover:bg-surface-50"
                    >
                        {t('card.notifyMe')}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => addToCart({ ...product, image: images[0]?.imageUrl })}
                        className="flex items-center justify-center gap-2 rounded-full bg-brand-600 px-[18px] py-[13px] text-[15px] font-bold text-white transition-colors hover:bg-brand-700"
                    >
                        {t('card.addToCart')}
                    </button>
                )}
            </div>
        </article>
    );
}

// Силуэт доски из макета вместо фото, пока у товара нет картинки
export function BoardPlaceholder({ width = 170, className = '' }) {
    return (
        <svg width={width} height={width * 0.25} viewBox="0 0 180 44" fill="none" aria-hidden="true" className={className}>
            <path d="M6 22C6 22 42 5 90 5s84 17 84 17-36 17-84 17S6 22 6 22Z" fill="#0B7A91" opacity="0.85" />
        </svg>
    );
}



export default ProductCard;
