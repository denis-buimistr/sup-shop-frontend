import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Logo() {
    return (
        <Link to="/" className="flex shrink-0 items-center" aria-label="SUP Shop Moldova — home">
            <img src={logo} alt="SUP Shop Moldova" width="157" height="60" className="h-[48px] w-auto sm:h-[60px]" />
        </Link>
    );
}

export default Logo;
