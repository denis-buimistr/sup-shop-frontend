import { useEffect, useState } from 'react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import { useToast } from '../../context/toast';
import { formatPrice, formatOrderNumber, formatDate } from '../../utils/format';
import { getErrorMessage } from '../../utils/forms';
import { ORDER_STATUSES, formatDelivery, getOrderStatus, getNextStatuses, getPaymentLabel } from '../../utils/orders';

const FILTERS = [{ id: 'ALL', label: 'All' }, ...Object.entries(ORDER_STATUSES).map(([id, s]) => ({ id, label: s.label }))];

function OrderRow({ order, onStatusChange }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const status = getOrderStatus(order.status);
    const items = order.items ?? [];
    const nextStatuses = getNextStatuses(order.status);

    function handleChange(e) {
        setSaving(true);
        onStatusChange(order, e.target.value).finally(() => setSaving(false));
    }

    return (
        <article className="mb-3 overflow-hidden rounded-[18px] border border-line bg-white">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
                <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen(o => !o)}
                    className="text-left"
                >
                    <span className="block text-xs text-ink-400">Order</span>
                    <span className="block text-[15px] font-bold text-brand-600 hover:text-brand-700">{formatOrderNumber(order.id)}</span>
                </button>
                <span className="min-w-0">
                    <span className="block text-xs text-ink-400">Customer</span>
                    <span className="block max-w-[200px] truncate text-[15px] font-semibold">{order.customerUsername ?? '—'}</span>
                </span>
                <span>
                    <span className="block text-xs text-ink-400">Placed</span>
                    <span className="block text-[15px] font-semibold">{formatDate(order.createdAt)}</span>
                </span>
                <span>
                    <span className="block text-xs text-ink-400">Items</span>
                    <span className="block text-[15px] font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </span>
                <span>
                    <span className="block text-xs text-ink-400">Total</span>
                    <span className="block text-[15px] font-bold tabular-nums">{formatPrice(order.totalPrice)}</span>
                </span>

                <span className="ml-auto flex items-center gap-3">
                    <span className={`hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline-flex ${status.className}`}>{status.label}</span>
                    <label htmlFor={`status-${order.id}`} className="sr-only">Status of order {formatOrderNumber(order.id)}</label>
                    <select
                        id={`status-${order.id}`}
                        value={order.status}
                        // из Delivered и Cancelled переходов нет — список не нужен
                        disabled={saving || nextStatuses.length === 0}
                        onChange={handleChange}
                        className="h-10 cursor-pointer rounded-lg border border-line-input bg-white px-2.5 text-sm font-semibold text-ink-900 disabled:cursor-default disabled:opacity-60"
                    >
                        {[order.status, ...nextStatuses].map(id => (
                            <option key={id} value={id}>{getOrderStatus(id).label}</option>
                        ))}
                    </select>
                </span>
            </div>

            {open && (
                <div className="border-t border-line bg-surface-50 px-5 py-4">
                    <dl className="mb-3 grid gap-x-6 gap-y-1.5 text-sm leading-[1.6] sm:grid-cols-[auto_1fr]">
                        <dt className="font-semibold text-ink-900">Customer</dt>
                        <dd className="text-ink-600">
                            {order.customerUsername ?? '—'}
                            {order.customerEmail && (
                                <>
                                    {' · '}
                                    <a href={`mailto:${order.customerEmail}`} className="text-brand-600 hover:text-brand-700">{order.customerEmail}</a>
                                </>
                            )}
                        </dd>
                        {order.firstName && (
                            <>
                                <dt className="font-semibold text-ink-900">Recipient</dt>
                                <dd className="text-ink-600">
                                    {order.firstName} {order.lastName}
                                    {order.phone && (
                                        <>
                                            {' · '}
                                            <a href={`tel:${order.phone}`} className="text-brand-600 hover:text-brand-700">{order.phone}</a>
                                        </>
                                    )}
                                    {order.email && ` · ${order.email}`}
                                </dd>
                            </>
                        )}
                        <dt className="font-semibold text-ink-900">Delivery</dt>
                        <dd className="text-ink-600">
                            {formatDelivery(order) || '—'}
                            {order.deliveryPrice > 0 && ` · ${formatPrice(order.deliveryPrice)}`}
                        </dd>
                        {order.paymentMethod && (
                            <>
                                <dt className="font-semibold text-ink-900">Payment</dt>
                                <dd className="text-ink-600">{getPaymentLabel(order.paymentMethod)}</dd>
                            </>
                        )}
                        {order.comment && (
                            <>
                                <dt className="font-semibold text-ink-900">Comment</dt>
                                <dd className="text-ink-600">{order.comment}</dd>
                            </>
                        )}
                    </dl>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-ink-400">
                                <th className="pb-2 font-semibold">Product</th>
                                <th className="pb-2 text-right font-semibold">Qty</th>
                                <th className="pb-2 text-right font-semibold">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-t border-line">
                                    <td className="py-2 pr-3 font-semibold">{item.productName}</td>
                                    <td className="py-2 text-right tabular-nums">{item.quantity}</td>
                                    <td className="py-2 text-right tabular-nums">{formatPrice(item.priceAtPurchase)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </article>
    );
}

function AdminOrdersPage() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [query, setQuery] = useState('');

    useEffect(() => {
        api.get('/admin/orders')
            // бэкенд отдаёт findAll() без сортировки — свежие заказы наверх
            .then(({ data }) => setOrders([...data].sort((a, b) => b.id - a.id)))
            .catch(err => setError(getErrorMessage(err, 'Не удалось загрузить заказы.')));
    }, []);

    function handleStatusChange(order, status) {
        return api.patch(`/orders/${order.id}/status`, { status })
            .then(({ data }) => {
                setOrders(current => current.map(o => (o.id === order.id ? data : o)));
                showToast({ title: `${formatOrderNumber(order.id)} updated`, body: `Status: ${getOrderStatus(status).label}` });
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось сменить статус.')));
    }

    const counts = orders?.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {}) ?? {};
    // ищем по номеру заказа (#SM-0012), логину и email покупателя
    const q = query.trim().toLowerCase();
    const visible = orders?.filter(o =>
        (filter === 'ALL' || o.status === filter) &&
        (!q || [formatOrderNumber(o.id), o.customerUsername, o.customerEmail].some(v => v?.toLowerCase().includes(q)))
    ) ?? [];

    return (
        <>
            <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Orders</h1>
            <p className="mb-6 text-[15px] text-ink-400">Open an order to see the customer and items. Change the status as it moves to delivery.</p>

            <label htmlFor="order-search" className="sr-only">Search orders</label>
            <input
                id="order-search"
                type="search"
                placeholder="Search by order number, customer or email…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="mb-4 h-11 w-full max-w-[420px] rounded-full border border-line bg-white px-5 text-[15px] outline-none focus:border-brand-600"
            />

            <div className="mb-5 flex flex-wrap gap-2">
                {FILTERS.map(f => {
                    const count = f.id === 'ALL' ? orders?.length : counts[f.id];
                    const active = filter === f.id;
                    return (
                        <button
                            key={f.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setFilter(f.id)}
                            className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold ${
                                active ? 'border-brand-600 bg-tint-100 text-tint-900' : 'border-line bg-white text-ink-900 hover:border-line-divider'
                            }`}
                        >
                            {f.label}{count ? ` · ${count}` : ''}
                        </button>
                    );
                })}
            </div>

            {error && <div className="mb-4"><FormError message={error} /></div>}
            {!orders && !error && <p className="text-[15px] text-ink-400">Loading orders…</p>}
            {orders && visible.length === 0 && (
                <p className="rounded-[18px] border border-line bg-white px-5 py-10 text-center text-[15px] text-ink-400">No orders here.</p>
            )}
            {visible.map(order => <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />)}
        </>
    );
}

export default AdminOrdersPage;
