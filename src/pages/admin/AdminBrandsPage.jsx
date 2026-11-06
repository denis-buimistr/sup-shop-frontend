import { useEffect, useState } from 'react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import RowActions from '../../components/RowActions';
import { useToast } from '../../context/toast';
import { getErrorMessage } from '../../utils/forms';

const fieldClass =
    'w-full rounded-lg border border-line-input bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

const EMPTY_FORM = { name: '', description: '' };

const byName = (a, b) => a.name.localeCompare(b.name);

function AdminBrandsPage() {
    const { showToast } = useToast();
    const [brands, setBrands] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    // null — форма добавляет новый бренд, иначе редактирует бренд с этим id
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        api.get('/brands')
            .then(({ data }) => setBrands(data))
            .catch(err => setLoadError(getErrorMessage(err, 'Could not load brands.')));
    }, []);

    function startEdit(brand) {
        setEditingId(brand.id);
        setForm({ name: brand.name, description: brand.description ?? '' });
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError(null);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const body = { name: form.name.trim(), description: form.description.trim() || null };
        const request = editingId ? api.put(`/brands/${editingId}`, body) : api.post('/brands', body);

        request
            .then(({ data }) => {
                // держим тот же порядок, что отдаёт бэкенд: по алфавиту
                setBrands(current => [...current.filter(b => b.id !== data.id), data].sort(byName));
                showToast({ title: editingId ? 'Brand updated' : 'Brand added', body: data.name });
                resetForm();
            })
            .catch(err => setError(getErrorMessage(err, 'Could not save the brand.')))
            .finally(() => setSaving(false));
    }

    function handleDelete(brand) {
        if (!window.confirm(`Delete brand "${brand.name}"?`)) return;
        setDeleteError(null);

        api.delete(`/brands/${brand.id}`)
            .then(() => {
                setBrands(current => current.filter(b => b.id !== brand.id));
                if (editingId === brand.id) resetForm();
                showToast({ title: 'Brand deleted', body: brand.name });
            })
            .catch(err => setDeleteError(getErrorMessage(err, 'Could not delete the brand.')));
    }

    return (
        <>
            <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Brands</h1>
            <p className="mb-6 text-[15px] text-ink-400">Manufacturers you can pick when adding a product.</p>

            <form onSubmit={handleSubmit} className="mb-6 rounded-[20px] border border-line bg-white p-6">
                <h2 className="mb-4 text-[17px] font-bold">{editingId ? 'Edit brand' : 'Add a brand'}</h2>
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
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                    >
                        {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add brand'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border-[1.5px] border-line-divider bg-white px-6 py-3 text-sm font-bold text-ink-900 hover:border-ink-900"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loadError && <FormError message={loadError} />}
            {deleteError && <div className="mb-4"><FormError message={deleteError} /></div>}
            {!brands && !loadError && <p className="text-[15px] text-ink-400">Loading brands…</p>}

            {brands && (
                <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
                    <table className="w-full min-w-[520px] text-sm">
                        <thead className="bg-surface-50 text-left text-xs text-ink-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Brand</th>
                                <th className="px-5 py-3 font-semibold">Description</th>
                                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(b => (
                                <tr key={b.id} className={`border-t border-line ${editingId === b.id ? 'bg-tint-100' : ''}`}>
                                    <td className="px-5 py-3 font-bold text-ink-900">{b.name}</td>
                                    <td className="px-5 py-3 text-ink-600">{b.description || '—'}</td>
                                    <td className="px-5 py-3">
                                        <RowActions name={b.name} onEdit={() => startEdit(b)} onDelete={() => handleDelete(b)} />
                                    </td>
                                </tr>
                            ))}
                            {brands.length === 0 && (
                                <tr><td colSpan={3} className="px-5 py-8 text-center text-ink-400">No brands yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default AdminBrandsPage;
