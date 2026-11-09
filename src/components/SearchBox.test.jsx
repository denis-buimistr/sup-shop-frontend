import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import api from '../api/client';
import SearchBox from './SearchBox';
import { renderWithApp } from '../test/render';

// настоящий axios не нужен: подменяю модуль клиента, и запросы никуда не уходят
vi.mock('../api/client', () => ({ default: { get: vi.fn() } }));

const results = {
    content: [
        { id: 18, slug: 'starboard-enduro-carbon-paddle', name: 'Starboard Enduro Carbon Paddle', brandName: 'Starboard', price: 4290, images: [] },
        { id: 19, slug: 'nsp-vivace-79-carbon-paddle', name: 'NSP Vivace 79 Carbon Paddle', brandName: 'NSP', price: 6790, images: [] },
    ],
    page: { totalElements: 3 },
};

// показывает, куда увёл поиск, чтобы проверить переход по Enter
function CurrentUrl() {
    const location = useLocation();
    return <p data-testid="url">{location.pathname + location.search}</p>;
}

function renderSearch() {
    return renderWithApp(
        <Routes>
            <Route path="/" element={<SearchBox />} />
            <Route path="/catalog" element={<CurrentUrl />} />
        </Routes>
    );
}

describe('SearchBox', () => {
    beforeEach(() => {
        api.get.mockReset();
        api.get.mockResolvedValue({ data: results });
    });

    it('shows suggestions under the field after a pause', async () => {
        renderSearch();

        await userEvent.type(screen.getByLabelText('Search the shop'), 'carbon');

        expect(await screen.findByText('Starboard Enduro Carbon Paddle')).toBeInTheDocument();
        expect(screen.getByText('See all 3 results for “carbon” →')).toBeInTheDocument();
        // debounce: печатал 6 букв, а запрос ушёл один, с полным словом
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith('/products', { params: { q: 'carbon', size: 6 } });
    });

    it('does not search for a single letter', async () => {
        renderSearch();

        await userEvent.type(screen.getByLabelText('Search the shop'), 'c');
        // ждём дольше, чем debounce, и убеждаемся, что запроса так и не было
        await new Promise(resolve => setTimeout(resolve, 400));

        expect(api.get).not.toHaveBeenCalled();
    });

    it('tells when nothing is found', async () => {
        api.get.mockResolvedValue({ data: { content: [], page: { totalElements: 0 } } });
        renderSearch();

        await userEvent.type(screen.getByLabelText('Search the shop'), 'zzz');

        expect(await screen.findByText(/Nothing found for/)).toBeInTheDocument();
    });

    it('opens the results page on Enter', async () => {
        renderSearch();

        await userEvent.type(screen.getByLabelText('Search the shop'), 'red paddle{Enter}');

        expect(await screen.findByTestId('url')).toHaveTextContent('/catalog?q=red%20paddle');
    });
});
