import { createContext, useContext } from 'react';
import { useToast } from './toast';
import i18n from '../i18n/config';

// Порог бесплатной доставки по Молдове, MDL
export const FREE_DELIVERY_FROM = 2000;

export const CartContext = createContext(null);

export function useCart() {
    return useContext(CartContext);
}

// Кнопки «Add to cart» кладут товар и показывают тост; сам addItem молчит, чтобы «Buy again» не сыпал уведомлениями
export function useAddToCart() {
    const { addItem } = useCart();
    const { showToast } = useToast();

    return (product, qty = 1) => {
        addItem(product, qty);
        showToast({
            title: i18n.t('toast.addedToCart'),
            body: qty > 1 ? `${qty} × ${product.name}` : product.name,
            link: { to: '/cart', label: i18n.t('toast.goToCart') },
        });
    };
}
