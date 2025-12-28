// Скрипт для створення першого адміністратора
// Запуск: node create-admin.js YOUR_EMAIL

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Отримати email з аргументів командного рядка
const email = process.argv[2];
const password = process.argv[3] || 'admin123456'; // Дефолтний пароль

if (!email) {
  console.error('❌ Використання: node create-admin.js YOUR_EMAIL [PASSWORD]');
  console.error('   Приклад: node create-admin.js admin@iboss.com mypassword');
  process.exit(1);
}

async function createAdminUser() {
  try {
    console.log(`🚀 Створення адміністратора для email: ${email}`);
    
    // Створити користувача в Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Користувача створено в Authentication`);
    
    // Створити профіль в Firestore з роллю admin
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: 'Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Профіль адміністратора створено в Firestore`);
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Пароль: ${password}`);
    console.log(`\n⚠️  Збережіть ці дані в безпечному місці!`);
    console.log(`\nТепер ви можете увійти на сайт з цими даними.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка створення адміна:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 Email вже використовується. Спробуйте інший.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n💡 Пароль занадто слабкий (мінімум 6 символів).');
    }
    
    process.exit(1);
  }
}

createAdminUser();
