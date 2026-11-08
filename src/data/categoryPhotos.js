import paddles from '../assets/categories/paddles.jpg';
import sup from '../assets/categories/sup.jpg';
import foilWing from '../assets/categories/foil-wing.jpg';
import surf from '../assets/categories/surf.jpg';
import clothing from '../assets/categories/clothing.jpg';
import accessories from '../assets/categories/accessories.jpg';
import supBanner from '../assets/categories/sup-banner.webp';
import foilWingBanner from '../assets/categories/foil-wing-banner.webp';
import surfBanner from '../assets/categories/surf-banner.webp';
import kayakBanner from '../assets/categories/kayak-banner.webp';
import clothingBanner from '../assets/categories/clothing-banner.webp';
import accessoriesBanner from '../assets/categories/accessories-banner.webp';

// фото по slug категории, их берут плитки на главной
export const CATEGORY_PHOTOS = {
    paddles,
    sup,
    'foil-wing': foilWing,
    surf,
    clothing,
    accessories,
};

// широкие фото под шапку каталога и карточку в мега-меню, если есть, беру их вместо фото с плитки.
// position держит людей в кадре, когда края обрезаются
const CATEGORY_BANNERS = {
    sup: { src: supBanner, position: '62% 50%' },
    'foil-wing': { src: foilWingBanner, position: '66% 35%' },
    surf: { src: surfBanner, position: '72% 40%' },
    kayak: { src: kayakBanner, position: '76% 45%' },
    clothing: { src: clothingBanner, position: '76% 40%' },
    accessories: { src: accessoriesBanner, position: '72% 55%' },
};

// у подкатегории своего фото обычно нет, поэтому иду вверх по цепочке и беру первое найденное
export function findCategoryPhoto(path) {
    for (let i = path.length - 1; i >= 0; i--) {
        const slug = path[i].slug;
        if (CATEGORY_BANNERS[slug]) return CATEGORY_BANNERS[slug];
        if (CATEGORY_PHOTOS[slug]) return { src: CATEGORY_PHOTOS[slug], position: '50% 50%' };
    }
    return null;
}
