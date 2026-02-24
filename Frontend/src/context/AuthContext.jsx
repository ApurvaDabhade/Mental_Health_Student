// Frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();
const AUTH_DISABLED = true;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || null); // Initialize from localStorage
  const [loading, setLoading] = useState(true);

  const ensureDevUser = (typeOverride = null) => {
    const storedType = typeOverride || localStorage.getItem('userType') || 'user';
    const storedId = localStorage.getItem('userId') || `dev_${Math.random().toString(36).slice(2, 10)}`;
    const storedName =
      localStorage.getItem('devDisplayName') ||
      (storedType === 'counsellor' ? 'Demo Counsellor' : 'Demo Student');
    const storedEmail = localStorage.getItem('devEmail') || 'demo@sahaay.local';

    localStorage.setItem('userType', storedType);
    localStorage.setItem('userId', storedId);
    localStorage.setItem('devDisplayName', storedName);
    localStorage.setItem('devEmail', storedEmail);

    const devUser = { uid: storedId, email: storedEmail, displayName: storedName };
    setUserType(storedType);
    setCurrentUser(devUser);
    return devUser;
  };

  // Sign up new user
  const signup = async (email, password, fullName, type = 'user') => {
    if (AUTH_DISABLED) {
      localStorage.setItem('devEmail', email || 'demo@sahaay.local');
      localStorage.setItem('devDisplayName', fullName || 'Demo User');
      const devUser = ensureDevUser(type);
      return { user: devUser };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Save userType to localStorage
      localStorage.setItem('userType', type);
      setUserType(type);

      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Sign in existing user
  const login = async (email, password) => {
    if (AUTH_DISABLED) {
      localStorage.setItem('devEmail', email || 'demo@sahaay.local');
      const devUser = ensureDevUser(localStorage.getItem('userType') || 'user');
      return { user: devUser };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // In a real app we would fetch userType from backend. 
      // Here we trust the previous session or default to 'user' if not found.
      const storedType = localStorage.getItem('userType') || 'user';
      setUserType(storedType);

      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (type = 'user') => {
    if (AUTH_DISABLED) {
      const devUser = ensureDevUser(type);
      return { user: devUser };
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Save or update userType
      // If logging in, we might want to keep existing type if we had one, 
      // but if specific type is requested (like from signup page toggle), use that.
      localStorage.setItem('userType', type);
      setUserType(type);

      return userCredential;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    if (AUTH_DISABLED) {
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      setUserType(null);
      setCurrentUser(null);
      return;
    }
    try {
      await signOut(auth);
      localStorage.removeItem('userType');
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    if (AUTH_DISABLED) {
      ensureDevUser();
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Recover userType from storage if page reloaded
        const storedType = localStorage.getItem('userType');
        if (storedType) {
          setUserType(storedType);
        }
      } else {
        setUserType(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    loading,
    setUserType // Exposed for manual updates after fetching from backend
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};