import React from 'react';

const Navbar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">🔒 FIMS</h1>

          <ul className="flex space-x-8 items-center">
            {isAdmin ? (
              // Admin navigation
              <>
                <li>
                  <button
                    onClick={() => setCurrentPage('admin-dashboard')}
                    className={`text-lg font-semibold transition-all ${
                      currentPage === 'admin-dashboard'
                        ? 'text-yellow-300 border-b-2 border-yellow-300'
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    Admin Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('alerts')}
                    className={`text-lg font-semibold transition-all ${
                      currentPage === 'alerts'
                        ? 'text-yellow-300 border-b-2 border-yellow-300'
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    All Alerts
                  </button>
                </li>
              </>
            ) : (
              // User navigation
              <>
                <li>
                  <button
                    onClick={() => setCurrentPage('user-dashboard')}
                    className={`text-lg font-semibold transition-all ${
                      currentPage === 'user-dashboard'
                        ? 'text-yellow-300 border-b-2 border-yellow-300'
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('scanner')}
                    className={`text-lg font-semibold transition-all ${
                      currentPage === 'scanner'
                        ? 'text-yellow-300 border-b-2 border-yellow-300'
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    File Scanner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('alerts')}
                    className={`text-lg font-semibold transition-all ${
                      currentPage === 'alerts'
                        ? 'text-yellow-300 border-b-2 border-yellow-300'
                        : 'text-white hover:text-yellow-300'
                    }`}
                  >
                    My Alerts
                  </button>
                </li>
              </>
            )}

            {/* User Info */}
            <li className="border-l border-blue-500 pl-8">
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {isAdmin ? '👑' : '👤'} {user.username}
                </span>
                <button
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
