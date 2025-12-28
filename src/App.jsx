import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import RepairPage from './pages/RepairPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import RepairRequestsPage from './pages/RepairRequestsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/repair" element={<RepairPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/repair-requests" element={<RepairRequestsPage />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
