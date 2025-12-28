// Seed script для додавання продуктів з кольорами та варіантами пам'яті
// Запустити: node seedProducts.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8vKx_wF7dN0BkR-0rLQJqFYxE-xRmZhI",
  authDomain: "kyrsova-8da83.firebaseapp.com",
  projectId: "kyrsova-8da83",
  storageBucket: "kyrsova-8da83.firebasestorage.app",
  messagingSenderId: "442961738599",
  appId: "1:442961738599:web:c8e9b4e9a3e0a8b2e9f5e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: "iPhone 16 Pro Max",
    colors: ["Чорний титан", "Білий титан", "Синій титан", "Сірий титан"],
    storageOptions: [
      { size: "256GB", price: 54999 },
      { size: "512GB", price: 62999 },
      { size: "1TB", price: 70999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1725502458783",
    inStock: true
  },
  {
    name: "iPhone 16 Pro",
    colors: ["Чорний титан", "Білий титан", "Синій титан", "Сірий титан"],
    storageOptions: [
      { size: "128GB", price: 49999 },
      { size: "256GB", price: 52999 },
      { size: "512GB", price: 60999 },
      { size: "1TB", price: 68999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-1inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1725502457818",
    inStock: true
  },
  {
    name: "iPhone 16 Plus",
    colors: ["Чорний", "Білий", "Синій", "Рожевий", "Зелений"],
    storageOptions: [
      { size: "128GB", price: 44999 },
      { size: "256GB", price: 47999 },
      { size: "512GB", price: 55999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-7inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1725502303520",
    inStock: true
  },
  {
    name: "iPhone 16",
    colors: ["Чорний", "Білий", "Синій", "Рожевий", "Зелений"],
    storageOptions: [
      { size: "128GB", price: 39999 },
      { size: "256GB", price: 42999 },
      { size: "512GB", price: 50999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1725502302978",
    inStock: true
  },
  {
    name: "iPhone 15 Pro Max",
    colors: ["Чорний титан", "Білий титан", "Синій титан", "Сірий титан"],
    storageOptions: [
      { size: "256GB", price: 50999 },
      { size: "512GB", price: 58999 },
      { size: "1TB", price: 66999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895702781",
    inStock: true
  },
  {
    name: "iPhone 15 Pro",
    colors: ["Чорний титан", "Білий титан", "Синій титан", "Сірий титан"],
    storageOptions: [
      { size: "128GB", price: 45999 },
      { size: "256GB", price: 48999 },
      { size: "512GB", price: 56999 },
      { size: "1TB", price: 64999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895700877",
    inStock: true
  },
  {
    name: "iPhone 15 Plus",
    colors: ["Чорний", "Синій", "Зелений", "Жовтий", "Рожевий"],
    storageOptions: [
      { size: "128GB", price: 40999 },
      { size: "256GB", price: 43999 },
      { size: "512GB", price: 51999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-7inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923775139",
    inStock: true
  },
  {
    name: "iPhone 15",
    colors: ["Чорний", "Синій", "Зелений", "Жовтий", "Рожевий"],
    storageOptions: [
      { size: "128GB", price: 35999 },
      { size: "256GB", price: 38999 },
      { size: "512GB", price: 46999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923774247",
    inStock: true
  },
  {
    name: "iPhone 14 Pro Max",
    colors: ["Космічний чорний", "Сріблястий", "Золотий", "Фіолетовий"],
    storageOptions: [
      { size: "128GB", price: 43999 },
      { size: "256GB", price: 46999 },
      { size: "512GB", price: 54999 },
      { size: "1TB", price: 62999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-spaceblack?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703841896",
    inStock: true
  },
  {
    name: "iPhone 14 Pro",
    colors: ["Космічний чорний", "Сріблястий", "Золотий", "Фіолетовий"],
    storageOptions: [
      { size: "128GB", price: 38999 },
      { size: "256GB", price: 41999 },
      { size: "512GB", price: 49999 },
      { size: "1TB", price: 57999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-spaceblack?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703840578",
    inStock: true
  },
  {
    name: "iPhone 14 Plus",
    colors: ["Midnight", "Фіолетовий", "Синій", "Червоний", "Starlight"],
    storageOptions: [
      { size: "128GB", price: 36999 },
      { size: "256GB", price: 39999 },
      { size: "512GB", price: 47999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-midnight?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1661027787458",
    inStock: true
  },
  {
    name: "iPhone 14",
    colors: ["Midnight", "Фіолетовий", "Синій", "Червоний", "Starlight"],
    storageOptions: [
      { size: "128GB", price: 31999 },
      { size: "256GB", price: 34999 },
      { size: "512GB", price: 42999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1661027786350",
    inStock: true
  },
  {
    name: "iPhone 13",
    colors: ["Midnight", "Рожевий", "Синій", "Червоний", "Starlight", "Зелений"],
    storageOptions: [
      { size: "128GB", price: 27999 },
      { size: "256GB", price: 30999 },
      { size: "512GB", price: 38999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-finish-select-202207-midnight?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1645572315857",
    inStock: true
  },
  {
    name: "iPhone SE (2022)",
    colors: ["Midnight", "Starlight", "Червоний"],
    storageOptions: [
      { size: "64GB", price: 19999 },
      { size: "128GB", price: 22999 },
      { size: "256GB", price: 27999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-finish-select-202207-midnight?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1645572444480",
    inStock: true
  },
  {
    name: "iPhone 12",
    colors: ["Чорний", "Білий", "Синій", "Зелений", "Червоний", "Фіолетовий"],
    storageOptions: [
      { size: "64GB", price: 24999 },
      { size: "128GB", price: 27999 },
      { size: "256GB", price: 32999 }
    ],
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-finish-select-202207-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1645572336810",
    inStock: false
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Починаємо seed продуктів...');
    
    // Опціонально: видалити існуючі продукти
    const existingProducts = await getDocs(collection(db, 'products'));
    console.log(`📦 Знайдено ${existingProducts.size} існуючих продуктів`);
    
    const shouldDelete = process.argv.includes('--delete');
    if (shouldDelete) {
      console.log('🗑️ Видалення існуючих продуктів...');
      for (const doc of existingProducts.docs) {
        await deleteDoc(doc.ref);
      }
      console.log('✅ Існуючі продукти видалено');
    }
    
    // Додати нові продукти
    console.log('➕ Додавання нових продуктів...');
    for (const product of products) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`  ✓ Додано: ${product.name}`);
    }
    
    console.log(`\n✨ Успішно додано ${products.length} продуктів!`);
    console.log('\n📝 Структура продукту:');
    console.log('  - name: назва продукту');
    console.log('  - colors: масив доступних кольорів');
    console.log('  - storageOptions: [{ size: "128GB", price: 39999 }]');
    console.log('  - image: URL зображення');
    console.log('  - inStock: наявність');
    
  } catch (error) {
    console.error('❌ Помилка:', error);
  } finally {
    process.exit();
  }
}

seedProducts();
