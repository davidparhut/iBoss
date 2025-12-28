import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from "firebase/storage";
import { storage } from "./config";

// ============ UPLOAD IMAGES ============

/**
 * Завантажити зображення товару
 * @param {File} file - Файл зображення
 * @param {string} productId - ID товару
 * @param {string} imageName - Назва файлу (опціонально)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadProductImage = async (file, productId, imageName = null) => {
  try {
    // Перевірка типу файлу
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Файл має бути зображенням' };
    }

    // Перевірка розміру (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'Розмір файлу не повинен перевищувати 5MB' };
    }

    // Генерація унікального імені файлу
    const timestamp = Date.now();
    const fileName = imageName || `${timestamp}_${file.name}`;
    
    // Створення посилання на Storage
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    
    // Завантаження файлу
    await uploadBytes(storageRef, file);
    
    // Отримання URL завантаженого файлу
    const downloadURL = await getDownloadURL(storageRef);
    
    return { 
      success: true, 
      url: downloadURL,
      fileName: fileName
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { 
      success: false, 
      error: error.message || 'Помилка завантаження зображення' 
    };
  }
};

/**
 * Завантажити декілька зображень для товару
 * @param {FileList|Array<File>} files - Масив файлів
 * @param {string} productId - ID товару
 * @returns {Promise<{success: boolean, urls?: Array<string>, errors?: Array<string>}>}
 */
export const uploadMultipleProductImages = async (files, productId) => {
  try {
    const uploadPromises = [];
    const urls = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      uploadPromises.push(
        uploadProductImage(files[i], productId, `image_${i + 1}_${files[i].name}`)
      );
    }

    const results = await Promise.all(uploadPromises);

    results.forEach((result, index) => {
      if (result.success) {
        urls.push(result.url);
      } else {
        errors.push(`Файл ${index + 1}: ${result.error}`);
      }
    });

    return {
      success: urls.length > 0,
      urls: urls,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    return {
      success: false,
      error: 'Помилка завантаження зображень'
    };
  }
};

// ============ GET IMAGES ============

/**
 * Отримати всі зображення товару
 * @param {string} productId - ID товару
 * @returns {Promise<{success: boolean, urls?: Array<string>, error?: string}>}
 */
export const getProductImages = async (productId) => {
  try {
    const listRef = ref(storage, `products/${productId}`);
    const res = await listAll(listRef);
    
    const urlPromises = res.items.map(itemRef => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);
    
    return {
      success: true,
      urls: urls
    };
  } catch (error) {
    console.error("Error getting product images:", error);
    return {
      success: false,
      error: error.message || 'Помилка отримання зображень'
    };
  }
};

/**
 * Отримати URL конкретного зображення
 * @param {string} productId - ID товару
 * @param {string} fileName - Назва файлу
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const getImageURL = async (productId, fileName) => {
  try {
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    const url = await getDownloadURL(storageRef);
    
    return {
      success: true,
      url: url
    };
  } catch (error) {
    console.error("Error getting image URL:", error);
    return {
      success: false,
      error: error.message || 'Зображення не знайдено'
    };
  }
};

// ============ DELETE IMAGES ============

/**
 * Видалити зображення товару
 * @param {string} productId - ID товару
 * @param {string} fileName - Назва файлу
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProductImage = async (productId, fileName) => {
  try {
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    await deleteObject(storageRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.message || 'Помилка видалення зображення'
    };
  }
};

/**
 * Видалити всі зображення товару
 * @param {string} productId - ID товару
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllProductImages = async (productId) => {
  try {
    const listRef = ref(storage, `products/${productId}`);
    const res = await listAll(listRef);
    
    const deletePromises = res.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting all images:", error);
    return {
      success: false,
      error: error.message || 'Помилка видалення зображень'
    };
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Стиснути зображення перед завантаженням
 * @param {File} file - Файл зображення
 * @param {number} maxWidth - Максимальна ширина
 * @param {number} maxHeight - Максимальна висота
 * @param {number} quality - Якість (0-1)
 * @returns {Promise<Blob>}
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Розрахунок нових розмірів зі збереженням пропорцій
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Завантажити стиснене зображення
 * @param {File} file - Файл зображення
 * @param {string} productId - ID товару
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadCompressedImage = async (file, productId) => {
  try {
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, { type: file.type });
    return await uploadProductImage(compressedFile, productId);
  } catch (error) {
    console.error("Error uploading compressed image:", error);
    return {
      success: false,
      error: 'Помилка стиснення та завантаження зображення'
    };
  }
};
