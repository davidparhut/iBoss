// Скрипт для заповнення Firebase бази даних тестовими даними
// Запуск: node seed-database.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAigqSVN6VW83lJUgaX5vm0kD1bLN_fjwI",
  authDomain: "kyrsova-8da83.firebaseapp.com",
  projectId: "kyrsova-8da83",
  storageBucket: "kyrsova-8da83.firebasestorage.app",
  messagingSenderId: "621245118426",
  appId: "1:621245118426:web:e01430c4a0081f62f872e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Початкові дані для товарів (iPhone)
const productsData = [
  {
    name: 'iPhone 16 Pro Max',
    storage: '256GB',
    price: 54999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 1
  },
  {
    name: 'iPhone 16 Pro Max',
    storage: '512GB',
    price: 62999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 2
  },
  {
    name: 'iPhone 16 Pro',
    storage: '128GB',
    price: 47999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-1inch-blacktitanium?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 3
  },
  {
    name: 'iPhone 16 Pro',
    storage: '256GB',
    price: 52999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-1inch-whitetitanium?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 4
  },
  {
    name: 'iPhone 16',
    storage: '128GB',
    price: 39999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-black?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 5
  },
  {
    name: 'iPhone 16',
    storage: '256GB',
    price: 44999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 6
  },
  {
    name: 'iPhone 15 Pro Max',
    storage: '256GB',
    price: 49999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-black-titanium-select?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 7
  },
  {
    name: 'iPhone 15 Pro',
    storage: '256GB',
    price: 44999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-blue-titanium-select?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 8
  },
  {
    name: 'iPhone 15',
    storage: '128GB',
    price: 35999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 9
  },
  {
    name: 'iPhone 15',
    storage: '256GB',
    price: 40999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 10
  },
  {
    name: 'iPhone 14 Pro',
    storage: '256GB',
    price: 38999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 11
  },
  {
    name: 'iPhone 14',
    storage: '128GB',
    price: 29999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 12
  },
  {
    name: 'iPhone 13',
    storage: '128GB',
    price: 24999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 13
  },
  {
    name: 'iPhone 13',
    storage: '256GB',
    price: 28999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=400&hei=400&fmt=jpeg',
    inStock: false,
    order: 14
  },
  {
    name: 'iPhone 12',
    storage: '128GB',
    price: 21999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-purple-select-2021?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 15
  }
];

