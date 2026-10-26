import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';

// Каждая страница сама задаёт ширину через <Container>, чтобы на главной фоны секций шли на весь экран
function Layout() {
    const { pathname } = useLocation();

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <TopBar />
            <Header />
            <CategoryNav />

            <main className="flex-grow">
                <Outlet />
            </main>

            {/* на главной полоса преимуществ уже есть под hero */}
            <Footer showUsps={pathname !== '/'} />
        </div>
    );
}

export default Layout;
