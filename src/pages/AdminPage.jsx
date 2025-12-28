import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getAllProducts, addProduct, updateProduct, deleteProduct,
  getAllRepairServices, addRepairService, updateRepairService, deleteRepairService,
  getAllOrders, updateOrderStatus,
  getAllRepairRequests, updateRepairRequestStatus
} from '../firebase/firestore';
import ImageUpload from '../components/ImageUpload';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [repairServices, setRepairServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'services', 'orders', 'requests'
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Форма для нового товару
  const [formData, setFormData] = useState({
    name: '',
    colors: [],
    colorInput: '',
    storage: {},
    storageVariant: '',
    storagePrice: '',
    image: '',
    inStock: true
  });

  // Форма для послуги
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    time: '',
    'iphone-16': '',
    'iphone-15': '',
    'iphone-14': '',
    'iphone-13': '',
    'iphone-12': '',
    'iphone-11': ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Перевірка ролі адміна
    if (!isAdmin) {
      alert('Доступ заборонено. Тільки для адміністраторів.');
      navigate('/');
      return;
    }
    
    loadProducts();
    loadRepairRequests();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const loadRepairServices = async () => {
    const result = await getAllRepairServices();
    if (result.success) {
      setRepairServices(result.data);
    }
  };

  const loadOrders = async () => {
    const result = await getAllOrders();
    if (result.success) {
      setOrders(result.data);
    }
  };

  const loadRepairRequests = async () => {
    const result = await getAllRepairRequests();
    if (result.success) {
      setRepairRequests(result.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceFormData({
      ...serviceFormData,
      [name]: value
    });
  };

  const handleAddColor = () => {
    if (formData.colorInput.trim() && !formData.colors.includes(formData.colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, formData.colorInput.trim()],
        colorInput: ''
      });
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== colorToRemove)
    });
  };

  const handleAddStorage = () => {
    if (formData.storageVariant && formData.storagePrice) {
      setFormData({
        ...formData,
        storage: {
          ...formData.storage,
          [formData.storageVariant]: parseInt(formData.storagePrice)
        },
        storageVariant: '',
        storagePrice: ''
      });
    }
  };

  const handleRemoveStorage = (storageKey) => {
    const newStorage = { ...formData.storage };
    delete newStorage[storageKey];
    setFormData({
      ...formData,
      storage: newStorage
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (formData.colors.length === 0) {
      alert('Додайте хоча б один колір');
      return;
    }
    
    if (Object.keys(formData.storage).length === 0) {
      alert('Додайте хоча б один варіант пам\'яті з ціною');
      return;
    }
    
    // Конвертуємо storage об'єкт в storageOptions масив
    const storageOptions = Object.entries(formData.storage).map(([size, price]) => ({
      size,
      price: parseInt(price)
    }));
    
    const productData = {
      name: formData.name,
      colors: formData.colors,
      storageOptions: storageOptions,
      image: formData.image,
      inStock: formData.inStock,
      order: products.length + 1
    };

    const result = await addProduct(productData);
    
    if (result.success) {
      alert('Товар успішно додано!');
      setFormData({
        name: '',
        colors: [],
        colorInput: '',
        storage: {},
        storageVariant: '',
        storagePrice: '',
        image: '',
        inStock: true
      });
      setShowAddForm(false);
      loadProducts();
    } else {
      alert('Помилка: ' + result.error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    
    const serviceData = {
      title: serviceFormData.title,
      description: serviceFormData.description,
      time: serviceFormData.time,
      models: {
        'iphone-16': parseInt(serviceFormData['iphone-16']) || 0,
        'iphone-15': parseInt(serviceFormData['iphone-15']) || 0,
        'iphone-14': parseInt(serviceFormData['iphone-14']) || 0,
        'iphone-13': parseInt(serviceFormData['iphone-13']) || 0,
        'iphone-12': parseInt(serviceFormData['iphone-12']) || 0,
        'iphone-11': parseInt(serviceFormData['iphone-11']) || 0,
      },
      order: repairServices.length + 1
    };

    const result = await addRepairService(serviceData);
    
    if (result.success) {
      alert('Послугу успішно додано!');
      setServiceFormData({
        title: '',
        description: '',
        time: '',
        'iphone-16': '',
        'iphone-15': '',
        'iphone-14': '',
        'iphone-13': '',
        'iphone-12': '',
        'iphone-11': ''
      });
      setShowServiceForm(false);
      loadRepairServices();
    } else {
      alert('Помилка: ' + result.error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        alert('Товар видалено!');
        loadProducts();
      } else {
        alert('Помилка видалення');
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю послугу?')) {
      const result = await deleteRepairService(serviceId);
      if (result.success) {
        alert('Послугу видалено!');
        loadRepairServices();
      } else {
        alert('Помилка видалення');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      // Оновити локальний стан
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      alert('Статус замовлення оновлено!');
    } else {
      alert('Помилка оновлення статусу');
    }
  };

  const handleRepairStatusChange = async (requestId, newStatus) => {
    const result = await updateRepairRequestStatus(requestId, newStatus);
    
    if (result.success) {
      setRepairRequests(repairRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, updatedAt: new Date().toISOString() }
          : request
      ));
      alert('Статус заявки оновлено!');
    } else {
      alert('Помилка оновлення статусу');
    }
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
      <div style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>Завантаження...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 20px 60px', minHeight: '100vh', background: 'var(--secondary)' }}>
      <div className="container">
        <h1 className="section-title">Адмін панель</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
          Управління товарами та послугами
        </p>

        {/* Вкладки */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'products' ? 'var(--primary)' : 'white',
              color: activeTab === 'products' ? 'white' : 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📱 Товари
          </button>
          <button
            onClick={() => setActiveTab('services')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'services' ? 'var(--primary)' : 'white',
              color: activeTab === 'services' ? 'white' : 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔧 Послуги
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'orders' ? 'var(--primary)' : 'white',
              color: activeTab === 'orders' ? 'white' : 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📦 Замовлення {orders.length > 0 && `(${orders.length})`}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'requests' ? 'var(--primary)' : 'white',
              color: activeTab === 'requests' ? 'white' : 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🛠️ Заявки на ремонт {repairRequests.length > 0 && `(${repairRequests.length})`}
          </button>
        </div>

        {/* Секція товарів */}
        {activeTab === 'products' && (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '1rem 2rem',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? 'Скасувати' : '+ Додати новий товар'}
          </button>
        </div>

        {/* Форма додавання товару */}
        {showAddForm && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Новий товар</h2>
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Назва *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid var(--secondary)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="iPhone 16 Pro Max"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Кольори *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.colorInput}
                    onChange={(e) => setFormData({...formData, colorInput: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      border: '2px solid var(--secondary)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Наприклад: Чорний, Білий, Синій"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    style={{
                      padding: '0.8rem 1.5rem',
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Додати
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.colors.map(color => (
                    <span key={color} style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--secondary)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'red',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Варіанти пам'яті та ціни *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.storageVariant}
                    onChange={(e) => setFormData({...formData, storageVariant: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      border: '2px solid var(--secondary)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Наприклад: 128GB"
                  />
                  <input
                    type="number"
                    value={formData.storagePrice}
                    onChange={(e) => setFormData({...formData, storagePrice: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      border: '2px solid var(--secondary)',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Ціна (грн)"
                  />
                  <button
                    type="button"
                    onClick={handleAddStorage}
                    style={{
                      padding: '0.8rem 1.5rem',
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Додати
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(formData.storage).map(([variant, price]) => (
                    <div key={variant} style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--secondary)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span><strong>{variant}</strong>: {price.toLocaleString('uk-UA')} ₴</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStorage(variant)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  URL зображення
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid var(--secondary)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="https://..."
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontWeight: '600' }}>В наявності</span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Додати товар
              </button>
            </form>
          </div>
        )}

        {/* Список товарів */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
                {product.name}
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Кольори:</strong> {product.colors?.join(', ') || 'Не вказано'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Варіанти пам'яті:</strong>
                {product.storage && Object.entries(product.storage).map(([variant, price]) => (
                  <div key={variant} style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>
                    {variant}: {price.toLocaleString('uk-UA')} ₴
                  </div>
                ))}
              </div>
              <p style={{ marginBottom: '1rem' }}>
                <span style={{ 
                  color: product.inStock ? '#34c759' : '#ff3b30',
                  fontWeight: '600'
                }}>
                  {product.inStock ? '✓ В наявності' : '✗ Немає'}
                </span>
              </p>

              {/* Зображення */}
              {product.image && (
                <div style={{ marginBottom: '1rem' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      borderRadius: '10px',
                      background: 'var(--secondary)'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: selectedProduct?.id === product.id ? 'var(--accent)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {selectedProduct?.id === product.id ? 'Приховати' : 'Завантажити фото'}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{
                    padding: '0.8rem',
                    background: '#c62828',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑️
                </button>
              </div>

              {/* Компонент завантаження зображень */}
              {selectedProduct?.id === product.id && (
                <ImageUpload
                  productId={product.id}
                  currentImages={product.images || []}
                  onImagesUpdated={() => loadProducts()}
                />
              )}
            </div>
          ))}
        </div>
          </>
        )}

        {/* Секція послуг */}
        {activeTab === 'services' && (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <button
                onClick={() => setShowServiceForm(!showServiceForm)}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showServiceForm ? 'Скасувати' : '+ Додати нову послугу'}
              </button>
            </div>

            {/* Форма додавання послуги */}
            {showServiceForm && (
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '15px',
                marginBottom: '3rem',
                maxWidth: '800px',
                margin: '0 auto 3rem'
              }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Нова послуга ремонту</h3>
                <form onSubmit={handleAddService}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Назва послуги *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={serviceFormData.title}
                      onChange={handleServiceInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '2px solid var(--secondary)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="Заміна екрану"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Опис *
                    </label>
                    <textarea
                      name="description"
                      value={serviceFormData.description}
                      onChange={handleServiceInputChange}
                      required
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '2px solid var(--secondary)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Детальний опис послуги..."
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Час виконання *
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={serviceFormData.time}
                      onChange={handleServiceInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '2px solid var(--secondary)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="1 година"
                    />
                  </div>

                  <h4 style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Ціни по моделях (грн)</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {['iphone-16', 'iphone-15', 'iphone-14', 'iphone-13', 'iphone-12', 'iphone-11'].map(model => (
                      <div key={model}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          {model.replace('iphone-', 'iPhone ')}
                        </label>
                        <input
                          type="number"
                          name={model}
                          value={serviceFormData[model]}
                          onChange={handleServiceInputChange}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '2px solid var(--secondary)',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                          placeholder="2500"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '1.5rem'
                    }}
                  >
                    Додати послугу
                  </button>
                </form>
              </div>
            )}

            {/* Список послуг */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {repairServices.map((service) => (
                <div
                  key={service.id}
                  style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '15px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{service.title}</h3>
                  <p style={{ color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {service.description}
                  </p>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong>Час:</strong> {service.time}
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Ціни:</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      {Object.entries(service.models || {}).map(([model, price]) => (
                        <div key={model} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                          <span>{model.replace('iphone-', 'iPhone ')}</span>
                          <span>{price.toLocaleString('uk-UA')} ₴</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: '#c62828',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Видалити
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Секція замовлень */}
        {activeTab === 'orders' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Управління замовленнями
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                Всього замовлень: {orders.length}
              </p>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '15px' }}>
                <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>📦</span>
                <h3>Немає замовлень</h3>
                <p style={{ color: 'var(--text-light)' }}>Замовлення з'являться тут після оформлення</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: 'white',
                      borderRadius: '15px',
                      padding: '2rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Заголовок замовлення */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>
                          Замовлення №{order.id.slice(0, 8)}
                        </h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                          {new Date(order.createdAt).toLocaleString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                          Email: {order.userEmail}
                        </p>
                      </div>

                      {/* Статус */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Статус:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '2px solid var(--secondary)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: order.status === 'pending' ? '#fff3cd' : 
                                       order.status === 'processing' ? '#cfe2ff' : 
                                       order.status === 'completed' ? '#d1e7dd' : '#f8d7da',
                            color: order.status === 'pending' ? '#856404' : 
                                   order.status === 'processing' ? '#084298' : 
                                   order.status === 'completed' ? '#0a3622' : '#842029'
                          }}
                        >
                          <option value="pending">Очікує обробки</option>
                          <option value="processing">В обробці</option>
                          <option value="completed">Виконано</option>
                          <option value="cancelled">Скасовано</option>
                        </select>
                      </div>
                    </div>

                    {/* Інформація про клієнта */}
                    <div style={{ 
                      marginBottom: '1.5rem', 
                      padding: '1rem', 
                      background: 'var(--secondary)', 
                      borderRadius: '10px' 
                    }}>
                      <h4 style={{ marginBottom: '0.75rem' }}>Контактні дані:</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        <p><strong>Ім'я:</strong> {order.customerInfo.name}</p>
                        <p><strong>Телефон:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Місто:</strong> {order.customerInfo.city}</p>
                        <p style={{ gridColumn: '1 / -1' }}>
                          <strong>Адреса:</strong> {order.customerInfo.address}
                        </p>
                        {order.customerInfo.comment && (
                          <p style={{ gridColumn: '1 / -1', fontStyle: 'italic' }}>
                            <strong>Коментар:</strong> {order.customerInfo.comment}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Товари */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ marginBottom: '1rem' }}>Товари:</h4>
                      {order.items.map((item, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'var(--secondary)',
                            borderRadius: '10px',
                            marginBottom: index < order.items.length - 1 ? '0.5rem' : 0
                          }}
                        >
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'contain',
                                background: 'white',
                                borderRadius: '8px',
                                padding: '5px'
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</p>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                              {item.storage} • {item.quantity} шт • {item.price.toLocaleString('uk-UA')} ₴/шт
                            </p>
                          </div>
                          <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                            {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Підсумок */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '2px solid var(--secondary)'
                    }}>
                      <div>
                        <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                          Всього товарів: {order.totalItems} шт
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#34c759' }}>
                          + Безкоштовна доставка
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          До сплати:
                        </p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                          {order.totalPrice.toLocaleString('uk-UA')} ₴
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Секція заявок на ремонт */}
        {activeTab === 'requests' && (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Всі заявки на ремонт ({repairRequests.length})
            </h2>

            {repairRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <span style={{ fontSize: '5rem', marginBottom: '1rem', display: 'block' }}>🔧</span>
                <h2>Заявок поки немає</h2>
                <p style={{ color: 'var(--text-light)', marginTop: '1rem', fontSize: '1.1rem' }}>
                  Коли клієнти залишатимуть заявки на ремонт, вони з'являться тут
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {repairRequests.map(request => {
                  return (
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
                      {/* Заголовок заявки */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'start',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--secondary)',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div>
                          <h3 style={{ marginBottom: '0.5rem' }}>{request.serviceTitle}</h3>
                          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            ID: {request.id.substring(0, 8)} • {new Date(request.createdAt).toLocaleString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            📧 {request.userEmail}
                          </p>
                        </div>
                        <select
                          value={request.status}
                          onChange={(e) => handleRepairStatusChange(request.id, e.target.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '2px solid',
                            borderColor: getStatusColor(request.status),
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            background: `${getStatusColor(request.status)}20`,
                            color: getStatusColor(request.status),
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="new">Нова заявка</option>
                          <option value="in-progress">В роботі</option>
                          <option value="completed">Виконано</option>
                          <option value="cancelled">Скасовано</option>
                        </select>
                      </div>

                      {/* Деталі послуги */}
                      <div style={{ 
                        marginBottom: '1.5rem', 
                        padding: '1rem', 
                        background: 'var(--secondary)', 
                        borderRadius: '10px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                      }}>
                        <div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                            Модель
                          </p>
                          <p style={{ fontWeight: '600' }}>
                            {request.model.replace('iphone-', 'iPhone ')}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                            Вартість
                          </p>
                          <p style={{ fontWeight: '600', color: 'var(--accent)' }}>
                            {request.price.toLocaleString('uk-UA')} ₴
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                            Час виконання
                          </p>
                          <p style={{ fontWeight: '600' }}>
                            {request.time}
                          </p>
                        </div>
                      </div>

                      {/* Контактна інформація */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                          Контактна інформація клієнта:
                        </h4>
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          border: '1px solid var(--secondary)',
                          borderRadius: '10px'
                        }}>
                          <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                              Ім'я:
                            </p>
                            <p style={{ fontWeight: '600' }}>
                              {request.customerInfo.name}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                              Телефон:
                            </p>
                            <p style={{ fontWeight: '600' }}>
                              {request.customerInfo.phone}
                            </p>
                          </div>
                          {request.customerInfo.comment && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                Коментар:
                              </p>
                              <p style={{ fontStyle: 'italic', color: 'var(--text-dark)' }}>
                                {request.customerInfo.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
