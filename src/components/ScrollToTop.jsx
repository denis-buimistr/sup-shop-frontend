import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { stripLang } from '../i18n/config';

// роутер сам не крутит страницу наверх, поэтому после перехода с низа главной каталог открывался у футера.
// смену языка (/catalog → /ru/catalog) за переход не считаю, там человек остаётся на месте
function ScrollToTop() {
    const page = stripLang(useLocation().pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    return null;
}

export default ScrollToTop;
