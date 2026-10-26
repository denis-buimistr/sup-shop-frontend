import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, Store } from 'lucide-react';
import api from '../api/client';
import Container from '../components/Container';
import ProductCard, { BoardPlaceholder } from '../components/ProductCard';

const HERO_STATS = [
    { value: '1–3 days', label: 'Delivery across Moldova' },
    { value: '2 years', label: 'Official warranty' },
    { value: '14 days', label: 'To return unused gear' },
];

const USPS = [
    { icon: Truck, title: 'Free delivery', body: 'On orders over 2,000 MDL' },
    { icon: ShieldCheck, title: '2-year warranty', body: 'Official dealer, local service' },
    { icon: Headphones, title: 'Expert support', body: 'Advice from real paddlers' },
    { icon: Store, title: 'Showroom', body: 'Test before you buy, Chișinău' },
];

const CATEGORIES = ['SUP boards', 'Paddles', 'Wing foiling', 'Kitesurf', 'Wetsuits', 'Accessories'];

const STEPS = [
    { title: 'Set your goal', body: 'Training, long-distance touring or competition.' },
    { title: 'Pick your water', body: 'Flat lake, river or open, choppy conditions.' },
    { title: 'Find the right fit', body: 'Width and volume matched to your weight.' },
];

const BRANDS = ['STARBOARD', 'SIC', 'INFINITY', 'FANATIC', 'NSP', 'ONE', 'RED PADDLE CO'];

function SectionHead({ title, body, link, linkLabel }) {
    return (
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h2 className="mb-2 text-[34px] font-extrabold tracking-[-0.02em] text-ink-900">{title}</h2>
                <p className="text-base text-ink-600">{body}</p>
            </div>
            <Link to={link} className="text-[15px] font-bold text-brand-600 hover:text-brand-700">
                {linkLabel}
            </Link>
        </div>
    );
}

