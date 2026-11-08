import { useEffect, useState } from 'react';
import { Link, Navigate } from '../i18n/routing';
import { CircleAlert, CircleCheck, Lock } from 'lucide-react';
import api from '../api/client';
import SimpleHeader from '../components/SimpleHeader';
import Container from '../components/Container';
import CheckoutSteps from '../components/CheckoutSteps';
import SimpleFooter from '../components/SimpleFooter';
import { FormError } from '../components/AuthShell';
import { BoardPlaceholder } from '../components/ProductCard';
import { useCart, FREE_DELIVERY_FROM } from '../context/cart';
import { useAuth } from '../context/auth';
import { useToast } from '../context/toast';
import { formatPrice, formatOrderNumber } from '../utils/format';
import { SHOWROOM } from '../data/contacts';
import { getErrorMessage } from '../utils/forms';
import { Trans, useTranslation } from 'react-i18next';

// value уходит на бэкенд как есть, на экране показываю перевод из cities.<key>
const CITIES = [
    { value: 'Chișinău', key: 'chisinau' },
    { value: 'Bălți', key: 'balti' },
    { value: 'Cahul', key: 'cahul' },
    { value: 'Orhei', key: 'orhei' },
    { value: 'Other locality', key: 'other' },
];

// названия в delivery.<id>, пояснения в checkout.shipping.<id>
const SHIPPING = [
    { id: 'COURIER_CHISINAU', price: 0 },
    { id: 'COURIER_MOLDOVA', price: 0 },
    { id: 'PICKUP', price: 0 },
    { id: 'PARCEL_LOCKER', price: 45 },
];

// Онлайн-оплаты на бэкенде пока нет, поэтому карта и рассрочка видны, но выбрать их нельзя
// названия в payment.<id>, пояснения и текст кнопки в checkout.payment.<id>
const PAYMENTS = [
    { id: 'CASH_ON_DELIVERY', marks: ['CASH'] },
    { id: 'BANK_TRANSFER', marks: ['B2B'] },
    { id: 'card', marks: ['VISA', 'MC'], soon: true },
    { id: 'instal', marks: ['MAIB'], soon: true },
];

