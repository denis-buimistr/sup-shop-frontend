import { useState } from 'react';
import { Link, Navigate } from '../i18n/routing';
import { useNavigate } from '../i18n/hooks';
import { useAuth } from '../context/auth';
import api from '../api/client';
import AuthShell, { HeaderButton, Field, PasswordInput, FormError, SubmitButton } from '../components/AuthShell';
import { inputClass, getErrorMessage } from '../utils/forms';
import { Trans, useTranslation } from 'react-i18next';

// тексты в register.perks.<key>
const PERKS = ['warranty', 'faster', 'stock', 'demo'];

// Полоска надёжности пароля из макета: 4 сегмента. возвращаю 0–4, подпись в register.strength.<n>
function getStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[a-zа-я]/.test(password) && /[A-ZА-Я]/.test(password)) score++;
    if (/[^\wа-яА-Я]/.test(password) || password.length >= 12) score++;
    return score;
}

function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', confirm: '' });
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const strength = getStrength(form.password);

    if (user) return <Navigate to="/" replace />;

    function update(field) {
        return e => setForm(current => ({ ...current, [field]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirm) {
            setError(t('register.errors.mismatch'));
            return;
        }
        if (!accepted) {
            setError(t('register.errors.terms'));
            return;
        }

        setLoading(true);
        api.post('/auth/register', {
            username: form.username,
            fullName: form.fullName || null,
            email: form.email,
            password: form.password,
        })
            .then(response => {
                // бэкенд сразу отдаёт токен — пользователь уже вошёл
                login(response.data);
                navigate('/', { replace: true });
            })
            .catch(err => {
                setError(getErrorMessage(err, t('errors.register')));
                setLoading(false);
            });
    }

    return (
        <AuthShell
            headerAction={<HeaderButton to="/login">{t('register.signIn')}</HeaderButton>}
            aside={
                <aside className="flex min-w-0 flex-[1_1_400px] items-center bg-surface-100 px-10 py-12">
                    <div className="max-w-[400px]">
                        <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-brand-600">{t('register.asideEyebrow')}</p>
                        <h2 className="mb-6 text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink-900">
                            {t('register.asideTitle')}
                        </h2>
                        {PERKS.map(perk => (
                            <div key={perk} className="mb-3 rounded-[18px] border border-line bg-white px-5 py-[18px]">
                                <p className="mb-[5px] text-base font-bold text-ink-900">{t(`register.perks.${perk}.title`)}</p>
                                <p className="text-sm leading-[1.55] text-ink-400">{t(`register.perks.${perk}.body`)}</p>
                            </div>
                        ))}
                        <p className="mt-[22px] text-sm leading-[1.6] text-ink-600">
                            {t('register.privacy')}
                        </p>
                    </div>
                </aside>
            }
        >
            <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
                <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">{t('register.title')}</h1>
                <p className="mb-7 text-base leading-[1.6] text-ink-600">
                    {t('register.subtitle')}
                </p>

                <div className="flex flex-col gap-[18px]">
                    <Field id="r-username" label={t('login.username')}>
                        <input id="r-username" autoComplete="username" required minLength={3} maxLength={50} value={form.username} onChange={update('username')} className={inputClass} />
                    </Field>

                    <Field id="r-fullname" label={t('register.fullName')} hint={t('register.fullNameHint')}>
                        <input id="r-fullname" autoComplete="name" maxLength={150} value={form.fullName} onChange={update('fullName')} className={inputClass} />
                    </Field>

                    <Field id="r-email" label={t('checkout.fields.email')} hint={t('register.emailHint')}>
                        <input id="r-email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className={inputClass} />
                    </Field>

                    <Field id="r-password" label={t('login.password')}>
                        <PasswordInput id="r-password" autoComplete="new-password" value={form.password} onChange={update('password')} />
                        <span className="block">
                            <span className="mb-[7px] mt-1 flex gap-1.5">
                                {[0, 1, 2, 3].map(i => (
                                    <span key={i} className={`h-[5px] flex-1 rounded-full ${i < strength ? 'bg-brand-600' : 'bg-line'}`} />
                                ))}
                            </span>
                            <span className="text-[13px] text-ink-600">
                                <Trans i18nKey="register.strengthLine" values={{ label: t(`register.strength.${strength}`) }} components={{ b: <strong className="text-ink-900" /> }} />
                            </span>
                        </span>
                    </Field>

                    <Field id="r-confirm" label={t('register.repeatPassword')}>
                        <input id="r-confirm" type="password" autoComplete="new-password" required value={form.confirm} onChange={update('confirm')} className={inputClass} />
                    </Field>

                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-[1.55] text-ink-600">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={e => setAccepted(e.target.checked)}
                            className="mt-0.5 h-[18px] w-[18px] cursor-pointer accent-brand-600"
                        />
                        <span>
                            <Trans i18nKey="register.accept" components={{ terms: <Link to="/contacts" className="text-brand-600" />, privacy: <Link to="/contacts" className="text-brand-600" /> }} />
                        </span>
                    </label>

                    <FormError message={error} />

                    <SubmitButton loading={loading}>{loading ? t('register.submitting') : t('register.submit')}</SubmitButton>
                </div>

                <p className="mt-[26px] text-[15px] text-ink-600">
                    <Trans i18nKey="register.haveAccount" components={{ link: <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700" /> }} />
                </p>
            </form>
        </AuthShell>
    );
}

export default RegisterPage;
