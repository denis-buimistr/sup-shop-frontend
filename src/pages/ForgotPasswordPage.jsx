import { useState } from 'react';
import { Link } from '../i18n/routing';
import { MailCheck } from 'lucide-react';
import api from '../api/client';
import AuthShell, { HeaderButton, Field, FormError, SubmitButton } from '../components/AuthShell';
import { inputClass, getErrorMessage } from '../utils/forms';
import { useTranslation } from 'react-i18next';

function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        api.post('/auth/forgot-password', { email })
            .then(() => setSent(true))
            .catch(err => setError(getErrorMessage(err, t('errors.forgotPassword'))))
            .finally(() => setLoading(false));
    }

    return (
        <AuthShell headerAction={<HeaderButton to="/login">{t('forgot.backToSignIn')}</HeaderButton>}>
            <div className="w-full max-w-[440px]">
                {sent ? (
                    // бэкенд отвечает одинаково, есть такая почта или нет, поэтому и текст осторожный
                    <>
                        <MailCheck size={40} strokeWidth={1.6} className="mb-5 text-brand-600" />
                        <h1 className="mb-2.5 text-[34px] font-extrabold tracking-[-0.025em]">{t('forgot.sentTitle')}</h1>
                        <p className="mb-7 text-base leading-[1.6] text-ink-600">{t('forgot.sentText', { email })}</p>
                        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">{t('forgot.backToSignIn')}</Link>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">{t('forgot.title')}</h1>
                        <p className="mb-[30px] text-base leading-[1.6] text-ink-600">{t('forgot.subtitle')}</p>

                        <div className="flex flex-col gap-[18px]">
                            <Field id="f-email" label={t('forgot.email')}>
                                <input
                                    id="f-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </Field>

                            <FormError message={error} />

                            <SubmitButton loading={loading}>{loading ? t('forgot.submitting') : t('forgot.submit')}</SubmitButton>
                        </div>
                    </form>
                )}
            </div>
        </AuthShell>
    );
}

export default ForgotPasswordPage;
