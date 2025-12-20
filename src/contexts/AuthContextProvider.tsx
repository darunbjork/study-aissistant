import { useState, type ReactNode } from 'react';
import type { User, NewQuiz, Quiz } from '../types';
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
      quizzes: [],
      createdQuizzes: [],
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
      quizzes: []
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

  // Add this function
  const addCreatedQuiz = (quizData: NewQuiz) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      userId: user?.id || 0,
    };
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        createdQuizzes: [...(prev.createdQuizzes || []), newQuiz]
      };
    });
  };

  // Add this function
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

  // Add this function
  const deleteCreatedQuiz = (quizId: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        createdQuizzes: prev.createdQuizzes?.filter(quiz => quiz.id !== quizId)
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
      addCreatedQuiz,      // Add this
      updateQuiz,          // Add this
      deleteCreatedQuiz    // Add this
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
