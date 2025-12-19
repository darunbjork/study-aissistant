import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Study from './pages/Study';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import ProtectedRoute from './components/ProtectedRoute';
import Card from './components/Card';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Routes>
          <Route path="/" element={<Card><Home /></Card>} />
          <Route path="/login" element={<Card><Login /></Card>} />
          <Route path="/signup" element={<Card><Signup /></Card>} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Card><Profile /></Card>
            </ProtectedRoute>
          } />
          <Route path="/study" element={
            <ProtectedRoute>
              <Card><Study /></Card>
            </ProtectedRoute>
          } />
          <Route path="/create-quiz" element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          } />
          <Route path="/take-quiz/:quizId" element={
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
