import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { CartContext } from '../context/cart';
import { ToastContext } from '../context/toast';
import { WishlistContext } from '../context/wishlist';

// Рисую компонент так, как он живёт в приложении: внутри роутера и контекстов.
// вместо настоящих контекстов — заглушки vi.fn(), чтобы проверить, что компонент их вызвал
export function renderWithApp(ui, { route = '/', wishlistIds = [] } = {}) {
    const cart = { addItem: vi.fn(), items: [], count: 0 };
    const toast = { showToast: vi.fn(), toasts: [], dismiss: vi.fn() };
    const wishlist = { ids: wishlistIds, count: wishlistIds.length, has: id => wishlistIds.includes(id), toggle: vi.fn() };

    const result = render(
        <MemoryRouter initialEntries={[route]}>
            <ToastContext.Provider value={toast}>
                <CartContext.Provider value={cart}>
                    <WishlistContext.Provider value={wishlist}>{ui}</WishlistContext.Provider>
                </CartContext.Provider>
            </ToastContext.Provider>
        </MemoryRouter>
    );
    return { ...result, cart, toast, wishlist };
}
