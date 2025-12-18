import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string): boolean => {
    console.log('Login attempt:', email);
    
    const mockUser: User = {
      id: 1,
      name: 'Student User',
      email: email,
      quizzes: [
        { id: 1, title: 'JavaScript Basics', date: '2024-03-01' },
        { id: 2, title: 'React Hooks', date: '2024-03-10' }
      ]
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    console.log('Signup attempt:', name, email);
    
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      quizzes: []
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};