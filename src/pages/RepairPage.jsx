import React, { useState, useEffect } from 'react';
import { getAllRepairServices, createRepairRequest } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RepairPage = () => {
  const [repairServices, setRepairServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });

  const iphoneModels = [
    { id: 'all', name: 'Всі моделі' },
    { id: 'iphone-16', name: 'iPhone 16 / 16 Pro' },
    { id: 'iphone-15', name: 'iPhone 15 / 15 Pro' },
    { id: 'iphone-14', name: 'iPhone 14 / 14 Pro' },
    { id: 'iphone-13', name: 'iPhone 13 / 13 Pro' },
    { id: 'iphone-12', name: 'iPhone 12 / 12 Pro' },
    { id: 'iphone-11', name: 'iPhone 11 / 11 Pro' },
  ];

  useEffect(() => {
    loadRepairServices();
  }, []);

  const loadRepairServices = async () => {
    setLoading(true);
    const result = await getAllRepairServices();
    
    if (result.success) {
      setRepairServices(result.data);
    }
    setLoading(false);
  };

  const getPriceForModel = (service) => {
    if (selectedModel === 'all') {
      // Показуємо діапазон цін
      const prices = Object.values(service.models || {});
      if (prices.length === 0) return service.price || 'Уточнюйте';
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return `від ${min.toLocaleString('uk-UA')} ₴`;
    } else {
      const price = service.models?.[selectedModel];
      return price ? `${price.toLocaleString('uk-UA')} ₴` : 'Уточнюйте';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>Завантаження...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="repair-hero">
        <div className="container">
          <h1>Професійний ремонт iPhone</h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            Сертифіковані майстри, оригінальні запчастини, гарантія на всі види робіт
          </p>
        </div>
      </div>

      <section className="repair-services">
        <div className="container">
          <h2 className="section-title">Наші послуги</h2>
          
          {/* Фільтр по моделях */}
          <div className="model-filter">
            <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>Оберіть модель для точної ціни:</p>
            <div className="model-buttons">
              {iphoneModels.map((model) => (
                <button
                  key={model.id}
                  className={`model-btn ${selectedModel === model.id ? 'active' : ''}`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          <div className="repair-grid">
            {repairServices.map((service) => (
              <div 
                key={service.id} 
                className="repair-card" 
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="repair-price">{getPriceForModel(service)}</div>
                <span className="repair-time">⏱ {service.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Модальні вікна - рендеряються окремо для правильного позиціонування */}
      {selectedService && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedService.title}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedService(null)}
              >
                ×
              </button>
            </div>
            
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: '1.8' }}>
              {selectedService.description}
            </p>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: '10px' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>
                ⏱ Час виконання: {selectedService.time}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Ціни за моделями:</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {Object.entries(selectedService.models || {}).map(([model, price]) => (
                  <div 
                    key={model} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: selectedModel === model ? 'var(--accent)' : 'var(--secondary)',
                      color: selectedModel === model ? 'white' : 'var(--text-dark)',
                      borderRadius: '10px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSelectedModel(model)}
                  >
                    <span>{model.replace('iphone-', 'iPhone ')}</span>
                    <span style={{ fontWeight: '700' }}>{price.toLocaleString('uk-UA')} ₴</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#2e7d32' }}>Що входить в послугу:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>✓ Безкоштовна діагностика</li>
                <li>✓ Оригінальні запчастини</li>
                <li>✓ Гарантія на ремонт 6 місяців</li>
                <li>✓ Професійні майстри</li>
              </ul>
            </div>

            <button 
              style={{
                width: '100%',
                padding: '1.2rem',
                fontSize: '1.1rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                console.log('Click!', currentUser, selectedService);
                if (!currentUser) {
                  navigate('/login');
                  return;
                }
                if (!selectedService) {
                  alert('Будь ласка, спочатку вибачте послугу');
                  return;
                }
                setShowRequestForm(true);
              }}
            >
              Замовити ремонт
            </button>
          </div>
        </div>
      )}

      {/* Форма заявки на ремонт */}
      {showRequestForm && (
        <div className="modal-overlay" onClick={() => setShowRequestForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Заявка на ремонт</h2>
              <button className="modal-close" onClick={() => setShowRequestForm(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: '10px' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{selectedService?.title}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Модель: {selectedModel.replace('iphone-', 'iPhone ')}
                </p>
                <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Час виконання: {selectedService?.time}
                </p>
                <p style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '1.2rem' }}>
                  {selectedService?.models?.[selectedModel]?.toLocaleString('uk-UA')} ₴
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setRequestSubmitting(true);

                const requestData = {
                  userId: currentUser.uid,
                  userEmail: currentUser.email,
                  serviceId: selectedService.id,
                  serviceTitle: selectedService.title,
                  model: selectedModel,
                  price: selectedService.models[selectedModel],
                  time: selectedService.time,
                  customerInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    comment: formData.comment
                  }
                };

                const result = await createRepairRequest(requestData);

                if (result.success) {
                  alert('Заявку прийнято! Ми зв\'яжемось з вами найближчим часом.');
                  setShowRequestForm(false);
                  setSelectedService(null);
                  setFormData({ name: '', phone: '', comment: '' });
                } else {
                  alert('Помилка при створенні заявки. Спробуйте ще раз.');
                }

                setRequestSubmitting(false);
              }}>
                <div className="form-group">
                  <label htmlFor="name">Ім'я *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ваше ім'я"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+380XX XXX XX XX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Коментар</label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Додаткова інформація про несправність"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="product-buy"
                  disabled={requestSubmitting}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {requestSubmitting ? 'Відправка...' : 'Підтвердити заявку'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RepairPage;
