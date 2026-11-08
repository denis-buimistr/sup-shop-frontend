import axios from 'axios';
import { loadAuth, clearAuth, AUTH_EXPIRED_EVENT } from '../utils/auth';
import { langFromPath } from '../i18n/config';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
    const auth = loadAuth();
    if (auth) config.headers.Authorization = `Bearer ${auth.token}`;
    // по этому заголовку бэкенд отдаёт названия и описания на нужном языке. беру язык из адреса:
    // он уже новый, когда страница начинает грузить данные, а i18n переключается чуть позже
    config.headers['Accept-Language'] = langFromPath(window.location.pathname);
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
