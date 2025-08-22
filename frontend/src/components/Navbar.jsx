import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold flex items-center">
        <span className="mr-2">📄</span>
        Digital Resume Builder
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/resumes" className="hover:text-blue-200 transition-colors">My Resumes</Link>
            <Link to="/resumes/create" className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              + Create Resume
            </Link>
            <Link to="/profile" className="hover:text-blue-200 transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
