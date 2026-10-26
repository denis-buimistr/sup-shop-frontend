import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NAVIGATION } from '../data/navigation';

function CategoryNav() {
    const [openLabel, setOpenLabel] = useState(null);
    const navRef = useRef(null);

    useEffect(() => {
        if (!openLabel) return;

        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setOpenLabel(null);
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') setOpenLabel(null);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [openLabel]);

    const activeItem = NAVIGATION.find(item => item.label === openLabel);

    function toggle(item) {
        if (item.columns.length === 0) return;
        setOpenLabel(current => (current === item.label ? null : item.label));
    }

    return (
        <nav
            ref={navRef}
            aria-label="Product categories"
            className="relative border-b border-line bg-white"
        >
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-[26px] gap-y-1 px-6">
                {NAVIGATION.map(item => {
                    const isOpen = openLabel === item.label;
                    const hasMenu = item.columns.length > 0;

                    return hasMenu ? (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => toggle(item)}
                            aria-expanded={isOpen}
                            className={`flex items-center gap-1.5 py-4 text-[13px] font-bold tracking-[0.05em] transition-colors ${
                                isOpen
                                    ? 'text-brand-600 shadow-[inset_0_-3px_0_0_#0B7A91]'
                                    : 'text-ink-900 hover:text-brand-600'
                            }`}
                        >
                            {item.label}
                            <ChevronDown
                                size={11}
                                strokeWidth={2}
                                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    ) : (
                        <Link
                            key={item.label}
                            to="/catalog"
                            className="py-4 text-[13px] font-bold tracking-[0.05em] text-ink-900 hover:text-brand-600"
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {activeItem && (
                <div className="absolute left-0 right-0 top-full z-40 border-t border-line bg-white shadow-[0_18px_36px_-12px_rgba(14,42,51,0.22)]">
                    <div className="mx-auto flex max-w-[1320px] flex-wrap gap-8 px-6 pb-9 pt-8">
                        {activeItem.columns.map(column => (
                            <div key={column.title} className="min-w-0 flex-[1_1_200px]">
                                <p className="mb-3.5 text-[11px] font-bold tracking-[0.12em] text-ink-400">
                                    {column.title}
                                </p>
                                {column.links.map(link => (
                                    <Link
                                        key={link.label}
                                        to="/catalog"
                                        onClick={() => setOpenLabel(null)}
                                        className="flex items-baseline justify-between gap-2.5 py-2 text-[15px] font-medium text-ink-900 hover:text-brand-600"
                                    >
                                        <span>{link.label}</span>
                                        <span className="text-xs text-ink-400">{link.count}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}

                        {activeItem.promo && (
                            <div className="min-w-0 flex-[1_1_300px] rounded-[20px] bg-surface-100 p-6">
                                <p className="mb-2 text-[11px] font-bold tracking-[0.12em] text-brand-600">
                                    {activeItem.promo.eyebrow}
                                </p>
                                <p className="mb-2.5 text-xl font-extrabold leading-[1.25] text-ink-900">
                                    {activeItem.promo.title}
                                </p>
                                <p className="mb-[18px] text-sm leading-[1.55] text-ink-600">
                                    {activeItem.promo.body}
                                </p>
                                <Link
                                    to="/catalog"
                                    onClick={() => setOpenLabel(null)}
                                    className="inline-flex rounded-full bg-brand-600 px-[22px] py-3 text-sm font-bold text-white hover:bg-brand-700"
                                >
                                    {activeItem.promo.cta}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default CategoryNav;