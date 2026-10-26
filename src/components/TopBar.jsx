import { Link } from 'react-router-dom';
import { Truck, Award, Store, MessageCircle, Phone, ChevronDown } from 'lucide-react';

function TopBar() {
    return (
        <div className="bg-deep-900 text-[13px] text-[#CFE0E5]">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-7 gap-y-3 min-h-10 px-6 py-1.5">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2.5">
          <span className="flex items-center gap-2">
            <Truck size={16} strokeWidth={1.8} className="text-brand-light" />
            Free delivery in Moldova for orders over 2,000 MDL
          </span>
                    <span className="hidden items-center gap-2 lg:flex">
            <Award size={16} strokeWidth={1.8} className="text-brand-light" />
            Expert advice from real paddlers
          </span>
                    <span className="hidden items-center gap-2 xl:flex">
            <Store size={16} strokeWidth={1.8} className="text-brand-light" />
            Visit our showroom in Chișinău
          </span>
                </div>

                <div className="flex items-center gap-5">
                    <button type="button" className="flex items-center gap-1 py-1.5 hover:text-white">
                        MDL
                        <ChevronDown size={14} strokeWidth={1.8} />
                    </button>

                    <button type="button" className="flex items-center gap-1 py-1.5 hover:text-white">
                        EN
                        <ChevronDown size={14} strokeWidth={1.8} />
                    </button>

                    <Link to="/contacts" className="flex items-center gap-2 text-brand-light hover:text-white">
                        <MessageCircle size={16} strokeWidth={1.8} />
                        Contact us
                    </Link>

                    <a
                        href="tel:+37368820853"
                        className="flex items-center gap-[7px] rounded-full bg-deep-700 px-3.5 py-[5px] font-semibold text-white"
                    >
                        <Phone size={14} strokeWidth={1.8} className="text-brand-light" />
                        +373 688 20 853
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;