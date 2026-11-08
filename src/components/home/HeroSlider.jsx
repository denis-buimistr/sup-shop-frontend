import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../Container';
import inflatablePhoto from '../../assets/hero/inflatable.webp';
import racePhoto from '../../assets/hero/race.webp';
import robesPhoto from '../../assets/hero/robes.webp';
import foilPhoto from '../../assets/hero/foil.jpg';

// у каждого слайда свои цвета неба, воды и доски — сцена одна и та же, меняется только палитра
const SLIDES = [
    {
        eyebrow: 'RACE & TOURING',
        title: 'Built for distance, tuned for speed',
        body: 'Race and touring boards from Starboard, Red Paddle Co and Fanatic — in stock in Chișinău.',
        cta: { label: 'Shop race boards', to: '/catalog/touring-race' },
        cta2: { label: 'How to choose', to: '/catalog/sup' },
        alt: 'Two paddlers turning Starboard race boards on open water',
        photo: racePhoto,
        photoPosition: '50% 40%',
        // люди на фото по центру и места под текст нет — фото справа, текст на тёмной части слева
        photoLayout: 'split',
        textSide: 'left',
        sky: '#DCEAEF', sun: '#F2B544', hill: '#0E4B5A', water1: '#0B6475', water2: '#0E7E93', water3: '#13A0B4',
        board: '#C62B12', bodyInk: '#44585F', chipBg: '#C62B12', ctaBg: '#0B7A91', outline: '#0A2A3B',
    },
    {
        eyebrow: 'INFLATABLE BOARDS',
        title: 'Packs into a bag, rides like a board',
        body: 'Inflatables from Red Paddle Co, Fanatic and Starboard — stiff decks, light weight, easy to carry.',
        cta: { label: 'Shop inflatables', to: '/catalog/inflatable-boards' },
        cta2: { label: 'Compare by price', to: '/catalog/inflatable-boards?sort=price,asc' },
        alt: 'Three paddlers on Starboard inflatable boards on a turquoise lake',
        photo: inflatablePhoto,
        // три доски по центру кадра — как у Race, фото справа, текст слева
        photoPosition: '50% 50%',
        photoLayout: 'split',
        sky: '#F6EDDD', sun: '#E88B4C', hill: '#1F5B50', water1: '#15657A', water2: '#1A7E8E', water3: '#2FA3A8',
        board: '#F2B544', bodyInk: '#4A5A52', chipBg: '#B2552A', ctaBg: '#0A2A3B', outline: '#8A6A4A',
    },
    {
        eyebrow: 'FOIL & WING',
        title: 'Lift off the water this season',
        body: 'Wings, foils and foil boards from Starboard and SIC Maui. We help you pick sizes before you buy.',
        cta: { label: 'Shop foil & wing', to: '/catalog/foil-wing' },
        cta2: { label: 'Ask an expert', to: '/contacts' },
        alt: 'A rider flying a wing foil above the water',
        photo: foilPhoto,
        // исходник был панорамой с двумя райдерами и на широких экранах резался — обрезал заранее до райдера с крылом
        photoPosition: '50% 50%',
        photoLayout: 'split',
        sky: '#E3EFE4', sun: '#8FBF5A', hill: '#1C5540', water1: '#13646A', water2: '#17807E', water3: '#2AA396',
        board: '#15794A', bodyInk: '#42554B', chipBg: '#15794A', ctaBg: '#0B7A91', outline: '#2C6B52',
    },
    {
        eyebrow: 'CHANGING ROBES & LAYERS',
        title: 'The season lasts as long as you stay warm',
        body: 'Waterproof changing robes, ponchos and quick dry tops for cold mornings on the water.',
        cta: { label: 'Shop changing robes', to: '/catalog/changing-robes' },
        cta2: { label: 'All clothing', to: '/catalog/clothing' },
        alt: 'Two friends in changing robes sharing a snack next to a kayak by a lake',
        photo: robesPhoto,
        // фото почти квадратное: справа целиком не влезет, держу в кадре лица и робы
        photoPosition: '50% 30%',
        photoLayout: 'split',
        sky: '#E2E6EC', sun: '#B9C6D2', hill: '#2B4254', water1: '#1E4B60', water2: '#255F77', water3: '#35809A',
        board: '#5EC4CD', bodyInk: '#45545F', chipBg: '#0B7A91', ctaBg: '#0B7A91', outline: '#4A5F70',
    },
];

