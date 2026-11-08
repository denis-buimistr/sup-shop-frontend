import { useEffect, useState } from 'react';
import api from '../api/client';

// Категории и бренды меняются редко: грузим один раз на всё приложение, и меню, и каталог берут их из одного кэша
const cache = new Map();

// если бэкенд на секунду недоступен (перезапуск), пробую ещё пару раз, иначе меню останется пустым до перезагрузки
function getWithRetry(url, attemptsLeft = 4) {
    return api.get(url).catch(error => {
        if (attemptsLeft <= 1 || error.response) throw error;
        return new Promise(resolve => setTimeout(resolve, 2000)).then(() => getWithRetry(url, attemptsLeft - 1));
    });
}

function load(url) {
    if (!cache.has(url)) {
        const request = getWithRetry(url)
            .then(response => response.data)
            .catch(error => {
                cache.delete(url);
                throw error;
            });
        cache.set(url, request);
    }
    return cache.get(url);
}

function useCached(url) {
    const [data, setData] = useState(null);

    useEffect(() => {
        let active = true;
        load(url)
            .then(result => active && setData(result))
            .catch(() => active && setData([]));
        return () => {
            active = false;
        };
    }, [url]);

    return data;
}

export const useCategories = () => useCached('/categories');
export const useBrands = () => useCached('/brands');

// админка поменяла категории или бренды — следующий заход в меню возьмёт свежие
export function invalidateCatalogCache() {
    cache.clear();
}
