import React, { useContext } from "react"; 
import { Link } from "react-router-dom";
import AuthContext from "./context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          LeetCode Clone
        </Link>
        <div>
          <Link to="/" className="px-3 hover:text-blue-400">
            Problems
          </Link>
          <Link to="/contests" className="px-3 hover:text-blue-400">
            Contests
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="px-3 hover:text-blue-400">
                Profile
              </Link>
              <button onClick={logout} className="px-3 hover:text-blue-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 hover:text-blue-400">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 bg-blue-600 hover:bg-blue-700 rounded-md py-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
