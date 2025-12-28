# 🔥 Firebase Integration Guide

## Огляд

Проєкт iBoss інтегровано з Firebase для:
- ✅ Автентифікація користувачів (Firebase Auth)
- ✅ База даних товарів і послуг (Firestore)
- ✅ Замовлення та заявки на ремонт
- ✅ Кошик покупок
- ✅ Аналітика (Firebase Analytics)

## 📁 Структура Firebase файлів

```
src/
├── firebase/
│   ├── config.js          # Конфігурація Firebase
│   ├── auth.js            # Функції авторизації
│   └── firestore.js       # Робота з базою даних
├── context/
│   └── AuthContext.jsx    # Контекст авторизації
```

## 🔐 Firebase Authentication

### Доступні функції авторизації:

```javascript
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  getCurrentUser 
} from './firebase/auth';
```

### Приклади використання:

#### Реєстрація
```javascript
const result = await registerUser(email, password, displayName);
if (result.success) {
  console.log('Користувач:', result.user);
} else {
  console.error('Помилка:', result.error);
}
```

#### Вхід
```javascript
const result = await loginUser(email, password);
if (result.success) {
  console.log('Успішний вхід!');
}
```

#### Вихід
```javascript
const result = await logoutUser();
```

#### Відновлення паролю
```javascript
const result = await resetPassword(email);
if (result.success) {
  console.log(result.message);
}
```

## 📊 Firestore Database

### Колекції в базі даних:

#### 1. **products** - Товари (iPhone)
```javascript
{
  name: "iPhone 16 Pro Max",
  storage: "256GB",
  price: 54999,
  badge: "Новинка",
  icon: "📱",
  createdAt: "2024-12-27T...",
  updatedAt: "2024-12-27T..."
}
```

#### 2. **repairServices** - Послуги ремонту
```javascript
{
  title: "Заміна екрану",
  description: "Професійна заміна...",
  price: "від 2 500 ₴",
  time: "1 година",
  order: 1,
  createdAt: "2024-12-27T...",
  updatedAt: "2024-12-27T..."
}
```

#### 3. **orders** - Замовлення
```javascript
{
  userId: "user123",
  products: [{productId: "prod1", quantity: 1}],
  totalPrice: 54999,
  status: "pending", // pending, processing, completed, cancelled
  customerInfo: {
    name: "Іван",
    phone: "+380...",
    address: "..."
  },
  createdAt: "2024-12-27T...",
  updatedAt: "2024-12-27T..."
}
```

#### 4. **repairRequests** - Заявки на ремонт
```javascript
{
  userId: "user123",
  serviceId: "service1",
  deviceModel: "iPhone 15 Pro",
  problemDescription: "Розбитий екран",
  status: "new", // new, in-progress, completed, cancelled
  customerInfo: {...},
  createdAt: "2024-12-27T...",
  updatedAt: "2024-12-27T..."
}
```

#### 5. **carts** - Кошики покупок
```javascript
{
  userId: "user123",
  productId: "prod1",
  quantity: 1,
  createdAt: "2024-12-27T...",
  updatedAt: "2024-12-27T..."
}
```

### Функції для роботи з даними:

```javascript
import { 
  // Products
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  
  // Repair Services
  getAllRepairServices,
  addRepairService,
  updateRepairService,
  
  // Orders
  createOrder,
  getUserOrders,
  updateOrderStatus,
  
  // Repair Requests
  createRepairRequest,
  getUserRepairRequests,
  
  // Cart
  addToCart,
  getUserCart,
  removeFromCart,
  clearCart
} from './firebase/firestore';
```

### Приклади використання:

#### Отримати всі товари
```javascript
const result = await getAllProducts();
if (result.success) {
  console.log(result.data); // масив товарів
}
```

#### Створити замовлення
```javascript
const orderData = {
  userId: currentUser.uid,
  products: [
    { productId: "prod1", quantity: 1, price: 54999 }
  ],
  totalPrice: 54999,
  customerInfo: {
    name: "Іван Петренко",
    phone: "+380671234567",
    email: "ivan@example.com",
    address: "Львів, вул. Шевченка 1"
  }
};

const result = await createOrder(orderData);
if (result.success) {
  console.log('Замовлення створено:', result.id);
}
```

