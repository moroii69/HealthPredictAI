"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";  // firebase user auth
import { auth } from "@/lib/firebase";  // firebase auth instance

// auth context type definition
interface AuthContextType {
  user: User | null;  // current user or null
  loading: boolean;  // loading state
}

// create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// auth provider component to manage user state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);  // user state
  const [loading, setLoading] = useState(true);  // loading state

  useEffect(() => {
    // listen for auth state changes (user sign-in/out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // update user state
      setLoading(false);  // set loading to false once auth state is determined
    });

    return () => unsubscribe();  // cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}  // provide auth context to children components
    </AuthContext.Provider>
  );
}

// custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
