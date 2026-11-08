import { Link } from '../i18n/routing';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

function Logo() {
    const { t } = useTranslation();
    return (
        <Link to="/" className="flex shrink-0 items-center" aria-label={t('header.home')}>
            <img src={logo} alt="SUP Shop Moldova" width="157" height="60" className="h-[48px] w-auto sm:h-[60px]" />
        </Link>
    );
}

export default Logo;
