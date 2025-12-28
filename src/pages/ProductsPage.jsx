import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedStorage, setSelectedStorage] = useState({});
  const [filters, setFilters] = useState({
    model: 'all',
    storage: 'all',
    availability: 'all'
  });
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    
    if (result.success) {
      setProducts(result.data);
    } else {
      setError('Помилка завантаження товарів');
    }
    setLoading(false);
  };

  const getProductPrice = (product, storage) => {
    if (product.storageOptions && Array.isArray(product.storageOptions) && storage) {
      const option = product.storageOptions.find(opt => opt.size === storage);
      return option?.price || product.price || 0;
    }
    return product.price || 0;
  };

  const handleBuyClick = (product, color, storage) => {
    if (!currentUser) {
      alert('Будь ласка, увійдіть для покупки товарів');
      navigate('/login');
      return;
    }
    if (!product.inStock) {
      alert('На жаль, цей товар зараз відсутній');
      return;
    }
    
    const finalStorage = storage || (product.storageOptions ? product.storageOptions[0].size : product.storage);
    const finalColor = color || (product.colors ? product.colors[0] : 'default');
    const finalPrice = getProductPrice(product, finalStorage);
    
    const cartItem = {
      ...product,
      selectedColor: finalColor,
      selectedStorage: finalStorage,
      price: finalPrice
    };
    
    addToCart(cartItem);
    alert(`${product.name} (${finalStorage}, ${finalColor}) додано до кошика!`);
  };

  const filteredProducts = products.filter(product => {
    if (filters.model !== 'all' && !product.name.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    if (filters.storage !== 'all') {
      if (product.storageOptions) {
        const hasStorage = product.storageOptions.some(opt => opt.size === filters.storage);
        if (!hasStorage) return false;
      } else if (product.storage !== filters.storage) {
        return false;
      }
    }
    if (filters.availability === 'inStock' && !product.inStock) {
      return false;
    }
    if (filters.availability === 'outOfStock' && product.inStock) {
      return false;
    }
    return true;
  });

  const allModels = ['all', ...new Set(products.map(p => {
    const match = p.name.match(/iPhone (\d+|SE|X|XR|XS|11|12|13|14|15|16)/);
    return match ? match[1] : null;
  }).filter(Boolean))];

  const allStorageOptions = ['all', ...new Set(products.flatMap(p => 
    (p.storageOptions && Array.isArray(p.storageOptions)) ? p.storageOptions.map(opt => opt.size) : (p.storage ? [p.storage] : [])
  ))];

  if (loading) {
    return (
      <section className="products-section">
        <div className="container">
          <h1 className="section-title">Завантаження...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <h1 className="section-title">Каталог iPhone</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Оберіть свій ідеальний iPhone з офіційною гарантією
        </p>

        {error && (
          <div style={{ textAlign: 'center', color: '#c33', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {/* Фільтри */}
        <div style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--secondary)', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Фільтри</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Модель:</label>
              <select 
                value={filters.model} 
                onChange={(e) => setFilters({...filters, model: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--primary)', fontSize: '1rem' }}
              >
                {allModels.map(model => (
                  <option key={model} value={model}>
                    {model === 'all' ? 'Всі моделі' : `iPhone ${model}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Пам'ять:</label>
              <select 
                value={filters.storage} 
                onChange={(e) => setFilters({...filters, storage: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--primary)', fontSize: '1rem' }}
              >
                {allStorageOptions.map(storage => (
                  <option key={storage} value={storage}>
                    {storage === 'all' ? 'Вся пам\'ять' : storage}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Наявність:</label>
              <select 
                value={filters.availability} 
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--primary)', fontSize: '1rem' }}
              >
                <option value="all">Всі товари</option>
                <option value="inStock">В наявності</option>
                <option value="outOfStock">Немає в наявності</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => {
            const productId = product.id;
            const currentColor = selectedColor[productId] || (product.colors ? product.colors[0] : null);
            const currentStorage = selectedStorage[productId] || (product.storageOptions ? product.storageOptions[0].size : product.storage);
            const currentPrice = getProductPrice(product, currentStorage);
            
            return (
              <div key={product.id} className="product-card">
                <div className="product-image" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                  {!product.inStock && <span className="product-badge out-of-stock">Немає в наявності</span>}
                  {product.inStock && <span className="product-badge in-stock">В наявності</span>}
                  
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span style={{ display: product.image ? 'none' : 'block', fontSize: '4rem' }}>📱</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  
                  {/* Вибір пам'яті */}
                  {product.storageOptions && product.storageOptions.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                        Пам'ять:
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {product.storageOptions.map((option) => (
                          <button
                            key={option.size}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStorage({...selectedStorage, [productId]: option.size});
                            }}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: currentStorage === option.size ? '2px solid var(--accent)' : '2px solid var(--secondary)',
                              background: currentStorage === option.size ? 'var(--accent)' : 'white',
                              color: currentStorage === option.size ? 'white' : 'var(--text-dark)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {option.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Вибір кольору */}
                  {product.colors && product.colors.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                        Колір:
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {product.colors.map((color) => {
                          const colorMap = {
                            'Чорний': '#000000',
                            'Білий': '#FFFFFF',
                            'Синій': '#1E3A8A',
                            'Фіолетовий': '#7C3AED',
                            'Червоний': '#DC2626',
                            'Зелений': '#059669',
                            'Рожевий': '#EC4899',
                            'Жовтий': '#EAB308',
                            'Золотий': '#D4AF37',
                            'Срібний': '#C0C0C0',
                            'Графітовий': '#4B5563',
                            'Космічний чорний': '#1F2937',
                            'Сині: Тихоокеанський': '#0EA5E9',
                            'Синій океан': '#0284C7',
                            'Midnight': '#1E293B',
                            'Starlight': '#F1F5F9',
                            'Титан': '#9CA3AF'
                          };
                          const bgColor = colorMap[color] || '#gray';
                          
                          return (
                            <button
                              key={color}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColor({...selectedColor, [productId]: color});
                              }}
                              title={color}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: currentColor === color ? '3px solid var(--accent)' : '2px solid #ddd',
                                background: bgColor,
                                cursor: 'pointer',
                                boxShadow: bgColor === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                              }}
                            >
                              {currentColor === color && (
                                <span style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  color: bgColor === '#FFFFFF' || bgColor === '#F1F5F9' ? '#000' : '#fff',
                                  fontSize: '1rem',
                                  fontWeight: 'bold'
                                }}>✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="product-price" style={{ marginTop: '1rem' }}>
                    {currentPrice && (typeof currentPrice === 'string' 
                      ? `${parseInt(currentPrice).toLocaleString('uk-UA')} ₴`
                      : `${currentPrice.toLocaleString('uk-UA')} ₴`)
                    }
                  </div>
                  <button 
                    className={`product-buy ${!product.inStock ? 'disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyClick(product, currentColor, currentStorage);
                    }}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Купити зараз' : 'Повідомити про наявність'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Модальне вікно деталей */}
        {selectedProduct && (
          <div 
            className="modal-overlay" 
            onClick={() => setSelectedProduct(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: 'var(--text-light)'
                }}
              >
                ×
              </button>

              {selectedProduct.image && (
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}

              <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                {selectedProduct.name}
              </h2>
              
              {/* Вибір кольору в модалці */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Колір:</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedProduct.colors.map((color) => {
                      const colorMap = {
                        'Чорний': '#000000', 'Білий': '#FFFFFF', 'Синій': '#1E3A8A',
                        'Фіолетовий': '#7C3AED', 'Червоний': '#DC2626', 'Зелений': '#059669',
                        'Рожевий': '#EC4899', 'Жовтий': '#EAB308', 'Золотий': '#D4AF37',
                        'Срібний': '#C0C0C0', 'Графітовий': '#4B5563', 'Космічний чорний': '#1F2937',
                        'Midnight': '#1E293B', 'Starlight': '#F1F5F9', 'Титан': '#9CA3AF'
                      };
                      const bgColor = colorMap[color] || '#808080';
                      const modalColor = selectedColor[selectedProduct.id] || selectedProduct.colors[0];
                      
                      return (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor({...selectedColor, [selectedProduct.id]: color});
                          }}
                          style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            border: modalColor === color ? '3px solid var(--accent)' : '2px solid #ddd',
                            background: bgColor, cursor: 'pointer',
                            boxShadow: bgColor === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : 'none'
                          }}
                          title={color}
                        >
                          {modalColor === color && (
                            <span style={{
                              color: bgColor === '#FFFFFF' || bgColor === '#F1F5F9' ? '#000' : '#fff',
                              fontSize: '1.2rem', fontWeight: 'bold'
                            }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Вибір пам'яті в модалці */}
              {selectedProduct.storageOptions && selectedProduct.storageOptions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Пам'ять:</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedProduct.storageOptions.map((option) => {
                      const modalStorage = selectedStorage[selectedProduct.id] || selectedProduct.storageOptions[0].size;
                      return (
                        <button
                          key={option.size}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStorage({...selectedStorage, [selectedProduct.id]: option.size});
                          }}
                          style={{
                            padding: '0.75rem 1.25rem',
                            border: modalStorage === option.size ? '2px solid var(--accent)' : '2px solid var(--secondary)',
                            background: modalStorage === option.size ? 'var(--accent)' : 'white',
                            color: modalStorage === option.size ? 'white' : 'var(--text-dark)',
                            borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600'
                          }}
                        >
                          {option.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: '700', marginBottom: '1rem' }}>
                  {(() => {
                    const modalStorage = selectedStorage[selectedProduct.id] || (selectedProduct.storageOptions ? selectedProduct.storageOptions[0].size : selectedProduct.storage);
                    const price = getProductPrice(selectedProduct, modalStorage);
                    return typeof price === 'string' 
                      ? `${parseInt(price).toLocaleString('uk-UA')} ₴`
                      : `${price.toLocaleString('uk-UA')} ₴`;
                  })()}
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  <span style={{ 
                    color: selectedProduct.inStock ? '#34c759' : '#ff3b30',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}>
                    {selectedProduct.inStock ? '✓ В наявності' : '✗ Немає в наявності'}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: '10px' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Характеристики:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>✓ Офіційна гарантія Apple</li>
                  <li>✓ Оригінальна комплектація</li>
                  <li>✓ Безкоштовна доставка по Львову</li>
                  <li>✓ Можливість обміну старого iPhone</li>
                </ul>
              </div>

              <button 
                className={`product-buy ${!selectedProduct.inStock ? 'disabled' : ''}`}
                onClick={() => {
                  const modalColor = selectedColor[selectedProduct.id] || (selectedProduct.colors ? selectedProduct.colors[0] : 'default');
                  const modalStorage = selectedStorage[selectedProduct.id] || (selectedProduct.storageOptions ? selectedProduct.storageOptions[0].size : selectedProduct.storage);
                  handleBuyClick(selectedProduct, modalColor, modalStorage);
                  setSelectedProduct(null);
                }}
                disabled={!selectedProduct.inStock}
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
              >
                {selectedProduct.inStock ? 'Купити зараз' : 'Повідомити про наявність'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
