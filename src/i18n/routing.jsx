import { useEffect } from 'react';
import { Link as RouterLink, Navigate as RouterNavigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG, isPrefixedLang } from './config';
import { localizeTo, useLang } from './hooks';

// обычный Link из роутера, только сам добавляет /ro или /ru. по всему сайту импортирую его вместо роутерного
export function Link({ to, ...props }) {
    return <RouterLink to={localizeTo(to, useLang())} {...props} />;
}

export function Navigate({ to, ...props }) {
    return <RouterNavigate to={localizeTo(to, useLang())} {...props} />;
}

// корневой роут /:lang?. проверяет префикс и переключает i18n, когда язык в адресе поменялся
export function LanguageRoute() {
    const { lang } = useParams();
    const { i18n } = useTranslation();
    const current = lang ?? DEFAULT_LANG;
    const valid = !lang || isPrefixedLang(lang);

    useEffect(() => {
        if (!valid) return;
        if (i18n.language !== current) i18n.changeLanguage(current);
        document.documentElement.lang = current;
    }, [current, valid, i18n]);

    // /xyz — это не язык и не страница, отправляю на главную
    if (!valid) return <RouterNavigate to="/" replace />;
    return <Outlet />;
}