const GUARANTEES = ['checkout.guarantees.call', 'cart.guarantees.returns', 'cart.guarantees.warranty'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
    'h-12 w-full rounded-lg border px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

function validate(form) {
    const errors = {};
    // кладу ключи переводов, сам текст беру при рендере, чтобы он менялся вместе с языком
    if (!form.firstName.trim()) errors.firstName = 'checkout.errors.firstName';
    if (!form.lastName.trim()) errors.lastName = 'checkout.errors.lastName';
    if (form.phone.replace(/\D/g, '').length < 8) errors.phone = 'checkout.errors.phone';
    if (!EMAIL_RE.test(form.email.trim())) errors.email = 'checkout.errors.email';
    if (form.shipping !== 'PICKUP' && !form.street.trim()) errors.street = 'checkout.errors.street';
    return errors;
}

function buildCheckoutRequest(form) {
    const needsAddress = form.shipping !== 'PICKUP';
    const flat = form.flat.trim();

    return {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        deliveryMethod: form.shipping,
        city: needsAddress ? form.city : null,
        shippingAddress: needsAddress ? [form.street.trim(), flat && `flat ${flat}`].filter(Boolean).join(', ') : null,
        paymentMethod: form.payment,
        comment: form.note.trim() || null,
    };
}

function Field({ id, label, optional, hint, error, children }) {
    const { t } = useTranslation();
    return (
        <p className="flex min-w-0 flex-col gap-[7px]">
            <label htmlFor={id} className="text-sm font-semibold">
                {label} {optional && <span className="font-normal text-ink-400">{t('checkout.optional')}</span>}
            </label>
            {children}
            {error ? (
                <span id={`${id}-err`} className="flex items-center gap-1.5 text-[13px] font-semibold text-danger">
                    <CircleAlert size={14} strokeWidth={2} className="flex-none" />
                    {t(error)}
                </span>
            ) : (
                hint && <span className="text-[13px] text-ink-400">{hint}</span>
            )}
        </p>
    );
}

function ChoiceCard({ name, checked, disabled, onChange, title, body, children }) {
    let tone = 'border-line bg-white';
    if (checked) tone = 'border-brand-600 bg-tint-100';
    if (disabled) tone = 'cursor-not-allowed border-line bg-surface-50 opacity-70';

    return (
        <label className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border-[1.5px] px-[18px] py-4 ${tone}`}>
            <input
                type="radio"
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="mt-0.5 h-[19px] w-[19px] flex-none cursor-pointer accent-brand-600 disabled:cursor-not-allowed"
            />
            <span className="min-w-0 flex-grow">
                <span className="block text-base font-bold text-ink-900">{title}</span>
                <span className="mt-[3px] block text-sm leading-[1.5] text-ink-400">{body}</span>
            </span>
            {children}
        </label>
    );
}

function Fieldset({ legend, children }) {
    return (
        <fieldset className="m-0 min-w-0 rounded-[22px] border border-line p-[26px]">
            <legend className="px-2.5 text-xl font-extrabold tracking-[-0.01em]">{legend}</legend>
            {children}
        </fieldset>
    );
}

function CheckoutPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { items, subtotal, clearCart } = useCart();
    const { showToast } = useToast();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        shipping: 'COURIER_CHISINAU',
        city: CITIES[0].value,
        street: '',
        flat: '',
        note: '',
        payment: 'CASH_ON_DELIVERY',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [placed, setPlaced] = useState(null);

    // Подставляем имя и почту из профиля, но не затираем то, что человек уже успел ввести
    useEffect(() => {
        if (!user) return;
        api.get('/profile')
            .then(({ data }) => {
                const [first = '', ...rest] = (data.fullName ?? '').trim().split(/\s+/);
                setForm(current => ({
                    ...current,
                    firstName: current.firstName || first,
                    lastName: current.lastName || rest.join(' '),
                    email: current.email || (data.email ?? ''),
                }));
            })
            .catch(() => {
                // без профиля просто заполнят руками
            });
    }, [user]);

    if (!user) return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
    if (!placed && items.length === 0) return <Navigate to="/cart" replace />;

    const shipping = SHIPPING.find(s => s.id === form.shipping);
    const payment = PAYMENTS.find(p => p.id === form.payment);
    // как на бэкенде: от FREE_DELIVERY_FROM доставка бесплатная при любом способе
    const freeDelivery = subtotal >= FREE_DELIVERY_FROM;
    const deliveryPrice = freeDelivery ? 0 : shipping.price;
    const total = subtotal + deliveryPrice;

    function update(field) {
        return e => {
            setForm(current => ({ ...current, [field]: e.target.value }));
            setErrors(current => ({ ...current, [field]: undefined }));
        };
    }

    function inputProps(field) {
        return {
            id: `co-${field}`,
            value: form[field],
            onChange: update(field),
            'aria-invalid': Boolean(errors[field]),
            'aria-describedby': errors[field] ? `co-${field}-err` : undefined,
            className: `${fieldClass} ${errors[field] ? 'border-[1.5px] border-danger' : 'border-line-input'}`,
        };
    }

    // Бэкенд оформляет заказ из своей корзины, а наша живёт в localStorage — перед оформлением переносим её на сервер
    async function placeOrder() {
        const { data: serverItems } = await api.get('/cart/items');
        await Promise.all(serverItems.map(item => api.delete(`/cart/items/${item.productId}`)));

        // по одному: первый запрос создаёт корзину на сервере, параллельные могли бы создать её дважды
        for (const item of items) {
            await api.post('/cart/items', null, { params: { productId: item.id, quantity: item.qty } });
        }

        const { data: order } = await api.post('/orders/checkout', buildCheckoutRequest(form));
        return order;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);

        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            document.getElementById(`co-${Object.keys(found)[0]}`)?.focus();
            return;
        }

        setLoading(true);
        placeOrder()
            .then(order => {
                // сумму берём из ответа сервера: это то, что он реально записал в заказ
                const toPay = order?.totalPrice ?? total;
                setPlaced({ id: order?.id, total: toPay, phone: form.phone.trim() });
                clearCart();
                showToast({
                    title: order?.id ? t('checkout.toast.placedNumber', { number: formatOrderNumber(order.id) }) : t('checkout.toast.placed'),
                    body: t('checkout.toast.toPay', { price: formatPrice(toPay) }),
                    link: { to: '/profile', label: t('checkout.viewOrders') },
                });
                window.scrollTo(0, 0);
            })
            .catch(err => {
                setSubmitError(getErrorMessage(err, t('errors.checkout')));
                setLoading(false);
            });
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SimpleHeader
                action={
                    <p className="flex items-center gap-2.5 text-sm font-semibold text-brand-600">
                        <Lock size={18} strokeWidth={1.8} />
                        {t('checkout.secure')}
                    </p>
                }
            />

            <CheckoutSteps done={placed ? [0, 1, 2] : [0]} active={placed ? [] : [1, 2]} />

            <Container as="main" className="flex-grow pt-8">
                {placed ? (
                    <section className="mx-auto max-w-[640px] rounded-[22px] border border-line bg-surface-50 px-8 py-12 text-center">
                        <CircleCheck size={48} strokeWidth={1.6} className="mx-auto mb-5 text-brand-600" />
                        <h1 className="mb-3 text-[34px] font-extrabold tracking-[-0.025em]">
                            {placed.id ? t('checkout.done.titleNumber', { number: formatOrderNumber(placed.id) }) : t('checkout.done.title')}
                        </h1>
                        <p className="mb-2 text-base leading-[1.6] text-ink-600">
                            <Trans i18nKey="checkout.done.call" values={{ phone: placed.phone }} components={{ b: <span className="font-semibold text-ink-900" /> }} />
                        </p>
                        <p className="mb-8 text-base text-ink-600">
                            <Trans i18nKey="checkout.done.toPay" values={{ price: formatPrice(placed.total) }} components={{ b: <span className="font-bold tabular-nums text-ink-900" /> }} />
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                to="/profile"
                                className="inline-flex rounded-full bg-brand-600 px-[26px] py-3.5 text-[15px] font-bold text-white hover:bg-brand-700"
                            >
                                {t('checkout.viewOrders')}
                            </Link>
                            <Link
                                to="/catalog"
                                className="inline-flex rounded-full border-[1.5px] border-ink-900 bg-white px-[26px] py-3.5 text-[15px] font-bold text-ink-900 hover:bg-surface-50"
                            >
                                {t('cart.continue')}
                            </Link>
                        </div>
                    </section>
                ) : (
                    <>
                        <h1 className="mb-7 text-[38px] font-extrabold tracking-[-0.025em] text-ink-900">{t('checkout.title')}</h1>

                        <div className="flex flex-wrap items-start gap-7">
                            <form
                                id="checkout-form"
                                noValidate
                                onSubmit={handleSubmit}
                                className="flex min-w-0 flex-[999_1_560px] flex-col gap-5"
                            >
                                <Fieldset legend={t('checkout.details')}>
                                    <p className="mb-5 text-sm text-ink-400">
                                        <Trans i18nKey="checkout.signedInAs" values={{ name: user.username }} components={{ b: <span className="font-semibold text-ink-900" /> }} />
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field id="co-firstName" label={t('checkout.fields.firstName')} error={errors.firstName}>
                                            <input type="text" autoComplete="given-name" {...inputProps('firstName')} />
                                        </Field>
                                        <Field id="co-lastName" label={t('checkout.fields.lastName')} error={errors.lastName}>
                                            <input type="text" autoComplete="family-name" {...inputProps('lastName')} />
                                        </Field>
                                        <Field id="co-phone" label={t('checkout.fields.phone')} hint={t('checkout.fields.phoneHint')} error={errors.phone}>
                                            <input type="tel" autoComplete="tel" placeholder="+373 69 000 000" {...inputProps('phone')} />
                                        </Field>
                                        <Field id="co-email" label={t('checkout.fields.email')} error={errors.email}>
                                            <input type="email" autoComplete="email" {...inputProps('email')} />
                                        </Field>
                                    </div>
                                </Fieldset>

                                <Fieldset legend={t('checkout.delivery')}>
                                    <div className="mb-5 flex flex-col gap-3">
                                        {SHIPPING.map(s => (
                                            <ChoiceCard
                                                key={s.id}
                                                name="shipping"
                                                checked={form.shipping === s.id}
                                                onChange={() => setForm(current => ({ ...current, shipping: s.id }))}
                                                title={t(`delivery.${s.id}`)}
                                                body={t(`checkout.shipping.${s.id}`, { address: SHOWROOM })}
                                            >
                                                <span className={`flex-none text-[15px] font-bold ${s.price && !freeDelivery ? 'text-ink-900' : 'text-brand-600'}`}>
                                                    {s.price && !freeDelivery ? formatPrice(s.price) : t('checkout.free')}
                                                </span>
                                            </ChoiceCard>
                                        ))}
                                    </div>

                                    {form.shipping === 'PICKUP' ? (
                                        <p className="text-sm leading-[1.6] text-ink-600">
                                            <Trans i18nKey="checkout.pickupNote" values={{ address: SHOWROOM }} components={{ b: <span className="font-semibold text-ink-900" /> }} />
                                        </p>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-[1fr_1.3fr]">
                                            <Field id="co-city" label={t('checkout.fields.city')}>
                                                <select {...inputProps('city')} className={`${fieldClass} cursor-pointer border-line-input bg-white px-3`}>
                                                    {CITIES.map(city => <option key={city.value} value={city.value}>{t(`cities.${city.key}`)}</option>)}
                                                </select>
                                            </Field>
                                            <Field id="co-street" label={t('checkout.fields.street')} error={errors.street}>
                                                <input type="text" autoComplete="address-line1" placeholder="str. Albișoara 4" {...inputProps('street')} />
                                            </Field>
                                            <Field id="co-flat" label={t('checkout.fields.flat')}>
                                                <input type="text" autoComplete="address-line2" placeholder="12" {...inputProps('flat')} />
                                            </Field>
                                            <Field id="co-note" label={t('checkout.fields.note')} optional>
                                                <input type="text" placeholder={t('checkout.fields.notePlaceholder')} {...inputProps('note')} />
                                            </Field>
                                        </div>
                                    )}
                                </Fieldset>

                                <Fieldset legend={t('checkout.paymentStep')}>
                                    <div className="flex flex-col gap-3">
                                        {PAYMENTS.map(m => (
                                            <ChoiceCard
                                                key={m.id}
                                                name="payment"
                                                checked={form.payment === m.id}
                                                disabled={m.soon}
                                                onChange={() => setForm(current => ({ ...current, payment: m.id }))}
                                                title={t(`payment.${m.id}`)}
                                                body={m.soon ? t('checkout.comingSoon', { text: t(`checkout.payment.${m.id}.body`) }) : t(`checkout.payment.${m.id}.body`)}
                                            >
                                                <span className="flex flex-none gap-1.5">
                                                    {m.marks.map(mark => (
                                                        <span
                                                            key={mark}
                                                            className="flex h-[26px] min-w-[44px] items-center justify-center rounded-[5px] border border-line bg-white px-2 text-[10px] font-bold text-ink-900"
                                                        >
                                                            {mark}
                                                        </span>
                                                    ))}
                                                </span>
                                            </ChoiceCard>
                                        ))}
                                    </div>
                                </Fieldset>
                            </form>

                            <aside aria-label={t('cart.summary.title')} className="min-w-0 flex-[1_1_360px]">
                                <div className="rounded-[22px] border border-line bg-surface-50 p-[26px]">
                                    <h2 className="mb-[18px] text-[22px] font-extrabold tracking-[-0.02em]">{t('checkout.yourOrder')}</h2>

                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-3.5 border-b border-line py-3">
                                            <span className="relative flex h-[52px] w-[60px] flex-none items-center justify-center rounded-xl bg-white">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="max-h-full max-w-full object-contain p-1 mix-blend-multiply" />
                                                ) : (
                                                    <BoardPlaceholder width={44} />
                                                )}
                                                <span className="absolute -right-[7px] -top-[7px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-deep-900 text-[11px] font-bold text-white">
                                                    {item.qty}
                                                </span>
                                            </span>
                                            <span className="min-w-0 flex-grow">
                                                <span className="block text-sm font-semibold leading-[1.35] text-ink-900">{item.name}</span>
                                                {item.brandName && <span className="mt-[3px] block text-[13px] text-ink-400">{item.brandName}</span>}
                                            </span>
                                            <span className="flex-none text-[15px] font-bold tabular-nums">{formatPrice(item.price * item.qty)}</span>
                                        </div>
                                    ))}

                                    <div className="pt-4">
                                        <p className="mb-[11px] flex justify-between gap-4 text-[15px] text-ink-600">
                                            <span>{t('checkout.subtotal')}</span>
                                            <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                                        </p>
                                        <p className="mb-[11px] flex justify-between gap-4 text-[15px] text-ink-600">
                                            <span>{t('checkout.deliveryRow')}</span>
                                            <span className="font-semibold tabular-nums">{deliveryPrice ? formatPrice(deliveryPrice) : t('checkout.free')}</span>
                                        </p>
                                    </div>

                                    <p className="mb-1 mt-4 flex items-baseline justify-between gap-4 border-t border-line-divider pt-4">
                                        <span className="text-lg font-bold">{t('checkout.toPay')}</span>
                                        <span className="text-[28px] font-extrabold tabular-nums">{formatPrice(total)}</span>
                                    </p>
                                    <p className="mb-5 text-right text-[13px] text-ink-400">{t('common.vatIncluded')}</p>

                                    {submitError && (
                                        <div className="mb-4">
                                            <FormError message={submitError} />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={loading}
                                        className="mb-3.5 w-full rounded-full bg-brand-600 p-[17px] text-[17px] font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                                    >
                                        {loading ? t('checkout.placing') : t(`checkout.payment.${payment.id}.cta`)}
                                    </button>

                                    <p className="mb-[18px] text-center text-[13px] leading-[1.6] text-ink-400">
                                        <Trans
                                            i18nKey="checkout.terms"
                                            components={{
                                                terms: <Link to="/contacts" className="text-brand-600" />,
                                                privacy: <Link to="/contacts" className="text-brand-600" />,
                                            }}
                                        />
                                    </p>

                                    <Link
                                        to="/cart"
                                        className="flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white p-[13px] text-[15px] font-bold text-ink-900 hover:bg-surface-50"
                                    >
                                        {t('checkout.backToCart')}
                                    </Link>

                                    <div className="mt-[22px] border-t border-line-divider pt-5">
                                        {GUARANTEES.map(key => (
                                            <p key={key} className="mb-2.5 flex items-start gap-2.5 text-sm leading-[1.5] text-ink-600">
                                                <CircleCheck size={17} strokeWidth={1.8} className="mt-0.5 flex-none text-brand-600" />
                                                {t(key)}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </Container>

            <SimpleFooter />
        </div>
    );
}

export default CheckoutPage;
