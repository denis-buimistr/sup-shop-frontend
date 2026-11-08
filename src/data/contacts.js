// Контакты магазина в одном месте: страница контактов, оформление заказа
export const PHONE = '+373 688 20 853';
export const PHONE_HREF = 'tel:+37368820853';

export const SHOWROOM = 'str. Albișoara 4, Chișinău';
export const SHOWROOM_POSTCODE = 'MD-2005, Moldova';

// подпись отдела в contacts.emails.<key>
export const EMAILS = [
    { key: 'general', address: 'hello@supshop.md' },
    { key: 'service', address: 'service@supshop.md' },
    { key: 'b2b', address: 'b2b@supshop.md' },
];

export const MESSENGERS = [
    { name: 'WhatsApp', href: 'https://wa.me/37368820853' },
    { name: 'Viber', href: 'viber://chat?number=%2B37368820853' },
    { name: 'Telegram', href: 'https://t.me/+37368820853' },
];

// Часы шоурума по дням недели (0 — воскресенье), null — выходной
export const SHOWROOM_HOURS = [null, [10, 19], [10, 19], [10, 19], [10, 19], [10, 19], [10, 16]];