// Початкові дані для послуг ремонту
const repairServicesData = [
  {
    title: 'Заміна екрану',
    description: 'Професійна заміна розбитого або пошкодженого екрану на оригінальний дисплей Apple з гарантією якості.',
    models: {
      'iphone-16': 8500,
      'iphone-15': 6500,
      'iphone-14': 5500,
      'iphone-13': 4500,
      'iphone-12': 3800,
      'iphone-11': 3000,
    },
    time: '1 година',
    order: 1
  },
  {
    title: 'Заміна батареї',
    description: 'Встановлення нової оригінальної батареї. Відновлення автономності роботи вашого iPhone.',
    models: {
      'iphone-16': 2800,
      'iphone-15': 2500,
      'iphone-14': 2200,
      'iphone-13': 2000,
      'iphone-12': 1800,
      'iphone-11': 1600,
    },
    time: '30 хвилин',
    order: 2
  },
  {
    title: 'Ремонт після води',
    description: 'Професійна очистка та відновлення iPhone після контакту з водою. Діагностика безкоштовно.',
    models: {
      'iphone-16': 2500,
      'iphone-15': 2200,
      'iphone-14': 2000,
      'iphone-13': 1800,
      'iphone-12': 1600,
      'iphone-11': 1500,
    },
    time: '2-3 години',
    order: 3
  },
  {
    title: 'Заміна камери',
    description: 'Ремонт або заміна основної, фронтальної або всіх камер. Оригінальні запчастини Apple.',
    models: {
      'iphone-16': 5500,
      'iphone-15': 4500,
      'iphone-14': 3800,
      'iphone-13': 3200,
      'iphone-12': 2800,
      'iphone-11': 2400,
    },
    time: '1 година',
    order: 4
  },
  {
    title: 'Заміна корпусу',
    description: 'Повна заміна задньої кришки або всього корпусу. Відновлення первісного вигляду вашого iPhone.',
    models: {
      'iphone-16': 7500,
      'iphone-15': 6200,
      'iphone-14': 5500,
      'iphone-13': 4800,
      'iphone-12': 4200,
      'iphone-11': 3500,
    },
    time: '2 години',
    order: 5
  },
  {
    title: 'Ремонт роз\'єму зарядки',
    description: 'Чистка або заміна роз\'єму Lightning/USB-C. Вирішення проблем із зарядкою.',
    models: {
      'iphone-16': 1800,
      'iphone-15': 1600,
      'iphone-14': 1500,
      'iphone-13': 1400,
      'iphone-12': 1300,
      'iphone-11': 1200,
    },
    time: '45 хвилин',
    order: 6
  },
  {
    title: 'Заміна динаміків',
    description: 'Ремонт розмовного або поліфонічного динаміка. Відновлення якості звуку.',
    models: {
      'iphone-16': 2200,
      'iphone-15': 1900,
      'iphone-14': 1700,
      'iphone-13': 1500,
      'iphone-12': 1400,
      'iphone-11': 1200,
    },
    time: '1 година',
    order: 7
  },
  {
    title: 'Ремонт кнопок',
    description: 'Заміна кнопок гучності, блокування або Home. Відновлення функціональності.',
    models: {
      'iphone-16': 1600,
      'iphone-15': 1500,
      'iphone-14': 1400,
      'iphone-13': 1300,
      'iphone-12': 1200,
      'iphone-11': 1100,
    },
    time: '1 година',
    order: 8
  },
  {
    title: 'Діагностика',
    description: 'Повна діагностика всіх систем iPhone. Визначення причини несправності.',
    models: {
      'iphone-16': 0,
      'iphone-15': 0,
      'iphone-14': 0,
      'iphone-13': 0,
      'iphone-12': 0,
      'iphone-11': 0,
    },
    time: '20 хвилин',
    order: 9
  },
  {
    title: 'Заміна вібромотора',
    description: 'Відновлення вібрації на вашому iPhone. Заміна несправного вібромотора.',
    models: {
      'iphone-16': 1400,
      'iphone-15': 1300,
      'iphone-14': 1200,
      'iphone-13': 1100,
      'iphone-12': 1000,
      'iphone-11': 900,
    },
    time: '40 хвилин',
    order: 10
  }
];

// Функція для очищення колекції
async function clearCollection(collectionName) {
  try {
    const collRef = collection(db, collectionName);
    const snapshot = await getDocs(collRef);
    
    const deletePromises = snapshot.docs.map(docSnap => 
      deleteDoc(doc(db, collectionName, docSnap.id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Колекцію ${collectionName} очищено`);
  } catch (error) {
    console.error(`❌ Помилка очищення ${collectionName}:`, error);
  }
}

// Заповнення колекції products
async function seedProducts() {
  try {
    const productsRef = collection(db, "products");
    
    for (const product of productsData) {
      await addDoc(productsRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Товари успішно додано в базу даних');
  } catch (error) {
    console.error('❌ Помилка додавання товарів:', error);
  }
}

// Заповнення колекції repairServices
async function seedRepairServices() {
  try {
    const servicesRef = collection(db, "repairServices");
    
    for (const service of repairServicesData) {
      await addDoc(servicesRef, {
        ...service,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Послуги ремонту успішно додано в базу даних');
  } catch (error) {
    console.error('❌ Помилка додавання послуг:', error);
  }
}

// Головна функція
async function seedDatabase() {
  console.log('🚀 Початок заповнення бази даних...\n');
  
  // Очищаємо старі дані
  await clearCollection('products');
  await clearCollection('repairServices');
  
  // Додаємо нові дані
  await seedProducts();
  await seedRepairServices();
  
  console.log('\n✅ База даних успішно заповнена!');
  process.exit(0);
}

// Запускаємо
seedDatabase().catch(error => {
  console.error('❌ Критична помилка:', error);
  process.exit(1);
});
