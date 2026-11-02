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

export function getNextStatuses(status) {
    return NEXT_STATUSES[status] ?? [];
}

export function getOrderStatus(status) {
    return ORDER_STATUSES[status] ?? { label: status, className: 'bg-surface-100 text-ink-600' };
}
