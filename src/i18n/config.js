import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ro from '../locales/ro.json';
import ru from '../locales/ru.json';

// английский живёт без префикса (/catalog), остальные с префиксом (/ro/catalog, /ru/catalog)
export const DEFAULT_LANG = 'en';
export const LANGUAGES = [
    { code: 'en', label: 'EN', name: 'English', locale: 'en-GB' },
    { code: 'ro', label: 'RO', name: 'Română', locale: 'ro-MD' },
    { code: 'ru', label: 'RU', name: 'Русский', locale: 'ru-MD' },
];
const PREFIXED = LANGUAGES.map(l => l.code).filter(code => code !== DEFAULT_LANG);

export function isPrefixedLang(code) {
    return PREFIXED.includes(code);
}

export function langFromPath(pathname) {
    const first = pathname.split('/')[1];
    return isPrefixedLang(first) ? first : DEFAULT_LANG;
}

// путь без языка: /ru/catalog/sup → /catalog/sup
export function stripLang(pathname) {
    const lang = langFromPath(pathname);
    if (lang === DEFAULT_LANG) return pathname;
    return pathname.slice(lang.length + 1) || '/';
}

// админка одна на английском, её не трогаю. уже локализованный путь тоже не трогаю
export function localizePath(path, lang) {
    if (!path.startsWith('/') || path.startsWith('/admin') || langFromPath(path) !== DEFAULT_LANG) return path;
    if (lang === DEFAULT_LANG) return path;
    return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

export function localeOf(lang) {
    return LANGUAGES.find(l => l.code === lang)?.locale ?? 'en-GB';
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ro: { translation: ro },
        ru: { translation: ru },
    },
    // язык беру из адреса сразу, чтобы при открытии /ru/... не мелькнул английский
    lng: langFromPath(window.location.pathname),
    fallbackLng: DEFAULT_LANG,
    // React сам экранирует текст, второй раз не нужно
    interpolation: { escapeValue: false },
});

export default i18n;
