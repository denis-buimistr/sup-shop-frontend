import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import api from '../api/client';
import SimpleHeader from '../components/SimpleHeader';
import Container from '../components/Container';
import SimpleFooter from '../components/SimpleFooter';
import { FormError } from '../components/AuthShell';
import { BoardPlaceholder } from '../components/ProductCard';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { formatPrice, formatOrderNumber, formatDate } from '../utils/format';
import { getErrorMessage } from '../utils/forms';

// Из макета оставили только то, что есть на бэкенде: заказы и профиль.
// Избранное, адреса и сохранённые карты появятся вместе с эндпоинтами под них
const SECTIONS = [
    { id: 'orders', label: 'My orders' },
    { id: 'settings', label: 'Settings' },
];

// Статусы Order.Status на бэкенде → подпись и цвет плашки
const STATUSES = {
    NEW: { label: 'Processing', className: 'bg-badge-warm-bg text-badge-warm-ink' },
    PAID: { label: 'Paid', className: 'bg-tint-100 text-tint-900' },
    SHIPPED: { label: 'In delivery', className: 'bg-tint-100 text-tint-900' },
    COMPLETED: { label: 'Delivered', className: 'bg-surface-100 text-ink-600' },
    CANCELLED: { label: 'Cancelled', className: 'bg-surface-100 text-danger' },
};

const fieldClass =
    'h-12 w-full rounded-lg border border-line-input px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

function getInitials(profile, username) {
    const words = (profile?.fullName ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length > 0) return words.slice(0, 2).map(w => w[0]).join('');
    return username.slice(0, 2);
}

function Kpi({ value, label }) {
    return (
        <div className="min-w-0 rounded-2xl border border-line bg-white px-4 py-3.5">
            <p className="mb-[3px] text-[22px] font-extrabold tabular-nums">{value}</p>
            <p className="text-[13px] text-ink-400">{label}</p>
        </div>
    );
}

