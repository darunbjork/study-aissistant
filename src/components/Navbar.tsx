import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const auth = useAuth();
  
  return (
    <nav>
      <Link to="/">Study AI Assistant</Link>
      
      <div>
        {!auth.isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/study">Study</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={auth.logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;