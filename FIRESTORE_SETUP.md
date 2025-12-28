# Налаштування Firebase Firestore Security Rules

Щоб заповнити базу даних, потрібно налаштувати правила Firestore.

## Крок 1: Відкрийте Firebase Console
Перейдіть: https://console.firebase.google.com/project/kyrsova-8da83/firestore/rules

## Крок 2: Встановіть правила (ДЛЯ SEED - тимчасово!)

**УВАГА: Використовуйте ці правила ТІЛЬКИ для запуску seed, потім змініть на безпечні!**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Після успішного seed замініть на безпечні правила (див. Крок 5)!

## Крок 3: Публікація правил
Натисніть **"Publish"** або **"Опублікувати"**

## Крок 4: Запустіть seed знову
```bash
npm run seed
```

## Крок 5: ОБОВ'ЯЗКОВО змініть правила на безпечні!

**Після успішного seed поверніться в Firebase Console та встановіть ці правила:**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Функція перевірки адміна
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Товари - всі можуть читати, тільки адміни пишуть
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Послуги ремонту - всі можуть читати, тільки адміни пишуть
    match /repairServices/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Профілі користувачів
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId || isAdmin();
    }
    
    // Замовлення - користувачі можуть читати свої, адміни всі
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }
    
    // Заявки на ремонт
    match /repairRequests/{requestId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }
  }
}
```

Натисніть **"Publish"** ще раз!

---

## Альтернатива: Використати Firebase Console UI

1. Перейдіть: https://console.firebase.google.com/project/kyrsova-8da83/firestore/data
2. Вручну створіть колекції `products` та `repairServices`
3. Додайте документи з даних нижче:

### Products Collection

**Document 1:**
```json
{
  "name": "iPhone 16 Pro Max",
  "storage": "256GB",
  "price": 54999,
  "image": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=400&hei=400&fmt=jpeg",
  "inStock": true,
  "order": 1,
  "createdAt": "2025-12-27T00:00:00.000Z",
  "updatedAt": "2025-12-27T00:00:00.000Z"
}
```

**Document 2:**
```json
{
  "name": "iPhone 16 Pro",
  "storage": "128GB",
  "price": 47999,
  "image": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-1inch-blacktitanium?wid=400&hei=400&fmt=jpeg",
  "inStock": true,
  "order": 2,
  "createdAt": "2025-12-27T00:00:00.000Z",
  "updatedAt": "2025-12-27T00:00:00.000Z"
}
```

### Repair Services Collection

**Document 1:**
```json
{
  "title": "Заміна екрану",
  "description": "Професійна заміна розбитого або пошкодженого екрану на оригінальний дисплей Apple з гарантією якості.",
  "models": {
    "iphone-16": 8500,
    "iphone-15": 6500,
    "iphone-14": 5500,
    "iphone-13": 4500,
    "iphone-12": 3800,
    "iphone-11": 3000
  },
  "time": "1 година",
  "order": 1,
  "createdAt": "2025-12-27T00:00:00.000Z",
  "updatedAt": "2025-12-27T00:00:00.000Z"
}
```

**Document 2:**
```json
{
  "title": "Заміна батареї",
  "description": "Встановлення нової оригінальної батареї. Відновлення автономності роботи вашого iPhone.",
  "models": {
    "iphone-16": 2800,
    "iphone-15": 2500,
    "iphone-14": 2200,
    "iphone-13": 2000,
    "iphone-12": 1800,
    "iphone-11": 1600
  },
  "time": "30 хвилин",
  "order": 2,
  "createdAt": "2025-12-27T00:00:00.000Z",
  "updatedAt": "2025-12-27T00:00:00.000Z"
}
```

---

## Для production (після тестування):

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /repairServices/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```
