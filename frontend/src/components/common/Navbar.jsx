import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => navigate('/login'), 500);
  };

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base lg:text-sm ${
      isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
    }`;

  const btnClass = 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700';

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <NavLink to="/" className="text-xl font-bold text-gray-900">DeepShield</NavLink>

          {/* desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <ul className="flex items-center space-x-4">
              <li>
                <NavLink to="/" className={linkClass} aria-current="page">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={linkClass}>About</NavLink>
              </li>
            </ul>

            {token ? (
              <button onClick={handleLogout} className={btnClass}>Logout</button>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">Login</NavLink>
                <NavLink to="/signup" className={btnClass}>Signup</NavLink>
              </div>
            )}
          </div>

          {/* mobile toggle */}
          <div className="lg:hidden">
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* mobile menu content */}
        {open && (
          <div className="lg:hidden pb-4">
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={linkClass} onClick={() => setOpen(false)}>FAQ</NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy" className={linkClass} onClick={() => setOpen(false)}>Privacy Policy</NavLink>
              </li>
            </ul>

            <div className="mt-4">
              {token ? (
                <button onClick={() => { handleLogout(); setOpen(false); }} className={btnClass}>Logout</button>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-center">Login</NavLink>
                  <NavLink to="/signup" className={btnClass}>Signup</NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;