#### Додати товар в кошик
```javascript
const result = await addToCart(userId, productId, quantity);
```

## 🎯 Використання AuthContext

### В компонентах:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Завантаження...</div>;
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Привіт, {currentUser.displayName}!</p>
      ) : (
        <p>Будь ласка, увійдіть</p>
      )}
    </div>
  );
}
```

### Доступні властивості:
- `currentUser` - об'єкт поточного користувача (або null)
- `isAuthenticated` - boolean, чи увійшов користувач
- `loading` - boolean, чи завантажується стан авторизації

## 🚀 Початок роботи

### 1. Встановіть залежності:
```bash
npm install
```

### 2. Firebase вже налаштований!
Конфігурація знаходиться в `src/firebase/config.js`

### 3. Запустіть проєкт:
```bash
npm run dev
```

## 📝 Структура даних для додавання в Firestore

### Додати тестові товари в Firestore Console:

1. Відкрийте Firebase Console: https://console.firebase.google.com/
2. Виберіть проєкт "iboss-bd2112"
3. Перейдіть в Firestore Database
4. Створіть колекцію "products"
5. Додайте документи з такими полями:

```javascript
// Документ 1
{
  name: "iPhone 16 Pro Max",
  storage: "256GB", 
  price: 54999,
  badge: "Новинка",
  icon: "📱",
  inStock: true,
  createdAt: new Date().toISOString()
}

// Документ 2
{
  name: "iPhone 15 Pro",
  storage: "128GB",
  price: 42999,
  badge: "Топ",
  icon: "📱",
  inStock: true,
  createdAt: new Date().toISOString()
}
```

### Додати послуги ремонту:

Колекція: "repairServices"

```javascript
{
  title: "Заміна екрану",
  description: "Професійна заміна розбитого або пошкодженого екрану",
  price: "від 2 500 ₴",
  time: "1 година",
  order: 1,
  createdAt: new Date().toISOString()
}
```

## 🔒 Правила безпеки Firestore

Рекомендовані правила для Firebase Console (Firestore Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - читання для всіх, запис лише для адмінів
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Repair Services - читання для всіх, запис лише для адмінів
    match /repairServices/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Orders - лише власник може читати свої замовлення
    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Repair Requests - лише власник
    match /repairRequests/{requestId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Carts - лише власник свого кошика
    match /carts/{cartId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🎨 Особливості реалізації

1. **Fallback дані**: Якщо в Firestore немає даних, додаток автоматично використовує дефолтні дані
2. **Помилки перекладені українською**: Всі помилки Firebase перекладені
3. **Автоматична авторизація**: AuthContext автоматично відстежує стан користувача
4. **Lazy Loading**: Дані завантажуються тільки коли потрібно

## 📱 Тестування

### Створіть тестового користувача:
1. Перейдіть на `/login`
2. Натисніть "Зареєструватися"
3. Введіть дані
4. Після реєстрації автоматично відбудеться вхід

### Перевірте Firestore:
1. Firebase Console → Authentication → Users
2. Має з'явитися новий користувач

## 🆘 Часті помилки

### "Firebase: Error (auth/configuration-not-found)"
- Перевірте чи правильно скопійовано firebaseConfig
- Переконайтесь що Authentication увімкнено в Firebase Console

### "Missing or insufficient permissions"
- Налаштуйте правила безпеки Firestore
- Перевірте чи користувач авторизований

### Дані не завантажуються
- Перевірте чи створені колекції в Firestore
- Додаток використає fallback дані якщо колекція пуста

## 📚 Додаткові ресурси

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

## 🎯 Наступні кроки

1. ✅ Додати товари в Firestore Console
2. ✅ Додати послуги ремонту
3. ✅ Налаштувати правила безпеки
4. ⬜ Додати адмін панель
5. ⬜ Реалізувати повний процес замовлення
6. ⬜ Додати Firebase Storage для зображень
7. ⬜ Інтегрувати платіжну систему