function OrderCard({ order, onBuyAgain }) {
    const status = STATUSES[order.status] ?? { label: order.status, className: 'bg-surface-100 text-ink-600' };
    const items = order.items ?? [];
    // productId есть, только если бэкенд отдаёт его в позиции заказа — без него повторить заказ нельзя
    const canBuyAgain = items.length > 0 && items.every(item => item.productId);

    return (
        <article className="mb-4 overflow-hidden rounded-[20px] border border-line">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line bg-surface-50 px-[22px] py-[18px]">
                <span>
                    <span className="block text-xs text-ink-400">Order</span>
                    <span className="block text-[15px] font-bold">{formatOrderNumber(order.id)}</span>
                </span>
                <span>
                    <span className="block text-xs text-ink-400">Placed</span>
                    <span className="block text-[15px] font-semibold">{formatDate(order.createdAt)}</span>
                </span>
                <span>
                    <span className="block text-xs text-ink-400">Total</span>
                    <span className="block text-[15px] font-bold tabular-nums">{formatPrice(order.totalPrice)}</span>
                </span>
                <span className={`ml-auto inline-flex items-center gap-[7px] rounded-full px-3.5 py-[7px] text-[13px] font-bold ${status.className}`}>
                    <span className="h-[7px] w-[7px] rounded-full bg-current" />
                    {status.label}
                </span>
            </div>

            <div className="px-[22px] py-[18px]">
                {items.map(item => (
                    <div key={item.id ?? item.productName} className="flex items-center gap-3.5 py-2">
                        <span className="flex h-[50px] w-[60px] flex-none items-center justify-center rounded-xl bg-surface-100">
                            <BoardPlaceholder width={44} />
                        </span>
                        <span className="min-w-0 flex-grow text-[15px] font-semibold">
                            {item.productId ? (
                                <Link to={`/products/${item.productId}`} className="text-ink-900 hover:text-brand-600">{item.productName}</Link>
                            ) : (
                                item.productName
                            )}
                        </span>
                        <span className="flex-none text-sm text-ink-400">× {item.quantity}</span>
                    </div>
                ))}

                {order.shippingAddress && (
                    <p className="mt-2 text-[13px] leading-[1.6] text-ink-400">{order.shippingAddress}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                    {canBuyAgain && (
                        <button
                            type="button"
                            onClick={() => onBuyAgain(order)}
                            className="inline-flex rounded-full border-[1.5px] border-line-divider bg-white px-5 py-[11px] text-sm font-bold text-brand-600 hover:border-brand-600"
                        >
                            Buy again
                        </button>
                    )}
                    <Link to="/contacts" className="inline-flex items-center px-1 py-[11px] text-sm font-semibold text-ink-400 hover:text-brand-600">
                        Need help with this order?
                    </Link>
                </div>
            </div>
        </article>
    );
}

function OrdersSection({ orders, error, onBuyAgain }) {
    if (error) return <FormError message={error} />;
    if (!orders) return <p className="text-[15px] text-ink-400">Loading your orders…</p>;

    if (orders.length === 0) {
        return (
            <div className="rounded-[20px] border border-line px-6 py-14 text-center">
                <p className="mb-2.5 text-xl font-bold">No orders yet</p>
                <p className="mb-[22px] text-[15px] text-ink-400">When you place an order, it shows up here with its status.</p>
                <Link to="/catalog" className="inline-flex rounded-full bg-brand-600 px-[26px] py-3.5 text-[15px] font-bold text-white hover:bg-brand-700">
                    Browse the catalog
                </Link>
            </div>
        );
    }

    return orders.map(order => <OrderCard key={order.id} order={order} onBuyAgain={onBuyAgain} />);
}

function SettingsSection({ profile, onSaved }) {
    const [details, setDetails] = useState({ fullName: profile.fullName ?? '', email: profile.email ?? '' });
    const [detailsState, setDetailsState] = useState({ loading: false, error: null, saved: false });

    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirm: '' });
    const [passwordState, setPasswordState] = useState({ loading: false, error: null, saved: false });

    function handleDetails(e) {
        e.preventDefault();
        setDetailsState({ loading: true, error: null, saved: false });

        api.put('/profile', { fullName: details.fullName.trim(), email: details.email.trim() })
            .then(({ data }) => {
                onSaved(data);
                setDetailsState({ loading: false, error: null, saved: true });
            })
            .catch(err => {
                setDetailsState({ loading: false, error: getErrorMessage(err, 'Не удалось сохранить изменения.'), saved: false });
            });
    }

    function handlePassword(e) {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirm) {
            setPasswordState({ loading: false, error: 'Пароли не совпадают', saved: false });
            return;
        }

        setPasswordState({ loading: true, error: null, saved: false });
        api.post('/profile/change-password', { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword })
            .then(() => {
                setPasswords({ oldPassword: '', newPassword: '', confirm: '' });
                setPasswordState({ loading: false, error: null, saved: true });
                setShowPassword(false);
            })
            .catch(err => {
                setPasswordState({ loading: false, error: getErrorMessage(err, 'Не удалось сменить пароль.'), saved: false });
            });
    }

    function updatePassword(field) {
        return e => setPasswords(current => ({ ...current, [field]: e.target.value }));
    }

    return (
        <>
            <form onSubmit={handleDetails} className="mb-[18px]">
                <fieldset className="m-0 mb-[18px] min-w-0 rounded-[20px] border border-line p-6">
                    <legend className="px-2.5 text-[17px] font-bold">Personal details</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <p className="flex min-w-0 flex-col gap-[7px]">
                            <label htmlFor="s-name" className="text-sm font-semibold">Full name</label>
                            <input
                                id="s-name"
                                type="text"
                                autoComplete="name"
                                maxLength={150}
                                value={details.fullName}
                                onChange={e => setDetails(current => ({ ...current, fullName: e.target.value }))}
                                className={fieldClass}
                            />
                        </p>
                        <p className="flex min-w-0 flex-col gap-[7px]">
                            <label htmlFor="s-email" className="text-sm font-semibold">Email</label>
                            <input
                                id="s-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={details.email}
                                onChange={e => setDetails(current => ({ ...current, email: e.target.value }))}
                                className={fieldClass}
                            />
                        </p>
                    </div>
                    <p className="mt-4 text-[13px] text-ink-400">
                        Username <span className="font-semibold text-ink-900">{profile.username}</span> is used to sign in and cannot be changed.
                    </p>
                </fieldset>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={detailsState.loading}
                        className="rounded-full bg-brand-600 px-[30px] py-[15px] text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                        {detailsState.loading ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                        type="button"
                        aria-expanded={showPassword}
                        onClick={() => setShowPassword(open => !open)}
                        className="rounded-full border-[1.5px] border-line-divider bg-white px-7 py-3.5 text-[15px] font-bold text-ink-900 hover:border-ink-900"
                    >
                        Change password
                    </button>
                    {detailsState.saved && (
                        <span role="status" className="flex items-center gap-1.5 text-sm font-semibold text-success">
                            <CircleCheck size={16} strokeWidth={2} /> Saved
                        </span>
                    )}
                </div>
                {detailsState.error && <div className="mt-3"><FormError message={detailsState.error} /></div>}
            </form>

            {passwordState.saved && (
                <p role="status" className="mb-[18px] flex items-center gap-1.5 text-sm font-semibold text-success">
                    <CircleCheck size={16} strokeWidth={2} /> Password changed
                </p>
            )}

            {showPassword && (
                <form onSubmit={handlePassword}>
                    <fieldset className="m-0 min-w-0 rounded-[20px] border border-line p-6">
                        <legend className="px-2.5 text-[17px] font-bold">Change password</legend>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <p className="flex min-w-0 flex-col gap-[7px]">
                                <label htmlFor="s-old" className="text-sm font-semibold">Current password</label>
                                <input id="s-old" type="password" required autoComplete="current-password" value={passwords.oldPassword} onChange={updatePassword('oldPassword')} className={fieldClass} />
                            </p>
                            <p className="flex min-w-0 flex-col gap-[7px]">
                                <label htmlFor="s-new" className="text-sm font-semibold">New password</label>
                                <input id="s-new" type="password" required minLength={8} autoComplete="new-password" value={passwords.newPassword} onChange={updatePassword('newPassword')} className={fieldClass} />
                            </p>
                            <p className="flex min-w-0 flex-col gap-[7px]">
                                <label htmlFor="s-confirm" className="text-sm font-semibold">Repeat new password</label>
                                <input id="s-confirm" type="password" required minLength={8} autoComplete="new-password" value={passwords.confirm} onChange={updatePassword('confirm')} className={fieldClass} />
                            </p>
                        </div>
                        <p className="mt-3 text-[13px] text-ink-400">At least 8 characters.</p>
                        {passwordState.error && <div className="mt-3"><FormError message={passwordState.error} /></div>}
                        <button
                            type="submit"
                            disabled={passwordState.loading}
                            className="mt-5 rounded-full bg-brand-600 px-[30px] py-[15px] text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                        >
                            {passwordState.loading ? 'Saving…' : 'Update password'}
                        </button>
                    </fieldset>
                </form>
            )}
        </>
    );
}

