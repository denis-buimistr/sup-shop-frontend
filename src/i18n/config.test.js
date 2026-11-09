import { describe, expect, it } from 'vitest';
import { langFromPath, localizePath, stripLang } from './config';

// язык живёт в URL: английский без префикса, ro и ru с префиксом. на этих функциях держатся все ссылки сайта
describe('language in URL', () => {
    it('reads the language from the first path segment', () => {
        expect(langFromPath('/ru/catalog/sup')).toBe('ru');
        expect(langFromPath('/ro')).toBe('ro');
        expect(langFromPath('/catalog')).toBe('en');
        // похоже на язык, но такого нет — значит английский
        expect(langFromPath('/de/catalog')).toBe('en');
    });

    it('strips the language prefix', () => {
        expect(stripLang('/ru/catalog/sup')).toBe('/catalog/sup');
        expect(stripLang('/ro')).toBe('/');
        expect(stripLang('/catalog')).toBe('/catalog');
    });

    it('adds the prefix only where it belongs', () => {
        expect(localizePath('/catalog', 'ru')).toBe('/ru/catalog');
        expect(localizePath('/', 'ro')).toBe('/ro');
        expect(localizePath('/catalog', 'en')).toBe('/catalog');
        // уже локализованный путь второй раз не префиксую: иначе после логина вышло бы /ru/ru/checkout
        expect(localizePath('/ru/checkout', 'ru')).toBe('/ru/checkout');
        // админка одна на английском
        expect(localizePath('/admin/orders', 'ru')).toBe('/admin/orders');
        // относительные ссылки не трогаю
        expect(localizePath('orders', 'ru')).toBe('orders');
    });
});
