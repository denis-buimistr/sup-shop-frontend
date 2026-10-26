import { Link } from 'react-router-dom';
import { CircleCheck, X } from 'lucide-react';
import { useToast } from '../context/toast';

// Уведомления в правом верхнем углу: «Added to cart», «Order placed»
function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div
            aria-live="polite"
            className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-32px)] max-w-[360px] flex-col gap-3"
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    role="status"
                    className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_28px_-10px_rgba(14,42,51,0.3)]"
                >
                    <CircleCheck size={22} strokeWidth={1.8} className="mt-px flex-none text-brand-600" />
                    <div className="min-w-0 flex-grow">
                        <p className="text-[15px] font-bold text-ink-900">{toast.title}</p>
                        {toast.body && <p className="mt-0.5 truncate text-sm text-ink-600">{toast.body}</p>}
                        {toast.link && (
                            <Link
                                to={toast.link.to}
                                onClick={() => dismiss(toast.id)}
                                className="mt-2 inline-flex text-sm font-bold text-brand-600 hover:text-brand-700"
                            >
                                {toast.link.label}
                            </Link>
                        )}
                    </div>
                    <button
                        type="button"
                        aria-label="Close notification"
                        onClick={() => dismiss(toast.id)}
                        className="-m-1 flex h-8 w-8 flex-none items-center justify-center rounded-full text-ink-400 hover:bg-surface-100 hover:text-ink-900"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Toaster;
