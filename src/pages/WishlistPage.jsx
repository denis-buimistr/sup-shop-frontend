import { useEffect, useState } from 'react';
import { Link } from '../i18n/routing';
import { Heart } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import api from '../api/client';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/auth';
import { useWishlist } from '../context/wishlist';

// Избранное хранит только id, сами товары беру из каталога: так цены и наличие всегда свежие
function WishlistPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { ids } = useWishlist();
    const [products, setProducts] = useState(null);
    const key = ids.join(',');

    useEffect(() => {
        if (!key) return;
        const query = new URLSearchParams();
        key.split(',').forEach(id => query.append('id', id));
        query.set('size', '100');

        let active = true;
        api.get('/products', { params: query })
            .then(({ data }) => active && setProducts(data.content))
            .catch(() => active && setProducts([]));
        return () => {
            active = false;
        };
    }, [key]);

    // после снятия сердечка товар пропадает сразу, не дожидаясь нового запроса. порядок как в избранном, новые первыми
    const visible = (products ?? [])
        .filter(p => ids.includes(p.id))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    const loading = ids.length > 0 && products === null;

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="pb-9 pt-7">
                    <nav aria-label={t('common.breadcrumb')} className="mb-[18px] text-[13px] text-ink-400">
                        <Link to="/" className="hover:text-ink-900">{t('common.home')}</Link>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-ink-900">{t('wishlist.title')}</span>
                    </nav>
                    <h1 className="mb-3 text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{t('wishlist.title')}</h1>
                    <p className="max-w-[680px] text-[17px] leading-[1.6] text-ink-600">
                        {user
                            ? t('wishlist.signedIn')
                            : t('wishlist.guest')}
                    </p>
                </Container>
            </section>

            <Container as="section" className="pb-16 pt-8">
                {loading && <p className="text-ink-400">{t('common.loading')}</p>}

                {!loading && visible.length === 0 && (
                    <div className="mx-auto max-w-[480px] rounded-[22px] border border-line px-8 py-12 text-center">
                        <Heart size={40} strokeWidth={1.6} className="mx-auto mb-4 text-ink-400" />
                        <h2 className="mb-2 text-xl font-extrabold">{t('wishlist.empty.title')}</h2>
                        <p className="mb-6 text-ink-600">{t('wishlist.empty.body')}</p>
                        <Link to="/catalog" className="inline-flex rounded-full bg-brand-600 px-[26px] py-3.5 text-[15px] font-bold text-white hover:bg-brand-700">
                            {t('wishlist.empty.cta')}
                        </Link>
                    </div>
                )}

                {visible.length > 0 && (
                    <>
                        <p className="mb-5 text-[15px] text-ink-600">
                            <Trans i18nKey="catalog.count" count={visible.length} components={{ b: <span className="font-bold text-ink-900" /> }} />
                        </p>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {visible.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    </>
                )}
            </Container>
        </>
    );
}

export default WishlistPage;
