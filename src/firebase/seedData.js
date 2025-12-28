import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config";

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
    name: 'iPhone 16 Pro',
    storage: '128GB',
    price: 47999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-1inch-blacktitanium?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 2
  },
  {
    name: 'iPhone 15 Pro Max',
    storage: '256GB',
    price: 49999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-black-titanium-select?wid=400&hei=400&fmt=jpeg',
    inStock: true,
    order: 3
  },
  {
    name: 'iPhone 15',
    storage: '128GB',
    price: 35999,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400&hei=400&fmt=jpeg',
    inStock: false,
    order: 4
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
  }
];

// Функція для очищення колекції
export const clearCollection = async (collectionName) => {
  try {
    const collRef = collection(db, collectionName);
    const snapshot = await getDocs(collRef);
    
    const deletePromises = snapshot.docs.map(docSnap => 
      deleteDoc(doc(db, collectionName, docSnap.id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Колекцію ${collectionName} очищено`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Помилка очищення ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// Заповнення колекції products
export const seedProducts = async () => {
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
    return { success: true };
  } catch (error) {
    console.error('❌ Помилка додавання товарів:', error);
    return { success: false, error: error.message };
  }
};

// Заповнення колекції repairServices
export const seedRepairServices = async () => {
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
    return { success: true };
  } catch (error) {
    console.error('❌ Помилка додавання послуг:', error);
    return { success: false, error: error.message };
  }
};

// Головна функція для заповнення всіх даних
export const seedDatabase = async () => {
  console.log('🚀 Початок заповнення бази даних...\n');
  
  // Очищаємо старі дані
  await clearCollection('products');
  await clearCollection('repairServices');
  
  // Додаємо нові дані
  await seedProducts();
  await seedRepairServices();
  
  console.log('\n✅ База даних успішно заповнена!');
  return { success: true };
};

export { productsData, repairServicesData };
