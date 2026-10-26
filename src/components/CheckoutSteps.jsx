import { Check } from 'lucide-react';
import Container from './Container';

const STEPS = ['Cart', 'Delivery', 'Payment'];

// Полоса шагов корзина → доставка → оплата. В макете оформления доставка и оплата на одной странице,
// поэтому активными могут быть сразу несколько шагов
function CheckoutSteps({ done = [], active = [] }) {
    return (
        <div className="border-b border-line bg-surface-50">
            <Container as="ol" className="flex flex-wrap items-center gap-x-[18px] gap-y-2.5 py-[18px]">
                {STEPS.map((step, i) => {
                    const isDone = done.includes(i);
                    const isActive = active.includes(i);

                    let circle = 'border-line-divider bg-white text-ink-400';
                    if (isActive) circle = 'border-brand-600 bg-brand-600 text-white';
                    if (isDone) circle = 'border-tint-300 bg-tint-100 text-tint-900';

                    return (
                        <li key={step} className="flex items-center gap-2.5">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[13px] font-bold ${circle}`}>
                                {isDone ? <Check size={15} strokeWidth={2.6} aria-label="Done" /> : i + 1}
                            </span>
                            <span className={`text-[15px] ${isActive ? 'font-bold text-ink-900' : 'font-medium text-ink-400'}`}>
                                {step}
                            </span>
                            {i < STEPS.length - 1 && <span className="ml-2 h-px w-10 bg-line-divider" />}
                        </li>
                    );
                })}
            </Container>
        </div>
    );
}

export default CheckoutSteps;
