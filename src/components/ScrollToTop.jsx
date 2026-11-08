import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// роутер сам не крутит страницу наверх, поэтому после перехода с низа главной каталог открывался у футера.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;
