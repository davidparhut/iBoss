import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "./config";

// Реєстрація нового користувача
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Оновлення профілю користувача
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Вхід користувача
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Вихід користувача
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Відновлення паролю
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Лист для відновлення паролю відправлено на ваш email"
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Відстеження стану авторизації
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Отримати поточного користувача
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Вхід через Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

// Переклад помилок Firebase
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Цей email вже використовується',
    'auth/invalid-email': 'Невірний формат email',
    'auth/operation-not-allowed': 'Операція не дозволена',
    'auth/weak-password': 'Пароль занадто слабкий (мінімум 6 символів)',
    'auth/user-disabled': 'Цей акаунт деактивовано',
    'auth/user-not-found': 'Користувача не знайдено',
    'auth/wrong-password': 'Невірний пароль',
    'auth/too-many-requests': 'Забагато спроб входу. Спробуйте пізніше',
    'auth/network-request-failed': 'Помилка мережі. Перевірте підключення до інтернету'
  };
  
  return errorMessages[errorCode] || 'Виникла помилка. Спробуйте ще раз';
};
