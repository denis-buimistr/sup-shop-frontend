import { describe, expect, it } from 'vitest';
import i18n from '../i18n/config';
import { formatPrice, getStock, sortImages } from './format';

describe('formatPrice', () => {
    it('groups thousands with spaces and rounds', () => {
        expect(formatPrice(12990)).toBe('12 990 MDL');
        expect(formatPrice(489.6)).toBe('490 MDL');
        expect(formatPrice(1234567)).toBe('1 234 567 MDL');
    });
});

describe('getStock', () => {
    it('shows how many are left when stock is low', async () => {
        expect(getStock(0).label).toBe('Out of stock');
        expect(getStock(2).label).toBe('Only 2 left');
        expect(getStock(10).label).toBe('In stock');
    });

    // в русском у «шт.» две разные фразы: осталась 1, осталось 2 — проверяю, что плюралы i18next подхватились
    it('uses Russian plural forms', async () => {
        await i18n.changeLanguage('ru');
        expect(getStock(1).label).toBe('Осталась 1 шт.');
        expect(getStock(2).label).toBe('Осталось 2 шт.');
    });
});

describe('sortImages', () => {
    it('puts the main photo first, then the admin order', () => {
        const images = [
            { imageUrl: 'b', primary: false, sortOrder: 1 },
            { imageUrl: 'c', primary: false, sortOrder: 2 },
            { imageUrl: 'a', primary: true, sortOrder: 3 },
        ];
        expect(sortImages(images).map(i => i.imageUrl)).toEqual(['a', 'b', 'c']);
        expect(sortImages(undefined)).toEqual([]);
    });
});
