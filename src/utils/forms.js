export const inputClass =
    'h-[52px] rounded-lg border border-line-input px-4 text-base text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

// Бэкенд отдаёт ошибки валидации строкой «поле: текст; поле: текст»
export function getErrorMessage(error, fallback) {
    if (!error.response) return 'Сервер недоступен. Попробуйте позже.';
    return error.response.data?.message ?? fallback;
}
