import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="hero-label">Преміальні iPhone в Львові</span>
          <h1>Ваш iPhone<br/>Наша експертиза</h1>
          <p className="hero-subtitle">
            Офіційний продаж нових iPhone та професійний ремонт з гарантією якості
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Переглянути iPhone
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/repair')}>
              Ремонт iPhone
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Чому iBoss?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Офіційна гарантія</h3>
              <p>Усі iPhone з офіційною гарантією від Apple. Повна юридична підтримка та сервісне обслуговування.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Швидкий ремонт</h3>
              <p>Експрес-діагностика за 15 хвилин. Більшість ремонтів виконуємо за 1-2 години.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Оригінальні запчастини</h3>
              <p>Використовуємо тільки оригінальні комплектуючі Apple. Якість гарантована.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Преміум сервіс</h3>
              <p>Індивідуальний підхід до кожного клієнта. Комфортна зона очікування з Wi-Fi та кавою.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Конфіденційність</h3>
              <p>Повна конфіденційність ваших даних. Захист інформації на всіх етапах обслуговування.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Trade-in</h3>
              <p>Обміняйте свій старий iPhone на новий з доплатою. Вигідні умови Trade-in.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
