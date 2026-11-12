import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import { BoardPlaceholder } from '../../components/ProductCard';
import { useToast } from '../../context/toast';
import { formatPrice, getPrimaryImage } from '../../utils/format';
import { getErrorMessage } from '../../utils/forms';

// Удаление на бэкенде мягкое: товар получает статус DISCONTINUED и остаётся в базе (на него ссылаются заказы)
function DeleteButton({ product, onDeleted }) {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleDelete() {
        setLoading(true);
        onDeleted(product).finally(() => {
            setLoading(false);
            setConfirming(false);
        });
    }

    if (!confirming) {
        return (
            <button type="button" onClick={() => setConfirming(true)} className="text-sm font-semibold text-danger hover:underline">
                Delete
            </button>
        );
    }

    return (
        <span className="flex items-center gap-3">
            <button type="button" disabled={loading} onClick={handleDelete} className="text-sm font-bold text-danger hover:underline disabled:opacity-60">
                {loading ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-sm font-semibold text-ink-400 hover:text-ink-900">
                Cancel
            </button>
        </span>
    );
}

function AdminProductsPage() {
    const { showToast } = useToast();
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        // админский эндпоинт: в отличие от /products отдаёт и снятые с продажи (DISCONTINUED)
        api.get('/admin/products', { params: { size: 500, sort: 'id,desc' } })
            .then(({ data }) => setProducts(data.content))
            .catch(err => setError(getErrorMessage(err, 'Не удалось загрузить товары.')));
    }, []);

    function handleDelete(product) {
        return api.delete(`/products/${product.id}`)
            .then(() => {
                setProducts(current => current.map(p => (p.id === product.id ? { ...p, status: 'DISCONTINUED' } : p)));
                showToast({ title: 'Product removed', body: product.name });
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось удалить товар.')));
    }

    const q = query.trim().toLowerCase();
    const visible = products?.filter(p =>
        !q || [p.name, p.brandName, p.categoryName].some(v => v?.toLowerCase().includes(q))
    ) ?? [];

    return (
        <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">Products</h1>
                    <p className="text-[15px] text-ink-400">Boards, paddles and gear. New products appear in the catalog right away.</p>
                </div>
                <Link
                    to="new"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
                >
                    <Plus size={17} strokeWidth={2.2} />
                    Add product
                </Link>
            </div>

            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input
                id="product-search"
                type="search"
                placeholder="Search by name, brand or category…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="mb-5 h-11 w-full max-w-[420px] rounded-full border border-line bg-white px-5 text-[15px] outline-none focus:border-brand-600"
            />

            {error && <div className="mb-4"><FormError message={error} /></div>}
            {!products && !error && <p className="text-[15px] text-ink-400">Loading products…</p>}

            {products && (
                <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="bg-surface-50 text-left text-xs text-ink-400">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Product</th>
                                <th className="px-5 py-3 font-semibold">Category</th>
                                <th className="px-5 py-3 text-right font-semibold">Price</th>
                                <th className="px-5 py-3 text-right font-semibold">Stock</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(p => {
                                const image = getPrimaryImage(p.images);
                                const active = p.status === 'ACTIVE';
                                return (
                                    <tr key={p.id} className={`border-t border-line ${active ? '' : 'bg-surface-50'}`}>
                                        <td className="px-5 py-3">
                                            <span className="flex items-center gap-3">
                                                <span className="flex h-12 w-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-surface-100">
                                                    {image ? (
                                                        <img src={image.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                                                    ) : (
                                                        <BoardPlaceholder width={40} />
                                                    )}
                                                </span>
                                                <span className="min-w-0">
                                                    <Link to={String(p.id)} className="block font-bold text-ink-900 hover:text-brand-600">{p.name}</Link>
                                                    <span className="block text-xs text-ink-400">{p.brandName ?? 'No brand'} · #{p.id}</span>
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-ink-600">{p.categoryName ?? '—'}</td>
                                        <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatPrice(p.price)}</td>
                                        <td className={`px-5 py-3 text-right tabular-nums ${p.quantity === 0 ? 'font-bold text-danger' : ''}`}>{p.quantity}</td>
                                        <td className="px-5 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${active ? 'bg-tint-100 text-tint-900' : 'bg-surface-100 text-ink-400'}`}>
                                                {active ? 'Active' : 'Removed'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="flex items-center justify-end gap-4">
                                                <Link to={String(p.id)} className="text-sm font-semibold text-brand-600 hover:text-brand-700">Edit</Link>
                                                {active && <DeleteButton product={p} onDeleted={handleDelete} />}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {visible.length === 0 && (
                                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink-400">No products found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default AdminProductsPage;
