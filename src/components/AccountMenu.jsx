import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/auth';

const MENU_LINKS = [
    { label: 'My orders', to: '/profile' },
    { label: 'Settings', to: '/profile?tab=settings' },
];

// Гость видит ссылку на вход; вошедший — своё имя и выпадающее меню из макета (Nav · Account menu)
function AccountMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
        }

        function handleEscape(event) {
            if (event.key === 'Escape') setOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    if (!user) {
        return (
            <Link to="/login" className="flex items-center gap-2 hover:text-brand-600">
                <User size={22} strokeWidth={1.8} />
                <span className="hidden md:inline">Sign in</span>
            </Link>
        );
    }

    function handleLogout() {
        setOpen(false);
        logout();
        navigate('/');
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 hover:text-brand-600"
            >
                <User size={22} strokeWidth={1.8} />
                <span className="hidden max-w-[140px] truncate md:inline">{user.username}</span>
                <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-[260px] rounded-[18px] border border-line bg-white p-3 shadow-[0_10px_28px_-10px_rgba(14,42,51,0.22)]"
                >
                    <div className="mb-2 flex items-center gap-3 border-b border-surface-100 px-3 pb-4 pt-2.5">
                        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-deep-900 text-base font-bold uppercase text-white">
                            {user.username.slice(0, 2)}
                        </span>
                        <span className="min-w-0 truncate text-[15px] font-bold text-ink-900">{user.username}</span>
                    </div>

                    {MENU_LINKS.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className="block rounded-[10px] px-3 py-2.5 text-[15px] font-normal text-ink-900 hover:bg-surface-50"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/cart"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block rounded-[10px] px-3 py-2.5 text-[15px] font-normal text-ink-900 hover:bg-surface-50"
                    >
                        Cart
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] font-semibold text-danger hover:bg-surface-50"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default AccountMenu;
