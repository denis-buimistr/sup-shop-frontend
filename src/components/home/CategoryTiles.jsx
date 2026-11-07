import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCatalogData';

// плитки ведут в реальные разделы, а число товаров беру из /api/categories
const TILES = [
    { slug: 'sup', title: 'Paddleboards', note: 'inflatable & hard', bg: '#E4EFF2', Art: BoardArt },
    { slug: 'paddles', title: 'Paddles', note: 'carbon & hybrid', bg: '#EFEAE1', Art: PaddlesArt },
    { slug: 'foil-wing', title: 'Foil & wing', note: 'wings, foils, boards', bg: '#E8EDE4', Art: WingArt },
    { slug: 'surf', title: 'Surf', note: 'boards & leashes', bg: '#E2E7EA', Art: SurfArt },
    { slug: 'clothing', title: 'Clothing', note: 'tees, tops, robes', bg: '#EDE3E8', Art: ClothingArt },
    { slug: 'accessories', title: 'Accessories', note: 'pumps, bags, safety', bg: '#E9EEE9', Art: AccessoriesArt },
];

function CategoryTiles() {
    const categories = useCategories();
    const count = slug => categories?.find(c => c.slug === slug)?.productCount;

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.map(({ slug, title, note, bg, Art }) => (
                <Link key={slug} to={`/catalog/${slug}`} className="group block overflow-hidden rounded-3xl transition-transform hover:-translate-y-0.5" style={{ background: bg }}>
                    <span className="block px-[26px] pt-[26px]">
                        <span className="block text-[22px] font-extrabold tracking-[-0.015em] text-ink-900 group-hover:text-brand-700">{title}</span>
                        <span className="mt-[5px] block text-sm text-ink-600">
                            {count(slug) != null ? `${count(slug)} products · ` : ''}{note}
                        </span>
                    </span>
                    <Art />
                </Link>
            ))}
        </div>
    );
}

const artClass = 'block h-auto w-full';

function BoardArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 130c60-16 120-16 180 0s120 16 180 0 60-8 60-8v58H0Z" fill="#0B7A91" opacity="0.22" />
            <path d="M44 96c0 0 56-28 166-28s166 28 166 28-56 28-166 28S44 96 44 96Z" fill="#0B7A91" />
            <path d="M44 96c0 0 56-28 166-28s166 28 166 28" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" />
            <path d="M188 78h130c10 0 18 8 18 18s-8 18-18 18H188c-10 0-18-8-18-18s8-18 18-18Z" fill="#0A2A3B" opacity="0.2" />
            <path d="M80 88l36 8M80 104l36-8" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" />
            <rect x="240" y="92" width="30" height="7" rx="3.5" fill="#ffffff" opacity="0.5" />
            <path d="M44 96c0 0 22-11 52-19l8 19-8 19c-30-8-52-19-52-19Z" fill="#C62B12" />
        </svg>
    );
}

function PaddlesArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 140c70-14 140-14 210 0s140 14 210 0v40H0Z" fill="#0A2A3B" opacity="0.08" />
            <rect x="140" y="26" width="11" height="104" rx="5.5" fill="#0A2A3B" />
            <path d="M128 126h35l-7 44c-16-4-26-20-28-44Z" fill="#0B7A91" />
            <rect x="126" y="14" width="39" height="13" rx="6.5" fill="#0A2A3B" />
            <rect x="232" y="34" width="11" height="96" rx="5.5" fill="#44585F" />
            <path d="M220 126h35l-7 40c-16-4-26-18-28-40Z" fill="#F2B544" />
            <rect x="218" y="22" width="39" height="13" rx="6.5" fill="#44585F" />
            <rect x="302" y="46" width="10" height="84" rx="5" fill="#0A2A3B" opacity="0.6" />
            <path d="M291 126h32l-6 34c-15-4-24-15-26-34Z" fill="#7FC6D6" />
        </svg>
    );
}

function WingArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 142c70-14 140-14 210 0s140 14 210 0v38H0Z" fill="#15794A" opacity="0.14" />
            <path d="M96 118C96 60 150 24 236 24c56 0 84 20 84 20s-26 16-56 34c-44 26-96 42-168 40Z" fill="#15794A" opacity="0.85" />
            <path d="M96 118C148 72 204 46 320 44" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
            <path d="M150 90c40-26 92-42 158-46" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
            <rect x="112" y="110" width="150" height="12" rx="6" fill="#0A2A3B" />
            <path d="M300 128h70l-10 24h-50l-10-24Z" fill="#0A2A3B" opacity="0.5" />
        </svg>
    );
}

function SurfArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 150c70-12 140-12 210 0s140 12 210 0v30H0Z" fill="#0B7A91" opacity="0.18" />
            <path d="M40 120c50-70 140-96 250-70 30 7 60 22 90 46-60 18-150 34-240 34-40 0-74-4-100-10Z" fill="#0B7A91" opacity="0.35" />
            <path d="M130 98c0 0 50-34 130-34s100 34 100 34-30 30-110 30-120-30-120-30Z" fill="#F2B544" />
            <path d="M150 98h200" stroke="#0A2A3B" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M330 116l14 22-22-6Z" fill="#0A2A3B" />
        </svg>
    );
}

function ClothingArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 148c70-12 140-12 210 0s140 12 210 0v32H0Z" fill="#0A2A3B" opacity="0.08" />
            <path d="M168 26h84l40 26-18 30-18-10v82h-92V72l-18 10-18-30Z" fill="#0A2A3B" />
            <path d="M188 26c4 14 14 20 22 20s18-6 22-20" fill="none" stroke="#0B7A91" strokeWidth="6" />
            <path d="M188 106h64" stroke="#F2B544" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function AccessoriesArt() {
    return (
        <svg viewBox="0 0 420 180" className={artClass} aria-hidden="true">
            <path d="M0 148c70-12 140-12 210 0s140 12 210 0v32H0Z" fill="#0B7A91" opacity="0.14" />
            <rect x="60" y="62" width="76" height="86" rx="14" fill="#0B7A91" />
            <path d="M78 62V48a20 20 0 0 1 40 0v14" fill="none" stroke="#0A2A3B" strokeWidth="7" />
            <circle cx="226" cy="104" r="42" fill="none" stroke="#0A2A3B" strokeWidth="10" />
            <circle cx="226" cy="104" r="22" fill="none" stroke="#F2B544" strokeWidth="8" />
            <rect x="300" y="52" width="56" height="96" rx="12" fill="#44585F" />
            <rect x="316" y="30" width="24" height="26" rx="8" fill="#0A2A3B" />
            <path d="M300 96h56" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="5" />
        </svg>
    );
}

export default CategoryTiles;
