import api from '../api/client';

// Переводы контента в админке: английский в основной форме, тут только ro и ru
export const TRANSLATION_LANGS = [
    { code: 'ro', label: 'Română' },
    { code: 'ru', label: 'Русский' },
];

export function emptyTranslations() {
    return Object.fromEntries(TRANSLATION_LANGS.map(({ code }) => [code, { name: '', description: '' }]));
}

// ответ бэкенда [{ lang, name, description }] → { ro: {...}, ru: {...} } для формы
export function translationsFromResponse(list) {
    const result = emptyTranslations();
    for (const t of list) {
        if (result[t.lang]) result[t.lang] = { name: t.name ?? '', description: t.description ?? '' };
    }
    return result;
}

export function loadTranslations(basePath) {
    return api.get(`${basePath}/translations`).then(({ data }) => translationsFromResponse(data));
}

// сохраняю оба языка. пустые поля бэкенд понимает как «убрать перевод»
export function saveTranslations(basePath, translations) {
    return Promise.all(TRANSLATION_LANGS.map(({ code }) =>
        api.put(`${basePath}/translations/${code}`, {
            name: translations[code].name.trim() || null,
            description: translations[code].description.trim() || null,
        })
    ));
}
