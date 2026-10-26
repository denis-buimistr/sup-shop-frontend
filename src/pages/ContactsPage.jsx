import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Container from '../components/Container';
import { PHONE, PHONE_HREF, SHOWROOM, SHOWROOM_POSTCODE, EMAILS, MESSENGERS, SHOWROOM_HOURS } from '../data/contacts';

const TOPICS = [
    'Help me choose a board',
    'Question about an order',
    'Delivery and payment',
    'Warranty or repair',
    'Rental and demo days',
    'Wholesale and clubs',
];

const FAQS = [
    { q: 'How long does delivery take?', a: 'Chișinău — next working day. Across Moldova — 1 to 3 working days with the courier. Free over 2,000 MDL.' },
    { q: 'Can I pay on delivery?', a: 'Yes. Cash or card to the courier on delivery, or a bank transfer for companies.' },
    { q: 'Can I test a board before buying?', a: 'Yes — book a slot at the showroom or join a demo day on Lake Ghidighici from May to September.' },
    { q: 'What if the board does not suit me?', a: '14 days to return unused gear in its original packaging. Warranty claims are handled locally, no shipping abroad.' },
];

// Реквизитов пока нет — оставляем плейсхолдеры из макета, а не выдумываем номера
const LEGAL = [
    { k: 'Legal name', v: 'SUP Shop Moldova SRL' },
    { k: 'IDNO', v: '[COMPANY NUMBER]' },
    { k: 'VAT code', v: '[VAT CODE]' },
    { k: 'Legal address', v: `${SHOWROOM}, MD-2005` },
    { k: 'Bank', v: '[BANK NAME], IBAN [IBAN]' },
];

const MAP_QUERY = encodeURIComponent(`${SHOWROOM}, Moldova`);

const fieldClass =
    'w-full rounded-lg border border-line-input px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

// «Open now · closes 19:00» на плашке карты считаем по часам шоурума и времени в браузере
function getShowroomStatus(now = new Date()) {
    const today = SHOWROOM_HOURS[now.getDay()];
    const hour = now.getHours() + now.getMinutes() / 60;
    if (today && hour >= today[0] && hour < today[1]) return `Open now · closes ${today[1]}:00`;
    return 'Closed now';
}

function ContactCard({ icon: Icon, title, children }) {
    return (
        <div className="rounded-[22px] border border-line bg-white p-7">
            <span className="mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-full bg-surface-100 text-brand-600">
                <Icon size={22} strokeWidth={1.8} />
            </span>
            <h2 className="mb-2.5 text-xl font-extrabold">{title}</h2>
            {children}
        </div>
    );
}

function ContactsPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', topic: TOPICS[0], message: '' });
    const [sent, setSent] = useState(false);

    function update(field) {
        return e => setForm(current => ({ ...current, [field]: e.target.value }));
    }

    // Эндпоинта для сообщений на бэкенде нет, поэтому собираем письмо и открываем почтовый клиент
    function handleSubmit(e) {
        e.preventDefault();
        const body = [
            form.message.trim(),
            '',
            `${form.name.trim()} · ${form.phone.trim()} · ${form.email.trim()}`,
        ].join('\n');
        window.location.href =
            `mailto:${EMAILS[0].address}?subject=${encodeURIComponent(form.topic)}&body=${encodeURIComponent(body)}`;
        setSent(true);
    }

    return (
        <>
            <section className="border-b border-line bg-surface-100">
                <Container className="pb-9 pt-7">
                    <nav aria-label="Breadcrumb" className="mb-[18px] text-[13px] text-ink-400">
                        <Link to="/" className="text-ink-400 hover:text-brand-600">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-ink-900">Contacts</span>
                    </nav>
                    <h1 className="mb-3 text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">Talk to real paddlers</h1>
                    <p className="max-w-[680px] text-[17px] leading-[1.6] text-ink-600">
                        Call, write or come to the showroom. We answer within one working hour, Monday to Saturday.
                    </p>
                </Container>
            </section>

            <Container as="section" className="pt-10">
                <div className="grid gap-5 md:grid-cols-3">
                    <ContactCard icon={Phone} title="Call us">
                        <p className="mb-1.5">
                            <a href={PHONE_HREF} className="text-[22px] font-extrabold text-ink-900 hover:text-brand-600">{PHONE}</a>
                        </p>
                        <p className="mb-4 text-sm leading-[1.6] text-ink-400">
                            Mon–Sat 10:00–19:00, Sun closed.<br />Also on WhatsApp, Viber and Telegram.
                        </p>
                        <p className="flex flex-wrap gap-2">
                            {MESSENGERS.map(m => (
                                <a
                                    key={m.name}
                                    href={m.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex rounded-full border border-line px-3.5 py-2 text-[13px] font-semibold text-ink-900 hover:border-brand-600"
                                >
                                    {m.name}
                                </a>
                            ))}
                        </p>
                    </ContactCard>

                    <ContactCard icon={Mail} title="Write to us">
                        {EMAILS.map(e => (
                            <p key={e.address} className="mb-3">
                                <span className="block text-[13px] text-ink-400">{e.dept}</span>
                                <a href={`mailto:${e.address}`} className="text-base font-bold text-brand-600 hover:text-brand-700">{e.address}</a>
                            </p>
                        ))}
                        <p className="mt-2.5 text-sm leading-[1.6] text-ink-400">We reply within one working hour.</p>
                    </ContactCard>

                    <ContactCard icon={MapPin} title="Showroom">
                        <p className="mb-3 text-base font-semibold leading-[1.6] text-ink-900">
                            {SHOWROOM}<br />{SHOWROOM_POSTCODE}
                        </p>
                        <p className="mb-4 text-sm leading-[1.7] text-ink-400">
                            Mon–Fri 10:00–19:00<br />Sat 10:00–16:00 · Sun closed<br />Free parking at the entrance.
                        </p>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex rounded-full bg-brand-600 px-[22px] py-3 text-sm font-bold text-white hover:bg-brand-700"
                        >
                            Get directions
                        </a>
                    </ContactCard>
                </div>
            </Container>

            <Container as="section" className="pt-8">
                <div className="flex flex-wrap items-stretch gap-6">
                    <div className="relative min-h-[420px] min-w-0 flex-[999_1_520px] overflow-hidden rounded-[22px] border border-line bg-surface-100">
                        <iframe
                            title="SUP Shop showroom on the map"
                            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 h-full w-full border-0"
                        />
                        <div className="absolute bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_-8px_rgba(14,42,51,0.2)]">
                            <p className="mb-1 text-[15px] font-bold">SUP Shop showroom</p>
                            <p className="text-[13px] text-ink-400">{getShowroomStatus()}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="min-w-0 flex-[1_1_400px] rounded-[22px] border border-line bg-white p-8">
                        <h2 className="mb-2 text-2xl font-extrabold tracking-[-0.02em]">Send us a message</h2>
                        <p className="mb-6 text-[15px] leading-[1.6] text-ink-400">
                            Tell us your weight, your home water and what you want to do on the board — we'll come back with two or three options.
                        </p>

                        <div className="flex flex-col gap-[18px]">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <p className="flex min-w-0 flex-col gap-[7px]">
                                    <label htmlFor="c-name" className="text-sm font-semibold">Your name</label>
                                    <input id="c-name" type="text" required autoComplete="name" placeholder="Ion Munteanu" value={form.name} onChange={update('name')} className={`${fieldClass} h-12`} />
                                </p>
                                <p className="flex min-w-0 flex-col gap-[7px]">
                                    <label htmlFor="c-phone" className="text-sm font-semibold">Phone</label>
                                    <input id="c-phone" type="tel" autoComplete="tel" placeholder="+373 ___ _____" value={form.phone} onChange={update('phone')} className={`${fieldClass} h-12`} />
                                </p>
                            </div>

                            <p className="flex flex-col gap-[7px]">
                                <label htmlFor="c-email" className="text-sm font-semibold">Email</label>
                                <input id="c-email" type="email" required autoComplete="email" placeholder="your@email.com" value={form.email} onChange={update('email')} className={`${fieldClass} h-12`} />
                            </p>

                            <p className="flex flex-col gap-[7px]">
                                <label htmlFor="c-topic" className="text-sm font-semibold">What is it about?</label>
                                <select id="c-topic" value={form.topic} onChange={update('topic')} className={`${fieldClass} h-12 cursor-pointer bg-white px-3`}>
                                    {TOPICS.map(topic => <option key={topic}>{topic}</option>)}
                                </select>
                            </p>

                            <p className="flex flex-col gap-[7px]">
                                <label htmlFor="c-message" className="text-sm font-semibold">Message</label>
                                <textarea
                                    id="c-message"
                                    rows={4}
                                    required
                                    placeholder="I weigh 82 kg and paddle mostly on the Nistru…"
                                    value={form.message}
                                    onChange={update('message')}
                                    className={`${fieldClass} resize-y py-3`}
                                />
                            </p>

                            <label className="flex cursor-pointer items-start gap-[11px] text-sm leading-[1.55] text-ink-600">
                                <input type="checkbox" required className="mt-0.5 h-[18px] w-[18px] flex-none cursor-pointer accent-brand-600" />
                                <span>I agree to the processing of my personal data under the <Link to="/contacts" className="text-brand-600">privacy policy</Link>.</span>
                            </label>

                            <button type="submit" className="h-[52px] rounded-full bg-brand-600 text-base font-bold text-white hover:bg-brand-700">
                                Send message
                            </button>

                            {sent && (
                                <p role="status" className="text-sm leading-[1.6] text-ink-600">
                                    Your email app should open with the message ready. If it didn't, write to{' '}
                                    <a href={`mailto:${EMAILS[0].address}`} className="font-semibold text-brand-600">{EMAILS[0].address}</a>.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </Container>

            <Container as="section" className="pb-14 pt-10">
                <div className="flex flex-wrap gap-6">
                    <div className="min-w-0 flex-[999_1_460px] rounded-[22px] border border-line bg-surface-50 p-7">
                        <h2 className="mb-[18px] text-[22px] font-extrabold">Quick answers</h2>
                        {FAQS.map(f => (
                            <details key={f.q} className="border-t border-line py-3.5">
                                <summary className="cursor-pointer text-base font-semibold text-ink-900">{f.q}</summary>
                                <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-600">{f.a}</p>
                            </details>
                        ))}
                    </div>

                    <div className="min-w-0 flex-[1_1_320px] rounded-[22px] bg-deep-900 p-7 text-deep-text">
                        <h2 className="mb-[18px] text-[22px] font-extrabold text-white">Company details</h2>
                        {LEGAL.map(l => (
                            <p key={l.k} className="mb-3.5">
                                <span className="block text-[13px] text-deep-muted">{l.k}</span>
                                <span className="block text-[15px] font-semibold text-white">{l.v}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    );
}

export default ContactsPage;
