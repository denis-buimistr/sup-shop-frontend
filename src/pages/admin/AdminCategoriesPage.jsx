import { useEffect, useState } from 'react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import RowActions from '../../components/RowActions';
import { useToast } from '../../context/toast';
import { getErrorMessage } from '../../utils/forms';
import { flattenTree, selfAndDescendantIds } from '../../utils/categories';

const fieldClass =
    'w-full rounded-lg border border-line-input bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

const EMPTY_FORM = { name: '', description: '', parentId: '' };

function AdminCategoriesPage() {
    const { showToast } = useToast();
    const [categories, setCategories] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    // null — форма создаёт новую категорию, иначе редактирует категорию с этим id
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        api.get('/categories')
            .then(({ data }) => setCategories(data))
            .catch(err => setLoadError(getErrorMessage(err, 'Could not load categories.')));
    }, []);

    const tree = categories ? flattenTree(categories) : [];
    const blockedParents = editingId && categories ? selfAndDescendantIds(categories, editingId) : new Set();
    const parentName = id => categories?.find(c => c.id === id)?.name;

    function update(field) {
        return e => setForm(current => ({ ...current, [field]: e.target.value }));
    }

    function startEdit(category) {
        setEditingId(category.id);
        setForm({
            name: category.name,
            description: category.description ?? '',
            parentId: category.parentId ?? '',
        });
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

        const body = {
            name: form.name.trim(),
            description: form.description.trim() || null,
            parentId: form.parentId === '' ? null : Number(form.parentId),
        };
        const request = editingId ? api.put(`/categories/${editingId}`, body) : api.post('/categories', body);

        request
            .then(({ data }) => {
                setCategories(current => [...current.filter(c => c.id !== data.id), data]);
                showToast({ title: editingId ? 'Category updated' : 'Category added', body: data.name });
                resetForm();
            })
            .catch(err => setError(getErrorMessage(err, 'Could not save the category.')))
            .finally(() => setSaving(false));
    }

    function handleDelete(category) {
        if (!window.confirm(`Delete category "${category.name}"?`)) return;
        setDeleteError(null);

        api.delete(`/categories/${category.id}`)
            .then(() => {
                setCategories(current => current.filter(c => c.id !== category.id));
                if (editingId === category.id) resetForm();
                showToast({ title: 'Category deleted', body: category.name });
            })
            .catch(err => setDeleteError(getErrorMessage(err, 'Could not delete the category.')));
    }

    return (
        <>
            <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Categories</h1>
            <p className="mb-6 text-[15px] text-ink-400">The catalog tree. A category with subcategories or products can't be deleted.</p>

            <form onSubmit={handleSubmit} className="mb-6 rounded-[20px] border border-line bg-white p-6">
                <h2 className="mb-4 text-[17px] font-bold">{editingId ? 'Edit category' : 'Add a category'}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <p className="flex min-w-0 flex-col gap-[7px]">
                        <label htmlFor="c-name" className="text-sm font-semibold">Name</label>
                        <input
                            id="c-name"
                            required
                            maxLength={150}
                            placeholder="Touring Paddleboards"
                            value={form.name}
                            onChange={update('name')}
                            className={`${fieldClass} h-12`}
                        />
                    </p>
                    <p className="flex min-w-0 flex-col gap-[7px]">
                        <label htmlFor="c-parent" className="text-sm font-semibold">Parent</label>
                        <select
                            id="c-parent"
                            value={form.parentId}
                            onChange={update('parentId')}
                            className={`${fieldClass} h-12 cursor-pointer px-3`}
                        >
                            <option value="">— Top level —</option>
                            {tree.filter(c => !blockedParents.has(c.id)).map(c => (
                                <option key={c.id} value={c.id}>
                                    {'  '.repeat(c.depth)}{c.name}
                                </option>
                            ))}
                        </select>
                    </p>
                    <p className="flex min-w-0 flex-col gap-[7px] sm:col-span-2">
                        <label htmlFor="c-description" className="text-sm font-semibold">
                            Description <span className="font-normal text-ink-400">(optional)</span>
                        </label>
                        <input
                            id="c-description"
                            placeholder="One line about the category"
                            value={form.description}
                            onChange={update('description')}
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
                        {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add category'}
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
            {!categories && !loadError && <p className="text-[15px] text-ink-400">Loading categories…</p>}

            {categories && (
                <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
                    <table className="w-full min-w-[560px] text-sm">
                        <thead className="bg-surface-50 text-left text-xs text-ink-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Category</th>
                                <th className="px-5 py-3 font-semibold">Parent</th>
                                <th className="px-5 py-3 font-semibold">Description</th>
                                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tree.map(c => (
                                <tr key={c.id} className={`border-t border-line ${editingId === c.id ? 'bg-tint-100' : ''}`}>
                                    <td className="px-5 py-3 text-ink-900" style={{ paddingLeft: `${20 + c.depth * 22}px` }}>
                                        <span className={c.depth === 0 ? 'font-bold' : 'font-semibold'}>
                                            {c.depth > 0 && <span className="mr-1.5 text-ink-400">└</span>}
                                            {c.name}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-ink-600">{parentName(c.parentId) ?? '—'}</td>
                                    <td className="px-5 py-3 text-ink-600">{c.description || '—'}</td>
                                    <td className="px-5 py-3">
                                        <RowActions name={c.name} onEdit={() => startEdit(c)} onDelete={() => handleDelete(c)} />
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr><td colSpan={4} className="px-5 py-8 text-center text-ink-400">No categories yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default AdminCategoriesPage;