function HomePage() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        api.get('/products', { params: { size: 4 } })
            .then(response => setFeatured(response.data.content))
            .catch(() => setFeatured([]));
    }, []);

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="flex flex-wrap items-center gap-12 py-6">
                    <div className="min-w-0 flex-[999_1_440px] py-10">
                        <p className="mb-4 text-[13px] font-bold tracking-[0.18em] text-ink-400">
                            SPEED / ENDURANCE / PERFORMANCE
                        </p>
                        <h1 className="mb-5 text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 sm:text-[62px]">
                            Everything you need to get on the water
                        </h1>
                        <p className="mb-8 max-w-[520px] text-lg leading-[1.6] text-ink-600">
                            Inflatable and hard boards, paddles, wings and wetsuits from the brands that actually win races —
                            stocked in Chișinău, delivered across Moldova.
                        </p>
                        <div className="flex flex-wrap gap-3.5">
                            <Link
                                to="/catalog"
                                className="inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-8 py-[17px] text-base font-bold text-white hover:bg-brand-700"
                            >
                                Shop all boards →
                            </Link>
                            <Link
                                to="/catalog"
                                className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-ink-900 bg-white px-[30px] py-4 text-base font-bold text-ink-900 hover:bg-surface-50"
                            >
                                How to choose
                            </Link>
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
                        <div className="flex h-[320px] flex-col items-center justify-center gap-3.5 rounded-[22px] border border-line-strong bg-surface-200">
                            <BoardPlaceholder width={260} />
                            <p className="text-[13px] font-semibold tracking-[0.08em] text-ink-600">[HERO PHOTO]</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {HERO_STATS.map(stat => (
                                <div key={stat.label} className="rounded-2xl border border-line bg-white p-4">
                                    <p className="mb-1 text-2xl font-extrabold text-ink-900">{stat.value}</p>
                                    <p className="text-[13px] leading-[1.4] text-ink-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section className="border-b border-line">
                <Container className="grid grid-cols-1 gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
                    {USPS.map(usp => {
                        const Icon = usp.icon;
                        return (
                            <div key={usp.title} className="flex items-start gap-3.5">
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-100 text-brand-600">
                                    <Icon size={20} strokeWidth={1.8} />
                                </span>
                                <span>
                                    <span className="block text-[15px] font-bold text-ink-900">{usp.title}</span>
                                    <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-400">{usp.body}</span>
                                </span>
                            </div>
                        );
                    })}
                </Container>
            </section>

            <Container as="section" className="pt-16">
                <SectionHead
                    title="Shop by category"
                    body="Everything tested by our team before it reaches the shelf."
                    link="/catalog"
                    linkLabel="View the full catalog →"
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map(name => (
                        <Link
                            key={name}
                            to="/catalog"
                            className="group block overflow-hidden rounded-[22px] border border-line bg-white hover:border-line-strong"
                        >
                            <span className="flex h-[150px] items-center justify-center bg-surface-100">
                                <BoardPlaceholder width={190} />
                            </span>
                            <span className="block px-5 pb-5 pt-[18px] text-lg font-bold text-ink-900 group-hover:text-brand-600">
                                {name}
                            </span>
                        </Link>
                    ))}
                </div>
            </Container>

            {featured.length > 0 && (
                <Container as="section" className="pt-16">
                    <SectionHead
                        title="Featured this season"
                        body="Top race and allround SUP boards from the world's leading brands."
                        link="/catalog"
                        linkLabel="View all paddleboards →"
                    />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {featured.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </Container>
            )}

            <Container as="section" className="pt-16">
                <div className="flex flex-wrap items-center overflow-hidden rounded-[26px] bg-deep-900">
                    <div className="min-w-0 flex-[999_1_420px] px-6 py-14 sm:px-12">
                        <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-sun">RACE COLLECTION</p>
                        <h2 className="mb-4 text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
                            Built for distance, tuned for speed
                        </h2>
                        <p className="mb-7 max-w-[480px] text-[17px] leading-[1.6] text-deep-text">
                            14'0" race shapes in stock in Chișinău — come and test one before you buy.
                        </p>
                        <div className="flex flex-wrap gap-3.5">
                            <Link to="/catalog" className="inline-flex rounded-full bg-sun px-[30px] py-4 text-base font-bold text-ink-900 hover:brightness-95">
                                Shop race boards
                            </Link>
                            <Link
                                to="/contacts"
                                className="inline-flex rounded-full border-[1.5px] border-[#5A7E88] px-7 py-[15px] text-base font-bold text-white hover:border-white"
                            >
                                Book a test paddle
                            </Link>
                        </div>
                    </div>
                    <div className="flex min-h-[300px] min-w-0 flex-[1_1_360px] flex-col items-center justify-center gap-3 self-stretch bg-deep-800">
                        <BoardPlaceholder width={280} />
                        <p className="text-[13px] font-semibold tracking-[0.08em] text-brand-light">[LIFESTYLE PHOTO]</p>
                    </div>
                </div>
            </Container>

            <Container as="section" className="pt-16">
                <div className="flex flex-wrap gap-10 rounded-[26px] border border-line bg-surface-50 p-6 sm:p-11">
                    <div className="min-w-0 flex-[1_1_300px]">
                        <h2 className="mb-3 text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink-900">
                            Not sure which board is yours?
                        </h2>
                        <p className="mb-6 text-base leading-[1.6] text-ink-600">
                            Tell us your weight, your water and your plans for the season — we'll shortlist the boards that fit.
                        </p>
                        <Link to="/contacts" className="inline-flex rounded-full bg-brand-600 px-7 py-[15px] text-[15px] font-bold text-white hover:bg-brand-700">
                            Ask an expert
                        </Link>
                    </div>
                    <div className="grid min-w-0 flex-[999_1_460px] grid-cols-1 gap-4 sm:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div key={step.title} className="rounded-[18px] border border-line bg-white p-[22px]">
                                <p className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-deep-900 text-sm font-bold text-white">
                                    {i + 1}
                                </p>
                                <p className="mb-1.5 text-base font-bold text-ink-900">{step.title}</p>
                                <p className="text-sm leading-[1.55] text-ink-400">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <Container as="section" className="pt-14">
                <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-y border-line py-7">
                    <p className="text-xs font-bold tracking-[0.12em] text-ink-400">OFFICIAL DEALER</p>
                    {BRANDS.map(brand => (
                        <span key={brand} className="text-[17px] font-extrabold tracking-[0.02em] text-ink-600">{brand}</span>
                    ))}
                </div>
            </Container>

            <Container as="section" className="py-16">
                <div className="flex flex-wrap items-center gap-8 rounded-[26px] bg-surface-100 p-6 sm:p-11">
                    <div className="min-w-0 flex-[999_1_380px]">
                        <h2 className="mb-2.5 text-[28px] font-extrabold tracking-[-0.02em] text-ink-900">
                            New arrivals, race dates, honest advice
                        </h2>
                        <p className="text-[15px] leading-[1.6] text-ink-600">One email a month. No spam, unsubscribe in a click.</p>
                    </div>
                    <form className="flex min-w-0 flex-[1_1_380px] flex-wrap gap-3" onSubmit={e => e.preventDefault()}>
                        <label htmlFor="news-email" className="sr-only">Email address</label>
                        <input
                            id="news-email"
                            type="email"
                            placeholder="your@email.com"
                            className="h-[52px] min-w-0 flex-[999_1_220px] rounded-full border border-line-divider bg-white px-[22px] text-[15px] text-ink-900 outline-none focus:border-brand-600"
                        />
                        <button type="submit" className="h-[52px] flex-[1_1_140px] rounded-full bg-brand-600 text-[15px] font-bold text-white hover:bg-brand-700">
                            Subscribe
                        </button>
                    </form>
                </div>
            </Container>
        </>
    );
}

export default HomePage;
