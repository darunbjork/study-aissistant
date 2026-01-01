import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';
import './Navbar.css';

function Navbar() {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">Study AI Assistant</Link>
      
      <div>
        {!auth.isAuthenticated ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/study" className="navbar-link">Study</Link>
            {/* Add this line after the Study link */}
            <Link 
              to="/create-quiz" 
              className="navbar-create-quiz-link"
            >
              Create Quiz
            </Link>
            <Link to="/profile" className="navbar-link">Profile</Link>
            <button onClick={auth.logout} className="navbar-button navbar-logout-button">Logout</button>
            <Button onClick={toggleTheme} variant="secondary" className="navbar-button">
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;