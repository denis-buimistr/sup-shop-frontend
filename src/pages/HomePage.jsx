import { Link } from 'react-router-dom';
import { Percent, Truck, Headphones, Store } from 'lucide-react';
import Container from '../components/Container';
import HeroSlider from '../components/home/HeroSlider';
import CategoryTiles from '../components/home/CategoryTiles';
import { FeaturedProduct, ProductRow, SectionHead, WaveDivider } from '../components/home/HomeSections';
import { useBrands } from '../hooks/useCatalogData';
import showroomPhoto from '../assets/hero/showroom.webp';
import { BRAND_LOGOS } from '../data/brandLogos';
import finderGoal from '../assets/finder/goal.jpg';
import finderWater from '../assets/finder/water.jpg';
import finderFit from '../assets/finder/fit.jpg';

const SERVICES = [
    { icon: Percent, title: 'Pay on delivery', body: 'Cash or card to the courier' },
    { icon: Truck, title: 'Free delivery', body: 'Orders over 2,000 MDL' },
    { icon: Headphones, title: 'Advice that helps', body: 'Mon–Sat, we answer in an hour' },
    { icon: Store, title: 'Showroom', body: 'Try the board in Chișinău' },
];

// каждая плитка ведёт туда, где этот вопрос реально решается
const FINDER_STEPS = [
    { title: 'Your goal', body: 'Cruise, explore, or race', photo: finderGoal, to: '/catalog/touring-race' },
    { title: 'Your water', body: 'Lake, river, or ocean', photo: finderWater, to: '/catalog/inflatable-boards' },
    { title: 'Your fit', body: 'Stability, speed, or balance', photo: finderFit, to: '/catalog/sup' },
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
                    <Container className="grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-5 py-[26px] sm:flex sm:flex-wrap sm:justify-between sm:gap-x-9">
                        <p className="col-span-3 justify-self-start text-xs font-bold tracking-[0.14em] text-ink-400 sm:col-auto">OFFICIAL DEALER</p>
                        {brands.map(brand => (
                            <Link
                                key={brand.id}
                                to={`/catalog?brand=${brand.id}`}
                                aria-label={brand.name}
                                className="flex h-10 w-full max-w-[150px] items-center justify-center opacity-90 transition hover:scale-105 hover:opacity-100 sm:h-12 sm:w-[150px]"
                            >
                                {BRAND_LOGOS[brand.name] ? (
                                    <img src={BRAND_LOGOS[brand.name]} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                ) : (
                                    <span className="text-[17px] font-extrabold uppercase tracking-[0.02em] text-ink-600">{brand.name}</span>
                                )}
                            </Link>
                        ))}
                        <Link to="/catalog" className="col-span-3 justify-self-start text-sm font-bold text-brand-600 hover:text-brand-700 sm:col-auto">All products →</Link>
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
                    <div className="relative min-h-[320px] min-w-0 flex-[1_1_400px] self-stretch bg-deep-800">
                        {/* фото вертикальное, поэтому держу в кадре середину с человеком и доской */}
                        <img
                            src={showroomPhoto}
                            alt="A paddler with an inflatable board, pump and backpack on the beach"
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{ objectPosition: '50% 45%' }}
                        />
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
                <SectionHead eyebrow="BOARD FINDER" title="Three questions, three boards that fit" link="/contacts" linkLabel="Ask for a shortlist →" />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {FINDER_STEPS.map(step => (
                        <Link key={step.title} to={step.to} className="group relative block aspect-[642/560] overflow-hidden rounded-3xl bg-deep-900">
                            <img src={step.photo} alt="" className="absolute inset-x-0 top-0 h-[72%] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(to bottom, rgba(7,43,54,0) 40%, rgba(9,58,72,0.85) 62%, #072B36 80%)' }}
                            />
                            <span className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6 text-center">
                                <span className="text-[30px] font-extrabold uppercase leading-none tracking-[0.04em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] lg:text-[36px]">
                                    {step.title}
                                </span>
                                <span className="mb-4 mt-2.5 text-base text-white/90">{step.body}</span>
                                <span className="inline-flex rounded-full border-2 border-deep-accent px-7 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors group-hover:bg-deep-accent group-hover:text-ink-900">
                                    Find your board
                                </span>
                            </span>
                        </Link>
                    ))}
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

export default HomePage;
