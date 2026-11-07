import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Star, Trash2 } from 'lucide-react';
import api from '../../api/client';
import { FormError } from '../../components/AuthShell';
import { useToast } from '../../context/toast';
import { getErrorMessage } from '../../utils/forms';
import { flattenTree } from '../../utils/categories';

// Значения enum Product.BoardType на бэкенде; пусто — не доска (весло, гидрокостюм, насос…)
const BOARD_TYPES = [
    { id: '', label: 'Not a board' },
    { id: 'INFLATABLE', label: 'Inflatable' },
    { id: 'HARDBOARD', label: 'Hardboard' },
];

const EMPTY = { name: '', description: '', price: '', compareAtPrice: '', quantity: '', brandId: '', categoryId: '', boardType: '' };

const fieldClass =
    'w-full rounded-lg border border-line-input bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600 disabled:bg-surface-50 disabled:text-ink-400';

function Field({ id, label, hint, children }) {
    return (
        <p className="flex min-w-0 flex-col gap-[7px]">
            <label htmlFor={id} className="text-sm font-semibold">{label}</label>
            {children}
            {hint && <span className="text-[13px] text-ink-400">{hint}</span>}
        </p>
    );
}

// Фото можно добавить только к сохранённому товару: бэкенду нужен его id (POST /products/{id}/images)
function ImagesSection({ productId, images, onChange }) {
    const { showToast } = useToast();
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    async function handleFiles(e) {
        const files = [...e.target.files];
        e.target.value = '';
        if (files.length === 0) return;

        setError(null);
        setUploading(true);
        let current = images;

        try {
            // по одному: первое фото товара становится главным, порядок сохраняется как выбрали
            for (const file of files) {
                const form = new FormData();
                form.append('file', file);
                const { data } = await api.post(`/products/${productId}/images`, form, {
                    params: { primary: current.length === 0 },
                });
                current = [...current, data];
                onChange(current);
            }
            showToast({ title: files.length > 1 ? `${files.length} photos uploaded` : 'Photo uploaded' });
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось загрузить фото.'));
        } finally {
            setUploading(false);
        }
    }

    function handleDelete(image) {
        setError(null);
        api.delete(`/products/${productId}/images/${image.id}`)
            .then(() => onChange(images.filter(i => i.id !== image.id)))
            .catch(err => setError(getErrorMessage(err, 'Не удалось удалить фото.')));
    }

    return (
        <fieldset className="m-0 min-w-0 rounded-[20px] border border-line bg-white p-6">
            <legend className="px-2.5 text-[17px] font-bold">Photos</legend>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map(image => (
                    <div key={image.id} className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-100">
                        <img src={image.imageUrl} alt="" className="max-h-full max-w-full object-contain p-2" />
                        {image.primary && (
                            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-deep-900 px-2 py-0.5 text-[11px] font-bold text-white">
                                <Star size={11} strokeWidth={2.4} /> Main
                            </span>
                        )}
                        <button
                            type="button"
                            aria-label="Delete photo"
                            onClick={() => handleDelete(image)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-danger shadow hover:bg-surface-50"
                        >
                            <Trash2 size={15} strokeWidth={2} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line-divider bg-white text-sm font-bold text-brand-600 hover:border-brand-600 disabled:opacity-60"
                >
                    <ImagePlus size={24} strokeWidth={1.8} />
                    {uploading ? 'Uploading…' : 'Add photos'}
                </button>
            </div>

            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <p className="mt-3 text-[13px] text-ink-400">JPG, PNG or WebP up to 5 MB. The first photo becomes the main one in the catalog.</p>
            {error && <div className="mt-3"><FormError message={error} /></div>}
        </fieldset>
    );
}

// Новый бренд прямо из формы товара, чтобы не терять введённое и не уходить в раздел Brands
function NewBrandInline({ onCreated }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    function handleAdd() {
        if (!name.trim()) return;
        setError(null);
        setSaving(true);
        api.post('/brands', { name: name.trim() })
            .then(({ data }) => {
                onCreated(data);
                setName('');
                setOpen(false);
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось создать бренд.')))
            .finally(() => setSaving(false));
    }

    if (!open) {
        return (
            <button type="button" onClick={() => setOpen(true)} className="self-start text-[13px] font-semibold text-brand-600 hover:text-brand-700">
                + New brand
            </button>
        );
    }

    // не <form>: она оказалась бы внутри формы товара, а вложенные формы в HTML запрещены
    return (
        <span className="flex flex-col gap-2">
            <span className="flex gap-2">
                <label htmlFor="p-new-brand" className="sr-only">New brand name</label>
                <input
                    id="p-new-brand"
                    autoFocus
                    maxLength={100}
                    placeholder="Brand name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className={`${fieldClass} h-10 min-w-0 flex-grow`}
                />
                <button
                    type="button"
                    disabled={saving}
                    onClick={handleAdd}
                    className="flex-none rounded-full bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                    {saving ? '…' : 'Add'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="flex-none px-1 text-sm font-semibold text-ink-400 hover:text-ink-900">
                    Cancel
                </button>
            </span>
            {error && <FormError message={error} />}
        </span>
    );
}

function AdminProductFormPage() {
    const { id } = useParams();
    const isNew = !id;
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [form, setForm] = useState(EMPTY);
    const [images, setImages] = useState([]);
    const [brands, setBrands] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Бренды и категории нужны для выпадающих списков; ProductResponse отдаёт только их названия, id ищем по ним
        const brandsRequest = api.get('/brands').then(r => r.data).catch(() => null);
        const categoriesRequest = api.get('/categories').then(r => r.data).catch(() => []);
        const productRequest = isNew ? Promise.resolve(null) : api.get(`/products/${id}`).then(r => r.data);

        Promise.all([brandsRequest, categoriesRequest, productRequest])
            .then(([brandList, categoryList, product]) => {
                setBrands(brandList);
                setCategories(categoryList);
                if (product) {
                    setForm({
                        name: product.name ?? '',
                        description: product.description ?? '',
                        price: product.price ?? '',
                        compareAtPrice: product.compareAtPrice ?? '',
                        quantity: product.quantity ?? '',
                        brandId: brandList?.find(b => b.name === product.brandName)?.id ?? '',
                        categoryId: categoryList.find(c => c.name === product.categoryName)?.id ?? '',
                        boardType: product.boardType ?? '',
                    });
                    setImages(product.images ?? []);
                }
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось загрузить товар.')))
            .finally(() => setLoading(false));
    }, [id, isNew]);

    function update(field) {
        return e => setForm(current => ({ ...current, [field]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        // ProductRequest на бэкенде: пустые селекты отправляем как null
        const body = {
            name: form.name.trim(),
            description: form.description.trim() || null,
            price: Number(form.price),
            compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
            quantity: Number(form.quantity),
            brandId: form.brandId ? Number(form.brandId) : null,
            categoryId: form.categoryId ? Number(form.categoryId) : null,
            boardType: form.boardType || null,
        };

        const request = isNew ? api.post('/products', body) : api.put(`/products/${id}`, body);

        request
            .then(({ data }) => {
                if (isNew) {
                    showToast({ title: 'Product created', body: 'Now add some photos' });
                    navigate(`/admin/products/${data.id}`, { replace: true });
                } else {
                    showToast({ title: 'Changes saved', body: data.name });
                }
            })
            .catch(err => setError(getErrorMessage(err, 'Не удалось сохранить товар.')))
            .finally(() => setSaving(false));
    }

    if (loading) return <p className="text-[15px] text-ink-400">Loading…</p>;

    return (
        <>
            <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-brand-600">
                <ArrowLeft size={16} strokeWidth={2} /> All products
            </Link>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="text-[30px] font-extrabold tracking-[-0.02em]">{isNew ? 'New product' : form.name || 'Edit product'}</h1>
                {!isNew && (
                    <Link to={`/products/${id}`} target="_blank" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                        View in shop ↗
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <fieldset className="m-0 min-w-0 rounded-[20px] border border-line bg-white p-6">
                        <legend className="px-2.5 text-[17px] font-bold">Details</legend>
                        <div className="flex flex-col gap-4">
                            <Field id="p-name" label="Name">
                                <input id="p-name" required maxLength={200} value={form.name} onChange={update('name')} placeholder="Starboard All Star 14'0 x 24.5" className={`${fieldClass} h-12`} />
                            </Field>
                            <Field id="p-description" label="Description" hint="Shown on the product page under the Description tab.">
                                <textarea id="p-description" rows={6} value={form.description} onChange={update('description')} className={`${fieldClass} resize-y py-3 leading-[1.6]`} />
                            </Field>
                        </div>
                    </fieldset>

                    <fieldset className="m-0 min-w-0 rounded-[20px] border border-line bg-white p-6">
                        <legend className="px-2.5 text-[17px] font-bold">Price, stock and type</legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field id="p-price" label="Price, MDL">
                                <input id="p-price" type="number" required min="0" step="0.01" inputMode="decimal" value={form.price} onChange={update('price')} className={`${fieldClass} h-12`} />
                            </Field>
                            <Field id="p-compare" label="Old price, MDL" hint="Fill in only for a discount: the shop shows it crossed out.">
                                <input id="p-compare" type="number" min="0" step="0.01" inputMode="decimal" value={form.compareAtPrice} onChange={update('compareAtPrice')} className={`${fieldClass} h-12`} />
                            </Field>
                            <Field id="p-quantity" label="In stock, pcs">
                                <input id="p-quantity" type="number" required min="0" step="1" inputMode="numeric" value={form.quantity} onChange={update('quantity')} className={`${fieldClass} h-12`} />
                            </Field>
                            <Field id="p-category" label="Category">
                                <select id="p-category" value={form.categoryId} onChange={update('categoryId')} className={`${fieldClass} h-12 cursor-pointer px-3`}>
                                    <option value="">No category</option>
                                    {flattenTree(categories).map(c => (
                                        <option key={c.id} value={c.id}>{'\u00A0\u00A0'.repeat(c.depth)}{c.name}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                id="p-brand"
                                label="Brand"
                                hint={brands ? null : 'Brands can’t be loaded — is the backend running?'}
                            >
                                <select id="p-brand" disabled={!brands} value={form.brandId} onChange={update('brandId')} className={`${fieldClass} h-12 cursor-pointer px-3`}>
                                    <option value="">No brand</option>
                                    {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                {brands && (
                                    <NewBrandInline
                                        onCreated={brand => {
                                            setBrands(current => [...current, brand].sort((a, b) => a.name.localeCompare(b.name)));
                                            setForm(current => ({ ...current, brandId: brand.id }));
                                        }}
                                    />
                                )}
                            </Field>
                            <Field id="p-type" label="Board type" hint="Leave “Not a board” for paddles and gear.">
                                <select id="p-type" value={form.boardType} onChange={update('boardType')} className={`${fieldClass} h-12 cursor-pointer px-3`}>
                                    {BOARD_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </Field>
                        </div>
                    </fieldset>

                    {error && <FormError message={error} />}

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-full bg-brand-600 px-[30px] py-[15px] text-[15px] font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                        >
                            {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
                        </button>
                        <Link
                            to="/admin/products"
                            className="rounded-full border-[1.5px] border-line-divider bg-white px-7 py-3.5 text-[15px] font-bold text-ink-900 hover:border-ink-900"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

                {isNew ? (
                    <p className="rounded-[20px] border border-dashed border-line-divider bg-white p-6 text-sm text-ink-400">
                        Photos can be added after the product is created.
                    </p>
                ) : (
                    <ImagesSection productId={id} images={images} onChange={setImages} />
                )}
            </div>
        </>
    );
}

export default AdminProductFormPage;
