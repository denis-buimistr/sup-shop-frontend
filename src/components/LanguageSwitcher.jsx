import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../i18n/config';
import { useLang, useSwitchLanguage } from '../i18n/hooks';

// Выпадающий список языков в тёмной полосе над шапкой
function LanguageSwitcher() {
    const { t } = useTranslation();
    const lang = useLang();
    const switchLanguage = useSwitchLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
        const onKey = e => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const current = LANGUAGES.find(l => l.code === lang);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`${t('topbar.language')}: ${current.name}`}
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 py-1.5 hover:text-white"
            >
                {current.label}
                <ChevronDown size={14} strokeWidth={1.8} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div role="menu" className="absolute left-0 top-[calc(100%+6px)] z-50 w-[170px] rounded-xl border border-line bg-white p-1.5 text-ink-900 shadow-[0_10px_28px_-10px_rgba(14,42,51,0.3)]">
                    {LANGUAGES.map(language => (
                        <button
                            key={language.code}
                            type="button"
                            role="menuitem"
                            lang={language.code}
                            onClick={() => {
                                setOpen(false);
                                if (language.code !== lang) switchLanguage(language.code);
                            }}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-surface-50"
                        >
                            {language.name}
                            {language.code === lang && <Check size={15} strokeWidth={2.2} className="text-brand-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Те же языки кнопками в ряд, для мобильного меню, где выпадашка неудобна
export function LanguageButtons({ onSwitch }) {
    const { t } = useTranslation();
    const lang = useLang();
    const switchLanguage = useSwitchLanguage();

    return (
        <div role="group" aria-label={t('topbar.language')} className="flex gap-1.5">
            {LANGUAGES.map(language => (
                <button
                    key={language.code}
                    type="button"
                    lang={language.code}
                    aria-pressed={language.code === lang}
                    aria-label={language.name}
                    onClick={() => {
                        if (language.code !== lang) switchLanguage(language.code);
                        onSwitch?.();
                    }}
                    className={`h-9 min-w-11 rounded-full px-3 text-[13px] font-bold ${
                        language.code === lang ? 'bg-deep-900 text-white' : 'bg-surface-50 text-ink-600'
                    }`}
                >
                    {language.label}
                </button>
            ))}
        </div>
    );
}

export default LanguageSwitcher;
