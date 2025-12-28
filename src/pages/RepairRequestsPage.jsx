import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserRepairRequests } from '../firebase/firestore';

const RepairRequestsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadRequests();
  }, [currentUser, navigate]);

  const loadRequests = async () => {
    setLoading(true);
    const result = await getUserRepairRequests(currentUser.uid);
    
    if (result.success) {
      setRequests(result.data);
    }
    setLoading(false);
  };

  const getStatusText = (status) => {
    const statuses = {
      new: 'Нова заявка',
      'in-progress': 'В роботі',
      completed: 'Виконано',
      cancelled: 'Скасовано'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#f59e0b',
      'in-progress': '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <section style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
        <div className="container">
          <h1 className="section-title">Мої заявки на ремонт</h1>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Завантаження...</p>
        </div>
      </section>
    );
  }

  if (requests.length === 0) {
    return (
      <section style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
        <div className="container">
          <h1 className="section-title">Мої заявки на ремонт</h1>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <span style={{ fontSize: '5rem', marginBottom: '1rem', display: 'block' }}>🔧</span>
            <h2>У вас поки немає заявок</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '1rem', fontSize: '1.1rem' }}>
              Перейдіть до сторінки ремонту та залиште заявку
            </p>
            <button 
              className="product-buy"
              onClick={() => navigate('/repair')}
              style={{ marginTop: '2rem' }}
            >
              Перейти до ремонту
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '100vh', padding: '100px 0 50px' }}>
      <div className="container">
        <h1 className="section-title">Мої заявки на ремонт</h1>
        
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {requests.map(request => (
            <div 
              key={request.id}
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
                  <h3>{request.serviceTitle}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {new Date(request.createdAt).toLocaleString('uk-UA', {
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
                    background: `${getStatusColor(request.status)}20`,
                    color: getStatusColor(request.status)
                  }}
                >
                  {getStatusText(request.status)}
                </span>
              </div>

              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary)', borderRadius: '10px' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Модель:</strong> {request.model.replace('iphone-', 'iPhone ')}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Вартість:</strong> {request.price.toLocaleString('uk-UA')} ₴
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Час виконання:</strong> {request.time}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Контактна інформація:</h4>
                <p style={{ color: 'var(--text-light)' }}>
                  {request.customerInfo.name} • {request.customerInfo.phone}
                </p>
                {request.customerInfo.comment && (
                  <p style={{ color: 'var(--text-light)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    Коментар: {request.customerInfo.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RepairRequestsPage;
