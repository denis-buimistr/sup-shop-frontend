import { useCallback } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { langFromPath, localizePath, stripLang } from './config';

// язык всегда беру из адреса, а не из i18n: так ссылки сразу правильные, даже пока язык переключается
export function useLang() {
    return langFromPath(useLocation().pathname);
}

export function localizeTo(to, lang) {
    if (typeof to === 'string') return localizePath(to, lang);
    if (to && typeof to.pathname === 'string') return { ...to, pathname: localizePath(to.pathname, lang) };
    return to;
}

// navigate из роутера, только сам добавляет /ro или /ru
export function useNavigate() {
    const navigate = useRouterNavigate();
    const lang = useLang();
    return useCallback(
        (to, options) => (typeof to === 'number' ? navigate(to) : navigate(localizeTo(to, lang), options)),
        [navigate, lang]
    );
}

// тот же адрес на другом языке: /catalog/sup?brand=1 → /ru/catalog/sup?brand=1
export function useSwitchLanguage() {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useRouterNavigate();
    return useCallback(code => {
        // меняю язык сразу, не дожидаясь эффекта в LanguageRoute, чтобы не мелькнул старый текст
        i18n.changeLanguage(code);
        navigate(localizePath(stripLang(location.pathname), code) + location.search + location.hash);
    }, [i18n, location, navigate]);
}
