import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import api from '../api/client';
import AuthShell, { HeaderButton, Field, PasswordInput, FormError, SubmitButton } from '../components/AuthShell';
import { inputClass, getErrorMessage } from '../utils/forms';
import { BoardPlaceholder } from '../components/ProductCard';
import { useAuth } from '../context/auth';

const PERKS = [
    'Track every order from payment to your door',
    'Save boards to a wishlist and get told when they are back',
    'Checkout faster with saved addresses',
    'Members-only demo days and early access to new arrivals',
];

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // после входа возвращаем туда, откуда отправили на логин
    const redirectTo = location.state?.from ?? '/';

    if (user) return <Navigate to={redirectTo} replace />;

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        api.post('/auth/login', { username, password })
            .then(response => {
                login(response.data);
                navigate(redirectTo, { replace: true });
            })
            .catch(err => {
                setError(getErrorMessage(err, 'Не удалось войти. Проверьте имя пользователя и пароль.'));
                setLoading(false);
            });
    }

    return (
        <AuthShell
            headerAction={<HeaderButton to="/register">Create account</HeaderButton>}
            aside={
                <aside className="flex min-w-0 flex-[1_1_420px] items-center bg-deep-900 px-10 py-14 text-deep-text">
                    <div className="max-w-[420px]">
                        <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-sun">MEMBERS GET MORE</p>
                        <h2 className="mb-5 text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white">
                            Keep your gear, orders and wishlist together
                        </h2>
                        {PERKS.map(perk => (
                            <p key={perk} className="mb-4 flex items-start gap-3 text-base leading-[1.55]">
                                <CircleCheck size={20} strokeWidth={1.8} className="mt-0.5 flex-none text-deep-accent" />
                                {perk}
                            </p>
                        ))}
                        <div className="mt-8 flex flex-col items-center gap-3 rounded-[20px] bg-deep-800 p-6">
                            <BoardPlaceholder width={220} />
                            <p className="text-[13px] font-semibold tracking-[0.08em] text-brand-light">[LIFESTYLE PHOTO]</p>
                        </div>
                    </div>
                </aside>
            }
        >
            <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
                <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">Sign in</h1>
                <p className="mb-[30px] text-base leading-[1.6] text-ink-600">
                    Your orders, wishlist and saved addresses, all in one place.
                </p>

                <div className="flex flex-col gap-[18px]">
                    <Field id="l-username" label="Username">
                        <input
                            id="l-username"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field id="l-password" label="Password">
                        <PasswordInput
                            id="l-password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Field>

                    <FormError message={error} />

                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
                        <input type="checkbox" defaultChecked className="h-[18px] w-[18px] cursor-pointer accent-brand-600" />
                        <span>Keep me signed in</span>
                    </label>

                    <SubmitButton loading={loading}>{loading ? 'Signing in…' : 'Sign in'}</SubmitButton>
                </div>

                <p className="mt-7 text-[15px] text-ink-600">
                    New here? <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">Create an account</Link> — it takes a minute.
                </p>
                <p className="mt-[18px] text-[13px] leading-[1.6] text-ink-400">
                    By signing in you accept our <Link to="/contacts" className="text-brand-600">terms of sale</Link> and{' '}
                    <Link to="/contacts" className="text-brand-600">privacy policy</Link>.
                </p>
            </form>
        </AuthShell>
    );
}

export default LoginPage;
