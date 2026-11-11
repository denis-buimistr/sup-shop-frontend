import { useEffect, useState } from 'react';
import { Link } from '../../i18n/routing';
import api from '../../api/client';
import ProductCard from '../ProductCard';
import { useAddToCart } from '../../context/cart';
import { formatPrice, getPrimaryImage } from '../../utils/format';
import { useTranslation } from 'react-i18next';

export function SectionHead({ eyebrow, title, link, linkLabel }) {
    return (
        <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="mb-2.5 text-xs font-bold tracking-[0.16em] text-brand-700">{eyebrow}</p>
                <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink-900 sm:text-[34px]">{title}</h2>
            </div>
            {link && (
                <Link to={link} className="text-[15px] font-bold text-brand-600 hover:text-brand-700">{linkLabel}</Link>
            )}
        </div>
    );
}

export function WaveDivider() {
    return (
        <svg viewBox="0 0 1272 20" preserveAspectRatio="none" className="block h-5 w-full" aria-hidden="true">
            <path
                d="M0 10c53-10 106-10 159 0s106 10 159 0 106-10 159 0 106 10 159 0 106-10 159 0 106 10 159 0 106-10 159 0 106 10 159 0"
                fill="none"
                stroke="#0B7A91"
                strokeOpacity="0.4"
                strokeWidth="2.5"
            />
        </svg>
    );
}

// ряд из 4 товаров одной категории; пустую категорию просто не показываю
export function ProductRow({ category, eyebrow, title }) {
    const { t } = useTranslation();
    const [page, setPage] = useState(null);

    useEffect(() => {
        api.get('/products', { params: { category, size: 4 } })
            .then(({ data }) => setPage(data))
            .catch(() => setPage(null));
    }, [category]);

    if (!page || page.content.length === 0) return null;

    return (
        <section>
            <SectionHead
                eyebrow={eyebrow}
                title={title}
                link={`/catalog/${category}`}
                linkLabel={t('common.viewAll', { count: page.page.totalElements })}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {page.content.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </section>
    );
}

// «доска месяца»: настоящий товар из базы, если его сняли с продажи — блок прячется
export function FeaturedProduct({ slug }) {
    const { t } = useTranslation();
    const addToCart = useAddToCart();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        api.get(`/products/slug/${slug}`)
            .then(({ data }) => setProduct(data))
            .catch(() => setProduct(null));
    }, [slug]);

    if (!product || product.status !== 'ACTIVE') return null;

    const specs = (product.attributes ?? []).slice(0, 4);
    const photo = getPrimaryImage(product.images);
    const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : null;

    return (
        <section className="border-y border-line bg-surface-100">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-12 px-6 py-14">
                <div className="min-w-0 flex-[999_1_460px]">
                    <div className="relative rounded-[26px] bg-white px-6 py-7">
                        <span className="absolute left-5 top-5 rounded-full bg-alert px-3.5 py-[7px] text-xs font-bold text-white">{t('featured.badge')}</span>
                        {photo ? (
                            <img src={photo.imageUrl} alt={product.name} className="mx-auto mt-6 block h-[320px] w-full object-contain" />
                        ) : (
                            <svg viewBox="0 0 520 240" className="mt-5 block h-auto w-full" role="img" aria-label={t('featured.illustration', { name: product.name })}>
                                <ellipse cx="260" cy="212" rx="196" ry="13" fill="#0A2A3B" opacity="0.08" />
                                <path d="M22 118c0 0 84-52 238-52s238 52 238 52-84 52-238 52S22 118 22 118Z" fill="#0B7A91" />
                                <path d="M22 118c0 0 84-52 238-52s238 52 238 52" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="5" />
                                <path d="M232 84h186c16 0 28 15 28 34s-12 34-28 34H232c-16 0-28-15-28-34s12-34 28-34Z" fill="#0A2A3B" opacity="0.2" />
                                <path d="M74 102l54 14M74 134l54-14" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="4" />
                                <rect x="300" y="112" width="44" height="10" rx="5" fill="#ffffff" opacity="0.5" />
                                <path d="M22 118c0 0 32-19 76-30l12 30-12 30c-44-11-76-30-76-30Z" fill="#C62B12" />
                                <path d="M386 170c10 24 23 38 39 45-22 3-45-12-55-34Z" fill="#0A2A3B" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="min-w-0 flex-[1_1_420px]">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">{product.brandName}</p>
                    <h2 className="mb-3.5 text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink-900 sm:text-[38px]">{product.name}</h2>
                    {product.description && <p className="mb-6 text-[17px] leading-[1.65] text-ink-600">{product.description}</p>}

                    <p className="mb-1.5 flex flex-wrap items-baseline gap-3.5">
                        <span className="text-[40px] font-extrabold tracking-[-0.02em] tabular-nums text-ink-900">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && (
                            <>
                                <s className="text-lg text-ink-400">{formatPrice(product.compareAtPrice)}</s>
                                <span className="rounded-full bg-badge-warm-bg px-3 py-[5px] text-[13px] font-bold text-badge-warm-ink">−{discount}%</span>
                            </>
                        )}
                    </p>
                    <p className="mb-6 text-sm text-ink-400">{t('common.vatIncluded')}</p>

                    <div className="mb-5 flex flex-wrap gap-3.5">
                        <button
                            type="button"
                            disabled={product.quantity === 0}
                            onClick={() => addToCart({ ...product, image: photo?.imageUrl })}
                            className="flex flex-[999_1_240px] items-center justify-center rounded-full bg-brand-600 px-[30px] py-[18px] text-[17px] font-bold text-white hover:bg-brand-700 disabled:opacity-50"
                        >
                            {product.quantity === 0 ? t('card.soldOut') : t('common.addToCart')}
                        </button>
                        <Link
                            to={`/products/${product.slug}`}
                            className="flex flex-[1_1_160px] items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white px-[26px] py-[17px] text-base font-bold text-ink-900 hover:bg-surface-50"
                        >
                            {t('featured.fullDetails')}
                        </Link>
                    </div>

                    {specs.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {specs.map(spec => (
                                <div key={spec.name} className="rounded-2xl bg-white px-4 py-3.5">
                                    <p className="mb-[3px] text-[15px] font-extrabold tabular-nums text-ink-900">{spec.value}</p>
                                    <p className="text-xs text-ink-400">{spec.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
