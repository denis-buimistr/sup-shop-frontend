import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '../i18n/routing';
import { CircleCheck } from 'lucide-react';
import api from '../api/client';
import AuthShell, { HeaderButton, Field, PasswordInput, FormError, SubmitButton } from '../components/AuthShell';
import { inputClass, getErrorMessage } from '../utils/forms';
import { useTranslation } from 'react-i18next';

// сюда ведёт ссылка из письма: /reset-password?token=...
function ResetPasswordPage() {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const token = params.get('token') ?? '';
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    // ссылку на новое письмо показываю, только если сервер отклонил токен, а не при опечатке в повторе пароля
    const [tokenRejected, setTokenRejected] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) {
            setError(t('register.errors.mismatch'));
            return;
        }
        setError(null);
        setLoading(true);

        api.post('/auth/reset-password', { token, newPassword: password })
            .then(() => setDone(true))
            .catch(err => {
                setError(getErrorMessage(err, t('errors.resetPassword')));
                setTokenRejected(err.response?.status === 400);
            })
            .finally(() => setLoading(false));
    }

    return (
        <AuthShell headerAction={<HeaderButton to="/login">{t('forgot.backToSignIn')}</HeaderButton>}>
            <div className="w-full max-w-[440px]">
                {done ? (
                    <>
                        <CircleCheck size={40} strokeWidth={1.6} className="mb-5 text-brand-600" />
                        <h1 className="mb-2.5 text-[34px] font-extrabold tracking-[-0.025em]">{t('reset.doneTitle')}</h1>
                        <p className="mb-7 text-base leading-[1.6] text-ink-600">{t('reset.doneText')}</p>
                        <Link
                            to="/login"
                            className="inline-flex h-[54px] items-center rounded-full bg-brand-600 px-8 text-base font-bold text-white hover:bg-brand-700"
                        >
                            {t('reset.goToSignIn')}
                        </Link>
                    </>
                ) : !token ? (
                    // открыли страницу без токена, например обрезали ссылку при копировании
                    <>
                        <h1 className="mb-2.5 text-[34px] font-extrabold tracking-[-0.025em]">{t('reset.title')}</h1>
                        <p className="mb-7 text-base leading-[1.6] text-ink-600">{t('reset.noToken')}</p>
                        <Link to="/forgot-password" className="font-bold text-brand-600 hover:text-brand-700">{t('reset.requestNew')}</Link>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">{t('reset.title')}</h1>
                        <p className="mb-[30px] text-base leading-[1.6] text-ink-600">{t('reset.subtitle')}</p>

                        <div className="flex flex-col gap-[18px]">
                            <Field id="rp-password" label={t('reset.password')} hint={t('reset.passwordHint')}>
                                <PasswordInput
                                    id="rp-password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Field>

                            <Field id="rp-confirm" label={t('register.repeatPassword')}>
                                <input
                                    id="rp-confirm"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    className={inputClass}
                                />
                            </Field>

                            <FormError message={error} />
                            {tokenRejected && (
                                <Link to="/forgot-password" className="text-sm font-bold text-brand-600 hover:text-brand-700">
                                    {t('reset.requestNew')}
                                </Link>
                            )}

                            <SubmitButton loading={loading}>{loading ? t('reset.submitting') : t('reset.submit')}</SubmitButton>
                        </div>
                    </form>
                )}
            </div>
        </AuthShell>
    );
}

export default ResetPasswordPage;
