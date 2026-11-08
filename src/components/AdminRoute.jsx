import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/auth';
import { DEFAULT_LANG } from '../i18n/config';

// Пускает в /admin только ROLE_ADMIN. Это удобство, а не защита: данные всё равно закрывает бэкенд (hasRole("ADMIN"))
function AdminRoute() {
    const { user, isAdmin } = useAuth();
    const location = useLocation();
    const { i18n } = useTranslation();

    // админка только на английском, а i18n мог остаться русским, если зашли сюда с /ru
    useEffect(() => {
        if (i18n.language !== DEFAULT_LANG) i18n.changeLanguage(DEFAULT_LANG);
    }, [i18n]);

    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default AdminRoute;
