// В макете цены пишутся с пробелом между разрядами: 27 500 MDL
export function formatPrice(value) {
    return new Intl.NumberFormat('en-US').format(Math.round(value)).replace(/,/g, ' ') + ' MDL';
}

export function getPrimaryImage(images) {
    if (!images || images.length === 0) return null;
    return images.find(img => img.primary) ?? images[0];
}

// Строка наличия как в макете: «In stock», «Only 2 left», «Out of stock»
export function getStock(quantity) {
    if (!quantity) return { label: 'Out of stock', className: 'text-danger' };
    if (quantity <= 2) return { label: `Only ${quantity} left`, className: 'text-warn' };
    return { label: 'In stock', className: 'text-brand-600' };
}

export const BOARD_TYPE_LABELS = {
    INFLATABLE: 'Inflatable',
    HARD: 'Composite / hard',
    COMPOSITE: 'Composite / hard',
};

export function formatBoardType(type) {
    if (!type) return null;
    return BOARD_TYPE_LABELS[type] ?? type.charAt(0) + type.slice(1).toLowerCase();
}

// Номер заказа как в макете: #SM-0042
export function formatOrderNumber(id) {
    return `#SM-${String(id).padStart(4, '0')}`;
}

// Бэкенд отдаёт LocalDateTime строкой «2026-10-26T14:05:00» — показываем «26 Oct 2026»
export function formatDate(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
