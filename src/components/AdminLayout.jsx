import { Link, NavLink, Outlet } from 'react-router-dom';
import { FolderTree, Package, ShoppingBag, Tag, Users } from 'lucide-react';
import Logo from './Logo';
import Container from './Container';
import { useAuth } from '../context/auth';

const SECTIONS = [
    { to: 'orders', label: 'Orders', icon: ShoppingBag },
    { to: 'products', label: 'Products', icon: Package },
    { to: 'categories', label: 'Categories', icon: FolderTree },
    { to: 'brands', label: 'Brands', icon: Tag },
    { to: 'users', label: 'Users', icon: Users },
];

// Экрана админки в макете нет — собираем из тех же токенов: короткая шапка, меню слева, контент справа
function AdminLayout() {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-surface-50">
            <header className="border-b border-line bg-white">
                <Container className="flex flex-wrap items-center justify-between gap-5 py-4">
                    <div className="flex items-center gap-4">
                        <Logo />
                        <span className="rounded-full bg-deep-900 px-3 py-1 text-xs font-bold tracking-[0.08em] text-white">ADMIN</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-semibold">
                        <span className="text-ink-400">{user.username}</span>
                        <Link to="/" className="text-brand-600 hover:text-brand-700">Back to shop</Link>
                    </div>
                </Container>
            </header>

            <Container className="flex flex-grow flex-wrap items-start gap-8 py-8">
                <nav aria-label="Admin sections" className="min-w-0 flex-[1_1_220px] md:max-w-[240px]">
                    <div className="rounded-[20px] border border-line bg-white p-2.5">
                        {SECTIONS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `mb-0.5 flex items-center gap-3 rounded-xl px-4 py-[13px] text-[15px] ${
                                        isActive ? 'bg-tint-100 font-bold text-tint-900' : 'font-medium text-ink-900 hover:bg-surface-50'
                                    }`
                                }
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <main className="min-w-0 flex-[999_1_640px]">
                    <Outlet />
                </main>
            </Container>
        </div>
    );
}

export default AdminLayout;
