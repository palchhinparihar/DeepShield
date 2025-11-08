import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import Profile from '../main/Profile';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
  ];

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base md:text-lg ${isActive ? 'text-[#D9A981] font-semibold' : 'text-white hover:text-[#D9A981]'
    }`;

  const loginBtnClass = "flex items-center gap-2 py-2 px-2.5 md:px-4 border border-blue-400 text-blue-400 font-semibold rounded-lg transition duration-150 hover:bg-blue-400 hover:text-white cursor-pointer";
  const logoutBtnClass = "flex items-center gap-2 py-2 px-2.5 md:px-4 border border-red-500 text-red-500 font-semibold rounded-lg transition duration-150 hover:bg-red-600 hover:text-white cursor-pointer";

  if (isLoading) return null; // prevents flicker while Auth0 is initializing

  return (
    <nav className="w-full md:w-[75%] mx-auto md:rounded-full md:border-2 md:border-gray-600 bg-black/10 backdrop-blur-md shadow sticky top-0 md:top-4 z-50 md:px-5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-8">
            {/* Brand */}
            <NavLink to="/" className="text-xl md:text-2xl font-bold text-purple-500">
              DeepShield
            </NavLink>

            {/** centralize nav items to avoid duplication */}
            <ul className="hidden md:flex items-center space-x-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass} aria-current={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {isAuthenticated && <Profile />}

            {/* Auth Buttons (desktop) - use icons and small helper to avoid duplication */}
            <div>
              {isAuthenticated ? (
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className={logoutBtnClass}
                  title="Logout"
                >
                  <FiLogOut size={24} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => loginWithRedirect()} className={loginBtnClass} title="Login">
                    <FiLogIn size={24} />
                  </button>
                </div>
              )}
            </div>
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
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout({ logoutParams: { returnTo: window.location.origin } });
                    setOpen(false);
                  }}
                  className={logoutBtnClass}
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="ml-2">Logout</span>
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
                    <FiLogIn className="inline w-4 h-4 mr-2" />
                    Login
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