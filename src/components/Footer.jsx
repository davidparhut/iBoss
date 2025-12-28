import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  
  // Don't show footer on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>iBoss</h3>
          <p>Преміальні iPhone та професійний ремонт в Львові</p>
          <p>Ваш надійний партнер у світі Apple</p>
        </div>
        <div className="footer-section">
          <h3>Контакти</h3>
          <p>📍 вул. Городоцька, 120, Львів</p>
          <p>📞 +380 67 123 4567</p>
          <p>✉️ info@iboss.com.ua</p>
        </div>
        <div className="footer-section">
          <h3>Графік роботи</h3>
          <p>Пн-Пт: 10:00 - 20:00</p>
          <p>Сб: 11:00 - 18:00</p>
          <p>Нд: 12:00 - 17:00</p>
        </div>
        <div className="footer-section">
          <h3>Інформація</h3>
          <a href="#">Про нас</a>
          <a href="#">Гарантія</a>
          <a href="#">Доставка та оплата</a>
          <a href="#">Trade-in</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 iBoss. Всі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
