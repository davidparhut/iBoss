import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./config";

// ============ PRODUCTS (iPhone) ============

// Отримати всі товари
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error getting products:", error);
    return { success: false, error: error.message };
  }
};

// Отримати товар за ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return {
        success: true,
        data: { id: productSnap.id, ...productSnap.data() }
      };
    } else {
      return { success: false, error: "Товар не знайдено" };
    }
  } catch (error) {
    console.error("Error getting product:", error);
    return { success: false, error: error.message };
  }
};

// Додати новий товар (тільки для адміна)
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, "products");
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: error.message };
  }
};

// Оновити товар
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};

// Видалити товар
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

// Пошук товарів за назвою
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        products.push({ id: doc.id, ...data });
      }
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error searching products:", error);
    return { success: false, error: error.message };
  }
};

// ============ REPAIR SERVICES ============

// Отримати всі послуги ремонту
export const getAllRepairServices = async () => {
  try {
    const servicesRef = collection(db, "repairServices");
    const q = query(servicesRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: services };
  } catch (error) {
    console.error("Error getting repair services:", error);
    return { success: false, error: error.message };
  }
};

// Додати послугу ремонту
export const addRepairService = async (serviceData) => {
  try {
    const servicesRef = collection(db, "repairServices");
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding repair service:", error);
    return { success: false, error: error.message };
  }
};

// Оновити послугу ремонту
export const updateRepairService = async (serviceId, serviceData) => {
  try {
    const serviceRef = doc(db, "repairServices", serviceId);
    await updateDoc(serviceRef, {
      ...serviceData,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating repair service:", error);
    return { success: false, error: error.message };
  }
};

// Видалити послугу ремонту
export const deleteRepairService = async (serviceId) => {
  try {
    const serviceRef = doc(db, "repairServices", serviceId);
    await deleteDoc(serviceRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting repair service:", error);
    return { success: false, error: error.message };
  }
};

// ============ USERS & ROLES (Користувачі та ролі) ============

// Створити або оновити профіль користувача
export const createOrUpdateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Оновити існуючий профіль
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Створити новий профіль
      await updateDoc(userRef, {
        ...userData,
        role: userData.role || "user", // За замовчуванням роль "user"
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Отримати профіль користувача
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        success: true,
        data: { id: userSnap.id, ...userSnap.data() }
      };
    } else {
      return { success: false, error: "Користувача не знайдено" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error: error.message };
  }
};

// Перевірити чи користувач адмін
export const isUserAdmin = async (userId) => {
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile.success) {
      return userProfile.data.role === "admin";
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Отримати всіх користувачів (тільки для адміна)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message };
  }
};

// Оновити роль користувача (тільки для адміна)
export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: role,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
};

// ============ ORDERS (Замовлення) ============

// Створити замовлення
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: 'pending', // pending, processing, completed, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};

// Отримати замовлення користувача
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Сортуємо в JavaScript
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error getting user orders:", error);
    return { success: false, error: error.message };
  }
};

// Отримати всі замовлення (для адмінів)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error getting all orders:", error);
    return { success: false, error: error.message };
  }
};

// Оновити статус замовлення
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// ============ REPAIR REQUESTS (Заявки на ремонт) ============

// Створити заявку на ремонт
export const createRepairRequest = async (requestData) => {
  try {
    const requestsRef = collection(db, "repairRequests");
    const docRef = await addDoc(requestsRef, {
      ...requestData,
      status: "new", // new, in-progress, completed, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating repair request:", error);
    return { success: false, error: error.message };
  }
};

// Отримати заявки користувача на ремонт
export const getUserRepairRequests = async (userId) => {
  try {
    const requestsRef = collection(db, "repairRequests");
    const q = query(requestsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Сортуємо в JavaScript
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return { success: true, data: requests };
  } catch (error) {
    console.error("Error getting repair requests:", error);
    return { success: false, error: error.message };
  }
};

// Отримати всі заявки на ремонт (для адміна)
export const getAllRepairRequests = async () => {
  try {
    const requestsRef = collection(db, "repairRequests");
    const q = query(requestsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: requests };
  } catch (error) {
    console.error("Error getting all repair requests:", error);
    return { success: false, error: error.message, data: [] };
  }
};

// Оновити статус заявки на ремонт
export const updateRepairRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, "repairRequests", requestId);
    await updateDoc(requestRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating repair request status:", error);
    return { success: false, error: error.message };
  }
};

// ============ CART (Кошик) - збереження в Firestore ============

// Додати товар до кошика
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const cartRef = collection(db, "carts");
    const q = query(
      cartRef,
      where("userId", "==", userId),
      where("productId", "==", productId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Оновити кількість існуючого товару
      const docRef = querySnapshot.docs[0].ref;
      const currentQuantity = querySnapshot.docs[0].data().quantity;
      await updateDoc(docRef, {
        quantity: currentQuantity + quantity,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Додати новий товар
      await addDoc(cartRef, {
        userId,
        productId,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: error.message };
  }
};

// Отримати кошик користувача
export const getUserCart = async (userId) => {
  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const cartItems = [];
    for (const docSnap of querySnapshot.docs) {
      const cartItem = { id: docSnap.id, ...docSnap.data() };
      
      // Отримати дані про товар
      const productResult = await getProductById(cartItem.productId);
      if (productResult.success) {
        cartItem.product = productResult.data;
      }
      
      cartItems.push(cartItem);
    }
    
    return { success: true, data: cartItems };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, error: error.message };
  }
};

// Видалити товар з кошика
export const removeFromCart = async (cartItemId) => {
  try {
    const cartItemRef = doc(db, "carts", cartItemId);
    await deleteDoc(cartItemRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: error.message };
  }
};

// Очистити кошик
export const clearCart = async (userId) => {
  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: error.message };
  }
};
