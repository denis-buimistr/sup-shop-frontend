import { Link } from '../i18n/routing';
import Container from './Container';
import PaymentBadges from './PaymentBadges';
import { useTranslation } from 'react-i18next';

const YEAR = new Date().getFullYear();

// Короткий тёмный футер корзины и оформления: копирайт, ссылки на условия и способы оплаты
function SimpleFooter() {
    const { t } = useTranslation();
    return (
        <footer className="mt-14 bg-deep-900 text-deep-text">
            <Container className="flex flex-wrap items-center justify-between gap-6 py-8">
                <p className="text-[13px] text-deep-muted">
                    © {YEAR} SUP Shop Moldova · <Link to="/contacts" className="text-deep-text">{t('footer.links.terms')}</Link> ·{' '}
                    <Link to="/contacts" className="text-deep-text">{t('footer.links.privacy')}</Link>
                </p>
                <div className="flex flex-wrap gap-2.5">
                    <PaymentBadges />
                </div>
            </Container>
        </footer>
    );
}

export default SimpleFooter;
