import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const auth = useAuth();
  
  return (
    <nav>
      <Link to="/">Study AI Assistant</Link>
    </nav>
  );
}

export default Navbar;