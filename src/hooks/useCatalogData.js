import { useEffect, useState } from 'react';
import { useLang } from '../i18n/hooks';
import api from '../api/client';

// Категории и бренды меняются редко: грузим один раз на всё приложение, и меню, и каталог берут их из одного кэша.
// ключ кэша с языком, потому что названия категорий приходят уже переведёнными
const cache = new Map();

// если бэкенд на секунду недоступен (перезапуск), пробую ещё пару раз, иначе меню останется пустым до перезагрузки
function getWithRetry(url, attemptsLeft = 4) {
    return api.get(url).catch(error => {
        if (attemptsLeft <= 1 || error.response) throw error;
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() => getWithRetry(url, attemptsLeft - 1));
    });
}

function load(url, lang) {
    const key = `${lang}:${url}`;
    if (!cache.has(key)) {
        const request = getWithRetry(url)
            .then(response => response.data)
            .catch(error => {
                cache.delete(key);
                throw error;
            });
        cache.set(key, request);
    }
    return cache.get(key);
}

function useCached(url) {
    const lang = useLang();
    const [data, setData] = useState(null);

    useEffect(() => {
        let active = true;
        load(url, lang)
            .then(result => active && setData(result))
            .catch(() => active && setData([]));
        return () => {
            active = false;
        };
    }, [url, lang]);

    return data;
}

export const useCategories = () => useCached('/categories');
export const useBrands = () => useCached('/brands');

// админка поменяла категории или бренды — следующий заход в меню возьмёт свежие
export function invalidateCatalogCache() {
    cache.clear();
}
