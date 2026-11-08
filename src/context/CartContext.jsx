import { useCallback, useEffect, useState } from 'react';
import { CartContext } from './cart';
import { getPrimaryImage } from '../utils/format';

const STORAGE_KEY = 'sup-shop-cart';

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

// что из товара храню в корзине; фото беру главное, чтобы не передавать его руками из каждой кнопки
function toCartFields(product) {
    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brandName: product.brandName,
        price: product.price,
        stock: product.quantity,
        image: product.image ?? getPrimaryImage(product.images)?.imageUrl ?? null,
    };
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

            // если товар уже в корзине — заодно обновляю его данные, вдруг с тех пор поменялись фото или цена
            if (existing) {
                return current.map(item =>
                    item.id === product.id
                        ? { ...item, ...toCartFields(product), qty: Math.min(max, item.qty + qty) }
                        : item
                );
            }

            return [...current, { ...toCartFields(product), qty: Math.min(max, qty) }];
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

    // свежие данные с сервера: корзина живёт в localStorage днями, а цену и фото могли поменять в админке
    // useCallback — чтобы ссылка на функцию не менялась и эффект в корзине не запускался заново на каждый рендер
    const syncItems = useCallback(products => {
        setItems(current =>
            current.map(item => {
                const fresh = products.find(p => p.id === item.id);
                return fresh ? { ...item, ...toCartFields(fresh), qty: Math.max(1, Math.min(item.qty, fresh.quantity || item.qty)) } : item;
            })
        );
    }, []);

    function removeItem(id) {
        setItems(current => current.filter(item => item.id !== id));
    }

    function clearCart() {
        setItems([]);
    }

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ items, count, subtotal, addItem, setQty, removeItem, clearCart, syncItems }}>
            {children}
        </CartContext.Provider>
    );
}
