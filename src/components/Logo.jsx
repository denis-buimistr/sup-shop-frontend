import { Link } from 'react-router-dom';

function Logo() {
    return (
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink-900">
            <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
                <path d="M2 15c4-5 8-5 12 0s8 5 12 0 6-4 6-4" stroke="#0B7A91" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M2 21c4-5 8-5 12 0" stroke="#7FC6D6" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="25" cy="6" r="4" fill="#F2B544" />
            </svg>

            <span className="flex flex-col leading-none">
        <span className="text-[23px] font-extrabold tracking-[-0.01em]">
          SUP <span className="text-brand-600">SHOP</span>
        </span>
        <span className="mt-1 text-[9px] tracking-[0.26em] text-ink-400">
          MOLDOVA
        </span>
      </span>
        </Link>
    );
}

export default Logo;