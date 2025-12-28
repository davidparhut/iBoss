import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../firebase/firestore';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Львів',
    address: '',
    comment: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Будь ласка, увійдіть для оформлення замовлення');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Ваш кошик порожній');
      return;
    }

    setShowCheckoutForm(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setOrderPlaced(true);

    const orderData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        comment: formData.comment
      },
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        storage: item.selectedStorage || item.storage,
        color: item.selectedColor || 'Не вказано',
        price: typeof item.price === 'string' ? parseInt(item.price) : item.price,
        quantity: item.quantity,
        image: item.image || ''
      })),
      totalPrice: getTotalPrice(),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };

    const result = await createOrder(orderData);
    
    if (result.success) {
      clearCart();
      setOrderPlaced(false);
      setShowCheckoutForm(false);
      alert(`Дякуємо за замовлення!\n\nНомер замовлення: ${result.orderId}\n\nМи зв'яжемось з вами найближчим часом за номером ${formData.phone}`);
      navigate('/');
    } else {
      setOrderPlaced(false);
      alert('Помилка при оформленні замовлення. Спробуйте ще раз.');
    }
  };

  if (!currentUser) {
    return (
      <section className="cart-section">
        <div className="container">
          <h1 className="section-title">Кошик</h1>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Будь ласка, увійдіть для перегляду кошика
            </p>
            <button 
              className="product-buy"
              onClick={() => navigate('/login')}
            >
              Увійти
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="cart-section">
        <div className="container">
          <h1 className="section-title">Кошик</h1>
          <div className="cart-empty">
            <span style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</span>
            <h2>Ваш кошик порожній</h2>
            <p>Додайте товари з нашого каталогу</p>
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
    <section className="cart-section">
      <div className="container">
        <h1 className="section-title">Кошик</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`} className="cart-item">
                <div 
                  className="cart-item-image" 
                  onClick={() => setSelectedProduct(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>📱</span>
                  )}
                </div>
                
                <div 
                  className="cart-item-details"
                  onClick={() => setSelectedProduct(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{item.name}</h3>
                  <p style={{ color: 'var(--text-light)' }}>
                    {item.selectedStorage || item.storage}
                    {item.selectedColor && ` • ${item.selectedColor}`}
                  </p>
                  <p style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '1.1rem' }}>
                    {typeof item.price === 'string' 
                      ? `${parseInt(item.price).toLocaleString('uk-UA')} ₴`
                      : `${item.price.toLocaleString('uk-UA')} ₴`
                    }
                  </p>
                </div>
                
                <div className="cart-item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedStorage)}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedStorage)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-total">
                  <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                    {(typeof item.price === 'string' 
                      ? parseInt(item.price) * item.quantity
                      : item.price * item.quantity
                    ).toLocaleString('uk-UA')} ₴
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedStorage)}
                    className="remove-btn"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Підсумок замовлення</h2>
            <div className="summary-row">
              <span>Товарів:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт</span>
            </div>
            <div className="summary-row">
              <span>Вартість товарів:</span>
              <span>{getTotalPrice().toLocaleString('uk-UA')} ₴</span>
            </div>
            <div className="summary-row">
              <span>Доставка:</span>
              <span style={{ color: '#34c759' }}>Безкоштовно</span>
            </div>
            <div className="divider" style={{ margin: '1rem 0' }}></div>
            <div className="summary-row" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              <span>До сплати:</span>
              <span style={{ color: 'var(--accent)' }}>{getTotalPrice().toLocaleString('uk-UA')} ₴</span>
            </div>
            
            <button 
              className="product-buy"
              onClick={handleCheckout}
              disabled={orderPlaced}
              style={{ 
                width: '100%', 
                marginTop: '2rem',
                padding: '1.2rem',
                fontSize: '1.1rem'
              }}
            >
              Оформити замовлення
            </button>
            
            <button 
              onClick={clearCart}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem',
                background: 'transparent',
                border: '2px solid var(--text-light)',
                color: 'var(--text-light)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Очистити кошик
            </button>
          </div>
        </div>

        {/* Модальне вікно оформлення замовлення */}
        {showCheckoutForm && (
          <div 
            className="modal-overlay" 
            onClick={() => !orderPlaced && setShowCheckoutForm(false)}
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
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem',
                position: 'relative'
              }}
            >
              <button
                onClick={() => !orderPlaced && setShowCheckoutForm(false)}
                disabled={orderPlaced}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: orderPlaced ? 'not-allowed' : 'pointer',
                  color: 'var(--text-light)',
                  opacity: orderPlaced ? 0.5 : 1
                }}
              >
                ×
              </button>

              <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                Оформлення замовлення
              </h2>

              <form onSubmit={handleSubmitOrder}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Ім'я та прізвище *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={orderPlaced}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
                    placeholder="Введіть ваше ім'я"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={orderPlaced}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Місто *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={orderPlaced}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Адреса доставки *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={orderPlaced}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
                    placeholder="Вулиця, будинок, квартира"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Коментар до замовлення
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    disabled={orderPlaced}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                    placeholder="Побажання до замовлення"
                  />
                </div>

                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--secondary)', 
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Товарів:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem' }}>
                    <span>До сплати:</span>
                    <span style={{ color: 'var(--accent)' }}>{getTotalPrice().toLocaleString('uk-UA')} ₴</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={orderPlaced}
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.1rem',
                    background: orderPlaced ? 'var(--text-light)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: orderPlaced ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {orderPlaced ? 'Обробка замовлення...' : 'Підтвердити замовлення'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Модальне вікно деталей товару */}
        {selectedProduct && (
          <div 
            className="modal-overlay" 
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedProduct.name}</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedProduct(null)}
                >
                  ×
                </button>
              </div>

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

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  <strong>Пам'ять:</strong> {selectedProduct.selectedStorage || selectedProduct.storage}
                </p>
                {selectedProduct.selectedColor && (
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    <strong>Колір:</strong> {selectedProduct.selectedColor}
                  </p>
                )}
                <p style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: '700', marginTop: '1rem' }}>
                  {typeof selectedProduct.price === 'string' 
                    ? `${parseInt(selectedProduct.price).toLocaleString('uk-UA')} ₴`
                    : `${selectedProduct.price.toLocaleString('uk-UA')} ₴`
                  }
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  Кількість у кошику: {selectedProduct.quantity} шт
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

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => {
                    removeFromCart(selectedProduct.id, selectedProduct.selectedColor, selectedProduct.selectedStorage);
                    setSelectedProduct(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: '#ff3b30',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Видалити з кошика
                </button>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