function ProfilePage() {
    const { user, logout } = useAuth();
    const { count, addItem } = useCart();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState(null);
    const [ordersError, setOrdersError] = useState(null);

    const section = SECTIONS.some(s => s.id === searchParams.get('tab')) ? searchParams.get('tab') : 'orders';

    useEffect(() => {
        if (!user) return;

        api.get('/profile')
            .then(({ data }) => setProfile(data))
            .catch(() => setProfile({ username: user.username }));

        api.get('/orders/my')
            .then(({ data }) => setOrders(data))
            .catch(err => setOrdersError(getErrorMessage(err, 'Не удалось загрузить заказы.')));
    }, [user]);

    if (!user) return <Navigate to="/login" state={{ from: '/profile' }} replace />;

    const inDelivery = orders?.filter(o => o.status === 'SHIPPED').length ?? 0;
    const delivered = orders?.filter(o => o.status === 'COMPLETED').length ?? 0;
    const firstName = profile?.fullName?.trim().split(/\s+/)[0] || user.username;

    function handleLogout() {
        logout();
        navigate('/');
    }

    // Цены и наличие берём свежие из каталога, а не из старого заказа
    function handleBuyAgain(order) {
        Promise.all(order.items.map(item => api.get(`/products/${item.productId}`)))
            .then(responses => {
                responses.forEach(({ data: product }, i) => {
                    if (product.quantity > 0) addItem({ ...product, image: product.images?.[0]?.imageUrl }, order.items[i].quantity);
                });
                navigate('/cart');
            })
            .catch(err => setOrdersError(getErrorMessage(err, 'Не удалось добавить товары в корзину.')));
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SimpleHeader
                action={
                    <>
                        <Link to="/catalog" className="text-sm font-semibold text-ink-900 hover:text-brand-600">Catalog</Link>
                        <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-ink-900 hover:text-brand-600">
                            Cart
                            {count > 0 && (
                                <span className="rounded-full bg-alert px-[7px] py-0.5 text-[11px] font-bold text-white">{count}</span>
                            )}
                        </Link>
                    </>
                }
            />

            <section className="border-b border-line bg-surface-100">
                <Container className="flex flex-wrap items-center gap-6 py-8">
                    <span className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-full bg-deep-900 text-[26px] font-extrabold uppercase text-white">
                        {getInitials(profile, user.username)}
                    </span>
                    <div className="min-w-0 flex-[999_1_260px]">
                        <h1 className="mb-1.5 text-[32px] font-extrabold tracking-[-0.025em]">Hello, {firstName}</h1>
                        <p className="text-[15px] text-ink-600">
                            {profile?.email ?? user.username}
                            {profile?.createdAt && ` · member since ${new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(profile.createdAt))}`}
                        </p>
                    </div>
                    <div className="grid min-w-0 flex-[1_1_360px] grid-cols-3 gap-3">
                        <Kpi value={orders?.length ?? '—'} label="Orders placed" />
                        <Kpi value={orders ? inDelivery : '—'} label="In delivery" />
                        <Kpi value={orders ? delivered : '—'} label="Delivered" />
                    </div>
                </Container>
            </section>

            <Container as="main" className="flex-grow pt-8">
                <div className="flex flex-wrap items-start gap-8">
                    <nav aria-label="Profile sections" className="min-w-0 flex-[1_1_260px] md:max-w-[300px]">
                        <div className="rounded-[20px] border border-line p-2.5">
                            {SECTIONS.map(s => {
                                const current = s.id === section;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        aria-current={current ? 'page' : undefined}
                                        onClick={() => setSearchParams(s.id === 'orders' ? {} : { tab: s.id })}
                                        className={`mb-0.5 flex w-full items-center justify-between gap-3 rounded-xl px-4 py-[13px] text-left text-[15px] ${
                                            current ? 'bg-tint-100 font-bold text-tint-900' : 'font-medium text-ink-900 hover:bg-surface-50'
                                        }`}
                                    >
                                        <span>{s.label}</span>
                                        {s.id === 'orders' && orders?.length > 0 && (
                                            <span className="rounded-full bg-surface-100 px-[9px] py-0.5 text-xs font-bold text-ink-900">{orders.length}</span>
                                        )}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-1.5 block w-full border-t border-surface-100 px-4 py-[13px] text-left text-[15px] font-semibold text-danger"
                            >
                                Sign out
                            </button>
                        </div>

                        <div className="mt-4 rounded-[20px] bg-surface-100 p-[22px]">
                            <p className="mb-2 text-base font-bold">Need a hand?</p>
                            <p className="mb-4 text-sm leading-[1.55] text-ink-600">
                                Questions about an order, warranty or service — we answer within an hour.
                            </p>
                            <Link to="/contacts" className="inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">
                                Contact support
                            </Link>
                        </div>
                    </nav>

                    <div className="min-w-0 flex-[999_1_560px]">
                        <h2 className="mb-5 text-[26px] font-extrabold tracking-[-0.02em]">
                            {SECTIONS.find(s => s.id === section).label}
                        </h2>

                        {section === 'orders' && <OrdersSection orders={orders} error={ordersError} onBuyAgain={handleBuyAgain} />}

                        {section === 'settings' && (profile ? (
                            <SettingsSection profile={profile} onSaved={setProfile} />
                        ) : (
                            <p className="text-[15px] text-ink-400">Loading…</p>
                        ))}
                    </div>
                </div>
            </Container>

            <SimpleFooter />
        </div>
    );
}

export default ProfilePage;
