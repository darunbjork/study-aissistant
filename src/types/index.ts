export interface Quiz {
  id: number;
  title: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  quizzes: Quiz[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  deleteQuiz: (quizId: number) => void;
}