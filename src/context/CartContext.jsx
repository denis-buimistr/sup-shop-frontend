import { useEffect, useState } from 'react';
import { CartContext } from './cart';

const STORAGE_KEY = 'sup-shop-cart';

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // приватный режим — корзина живёт до перезагрузки
        }
    }, [items]);

    function addItem(product, qty = 1) {
        setItems(current => {
            const existing = current.find(item => item.id === product.id);
            const max = product.quantity ?? Infinity;

            if (existing) {
                return current.map(item =>
                    item.id === product.id
                        ? { ...item, qty: Math.min(max, item.qty + qty) }
                        : item
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    brandName: product.brandName,
                    price: product.price,
                    stock: product.quantity,
                    image: product.image ?? null,
                    qty: Math.min(max, qty),
                },
            ];
        });
    }

    function setQty(id, qty) {
        setItems(current =>
            current.map(item =>
                item.id === id
                    ? { ...item, qty: Math.max(1, Math.min(item.stock ?? Infinity, qty)) }
                    : item
            )
        );
    }

    function removeItem(id) {
        setItems(current => current.filter(item => item.id !== id));
    }

    function clearCart() {
        setItems([]);
    }

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ items, count, subtotal, addItem, setQty, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
