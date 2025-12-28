# 🛣️ Посібник з маршрутизації React Router

## Огляд роутингу

Додаток використовує **React Router v6** для навігації між сторінками без перезавантаження.

## Основні концепції

### 1. BrowserRouter (Router)
```jsx
import { BrowserRouter as Router } from 'react-router-dom';

<Router>
  {/* Весь додаток */}
</Router>
```
- Обгортає весь додаток
- Надає контекст маршрутизації
- Використовує HTML5 History API

### 2. Routes і Route
```jsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="/repair" element={<RepairPage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

#### Пояснення:
- `<Routes>` - контейнер для всіх маршрутів
- `<Route>` - окремий маршрут
- `path` - URL адреса
- `element` - компонент для відображення

## Навігація

### Метод 1: Link (для тегів <a>)
```jsx
import { Link } from 'react-router-dom';

<Link to="/products">iPhone</Link>
```

**Переваги:**
- Семантично правильний HTML
- Працює як звичайне посилання
- Можна натиснути правою кнопкою "Відкрити в новій вкладці"

### Метод 2: useNavigate (для кнопок/функцій)
```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/products');
  };
  
  return <button onClick={handleClick}>Перейти</button>;
}
```

**Переваги:**
- Програмна навігація
- Можна додати логіку перед переходом
- Ідеально для кнопок і форм

## Визначення активного маршруту

```jsx
import { useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <Link 
      to="/products" 
      className={location.pathname === '/products' ? 'active' : ''}
    >
      iPhone
    </Link>
  );
}
```

**useLocation** повертає:
- `pathname` - поточний шлях ('/products')
- `search` - query параметри ('?id=123')
- `hash` - якір (#section)
- `state` - передані дані між маршрутами

## Структура файлів у проєкті

### App.jsx - Головний файл з роутингом
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
// ... імпорт сторінок

function App() {
  return (
    <BrowserRouter>
      <Navigation />      {/* Відображається на всіх сторінках */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/repair" element={<RepairPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />          {/* Відображається на всіх сторінках */}
    </BrowserRouter>
  );
}
```

### Navigation.jsx - Навігаційне меню
```jsx
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Головна
      </Link>
      <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
        iPhone
      </Link>
      {/* ... інші посилання */}
    </nav>
  );
};
```

### HomePage.jsx - Сторінка з кнопками
```jsx
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/products')}>
      Переглянути iPhone
    </button>
  );
};
```

## Додаткові можливості

### 1. Вкладені маршрути
```jsx
<Routes>
  <Route path="/products" element={<ProductsLayout />}>
    <Route index element={<ProductsList />} />
    <Route path=":id" element={<ProductDetail />} />
  </Route>
</Routes>
```

### 2. Динамічні параметри
```jsx
// Маршрут
<Route path="/products/:id" element={<ProductDetail />} />

// Використання
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  return <div>Product ID: {id}</div>;
}
```

### 3. Перенаправлення
```jsx
import { Navigate } from 'react-router-dom';

<Route path="/old-path" element={<Navigate to="/new-path" replace />} />
```

### 4. Захищені маршрути
```jsx
function ProtectedRoute({ children }) {
  const isAuthenticated = checkAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

<Route path="/admin" element={
  <ProtectedRoute>
    <AdminPage />
  </ProtectedRoute>
} />
```

### 5. Передача даних між сторінками
```jsx
// Відправка
navigate('/products', { state: { from: 'home' } });

// Отримання
const location = useLocation();
console.log(location.state.from); // 'home'
```

## Корисні хуки

| Хук | Призначення |
|-----|------------|
| `useNavigate()` | Програмна навігація |
| `useLocation()` | Поточний маршрут і дані |
| `useParams()` | Параметри з URL |
| `useSearchParams()` | Query параметри (?key=value) |
| `useMatch()` | Перевірка відповідності маршруту |

## Приклад повної навігації

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Перейти на іншу сторінку
  const goToProducts = () => {
    navigate('/products');
  };
  
  // Повернутися назад
  const goBack = () => {
    navigate(-1);
  };
  
  // Перейти вперед
  const goForward = () => {
    navigate(1);
  };
  
  // Замінити поточний запис в історії
  const replaceRoute = () => {
    navigate('/products', { replace: true });
  };
  
  // Перейти з даними
  const navigateWithData = () => {
    navigate('/products', { 
      state: { searchQuery: 'iPhone 15' }
    });
  };
  
  return (
    <div>
      <p>Поточний шлях: {location.pathname}</p>
      <button onClick={goToProducts}>Товари</button>
      <button onClick={goBack}>Назад</button>
    </div>
  );
}
```

## Найкращі практики

1. **Використовуйте Link для посилань**
   ```jsx
   ✅ <Link to="/products">Products</Link>
   ❌ <a href="/products">Products</a>
   ```

2. **Використовуйте useNavigate для кнопок**
   ```jsx
   ✅ <button onClick={() => navigate('/products')}>Go</button>
   ```

3. **Завжди визначайте home route**
   ```jsx
   ✅ <Route path="/" element={<HomePage />} />
   ```

4. **Використовуйте lazy loading для великих додатків**
   ```jsx
   const ProductsPage = lazy(() => import('./pages/ProductsPage'));
   ```

5. **Додайте 404 сторінку**
   ```jsx
   <Route path="*" element={<NotFound />} />
   ```

## Налаштування для деплою

Для коректної роботи на сервері додайте до `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/', // базовий URL додатку
});
```

І налаштуйте сервер для перенаправлення всіх запитів на index.html.

## Корисні ресурси

- [React Router Документація](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [React Router Examples](https://github.com/remix-run/react-router/tree/main/examples)
