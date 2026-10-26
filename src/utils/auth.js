const STORAGE_KEY = 'sup-shop-auth';

// Событие для AuthProvider: сервер не принял токен, нужно разлогинить
export const AUTH_EXPIRED_EVENT = 'sup-shop:auth-expired';

// Время жизни берём из самого JWT (поле exp), чтобы не держать просроченный токен
function isExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

// Ответ /auth/login и /auth/register: { token, username, roles }
export function saveAuth(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // приватный режим — сессия живёт до перезагрузки
    }
}

export function loadAuth() {
    try {
        const auth = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!auth?.token || isExpired(auth.token)) return null;
        return auth;
    } catch {
        return null;
    }
}

export function clearAuth() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // нечего чистить
    }
}
