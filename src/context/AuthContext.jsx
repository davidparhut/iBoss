import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser } from '../firebase/auth';
import { getUserProfile, createOrUpdateUserProfile } from '../firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Завантажити профіль користувача з Firestore
        const profileResult = await getUserProfile(user.uid);
        
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        } else {
          // Якщо профілю немає, створити його
          await createOrUpdateUserProfile(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            role: 'user' // За замовчуванням звичайний користувач
          });
          
          // Завантажити знову
          const newProfileResult = await getUserProfile(user.uid);
          if (newProfileResult.success) {
            setUserProfile(newProfileResult.data);
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: userProfile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
