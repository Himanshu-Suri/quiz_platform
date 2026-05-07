import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="select-none">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Quiz<span className="text-blue-500">Platform</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-white text-sm">{user?.name}</p>
            <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;