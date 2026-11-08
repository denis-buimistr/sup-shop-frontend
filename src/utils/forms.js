import i18n from '../i18n/config';

export const inputClass =
    'h-[52px] rounded-lg border border-line-input px-4 text-base text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

// Бэкенд отдаёт ошибки валидации строкой «поле: текст; поле: текст»
export function getErrorMessage(error, fallback) {
    if (!error.response) return i18n.t('errors.serverDown');
    return error.response.data?.message ?? fallback;
}
