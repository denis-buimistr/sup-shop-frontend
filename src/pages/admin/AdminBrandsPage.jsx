import { useEffect, useState } from 'react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import { useToast } from '../../context/toast';
import { getErrorMessage } from '../../utils/forms';

const fieldClass =
    'w-full rounded-lg border border-line-input bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

function AdminBrandsPage() {
    const { showToast } = useToast();
    const [brands, setBrands] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/brands')
            .then(({ data }) => setBrands(data))
            .catch(err => setLoadError(getErrorMessage(err, 'Не удалось загрузить бренды.')));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        api.post('/brands', { name: form.name.trim(), description: form.description.trim() || null })
            .then(({ data }) => {
                // держим тот же порядок, что отдаёт бэкенд: по алфавиту
                setBrands(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
                setForm({ name: '', description: '' });
                showToast({ title: 'Brand added', body: data.name });
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось создать бренд.')))
            .finally(() => setSaving(false));
    }

    return (
        <>
            <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Brands</h1>
            <p className="mb-6 text-[15px] text-ink-400">Manufacturers you can pick when adding a product.</p>

            <form onSubmit={handleSubmit} className="mb-6 rounded-[20px] border border-line bg-white p-6">
                <h2 className="mb-4 text-[17px] font-bold">Add a brand</h2>
                <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                    <p className="flex min-w-0 flex-col gap-[7px]">
                        <label htmlFor="b-name" className="text-sm font-semibold">Name</label>
                        <input
                            id="b-name"
                            required
                            maxLength={100}
                            placeholder="NSP"
                            value={form.name}
                            onChange={e => setForm(current => ({ ...current, name: e.target.value }))}
                            className={`${fieldClass} h-12`}
                        />
                    </p>
                    <p className="flex min-w-0 flex-col gap-[7px]">
                        <label htmlFor="b-description" className="text-sm font-semibold">
                            Description <span className="font-normal text-ink-400">(optional)</span>
                        </label>
                        <input
                            id="b-description"
                            placeholder="One line about the brand"
                            value={form.description}
                            onChange={e => setForm(current => ({ ...current, description: e.target.value }))}
                            className={`${fieldClass} h-12`}
                        />
                    </p>
                </div>
                {error && <div className="mt-3"><FormError message={error} /></div>}
                <button
                    type="submit"
                    disabled={saving}
                    className="mt-4 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                    {saving ? 'Adding…' : 'Add brand'}
                </button>
            </form>

            {loadError && <FormError message={loadError} />}
            {!brands && !loadError && <p className="text-[15px] text-ink-400">Loading brands…</p>}

            {brands && (
                <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
                    <table className="w-full min-w-[480px] text-sm">
                        <thead className="bg-surface-50 text-left text-xs text-ink-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Brand</th>
                                <th className="px-5 py-3 font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(b => (
                                <tr key={b.id} className="border-t border-line">
                                    <td className="px-5 py-3 font-bold text-ink-900">{b.name}</td>
                                    <td className="px-5 py-3 text-ink-600">{b.description || '—'}</td>
                                </tr>
                            ))}
                            {brands.length === 0 && (
                                <tr><td colSpan={2} className="px-5 py-8 text-center text-ink-400">No brands yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default AdminBrandsPage;
