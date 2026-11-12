import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Link, Navigate} from '../i18n/routing';
import {useNavigate} from '../i18n/hooks';
import {CircleCheck} from 'lucide-react';
import api from '../api/client';
import AuthShell, {HeaderButton, Field, PasswordInput, FormError, SubmitButton} from '../components/AuthShell';
import {inputClass, getErrorMessage} from '../utils/forms';
import {useAuth} from '../context/auth';
import {Trans, useTranslation} from 'react-i18next';

// тексты в login.perks.<key>
const PERKS = ['track', 'wishlist', 'faster', 'demo'];

function LoginPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, login} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // после входа возвращаем туда, откуда отправили на логин
    const redirectTo = location.state?.from ?? '/';

    if (user) return <Navigate to={redirectTo} replace/>;

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        api.post('/auth/login', {username, password})
            .then(response => {
                login(response.data);
                navigate(redirectTo, {replace: true});
            })
            .catch(err => {
                setError(getErrorMessage(err, t('errors.login')));
                setLoading(false);
            });
    }

    return (
        <AuthShell
            headerAction={<HeaderButton to="/register">{t('login.createAccount')}</HeaderButton>}
            aside={
                <aside className="flex min-w-0 flex-[1_1_420px] items-center bg-deep-900 px-10 py-14 text-deep-text">
                    <div className="max-w-[420px]">
                        <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-sun">{t('login.asideEyebrow')}</p>
                        <h2 className="mb-5 text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white">
                            {t('login.asideTitle')}
                        </h2>
                        {PERKS.map(perk => (
                            <p key={perk} className="mb-4 flex items-start gap-3 text-base leading-[1.55]">
                                <CircleCheck size={20} strokeWidth={1.8} className="mt-0.5 flex-none text-deep-accent"/>
                                {t(`login.perks.${perk}`)}
                            </p>
                        ))}
                    </div>
                </aside>
            }
        >
            <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
                <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">{t('login.title')}</h1>
                <p className="mb-[30px] text-base leading-[1.6] text-ink-600">
                    {t('login.subtitle')}
                </p>

                <div className="flex flex-col gap-[18px]">
                    <Field id="l-username" label={t('login.identifier')}>
                        <input
                            id="l-username"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field id="l-password" label={t('login.password')}>
                        <PasswordInput
                            id="l-password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Field>

                    <FormError message={error}/>

                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
                        <input type="checkbox" defaultChecked
                               className="h-[18px] w-[18px] cursor-pointer accent-brand-600"/>
                        <span>{t('login.keepSignedIn')}</span>
                    </label>

                    <SubmitButton loading={loading}>{loading ? t('login.submitting') : t('login.submit')}</SubmitButton>
                </div>

                <p className="mt-7 text-[15px] text-ink-600">
                    <Trans i18nKey="login.newHere" components={{
                        link: <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700"/>
                    }}/>
                </p>
                <p className="mt-[18px] text-[13px] leading-[1.6] text-ink-400">
                    <Trans i18nKey="login.terms" components={{
                        terms: <Link to="/contacts" className="text-brand-600"/>,
                        privacy: <Link to="/contacts" className="text-brand-600"/>
                    }}/>
                </p>
            </form>
        </AuthShell>
    );
}

export default LoginPage;
