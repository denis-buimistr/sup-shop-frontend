import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// добавляет проверки вроде toBeInTheDocument() и toHaveTextContent()
import '@testing-library/jest-dom/vitest';
import i18n from '../i18n/config';

// после каждого теста убираю отрисованное и возвращаю английский, чтобы тесты не влияли друг на друга
afterEach(() => {
    cleanup();
    i18n.changeLanguage('en');
});
