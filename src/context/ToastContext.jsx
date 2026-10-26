    import { useCallback, useRef, useState } from 'react';
import { ToastContext } from './toast';

const DURATION = 4000;

// Хранит список уведомлений; рисует их <Toaster /> внутри роутера, чтобы в тосте работали <Link>
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(0);

    const dismiss = useCallback(id => {
        setToasts(current => current.filter(t => t.id !== id));
    }, []);

    // toast: { title, body?, link?: { to, label } }
    const showToast = useCallback(toast => {
        const id = ++nextId.current;
        // не больше трёх сразу — при быстрых кликах старые уходят
        setToasts(current => [...current.slice(-2), { ...toast, id }]);
        setTimeout(() => dismiss(id), DURATION);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}
