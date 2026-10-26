import { Link } from 'react-router-dom';
import { CircleCheck, Minus, Plus, Truck } from 'lucide-react';
import SimpleHeader from '../components/SimpleHeader';
import Container from '../components/Container';
import CheckoutSteps from '../components/CheckoutSteps';
import SimpleFooter from '../components/SimpleFooter';
import { BoardPlaceholder } from '../components/ProductCard';
import { useCart, FREE_DELIVERY_FROM } from '../context/cart';
import { formatPrice, getStock } from '../utils/format';

const GUARANTEES = [
    'Secure card payment, 3-D Secure',
    '14 days to return unused gear',
    '2-year official warranty, service in Chișinău',
];

function CartPage() {
    const { items, count, subtotal, setQty, removeItem } = useCart();
    const freeDelivery = subtotal >= FREE_DELIVERY_FROM;
    const progress = Math.min(100, (subtotal / FREE_DELIVERY_FROM) * 100);

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SimpleHeader
                action={
                    <Link to="/catalog" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                        Continue shopping
                    </Link>
                }
            />

            <CheckoutSteps active={[0]} />

            <Container as="main" className="flex-grow pt-8">
                <h1 className="mb-1.5 text-[38px] font-extrabold tracking-[-0.025em] text-ink-900">Your cart</h1>
                <p className="mb-7 text-base text-ink-400">{count} items</p>

                <div className="flex flex-wrap items-start gap-7">
                    <div className="min-w-0 flex-[999_1_560px]">
                        {items.length > 0 && (
                            <div className="mb-5 rounded-2xl border border-tint-300 bg-tint-100 px-5 py-4">
                                <p className="mb-2.5 flex items-center gap-2.5 text-[15px] font-semibold text-tint-900">
                                    {freeDelivery ? <CircleCheck size={18} strokeWidth={1.8} /> : <Truck size={18} strokeWidth={1.8} />}
                                    {freeDelivery
                                        ? 'Your order qualifies for free delivery across Moldova'
                                        : `Add ${formatPrice(FREE_DELIVERY_FROM - subtotal)} more for free delivery`}
                                </p>
                                <div className="h-1.5 overflow-hidden rounded-full bg-white">
                                    <span className="block h-full bg-brand-600" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        <div className="overflow-hidden rounded-[22px] border border-line">
                            {items.map(item => {
                                const stock = getStock(item.stock);
                                return (
                                    <div key={item.id} className="flex flex-wrap gap-5 border-b border-surface-100 p-[22px] last:border-b-0">
                                        <Link
                                            to={`/products/${item.id}`}
                                            className="flex h-[100px] w-[120px] flex-none items-center justify-center overflow-hidden rounded-[14px] bg-surface-100"
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt="" className="max-h-full max-w-full object-contain p-2" />
                                            ) : (
                                                <BoardPlaceholder width={96} />
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-[999_1_240px]">
                                            <p className="mb-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                                                {item.brandName ?? '—'}
                                            </p>
                                            <h2 className="mb-2 text-[17px] font-bold leading-[1.35]">
                                                <Link to={`/products/${item.id}`} className="text-ink-900 hover:text-brand-600">
                                                    {item.name}
                                                </Link>
                                            </h2>
                                            <p className={`mb-3 text-sm font-semibold ${stock.className}`}>{stock.label}</p>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="py-1 text-sm font-semibold text-danger hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="flex h-[46px] flex-none items-center gap-1 rounded-full border-[1.5px] border-line-input p-[3px]">
                                            <button
                                                type="button"
                                                aria-label={`Decrease quantity of ${item.name}`}
                                                onClick={() => setQty(item.id, item.qty - 1)}
                                                className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-ink-900 hover:bg-surface-100"
                                            >
                                                <Minus size={17} />
                                            </button>
                                            <span aria-live="polite" className="min-w-[30px] text-center text-[15px] font-bold">{item.qty}</span>
                                            <button
                                                type="button"
                                                aria-label={`Increase quantity of ${item.name}`}
                                                onClick={() => setQty(item.id, item.qty + 1)}
                                                className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-ink-900 hover:bg-surface-100"
                                            >
                                                <Plus size={17} />
                                            </button>
                                        </div>

                                        <div className="min-w-[140px] flex-none text-right">
                                            <p className="mb-1 text-xl font-extrabold tabular-nums text-ink-900">
                                                {formatPrice(item.price * item.qty)}
                                            </p>
                                            <p className="text-[13px] tabular-nums text-ink-400">{formatPrice(item.price)} each</p>
                                        </div>
                                    </div>
                                );
                            })}

                            {items.length === 0 && (
                                <div className="px-6 py-14 text-center">
                                    <p className="mb-2.5 text-xl font-bold">Your cart is empty</p>
                                    <p className="mb-[22px] text-[15px] text-ink-400">Nothing here yet — the boards are waiting.</p>
                                    <Link
                                        to="/catalog"
                                        className="inline-flex rounded-full bg-brand-600 px-[26px] py-3.5 text-[15px] font-bold text-white hover:bg-brand-700"
                                    >
                                        Browse the catalog
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside aria-label="Order summary" className="min-w-0 flex-[1_1_360px]">
                        <div className="rounded-[22px] border border-line bg-surface-50 p-[26px]">
                            <h2 className="mb-5 text-[22px] font-extrabold tracking-[-0.02em]">Order summary</h2>

                            <p className="mb-3 flex justify-between gap-4 text-[15px] text-ink-600">
                                <span>Subtotal ({count} items)</span>
                                <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                            </p>
                            <p className="mb-3 flex justify-between gap-4 text-[15px] text-ink-600">
                                <span>Delivery across Moldova</span>
                                <span className="font-semibold">{freeDelivery ? 'Free' : 'Calculated at checkout'}</span>
                            </p>
                            <p className="mb-3 flex justify-between gap-4 text-[15px] text-ink-600">
                                <span>Estimated arrival</span>
                                <span className="font-semibold">1–3 working days</span>
                            </p>

                            <p className="my-5 flex items-baseline justify-between gap-4 border-t border-line-divider pt-[18px]">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-[28px] font-extrabold tabular-nums">{formatPrice(subtotal)}</span>
                            </p>
                            <p className="-mt-2.5 mb-5 text-right text-[13px] text-ink-400">VAT included</p>

                            <Link
                                to="/checkout"
                                aria-disabled={items.length === 0}
                                className={`mb-3.5 flex items-center justify-center rounded-full p-[17px] text-[17px] font-bold ${
                                    items.length === 0
                                        ? 'pointer-events-none bg-surface-100 text-ink-400'
                                        : 'bg-brand-600 text-white hover:bg-brand-700'
                                }`}
                            >
                                Proceed to checkout
                            </Link>
                            <Link
                                to="/catalog"
                                className="flex items-center justify-center rounded-full border-[1.5px] border-ink-900 bg-white p-3.5 text-[15px] font-bold text-ink-900 hover:bg-surface-50"
                            >
                                Continue shopping
                            </Link>

                            <div className="mt-[22px] border-t border-line-divider pt-5">
                                {GUARANTEES.map(text => (
                                    <p key={text} className="mb-2.5 flex items-start gap-2.5 text-sm leading-[1.5] text-ink-600">
                                        <CircleCheck size={17} strokeWidth={1.8} className="mt-0.5 flex-none text-brand-600" />
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </Container>

            <SimpleFooter />
        </div>
    );
}

export default CartPage;
