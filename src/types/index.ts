export interface Quiz {
  id: number;
  title: string;
  date: string;
}

export interface QuizQuestion {
  question: string;
  options: { [key: string]: string }; // e.g., { A: "Option A text", B: "Option B text" }
  correctAnswer: string;
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