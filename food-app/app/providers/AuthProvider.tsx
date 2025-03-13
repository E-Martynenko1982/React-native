import { onAuthStateChanged, User, UserCredential } from "firebase/auth";
import React, { createContext, useState, useMemo, useEffect, FC } from "react";
import { Alert } from "react-native";
import { auth, db, login, logout, register } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

interface IContext {
  user: User | null;
  isLoading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IContext>({} as IContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const registerHandler = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential: UserCredential = await register(email, password);
      const registeredUser = userCredential.user;
      await addDoc(collection(db, 'users'), {
        _id: registeredUser.uid,
        displayName: 'No name'
      });
    } catch (error: any) {
      Alert.alert('Error registering user', error.message || error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const loginHandler = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error logging in user', error.message || error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error: any) {
      Alert.alert('Error logging out user', error.message || error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser || null);
      setIsLoadingInitial(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    user,
    register: registerHandler,
    login: loginHandler,
    logout: logoutHandler,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};
