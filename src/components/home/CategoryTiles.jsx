import { Link } from '../../i18n/routing';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_PHOTOS } from '../../data/categoryPhotos';
import { useTranslation } from 'react-i18next';

// подпись делаю текстом, а не беру с картинки — так её видят поисковики. сами подписи в tiles.<slug>
const TILES = ['paddles', 'sup', 'foil-wing', 'surf', 'clothing', 'accessories'];

function CategoryTiles() {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.map(slug => (
                <Link
                    key={slug}
                    to={`/catalog/${slug}`}
                    className="group relative block aspect-[488/440] overflow-hidden rounded-3xl bg-deep-900"
                >
                    <img
                        src={CATEGORY_PHOTOS[slug]}
                        alt=""
                        className="absolute inset-x-0 top-0 h-[74%] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* низ плитки уходит в тёмную бирюзу, как на макете, — на нём белый текст читается всегда */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(7,43,54,0) 42%, rgba(9,58,72,0.85) 64%, #072B36 80%)' }}
                    />
                    <svg viewBox="0 0 488 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[17%] h-10 w-full" aria-hidden="true">
                        <path d="M0 40C120 10 260 10 488 30" fill="none" stroke="#5EC4CD" strokeOpacity="0.55" strokeWidth="3" />
                    </svg>

                    <span className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6">
                        <span className="mb-3 text-center text-[30px] font-extrabold uppercase italic leading-none tracking-[-0.01em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:text-[34px]">
                            {t(`tiles.${slug}`)}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-deep-accent px-6 py-2.5 text-sm font-bold uppercase tracking-[0.04em] text-white transition-colors group-hover:bg-deep-accent group-hover:text-ink-900">
                            {t('tiles.shopNow')} <ArrowRight size={16} strokeWidth={2.4} />
                        </span>
                    </span>
                </Link>
            ))}
        </div>
    );
}

export default CategoryTiles;
