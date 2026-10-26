import axios from 'axios';
import { loadAuth, clearAuth, AUTH_EXPIRED_EVENT } from '../utils/auth';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(config => {
    const auth = loadAuth();
    if (auth) config.headers.Authorization = `Bearer ${auth.token}`;
    return config;
});

// 401 — сервер не принял токен (истёк или битый), разлогиниваем. 403 — просто нет прав, сессию не трогаем
api.interceptors.response.use(
    response => response,
    error => {
        const sentToken = Boolean(error.config?.headers?.Authorization);

        if (sentToken && error.response?.status === 401) {
            clearAuth();
            window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
        }

        return Promise.reject(error);
    }
);

export default api;
