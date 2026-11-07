import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Toaster from './components/Toaster';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
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
                    <Route path="catalog/:slug" element={<CatalogPage />} />
                    <Route path="products/:slug" element={<ProductPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                </Route>

                {/* в макете у корзины, оформления, профиля и входа своя короткая шапка без меню */}
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* AdminRoute проверяет роль, AdminLayout рисует шапку и меню, страницы попадают в его <Outlet /> */}
                <Route path="admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="orders" replace />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="products/new" element={<AdminProductFormPage />} />
                        <Route path="products/:id" element={<AdminProductFormPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="brands" element={<AdminBrandsPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                    </Route>
                </Route>
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