const AUTOPLAY_MS = 8000;

function HeroSlider() {
    const [index, setIndex] = useState(0);
    const slide = SLIDES[index];

    // листаю сам каждые 8 секунд, но не тем, у кого в системе выключены анимации
    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setTimeout(() => setIndex(i => (i + 1) % SLIDES.length), AUTOPLAY_MS);
        return () => clearTimeout(timer);
    }, [index]);

    const go = step => setIndex(i => (i + step + SLIDES.length) % SLIDES.length);

    const hasPhoto = Boolean(slide.photo);
    const textRight = hasPhoto && slide.textSide === 'right';
    const split = hasPhoto && slide.photoLayout === 'split';

    return (
        <section
            aria-label="Featured collections"
            aria-roledescription="carousel"
            className="relative overflow-hidden transition-colors duration-500"
            style={{ background: hasPhoto ? '#0A2A3B' : slide.sky }}
        >
            {hasPhoto && (
                <>
                    <img
                        key={slide.photo}
                        src={slide.photo}
                        alt={slide.alt}
                        className={`absolute right-0 top-0 h-full w-full object-cover ${split ? 'lg:w-[62%]' : ''}`}
                        style={{ objectPosition: slide.photoPosition }}
                    />
                    {/* затемняю ту сторону, где текст, чтобы он читался на любой фотке; на телефоне — всё фото */}
                    <div className="absolute inset-0 bg-ink-900/55 sm:hidden" />
                    <div
                        className="absolute inset-0 hidden sm:block"
                        style={{
                            background: split
                                ? 'linear-gradient(to right, #0A2A3B 0%, #0A2A3B 38%, rgba(10,42,59,0.55) 46%, rgba(10,42,59,0) 58%)'
                                : `linear-gradient(to ${textRight ? 'left' : 'right'}, rgba(10,42,59,0.85) 0%, rgba(10,42,59,0.6) 38%, rgba(10,42,59,0) 68%)`,
                        }}
                    />
                </>
            )}

            <Container className={`relative flex min-h-[540px] flex-wrap items-center gap-10 lg:min-h-[640px] ${textRight ? 'justify-end' : ''}`}>
                <div className={`relative z-[2] min-w-0 py-14 ${hasPhoto ? 'max-w-[560px]' : 'flex-[999_1_420px]'}`}>
                    <p className="mb-4 inline-flex rounded-full px-4 py-2 text-xs font-bold tracking-[0.16em] text-white" style={{ background: slide.chipBg }}>
                        {slide.eyebrow}
                    </p>
                    <h1 className={`mb-5 max-w-[560px] text-[40px] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-[64px] ${hasPhoto ? 'text-white' : 'text-ink-900'}`}>
                        {slide.title}
                    </h1>
                    <p className="mb-8 max-w-[480px] text-lg leading-[1.6]" style={{ color: hasPhoto ? '#E6EFF2' : slide.bodyInk }}>{slide.body}</p>
                    <div className="flex flex-wrap items-center gap-3.5">
                        <Link to={slide.cta.to} className="inline-flex items-center gap-2.5 rounded-full px-[34px] py-[18px] text-base font-bold text-white hover:opacity-90" style={{ background: hasPhoto ? '#0B7A91' : slide.ctaBg }}>
                            {slide.cta.label} →
                        </Link>
                        <Link
                            to={slide.cta2.to}
                            className={`inline-flex rounded-full border-[1.5px] px-[30px] py-[17px] text-base font-bold ${hasPhoto ? 'border-white text-white hover:bg-white/10' : 'text-ink-900 hover:bg-white/50'}`}
                            style={hasPhoto ? undefined : { borderColor: slide.outline }}
                        >
                            {slide.cta2.label}
                        </Link>
                    </div>
                </div>

                {!hasPhoto && (
                    <div className="relative flex min-w-0 flex-[1_1_480px] items-end self-stretch">
                        <PaddlerScene slide={slide} />
                    </div>
                )}
            </Container>

            <Container className="relative z-[2] flex flex-wrap items-center gap-4 pb-[26px]">
                <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] bg-white/75" style={{ borderColor: hasPhoto ? '#ffffff' : slide.outline }}>
                    <ChevronLeft size={18} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next slide" className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] bg-white/75" style={{ borderColor: hasPhoto ? '#ffffff' : slide.outline }}>
                    <ChevronRight size={18} strokeWidth={2.2} />
                </button>
                <div className="ml-2 flex gap-2.5">
                    {SLIDES.map((s, n) => (
                        <button
                            key={s.eyebrow}
                            type="button"
                            onClick={() => setIndex(n)}
                            aria-label={`Show slide ${n + 1}: ${s.eyebrow}`}
                            aria-current={n === index}
                            className={`h-2 rounded-full transition-all ${n === index ? 'w-[34px]' : 'w-2 opacity-40'} ${hasPhoto ? 'bg-white' : 'bg-ink-900'}`}
                        />
                    ))}
                </div>
                <p className="ml-auto text-[13px] font-semibold" style={{ color: hasPhoto ? '#E6EFF2' : slide.bodyInk }}>
                    {index + 1} / {SLIDES.length} — {slide.eyebrow}
                </p>
            </Container>
        </section>
    );
}

