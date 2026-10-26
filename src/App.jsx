import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Toaster from './components/Toaster';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="products/:id" element={<ProductPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                </Route>

                {/* в макете у корзины, оформления, профиля и входа своя короткая шапка без меню */}
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
