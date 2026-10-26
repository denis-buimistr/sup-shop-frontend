import Logo from './Logo';
import Container from './Container';

// Короткая шапка для корзины и входа/регистрации: логотип, телефон и одно действие
function SimpleHeader({ action }) {
    return (
        <header className="border-b border-line bg-white">
            <Container className="flex flex-wrap items-center justify-between gap-5 py-4">
                <Logo />
                <div className="flex items-center gap-6">
                    <a href="tel:+37368820853" className="text-[15px] font-bold text-ink-900">
                        +373 688 20 853
                    </a>
                    {action}
                </div>
            </Container>
        </header>
    );
}

export default SimpleHeader;