// нарисованная сцена вместо фото: солнце, холмы, три полосы воды и человек на доске
function PaddlerScene({ slide }) {
    return (
        <svg viewBox="0 0 640 460" className="block h-auto w-full" role="img" aria-label={slide.alt}>
            <circle cx="498" cy="112" r="62" fill={slide.sun} />
            <path d="M0 236c70-44 132-46 196-16s118 34 186 6 174-40 258 10v224H0Z" fill={slide.hill} />
            <path d="M0 286h640v174H0Z" fill={slide.water1} />
            <path d="M0 286c58 0 58 18 116 18s58-18 116-18 58 18 116 18 58-18 116-18 58 18 116 18 60-18 60-18v174H0Z" fill={slide.water2} />
            <path d="M0 368c54 0 54 16 108 16s54-16 108-16 54 16 108 16 54-16 108-16 54 16 108 16 100-16 100-16v92H0Z" fill={slide.water3} />
            <path d="M70 330h84M486 348h96M170 396h70" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
            <path d="M196 322c0 0 44-20 118-20s124 20 124 20-50 20-124 20-118-20-118-20Z" fill={slide.board} />
            <path d="M196 322c0 0 44-20 118-20s124 20 124 20" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" />
            <g fill="#0A2A3B">
                <circle cx="318" cy="166" r="15" />
                <path d="M318 184c13 0 22 9 23 21l3 31-8 1-5-22-3 22-5 24h-11l3-26-5-29c0-12 8-22 8-22Z" />
                <path d="M330 206h10l22-14" stroke="#0A2A3B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M310 208h-9l-16 18" stroke="#0A2A3B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M376 152 272 300" stroke="#0A2A3B" strokeWidth="7" strokeLinecap="round" />
                <path d="M266 290h22l-10 32c-8-2-14-10-16-22Z" />
            </g>
            <ellipse cx="262" cy="330" rx="26" ry="7" fill="#ffffff" opacity="0.55" />
            <circle cx="238" cy="322" r="5" fill="#ffffff" opacity="0.5" />
            <circle cx="226" cy="336" r="3.5" fill="#ffffff" opacity="0.4" />
            <path d="M96 128c8-8 16-8 24 0m8 0c8-8 16-8 24 0" fill="none" stroke="#0A2A3B" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

export default HeroSlider;
