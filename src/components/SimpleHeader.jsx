import { Phone } from 'lucide-react';
import Logo from './Logo';
import Container from './Container';

// Короткая шапка для корзины и входа/регистрации: логотип, телефон и одно действие.
// Прилипает к верху, как основная, поэтому на телефоне держу её в одну строку: вместо номера только иконка
function SimpleHeader({ action }) {
    return (
        <header className="sticky top-0 z-40 border-b border-line bg-white">
            <Container className="flex items-center justify-between gap-4 py-3 sm:gap-5 sm:py-4">
                <Logo />
                <div className="flex items-center gap-4 sm:gap-6">
                    <a href="tel:+37368820853" aria-label="Call +373 688 20 853" className="flex items-center text-[15px] font-bold text-ink-900">
                        <Phone size={20} strokeWidth={1.8} className="sm:hidden" />
                        <span className="hidden sm:inline">+373 688 20 853</span>
                    </a>
                    {action}
                </div>
            </Container>
        </header>
    );
}

export default SimpleHeader;
