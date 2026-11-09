import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../i18n/config';
import ProductCard from './ProductCard';
import { renderWithApp } from '../test/render';

const board = {
    id: 7,
    slug: 'red-paddle-ride',
    name: 'Red Paddle Co 10\'6" Ride',
    brandName: 'Red Paddle Co',
    price: 8990,
    compareAtPrice: 9990,
    quantity: 2,
    boardType: 'INFLATABLE',
    images: [
        { imageUrl: 'front.jpg', primary: true, sortOrder: 0 },
        { imageUrl: 'back.jpg', primary: false, sortOrder: 1 },
    ],
    attributes: [{ name: 'Length', value: '10\'6"' }],
};

// ищу элементы так, как их видит человек или скринридер: по роли и подписи, а не по CSS-классам
describe('ProductCard', () => {
    it('shows price, old price, discount and stock', () => {
        renderWithApp(<ProductCard product={board} />);

        // на страницу товара ведут и фото, и заголовок
        for (const link of screen.getAllByRole('link', { name: board.name })) {
            expect(link).toHaveAttribute('href', '/products/red-paddle-ride');
        }
        expect(screen.getByText('8 990 MDL')).toBeInTheDocument();
        expect(screen.getByText('9 990 MDL')).toBeInTheDocument();
        expect(screen.getByText('−10%')).toBeInTheDocument();
        expect(screen.getByText('Only 2 left')).toBeInTheDocument();
    });

    it('adds to cart with the main photo', async () => {
        const { cart } = renderWithApp(<ProductCard product={board} />);

        await userEvent.click(screen.getByRole('button', { name: 'Add to cart →' }));

        expect(cart.addItem).toHaveBeenCalledWith(expect.objectContaining({ id: 7, image: 'front.jpg' }), 1);
    });

    it('toggles the wishlist heart', async () => {
        const { wishlist } = renderWithApp(<ProductCard product={board} />);

        await userEvent.click(screen.getByRole('button', { name: 'Add to wishlist' }));

        expect(wishlist.toggle).toHaveBeenCalledWith(board);
    });

    it('shows a filled heart for saved products', () => {
        renderWithApp(<ProductCard product={board} />, { wishlistIds: [7] });

        expect(screen.getByRole('button', { name: 'Remove from wishlist' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('flips through photos', async () => {
        renderWithApp(<ProductCard product={board} />);
        const photo = () => screen.getByRole('img', { name: board.name });

        expect(photo()).toHaveAttribute('src', 'front.jpg');
        await userEvent.click(screen.getByRole('button', { name: 'Next photo' }));
        expect(photo()).toHaveAttribute('src', 'back.jpg');
        // после последнего снова первое
        await userEvent.click(screen.getByRole('button', { name: 'Next photo' }));
        expect(photo()).toHaveAttribute('src', 'front.jpg');
    });

    it('offers to notify instead of add when sold out', () => {
        renderWithApp(<ProductCard product={{ ...board, quantity: 0, compareAtPrice: null }} />);

        expect(screen.getByText('Sold out')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Notify me' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Add to cart →' })).not.toBeInTheDocument();
    });

    it('speaks Russian', async () => {
        await i18n.changeLanguage('ru');
        renderWithApp(<ProductCard product={board} />);

        expect(screen.getByRole('button', { name: 'В корзину →' })).toBeInTheDocument();
        expect(screen.getByText('Осталось 2 шт.')).toBeInTheDocument();
    });
});
