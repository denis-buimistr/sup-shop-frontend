import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

// Пускает в /admin только ROLE_ADMIN. Это удобство, а не защита: данные всё равно закрывает бэкенд (hasRole("ADMIN"))
function AdminRoute() {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default AdminRoute;
