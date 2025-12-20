import { useState, type ReactNode } from 'react';
import type { User, NewQuiz, Quiz, SavedQuizResult } from '../types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string): boolean => {
    console.log('Login attempt:', email);
    
    const mockUser: User = {
      id: 1,
      name: 'Student User',
      email: email,
      password: 'password', // Add this
      quizzes: [],
      createdQuizzes: [],
      settings: { theme: 'light' }, // Add this
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const signup = (name: string, email: string): boolean => {
    console.log('Signup attempt:', name, email);
    
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password: 'password', // Add this
      quizzes: [],
      createdQuizzes: [],
      settings: { theme: 'light' }, // Add this
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  const deleteQuiz = (quizId: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        quizzes: prev.quizzes.filter(quiz => quiz.id !== quizId)
      };
    });
  };

  const addCreatedQuiz = (quizData: NewQuiz) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      userId: user?.id || 0,
      source: 'manual', // Add this
    };
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        createdQuizzes: [...(prev.createdQuizzes || []), newQuiz]
      };
    });
  };

  const updateQuiz = (quizId: number, updatedQuiz: Partial<Quiz>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        createdQuizzes: prev.createdQuizzes?.map(quiz => 
          quiz.id === quizId ? { ...quiz, ...updatedQuiz } : quiz
        )
      };
    });
  };

  const deleteCreatedQuiz = (quizId: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        createdQuizzes: prev.createdQuizzes?.filter(quiz => quiz.id !== quizId)
      };
    });
  };

  // Add this function
  const saveQuizResult = (result: Omit<SavedQuizResult, 'id' | 'date'>) => {
    setUser(prev => {
      if (!prev) return null;
      const newResult: SavedQuizResult = {
        ...result,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      return {
        ...prev,
        quizzes: [...prev.quizzes, newResult],
      };
    });
  };

  // Add this function
  const toggleTheme = () => {
    setUser(prev => {
      if (!prev) return null;
      const newTheme = prev.settings.theme === 'light' ? 'dark' : 'light';
      return {
        ...prev,
        settings: { ...prev.settings, theme: newTheme },
      };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile,
      deleteQuiz,
      addCreatedQuiz,
      updateQuiz,
      deleteCreatedQuiz,
      saveQuizResult,    // Add this
      toggleTheme,       // Add this
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
