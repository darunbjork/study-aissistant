import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const auth = useAuth();
  
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#6b7280',
      color: 'white'
    }}>
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