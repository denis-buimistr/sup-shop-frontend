const PAYMENTS = ['VISA', 'Mastercard', 'MAIB', 'MIA', 'Cash'];

function PaymentBadges() {
    return PAYMENTS.map(pay => (
        <span
            key={pay}
            className="flex h-[30px] min-w-[52px] items-center justify-center rounded-md bg-white px-3 text-[11px] font-bold text-ink-900"
        >
            {pay}
        </span>
    ));
}

export default PaymentBadges;
