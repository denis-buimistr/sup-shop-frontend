import { Link } from 'react-router-dom';
import { Percent, Truck, Headphones, Store } from 'lucide-react';
import Container from '../components/Container';
import HeroSlider from '../components/home/HeroSlider';
import CategoryTiles from '../components/home/CategoryTiles';
import { FeaturedProduct, ProductRow, SectionHead, WaveDivider } from '../components/home/HomeSections';
import { useBrands } from '../hooks/useCatalogData';

const SERVICES = [
    { icon: Percent, title: 'Pay on delivery', body: 'Cash or card to the courier' },
    { icon: Truck, title: 'Free delivery', body: 'Orders over 2,000 MDL' },
    { icon: Headphones, title: 'Advice that helps', body: 'Mon–Sat, we answer in an hour' },
    { icon: Store, title: 'Showroom', body: 'Try the board in Chișinău' },
];

const FINDER_STEPS = [
    { title: '1 · Your goal', body: 'Fitness, touring, racing or a family afternoon on the lake.', Art: GoalArt },
    { title: '2 · Your water', body: 'Flat lake, river current, or open water with real chop.', Art: WaterArt },
    { title: '3 · Your fit', body: 'Volume matched to your weight, width matched to your balance.', Art: FitArt },
];

function HomePage() {
    const brands = useBrands();

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="grid grid-cols-2 gap-x-4 gap-y-4 py-[18px] lg:grid-cols-4">
                    {SERVICES.map(({ icon: Icon, title, body }) => (
                        <div key={title} className="flex items-center gap-[13px]">
                            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-brand-600">
                                <Icon size={18} strokeWidth={2} />
                            </span>
                            <span>
                                <span className="block text-sm font-bold text-ink-900">{title}</span>
                                <span className="mt-px hidden text-[13px] text-ink-400 sm:block">{body}</span>
                            </span>
                        </div>
                    ))}
                </Container>
            </section>

            <HeroSlider />

            {brands?.length > 0 && (
                <section className="border-b border-line">
                    <Container className="flex flex-wrap items-center justify-between gap-x-9 gap-y-5 py-[26px]">
                        <p className="text-xs font-bold tracking-[0.14em] text-ink-400">OFFICIAL DEALER</p>
                        {brands.map(brand => (
                            <Link key={brand.id} to={`/catalog?brand=${brand.id}`} className="text-[17px] font-extrabold uppercase tracking-[0.02em] text-ink-600 hover:text-brand-600">
                                {brand.name}
                            </Link>
                        ))}
                        <Link to="/catalog" className="text-sm font-bold text-brand-600 hover:text-brand-700">All products →</Link>
                    </Container>
                </section>
            )}

            <Container as="section" className="pt-16">
                <SectionHead eyebrow="EVERYTHING FOR THE WATER" title="Shop by category" link="/catalog" linkLabel="View the full catalog →" />
                <CategoryTiles />
            </Container>

            <Container className="mt-14"><WaveDivider /></Container>

            <Container className="pt-12">
                <ProductRow category="touring-race" eyebrow="FOR DISTANCE AND SPEED" title="Race & touring boards" />
            </Container>

            <Container as="section" className="pt-16">
                <div className="flex flex-wrap items-center overflow-hidden rounded-[28px] bg-deep-900">
                    <div className="min-w-0 flex-[999_1_420px] px-6 py-14 sm:px-12">
                        <p className="mb-3.5 inline-flex rounded-full bg-sun px-4 py-2 text-xs font-bold tracking-[0.16em] text-ink-900">TRY BEFORE YOU BUY</p>
                        <h2 className="mb-[18px] text-[34px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white sm:text-[42px]">
                            Paddle a few boards before you pick one
                        </h2>
                        <p className="mb-7 max-w-[470px] text-[17px] leading-[1.65] text-deep-text">
                            Come to the showroom in Chișinău, tell us where you paddle, and we'll show you the shapes that make sense for you.
                        </p>
                        <div className="flex flex-wrap gap-3.5">
                            <Link to="/contacts" className="inline-flex rounded-full bg-sun px-8 py-[17px] text-base font-bold text-ink-900 hover:brightness-95">
                                Visit the showroom
                            </Link>
                            <Link to="/catalog/sup" className="inline-flex rounded-full border-[1.5px] border-[#5A7E88] px-[30px] py-4 text-base font-bold text-white hover:border-white">
                                Browse SUP boards
                            </Link>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-[1_1_400px] items-end self-stretch bg-deep-800">
                        <JettyArt />
                    </div>
                </div>
            </Container>

            <Container className="pt-16">
                <ProductRow category="inflatable-boards" eyebrow="PACK IT, PUMP IT, PADDLE IT" title="Inflatable & allround" />
            </Container>

            <div className="mt-16">
                <FeaturedProduct slug="starboard-all-star-14-0-x-23" />
            </div>

            <Container as="section" className="pt-16">
                <div className="flex flex-wrap items-center gap-11">
                    <div className="min-w-0 flex-[1_1_320px]">
                        <p className="mb-2.5 text-xs font-bold tracking-[0.16em] text-brand-600">BOARD FINDER</p>
                        <h2 className="mb-4 text-[30px] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink-900 sm:text-[34px]">
                            Three questions, three boards that fit
                        </h2>
                        <p className="mb-[26px] text-base leading-[1.65] text-ink-600">
                            Weight, water and what you want from the season. Tell us that and we'll shortlist boards you can actually choose from.
                        </p>
                        <Link to="/contacts" className="inline-flex rounded-full bg-brand-600 px-[30px] py-4 text-base font-bold text-white hover:bg-brand-700">
                            Ask for a shortlist
                        </Link>
                    </div>
                    <div className="grid min-w-0 flex-[999_1_540px] grid-cols-1 gap-[18px] sm:grid-cols-3">
                        {FINDER_STEPS.map(({ title, body, Art }) => (
                            <div key={title} className="rounded-[22px] border border-line bg-surface-50 p-6">
                                <Art />
                                <p className="mb-1.5 text-[17px] font-bold text-ink-900">{title}</p>
                                <p className="text-sm leading-[1.55] text-ink-400">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <Container as="section" className="py-16">
                <div className="relative flex flex-wrap items-center gap-9 overflow-hidden rounded-[28px] bg-surface-100 p-6 sm:p-11">
                    <div className="relative z-[2] min-w-0 flex-[999_1_380px]">
                        <h2 className="mb-2.5 text-[28px] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-[30px]">
                            New arrivals, race dates, honest advice
                        </h2>
                        <p className="text-base leading-[1.6] text-ink-600">One email a month. No spam, unsubscribe in a click.</p>
                    </div>
                    <form className="relative z-[2] flex min-w-0 flex-[1_1_380px] flex-wrap gap-3" onSubmit={e => e.preventDefault()}>
                        <label htmlFor="news-email" className="sr-only">Email address</label>
                        <input
                            id="news-email"
                            type="email"
                            placeholder="your@email.com"
                            className="h-[54px] min-w-0 flex-[999_1_220px] rounded-full border border-line-divider bg-white px-6 text-[15px] text-ink-900 outline-none focus:border-brand-600"
                        />
                        <button type="submit" className="h-[54px] flex-[1_1_150px] rounded-full bg-brand-600 text-base font-bold text-white hover:bg-brand-700">
                            Subscribe
                        </button>
                    </form>
                    <svg viewBox="0 0 300 120" className="absolute -bottom-5 -right-2.5 h-[120px] w-[300px] opacity-35" aria-hidden="true">
                        <path d="M0 60c30 0 30 14 60 14s30-14 60-14 30 14 60 14 30-14 60-14 30 14 60 14" fill="none" stroke="#0B7A91" strokeWidth="5" strokeLinecap="round" />
                        <path d="M0 92c30 0 30 14 60 14s30-14 60-14 30 14 60 14 30-14 60-14 30 14 60 14" fill="none" stroke="#7FC6D6" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                </div>
            </Container>
        </>
    );
}

function JettyArt() {
    return (
        <svg viewBox="0 0 520 380" className="block h-auto w-full" role="img" aria-label="Three paddleboards on a jetty by a lake">
            <circle cx="408" cy="80" r="46" fill="#F2B544" />
            <path d="M0 180c60-30 110-32 164-12s100 26 158 6 144-26 198 16v190H0Z" fill="#0E4B5A" />
            <path d="M0 236h520v144H0Z" fill="#0B6475" />
            <path d="M0 236c48 0 48 14 96 14s48-14 96-14 48 14 96 14 48-14 96-14 48 14 96 14 40-14 40-14v144H0Z" fill="#0E7E93" />
            <path d="M0 306c44 0 44 12 88 12s44-12 88-12 44 12 88 12 44-12 88-12 44 12 88 12 80-12 80-12v62H0Z" fill="#13A0B4" opacity="0.65" />
            <rect x="40" y="252" width="440" height="16" rx="6" fill="#0A2A3B" opacity="0.65" />
            <rect x="74" y="266" width="12" height="60" fill="#0A2A3B" opacity="0.5" />
            <rect x="262" y="266" width="12" height="60" fill="#0A2A3B" opacity="0.5" />
            <rect x="428" y="266" width="12" height="60" fill="#0A2A3B" opacity="0.5" />
            <path d="M58 220c0 0 36-18 98-18s98 18 98 18-36 18-98 18-98-18-98-18Z" fill="#5EC4CD" />
            <path d="M58 220c0 0 20-10 42-14l6 14-6 14c-22-4-42-14-42-14Z" fill="#C62B12" />
            <path d="M268 220c0 0 32-16 88-16s88 16 88 16-32 16-88 16-88-16-88-16Z" fill="#F2B544" />
            <path d="M268 220c0 0 18-9 38-12l5 12-5 12c-20-3-38-12-38-12Z" fill="#0A2A3B" opacity="0.6" />
            <g fill="#0A2A3B">
                <circle cx="186" cy="150" r="13" />
                <path d="M186 166c12 0 20 8 21 19l3 27-8 1-4-20-3 20-4 22h-10l3-24-4-26c0-11 6-19 6-19Z" />
                <path d="M232 128 152 250" stroke="#0A2A3B" strokeWidth="6" strokeLinecap="round" />
                <path d="M146 242h20l-9 28c-7-2-12-9-14-19Z" />
            </g>
            <path d="M100 142c7-7 14-7 21 0m7 0c7-7 14-7 21 0" fill="none" stroke="#9FD9E6" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

const stepArtClass = 'mb-4 block h-auto w-full';

function GoalArt() {
    return (
        <svg viewBox="0 0 120 90" className={stepArtClass} aria-hidden="true">
            <circle cx="60" cy="46" r="34" fill="none" stroke="#0B7A91" strokeWidth="7" />
            <path d="M60 46 78 28" stroke="#0A2A3B" strokeWidth="7" strokeLinecap="round" />
            <circle cx="60" cy="46" r="5" fill="#0A2A3B" />
            <path d="M60 8v8M98 46h8M14 46h8" stroke="#F2B544" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

function WaterArt() {
    return (
        <svg viewBox="0 0 120 90" className={stepArtClass} aria-hidden="true">
            <path d="M6 34c18 0 18 10 36 10s18-10 36-10 18 10 36 10" fill="none" stroke="#7FC6D6" strokeWidth="7" strokeLinecap="round" />
            <path d="M6 54c18 0 18 10 36 10s18-10 36-10 18 10 36 10" fill="none" stroke="#0B7A91" strokeWidth="7" strokeLinecap="round" />
            <path d="M6 74c18 0 18 10 36 10s18-10 36-10 18 10 36 10" fill="none" stroke="#0A2A3B" strokeWidth="7" strokeLinecap="round" />
            <circle cx="92" cy="16" r="11" fill="#F2B544" />
        </svg>
    );
}

function FitArt() {
    return (
        <svg viewBox="0 0 120 90" className={stepArtClass} aria-hidden="true">
            <rect x="12" y="40" width="96" height="16" rx="8" fill="#0B7A91" />
            <rect x="12" y="24" width="30" height="48" rx="10" fill="#0A2A3B" />
            <rect x="78" y="24" width="30" height="48" rx="10" fill="#0A2A3B" />
            <rect x="46" y="32" width="28" height="32" rx="8" fill="#F2B544" />
        </svg>
    );
}

export default HomePage;
