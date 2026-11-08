import { Link } from '../i18n/routing';
import { useTranslation } from 'react-i18next';
import { Truck, Award, Store, MessageCircle, Phone, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

function TopBar() {
    const { t } = useTranslation();

    return (
        <div className="hidden bg-deep-900 text-[13px] text-[#CFE0E5] md:block">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-7 gap-y-3 min-h-10 px-6 py-1.5">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
                    <span className="flex items-center gap-2">
                        <Truck size={16} strokeWidth={1.8} className="text-brand-light" />
                        {t('topbar.freeDelivery')}
                    </span>
                    <span className="hidden items-center gap-2 lg:flex">
                        <Award size={16} strokeWidth={1.8} className="text-brand-light" />
                        {t('topbar.expert')}
                    </span>
                    <span className="hidden items-center gap-2 xl:flex">
                        <Store size={16} strokeWidth={1.8} className="text-brand-light" />
                        {t('topbar.showroom')}
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    <button type="button" className="flex items-center gap-1 py-1.5 hover:text-white">
                        MDL
                        <ChevronDown size={14} strokeWidth={1.8} />
                    </button>

                    <LanguageSwitcher />

                    <Link to="/contacts" className="flex items-center gap-2 text-brand-light hover:text-white">
                        <MessageCircle size={16} strokeWidth={1.8} />
                        {t('topbar.contact')}
                    </Link>

                    <a
                        href="tel:+37368820853"
                        className="flex items-center gap-[7px] rounded-full bg-deep-700 px-3.5 py-[5px] font-semibold text-white"
                    >
                        <Phone size={14} strokeWidth={1.8} className="text-brand-light" />
                        +373 688 20 853
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
