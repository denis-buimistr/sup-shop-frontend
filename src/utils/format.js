import i18n, { localeOf } from '../i18n/config';

// В макете цены пишутся с пробелом между разрядами: 27 500 MDL
export function formatPrice(value) {
    return new Intl.NumberFormat('en-US').format(Math.round(value)).replace(/,/g, ' ') + ' MDL';
}

// главное фото первым, дальше в порядке из админки. нужно для слайдеров в карточке и на странице товара
export function sortImages(images) {
    return [...(images ?? [])].sort((a, b) => (b.primary - a.primary) || ((a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
}

export function getPrimaryImage(images) {
    if (!images || images.length === 0) return null;
    return images.find(img => img.primary) ?? images[0];
}

// Строка наличия как в макете: «In stock», «Only 2 left», «Out of stock»
export function getStock(quantity) {
    if (!quantity) return { label: i18n.t('stock.out'), className: 'text-danger' };
    if (quantity <= 2) return { label: i18n.t('stock.few', { count: quantity }), className: 'text-warn' };
    return { label: i18n.t('stock.in'), className: 'text-brand-600' };
}

export function formatBoardType(type) {
    if (!type) return null;
    return i18n.t(`boardType.${type}`, { defaultValue: type.charAt(0) + type.slice(1).toLowerCase() });
}

// Номер заказа как в макете: #SM-0042
export function formatOrderNumber(id) {
    return `#SM-${String(id).padStart(4, '0')}`;
}

// Бэкенд отдаёт LocalDateTime строкой «2026-10-26T14:05:00» — показываем «26 Oct 2026», «26 окт. 2026 г.» и т.д.
export function formatDate(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat(localeOf(i18n.language), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
