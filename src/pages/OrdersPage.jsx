import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../firebase/firestore';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadOrders();
  }, [currentUser, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getUserOrders(currentUser.uid);
    
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: 'Очікує обробки',
      processing: 'В обробці',
      completed: 'Виконано',
      cancelled: 'Скасовано'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <section className="orders-section" style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
        <div className="container">
          <h1 className="section-title">Мої замовлення</h1>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="orders-section" style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
        <div className="container">
          <h1 className="section-title">Мої замовлення</h1>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <span style={{ fontSize: '5rem', marginBottom: '1rem', display: 'block' }}>📦</span>
            <h2>У вас поки немає замовлень</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '1rem', fontSize: '1.1rem' }}>
              Перейдіть до каталогу та оберіть ваш ідеальний iPhone
            </p>
            <button 
              className="product-buy"
              onClick={() => navigate('/products')}
              style={{ marginTop: '2rem' }}
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-section" style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
      <div className="container">
        <h1 className="section-title">Мої замовлення</h1>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div 
              key={order.id}
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px var(--shadow)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'start',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Замовлення №{order.id.slice(0, 8)}
                  </p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span 
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status)
                  }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Контактна інформація:</h4>
                <p style={{ color: 'var(--text-light)' }}>
                  {order.customerInfo.name} • {order.customerInfo.phone}
                </p>
                <p style={{ color: 'var(--text-light)' }}>
                  {order.customerInfo.city}, {order.customerInfo.address}
                </p>
                {order.customerInfo.comment && (
                  <p style={{ color: 'var(--text-light)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    Коментар: {order.customerInfo.comment}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Товари:</h4>
                {order.items.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.5rem 0',
                      borderBottom: index < order.items.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
                    }}
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                          background: 'var(--secondary)',
                          borderRadius: '8px',
                          padding: '5px'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600' }}>{item.name}</p>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        {item.storage} • {item.quantity} шт
                      </p>
                    </div>
                    <p style={{ fontWeight: '700' }}>
                      {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '2px solid rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Всього:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {order.totalPrice.toLocaleString('uk-UA')} ₴
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;
