import { Link } from '../i18n/routing';
import { Truck, ShieldCheck, RotateCcw, Store, Phone, MapPin } from 'lucide-react';
import Container from './Container';
import PaymentBadges from './PaymentBadges';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';

const USPS = [
    { icon: Truck, key: 'delivery' },
    { icon: ShieldCheck, key: 'warranty' },
    { icon: RotateCcw, key: 'returns' },
    { icon: Store, key: 'showroom' },
];

const SOCIALS = [
    { name: 'Instagram', short: 'IG' },
    { name: 'Facebook', short: 'FB' },
    { name: 'YouTube', short: 'YT' },
    { name: 'Telegram', short: 'TG' },
];

// подписи ссылок лежат в footer.links.* в файлах переводов
const COLUMNS = [
    {
        key: 'shop',
        links: [
            { key: 'supBoards', to: '/catalog/sup' },
            { key: 'paddles', to: '/catalog/paddles' },
            { key: 'wingFoiling', to: '/catalog/foil-wing' },
            { key: 'wetsuits', to: '/catalog/wetsuits' },
            { key: 'accessories', to: '/catalog/accessories' },
            { key: 'sale', to: '/catalog?onSale=true' },
        ],
    },
    {
        key: 'help',
        links: [
            { key: 'delivery', to: '/contacts' },
            { key: 'returns', to: '/contacts' },
            { key: 'warranty', to: '/contacts' },
            { key: 'howToChoose', to: '/catalog/sup' },
            { key: 'faq', to: '/contacts' },
        ],
    },
    {
        key: 'account',
        links: [
            { key: 'signIn', to: '/login' },
            { key: 'createAccount', to: '/register' },
            { key: 'wishlist', to: '/wishlist' },
            { key: 'cart', to: '/cart' },
        ],
    },
    {
        key: 'company',
        links: [
            { key: 'about', to: '/contacts' },
            { key: 'showroom', to: '/contacts' },
            { key: 'contacts', to: '/contacts' },
            { key: 'terms', to: '/contacts' },
            { key: 'privacy', to: '/contacts' },
        ],
    },
];

const YEAR = new Date().getFullYear();

function Footer({ showUsps = true }) {
    const { t } = useTranslation();

    return (
        <>
            {showUsps && (
                <section className="border-t border-line bg-surface-100">
                    <Container className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
                        {USPS.map(usp => {
                            const Icon = usp.icon;
                            return (
                                <div key={usp.key} className="flex items-start gap-3.5">
                                    <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-white text-brand-600">
                                        <Icon size={20} strokeWidth={1.8} />
                                    </span>
                                    <span>
                                        <span className="block text-[15px] font-bold text-ink-900">{t(`footer.usp.${usp.key}.title`)}</span>
                                        <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-400">{t(`footer.usp.${usp.key}.body`)}</span>
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
                        {/* логотип тёмный на белом фоне, поэтому на тёмном футере кладу его на белую плашку */}
                        <div className="mb-[18px] inline-flex rounded-2xl bg-white px-4 py-2.5">
                            <Logo />
                        </div>
                        <p className="mb-[22px] max-w-[310px] text-sm leading-[1.65] text-deep-muted">
                            {t('footer.about')}
                        </p>

                        <p className="mb-2.5 flex items-center gap-2.5 text-[15px] font-bold text-white">
                            <Phone size={17} strokeWidth={1.8} className="text-deep-accent" />
                            <a href="tel:+37368820853">+373 688 20 853</a>
                        </p>
                        <p className="mb-[22px] flex items-start gap-2.5 text-sm leading-[1.5]">
                            <MapPin size={17} strokeWidth={1.8} className="mt-0.5 flex-none text-deep-accent" />
                            <span>{t('footer.city')}</span>
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
                        <nav key={column.key} aria-label={t(`footer.columns.${column.key}`)} className="min-w-0 flex-[1_1_170px]">
                            <p className="mb-4 text-[13px] font-bold tracking-[0.1em] text-white">{t(`footer.columns.${column.key}`)}</p>
                            {column.links.map(link => (
                                <Link
                                    key={link.key}
                                    to={link.to}
                                    className="block py-[7px] text-sm leading-[1.5] hover:text-white"
                                >
                                    {t(`footer.links.${link.key}`)}
                                </Link>
                            ))}
                        </nav>
                    ))}

                    <div className="min-w-0 flex-[1_1_260px]">
                        <p className="mb-4 text-[13px] font-bold tracking-[0.1em] text-white">{t('footer.newsletter')}</p>
                        <p className="mb-3.5 text-sm leading-[1.6] text-deep-muted">
                            {t('footer.newsletterText')}
                        </p>
                        <form className="flex flex-col gap-2.5" onSubmit={e => e.preventDefault()}>
                            <label htmlFor="footer-email" className="text-[13px] font-semibold">
                                {t('footer.email')}
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
                                {t('footer.subscribe')}
                            </button>
                        </form>
                    </div>
                </Container>

                <div className="border-t border-deep-line">
                    <Container className="flex flex-wrap items-center justify-between gap-x-7 gap-y-4 py-[22px]">
                        <p className="text-[13px] leading-[1.6] text-deep-muted">
                            {t('footer.copyright', { year: YEAR })}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="mr-1 text-xs text-deep-muted">{t('footer.weAccept')}</span>
                            <PaymentBadges />
                        </div>
                    </Container>
                </div>
            </footer>
        </>
    );
}

export default Footer;
