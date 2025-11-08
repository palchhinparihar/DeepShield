import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base lg:text-sm ${
      isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
    }`;

  const btnClass = 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700';

  if (isLoading) return null; // prevents flicker while Auth0 is initializing

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <NavLink to="/" className="text-xl font-bold text-gray-900">
            DeepShield
          </NavLink>

          {/* desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <ul className="flex items-center space-x-4">
              <li>
                <NavLink to="/" className={linkClass} aria-current="page">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={linkClass}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={linkClass}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy" className={linkClass}>
                  Privacy Policy
                </NavLink>
              </li>
            </ul>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className={btnClass}
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginWithRedirect()}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  Login
                </button>
                <button onClick={() => loginWithRedirect()} className={btnClass}>
                  Signup
                </button>
              </div>
            )}
          </div>

          {/* mobile toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
                <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className={linkClass} onClick={() => setOpen(false)}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy" className={linkClass} onClick={() => setOpen(false)}>
                  Privacy Policy
                </NavLink>
              </li>
            </ul>

            <div className="mt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout({ logoutParams: { returnTo: window.location.origin } });
                    setOpen(false);
                  }}
                  className={btnClass}
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      loginWithRedirect();
                      setOpen(false);
                    }}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      loginWithRedirect();
                      setOpen(false);
                    }}
                    className={btnClass}
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
