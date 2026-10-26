import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw, Store, Phone, MapPin } from 'lucide-react';
import Container from './Container';
import PaymentBadges from './PaymentBadges';

const USPS = [
    { icon: Truck, title: 'Free delivery', body: 'On orders over 2,000 MDL' },
    { icon: ShieldCheck, title: '2-year warranty', body: 'Official dealer, local service' },
    { icon: RotateCcw, title: '14-day returns', body: 'Unused gear, no questions' },
    { icon: Store, title: 'Showroom', body: 'Test before you buy, Chișinău' },
];

const SOCIALS = [
    { name: 'Instagram', short: 'IG' },
    { name: 'Facebook', short: 'FB' },
    { name: 'YouTube', short: 'YT' },
    { name: 'Telegram', short: 'TG' },
];

const COLUMNS = [
    {
        title: 'SHOP',
        links: [
            { label: 'SUP boards', to: '/catalog' },
            { label: 'Paddles', to: '/catalog' },
            { label: 'Wing foiling', to: '/catalog' },
            { label: 'Wetsuits', to: '/catalog' },
            { label: 'Accessories', to: '/catalog' },
            { label: 'Sale', to: '/catalog' },
        ],
    },
    {
        title: 'HELP',
        links: [
            { label: 'Delivery & payment', to: '/contacts' },
            { label: 'Returns in 14 days', to: '/contacts' },
            { label: 'Warranty & service', to: '/contacts' },
            { label: 'How to choose a SUP', to: '/catalog' },
            { label: 'FAQ', to: '/contacts' },
        ],
    },
    {
        title: 'ACCOUNT',
        links: [
            { label: 'Sign in', to: '/login' },
            { label: 'Create account', to: '/register' },
            { label: 'Wishlist', to: '/wishlist' },
            { label: 'Cart', to: '/cart' },
        ],
    },
    {
        title: 'COMPANY',
        links: [
            { label: 'About us', to: '/contacts' },
            { label: 'Showroom', to: '/contacts' },
            { label: 'Contacts', to: '/contacts' },
            { label: 'Terms of sale', to: '/contacts' },
            { label: 'Privacy policy', to: '/contacts' },
        ],
    },
];

const YEAR = new Date().getFullYear();

function Footer({ showUsps = true }) {
    return (
        <>
            {showUsps && (
                <section className="border-t border-line bg-surface-100">
                    <Container className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
                        {USPS.map(usp => {
                            const Icon = usp.icon;
                            return (
                                <div key={usp.title} className="flex items-start gap-3.5">
                                    <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-white text-brand-600">
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
            )}

            <footer className="bg-deep-900 text-deep-text">
                <Container className="flex flex-wrap gap-10 pb-9 pt-14">
                    <div className="min-w-0 flex-[1_1_300px]">
                        <p className="mb-[18px] text-[22px] font-extrabold leading-none text-white">
                            SUP <span className="text-deep-accent">SHOP</span>
                            <span className="mt-[7px] block text-[9px] tracking-[0.26em] text-deep-muted">MOLDOVA</span>
                        </p>
                        <p className="mb-[22px] max-w-[310px] text-sm leading-[1.65] text-deep-muted">
                            Paddleboards, paddles and watersports gear for Moldova. Showroom and test centre in Chișinău.
                        </p>

                        <p className="mb-2.5 flex items-center gap-2.5 text-[15px] font-bold text-white">
                            <Phone size={17} strokeWidth={1.8} className="text-deep-accent" />
                            <a href="tel:+37368820853">+373 688 20 853</a>
                        </p>
                        <p className="mb-[22px] flex items-start gap-2.5 text-sm leading-[1.5]">
                            <MapPin size={17} strokeWidth={1.8} className="mt-0.5 flex-none text-deep-accent" />
                            <span>Chișinău, Moldova</span>
                        </p>

                        <p className="flex gap-2.5">
                            {SOCIALS.map(social => (
                                <a
                                    key={social.name}
                                    href="#"
                                    aria-label={social.name}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-deep-border text-[13px] font-bold hover:text-white"
                                >
                                    {social.short}
                                </a>
                            ))}
                        </p>
                    </div>

                    {COLUMNS.map(column => (
                        <nav key={column.title} aria-label={column.title} className="min-w-0 flex-[1_1_170px]">
                            <p className="mb-4 text-[13px] font-bold tracking-[0.1em] text-white">{column.title}</p>
                            {column.links.map(link => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="block py-[7px] text-sm leading-[1.5] hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    ))}

                    <div className="min-w-0 flex-[1_1_260px]">
                        <p className="mb-4 text-[13px] font-bold tracking-[0.1em] text-white">NEWSLETTER</p>
                        <p className="mb-3.5 text-sm leading-[1.6] text-deep-muted">
                            New arrivals and race dates, once a month.
                        </p>
                        <form className="flex flex-col gap-2.5" onSubmit={e => e.preventDefault()}>
                            <label htmlFor="footer-email" className="text-[13px] font-semibold">
                                Email address
                            </label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="your@email.com"
                                className="h-12 rounded-full border border-deep-border bg-deep-input px-5 text-sm text-white outline-none focus:border-deep-accent"
                            />
                            <button
                                type="submit"
                                className="h-12 rounded-full bg-brand-600 text-[15px] font-bold text-white hover:bg-brand-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </Container>

                <div className="border-t border-deep-line">
                    <Container className="flex flex-wrap items-center justify-between gap-x-7 gap-y-4 py-[22px]">
                        <p className="text-[13px] leading-[1.6] text-deep-muted">
                            © {YEAR} SUP Shop Moldova · Chișinău
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="mr-1 text-xs text-deep-muted">We accept</span>
                            <PaymentBadges />
                        </div>
                    </Container>
                </div>
            </footer>
        </>
    );
}

export default Footer;
