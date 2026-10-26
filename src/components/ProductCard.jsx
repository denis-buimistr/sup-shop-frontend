import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { formatPrice, getPrimaryImage, getStock, formatBoardType } from '../utils/format';
import { useAddToCart } from '../context/cart';

// Бейдж в углу фото: распродано, мало осталось или тип доски
function getBadge(product) {
    if (product.quantity === 0) return { label: 'Sold out', className: 'bg-surface-100 text-ink-600' };
    if (product.quantity <= 2) return { label: 'Limited stock', className: 'bg-badge-warm-bg text-badge-warm-ink' };
    const type = formatBoardType(product.boardType);
    if (type) return { label: type, className: 'bg-badge-info-bg text-badge-info-ink' };
    return null;
}

function ProductCard({ product }) {
    const addToCart = useAddToCart();
    const image = getPrimaryImage(product.images);
    const isSoldOut = product.quantity === 0;
    const specs = product.attributes?.slice(0, 3) ?? [];
    const stock = getStock(product.quantity);
    const badge = getBadge(product);

    return (
        <article className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
            <div className="relative flex h-[180px] items-center justify-center bg-surface-100">
                {badge && (
                    <span className={`absolute left-3.5 top-3.5 z-10 rounded-full px-[11px] py-[5px] text-[11px] font-bold ${badge.className}`}>
                        {badge.label}
                    </span>
                )}

                <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:text-alert"
                >
                    <Heart size={17} strokeWidth={1.8} />
                </button>

                <Link to={`/products/${product.id}`} className="flex h-full w-full items-center justify-center p-6">
                    {image ? (
                        <img
                            src={image.imageUrl}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <BoardPlaceholder />
                    )}
                </Link>
            </div>

            <div className="flex flex-grow flex-col p-[18px]">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                    {product.brandName ?? '—'}
                </p>

                <h3 className="mb-2.5 text-base font-bold leading-[1.35] text-ink-900">
                    <Link to={`/products/${product.id}`} className="hover:text-brand-600">
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

                <p className="mb-1.5 mt-auto text-[21px] font-extrabold tabular-nums text-ink-900">
                    {formatPrice(product.price)}
                </p>
                <p className={`mb-3.5 text-[13px] font-semibold ${stock.className}`}>{stock.label}</p>

                {isSoldOut ? (
                    <Link
                        to={`/products/${product.id}`}
                        className="flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-[18px] py-3 text-[15px] font-bold text-ink-900 hover:bg-surface-50"
                    >
                        Notify me
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={() => addToCart({ ...product, image: image?.imageUrl })}
                        className="flex items-center justify-center gap-2 rounded-full bg-brand-600 px-[18px] py-[13px] text-[15px] font-bold text-white transition-colors hover:bg-brand-700"
                    >
                        Add to cart →
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
