import i18n from '../i18n/config';

// Статусы Order.Status на бэкенде → подпись и цвет плашки
export const ORDER_STATUSES = {
    NEW: { label: 'Processing', className: 'bg-badge-warm-bg text-badge-warm-ink' },
    PAID: { label: 'Paid', className: 'bg-tint-100 text-tint-900' },
    SHIPPED: { label: 'In delivery', className: 'bg-tint-100 text-tint-900' },
    COMPLETED: { label: 'Delivered', className: 'bg-surface-100 text-ink-600' },
    CANCELLED: { label: 'Cancelled', className: 'bg-surface-100 text-danger' },
};

// Копия Order.Status.canChangeTo с бэкенда: куда можно перевести заказ из текущего статуса
const NEXT_STATUSES = {
    NEW: ['PAID', 'CANCELLED'],
    PAID: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['COMPLETED'],
    COMPLETED: [],
    CANCELLED: [],
};

// DeliveryMethod и PaymentMethod с бэкенда → подпись для людей
export const DELIVERY_LABELS = {
    COURIER_CHISINAU: 'Courier in Chișinău',
    COURIER_MOLDOVA: 'Courier across Moldova',
    PICKUP: 'Pick up at the showroom',
    PARCEL_LOCKER: 'Parcel locker',
};

export const PAYMENT_LABELS = {
    CASH_ON_DELIVERY: 'Cash or card on delivery',
    BANK_TRANSFER: 'Bank transfer',
};

// подписи на текущем языке, английские словари выше остаются для админки
export function getDeliveryLabel(method) {
    return i18n.t(`delivery.${method}`, { defaultValue: DELIVERY_LABELS[method] ?? method });
}

export function getPaymentLabel(method) {
    return i18n.t(`payment.${method}`, { defaultValue: PAYMENT_LABELS[method] ?? method });
}

// у старых заказов deliveryMethod нет, там всё склеено в shippingAddress — просто показываем его
export function formatDelivery(order) {
    const address = [order.city, order.shippingAddress].filter(Boolean).join(', ');
    if (!order.deliveryMethod) return address;
    const label = getDeliveryLabel(order.deliveryMethod);
    return address ? `${label} · ${address}` : label;
}

export function getNextStatuses(status) {
    return NEXT_STATUSES[status] ?? [];
}

export function getOrderStatus(status) {
    const known = ORDER_STATUSES[status];
    if (!known) return { label: status, className: 'bg-surface-100 text-ink-600' };
    return { ...known, label: i18n.t(`orders.status.${status}`, { defaultValue: known.label }) };
}
