import visa from '../assets/payments/visa.png';
import mastercard from '../assets/payments/mastercard.png';
import maib from '../assets/payments/maib.png';
import mia from '../assets/payments/mia.png';

const PAYMENTS = [
    { name: 'Visa', logo: visa, height: 'h-3.5' },
    { name: 'Mastercard', logo: mastercard, height: 'h-5' },
    { name: 'MAIB', logo: maib, height: 'h-4' },
    { name: 'MIA', logo: mia, height: 'h-5' },
];

// у логотипов разная форма, поэтому высоту подбираю каждому отдельно, чтобы на глаз они были одного размера
function PaymentBadges() {
    return PAYMENTS.map(({ name, logo, height }) => (
        <span key={name} className="flex h-[30px] min-w-[52px] items-center justify-center rounded-md bg-white px-2.5">
            <img src={logo} alt={name} className={`${height} w-auto`} />
        </span>
    ));
}

export default PaymentBadges;
