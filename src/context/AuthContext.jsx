import { useEffect, useState } from 'react';
import { AuthContext } from './auth';
import { loadAuth, saveAuth, clearAuth, AUTH_EXPIRED_EVENT } from '../utils/auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadAuth);

    useEffect(() => {
        const handleExpired = () => setUser(null);
        window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    }, []);

    function login(data) {
        saveAuth(data);
        setUser(data);
    }

    function logout() {
        clearAuth();
        setUser(null);
    }

    const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
