import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import api from '../api/client';
import AuthShell, { HeaderButton, Field, PasswordInput, FormError, SubmitButton } from '../components/AuthShell';
import { inputClass, getErrorMessage } from '../utils/forms';

const PERKS = [
    { title: 'Warranty without paperwork', body: 'Every purchase is on file — no receipt hunting two years later.' },
    { title: 'Faster checkout', body: 'Saved addresses, nothing retyped.' },
    { title: 'Back-in-stock alerts', body: 'Save a board and we tell you the day it lands.' },
    { title: 'Demo days first', body: 'Members get the invite before the slots go public.' },
];

// Полоска надёжности пароля из макета: 4 сегмента
function getStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[a-zа-я]/.test(password) && /[A-ZА-Я]/.test(password)) score++;
    if (/[^\wа-яА-Я]/.test(password) || password.length >= 12) score++;
    return { score, label: ['too short', 'weak', 'fair', 'good', 'strong'][score] };
}

function RegisterPage() {
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
            setError('Пароли не совпадают');
            return;
        }
        if (!accepted) {
            setError('Примите условия продажи и политику конфиденциальности');
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
                setError(getErrorMessage(err, 'Не удалось создать аккаунт. Попробуйте ещё раз.'));
                setLoading(false);
            });
    }

    return (
        <AuthShell
            headerAction={<HeaderButton to="/login">Sign in</HeaderButton>}
            aside={
                <aside className="flex min-w-0 flex-[1_1_400px] items-center bg-surface-100 px-10 py-12">
                    <div className="max-w-[400px]">
                        <p className="mb-3.5 text-xs font-bold tracking-[0.18em] text-brand-600">WHY REGISTER</p>
                        <h2 className="mb-6 text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink-900">
                            Built for people who buy once and paddle for years
                        </h2>
                        {PERKS.map(perk => (
                            <div key={perk.title} className="mb-3 rounded-[18px] border border-line bg-white px-5 py-[18px]">
                                <p className="mb-[5px] text-base font-bold text-ink-900">{perk.title}</p>
                                <p className="text-sm leading-[1.55] text-ink-400">{perk.body}</p>
                            </div>
                        ))}
                        <p className="mt-[22px] text-sm leading-[1.6] text-ink-600">
                            Your data stays with us and the courier. We never sell it.
                        </p>
                    </div>
                </aside>
            }
        >
            <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
                <h1 className="mb-2.5 text-[38px] font-extrabold tracking-[-0.025em]">Create an account</h1>
                <p className="mb-7 text-base leading-[1.6] text-ink-600">
                    One minute now, faster checkout for every order after.
                </p>

                <div className="flex flex-col gap-[18px]">
                    <Field id="r-username" label="Username">
                        <input id="r-username" autoComplete="username" required minLength={3} maxLength={50} value={form.username} onChange={update('username')} className={inputClass} />
                    </Field>

                    <Field id="r-fullname" label="Full name" hint="Optional — for the courier and invoices.">
                        <input id="r-fullname" autoComplete="name" maxLength={150} value={form.fullName} onChange={update('fullName')} className={inputClass} />
                    </Field>

                    <Field id="r-email" label="Email" hint="We'll send the order confirmations here.">
                        <input id="r-email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className={inputClass} />
                    </Field>

                    <Field id="r-password" label="Password">
                        <PasswordInput id="r-password" autoComplete="new-password" value={form.password} onChange={update('password')} />
                        <span className="block">
                            <span className="mb-[7px] mt-1 flex gap-1.5">
                                {[0, 1, 2, 3].map(i => (
                                    <span key={i} className={`h-[5px] flex-1 rounded-full ${i < strength.score ? 'bg-brand-600' : 'bg-line'}`} />
                                ))}
                            </span>
                            <span className="text-[13px] text-ink-600">
                                Strength: <strong className="text-ink-900">{strength.label}</strong> — at least 8 characters, one number.
                            </span>
                        </span>
                    </Field>

                    <Field id="r-confirm" label="Repeat password">
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
                            I accept the <Link to="/contacts" className="text-brand-600">terms of sale</Link> and the{' '}
                            <Link to="/contacts" className="text-brand-600">privacy policy</Link>.
                        </span>
                    </label>

                    <FormError message={error} />

                    <SubmitButton loading={loading}>{loading ? 'Creating…' : 'Create my account'}</SubmitButton>
                </div>

                <p className="mt-[26px] text-[15px] text-ink-600">
                    Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">Sign in</Link>
                </p>
            </form>
        </AuthShell>
    );
}

export default RegisterPage;
