import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Toaster from './components/Toaster';
import ScrollToTop from './components/ScrollToTop';
import {LanguageRoute} from './i18n/routing';
import AdminRoute from './components/AdminRoute';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import WishlistPage from './pages/WishlistPage';
import {lazy, Suspense} from 'react';

// админку грузим только при заходе в /admin, покупателю её код не нужен
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('./pages/admin/AdminProductFormPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminBrandsPage = lazy(() => import('./pages/admin/AdminBrandsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Suspense fallback={<div className="p-8 text-ink-600">Loading…</div>}>
                <Routes>
                    {/* английский без префикса, румынский и русский под /ro и /ru. LanguageRoute переключает язык по адресу */}
                    <Route path=":lang?" element={<LanguageRoute/>}>
                        <Route element={<Layout/>}>
                            <Route index element={<HomePage/>}/>
                            <Route path="catalog" element={<CatalogPage/>}/>
                            <Route path="catalog/:slug" element={<CatalogPage/>}/>
                            <Route path="products/:slug" element={<ProductPage/>}/>
                            <Route path="contacts" element={<ContactsPage/>}/>
                            <Route path="wishlist" element={<WishlistPage/>}/>
                        </Route>

                        {/* в макете у корзины, оформления, профиля и входа своя короткая шапка без меню */}
                        <Route path="cart" element={<CartPage/>}/>
                        <Route path="checkout" element={<CheckoutPage/>}/>
                        <Route path="profile" element={<ProfilePage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>
                    </Route>

                    {/* админка внутренняя, её не перевожу. AdminRoute проверяет роль, AdminLayout рисует шапку и меню */}
                    <Route path="admin" element={<AdminRoute/>}>
                        <Route element={<AdminLayout/>}>
                            <Route index element={<Navigate to="orders" replace/>}/>
                            <Route path="orders" element={<AdminOrdersPage/>}/>
                            <Route path="products" element={<AdminProductsPage/>}/>
                            <Route path="products/new" element={<AdminProductFormPage/>}/>
                            <Route path="products/:id" element={<AdminProductFormPage/>}/>
                            <Route path="categories" element={<AdminCategoriesPage/>}/>
                            <Route path="brands" element={<AdminBrandsPage/>}/>
                            <Route path="users" element={<AdminUsersPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
            <Toaster/>
        </BrowserRouter>
    );
}

export default App;
