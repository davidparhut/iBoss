import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { logoutUser } from '../firebase/auth';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">iBoss</Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Головна
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={location.pathname === '/products' ? 'active' : ''}
            >
              iPhone
            </Link>
          </li>
          <li>
            <Link 
              to="/repair" 
              className={location.pathname === '/repair' ? 'active' : ''}
            >
              Ремонт
            </Link>
          </li>
          {isAuthenticated && isAdmin && (
            <li>
              <Link 
                to="/admin" 
                className={location.pathname === '/admin' ? 'active' : ''}
              >
                Адмін
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link 
                to="/cart" 
                className={`cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                🛒 Кошик
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link 
                to="/orders" 
                className={location.pathname === '/orders' ? 'active' : ''}
              >
                📦 Замовлення
              </Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link 
                to="/repair-requests" 
                className={location.pathname === '/repair-requests' ? 'active' : ''}
              >
                🔧 Мої заявки
              </Link>
            </li>
          )}
          <li>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="nav-cta"
                style={{ cursor: 'pointer' }}
              >
                Вийти
              </button>
            ) : (
              <Link 
                to="/login" 
                className="nav-cta"
              >
                Увійти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
