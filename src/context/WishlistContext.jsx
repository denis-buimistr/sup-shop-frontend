import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './auth';
import { useToast } from './toast';
import { WishlistContext } from './wishlist';
import i18n from '../i18n/config';

const STORAGE_KEY = 'sup-shop-wishlist';
// один и тот же пустой массив, чтобы ids не менялся на каждом рендере
const NO_IDS = [];

function loadGuestIds() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveGuestIds(ids) {
    try {
        if (ids.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        else localStorage.removeItem(STORAGE_KEY);
    } catch {
        // приватный режим может запретить localStorage, тогда избранное гостя живёт до перезагрузки
    }
}

// Гость хранит избранное в браузере, вошедший — на сервере. При входе то, что набрал гость, переезжает в аккаунт
export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [guestIds, setGuestIds] = useState(loadGuestIds);
    // запоминаю, чьё это избранное, чтобы после смены юзера не мелькнул чужой список
    const [server, setServer] = useState({ username: null, ids: NO_IDS });

    const username = user?.username ?? null;

    useEffect(() => {
        if (!username) return;
        const pending = loadGuestIds();
        // сервер уже сохранил список гостя, поэтому чищу браузер сразу, даже если эффект успели отменить
        const request = pending.length
            ? api.post('/wishlist/merge', { productIds: pending }).then(response => {
                saveGuestIds([]);
                return response;
            })
            : api.get('/wishlist');

        let active = true;
        request
            .then(({ data }) => {
                if (!active) return;
                setGuestIds(loadGuestIds());
                setServer({ username, ids: data.productIds });
            })
            .catch(() => active && setServer({ username, ids: NO_IDS }));
        return () => {
            active = false;
        };
    }, [username]);

    const ids = username ? (server.username === username ? server.ids : NO_IDS) : guestIds;

    const toggle = useCallback(product => {
        const isSaved = ids.includes(product.id);
        const next = isSaved ? ids.filter(id => id !== product.id) : [product.id, ...ids];

        if (!isSaved) {
            showToast({ title: i18n.t('toast.addedToWishlist'), body: product.name, link: { to: '/wishlist', label: i18n.t('toast.openWishlist') } });
        }

        if (!username) {
            setGuestIds(next);
            saveGuestIds(next);
            return;
        }

        // меняю сразу, а если сервер откажет, возвращаю как было
        setServer({ username, ids: next });
        const request = isSaved ? api.delete(`/wishlist/${product.id}`) : api.put(`/wishlist/${product.id}`);
        request.catch(() => {
            setServer({ username, ids });
            showToast({ title: i18n.t('toast.wishlistFailed'), body: i18n.t('toast.tryAgain') });
        });
    }, [ids, username, showToast]);

    return (
        <WishlistContext.Provider value={{ ids, count: ids.length, has: id => ids.includes(id), toggle }}>
            {children}
        </WishlistContext.Provider>
    );
}
