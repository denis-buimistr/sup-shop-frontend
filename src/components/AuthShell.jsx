import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import SimpleHeader from './SimpleHeader';
import { inputClass } from '../utils/forms';

// Общий каркас для входа и регистрации: форма слева, панель с преимуществами справа
function AuthShell({ headerAction, children, aside }) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SimpleHeader action={headerAction} />
            <main className="flex flex-grow flex-wrap items-stretch">
                <div className="flex min-w-0 flex-[999_1_460px] items-center justify-center px-6 py-14">
                    {children}
                </div>
                {aside}
            </main>
        </div>
    );
}

export function HeaderButton({ to, children }) {
    return (
        <Link
            to={to}
            className="inline-flex rounded-full border-[1.5px] border-ink-900 bg-white px-[22px] py-[11px] text-sm font-bold text-ink-900 hover:bg-surface-50"
        >
            {children}
        </Link>
    );
}

export function Field({ id, label, hint, children }) {
    return (
        <p className="relative flex flex-col gap-[7px]">
            <label htmlFor={id} className="text-sm font-semibold">{label}</label>
            {children}
            {hint && <span className="text-[13px] text-ink-400">{hint}</span>}
        </p>
    );
}

export function PasswordInput({ id, autoComplete, value, onChange }) {
    const [reveal, setReveal] = useState(false);

    return (
        <span className="relative flex">
            <input
                id={id}
                type={reveal ? 'text' : 'password'}
                autoComplete={autoComplete}
                required
                value={value}
                onChange={onChange}
                className={`${inputClass} w-full pr-[92px]`}
            />
            <button
                type="button"
                onClick={() => setReveal(r => !r)}
                className="absolute right-2.5 top-1.5 h-10 px-3.5 text-sm font-semibold text-brand-600"
            >
                {reveal ? 'Hide' : 'Show'}
            </button>
        </span>
    );
}

export function FormError({ message }) {
    if (!message) return null;
    return (
        <p role="alert" className="flex items-start gap-[7px] text-[13px] font-semibold text-danger">
            <CircleAlert size={15} strokeWidth={2} className="mt-px flex-none" />
            {message}
        </p>
    );
}

export function SubmitButton({ loading, children }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="h-[54px] rounded-full bg-brand-600 text-base font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
            {children}
        </button>
    );
}

export default AuthShell;
