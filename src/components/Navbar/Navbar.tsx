import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import logo from '/src/assets/logo-color.svg';
import { useCart } from '../../context/CartContext';

const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const authToken = localStorage.getItem('authToken');
  const authUsername = localStorage.getItem('authUsername');
  const isLoggedIn = Boolean(authToken);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername');
    navigate('/');
  };

  return (
    <nav className='navbar-custom px-xl-5 px-lg-4 px-md-3 py-5 bg-white'>
      <div className='container d-flex justify-content-between align-items-center'>
        <Link to='/'>
          <img src={logo} alt='Logo' height='40' />
        </Link>

        <div className='d-none d-md-flex align-items-center gap-4'>
          <input
            type='text'
            className='form-control search-bar py-3'
            style={{ width: '450px' }}
            placeholder='Enter item or restaurant you are looking for'
          />
          <div className='position-relative'>
            <ShoppingBag aria-label='Bag' size={30} />
            {totalItems > 0 && (
              <span
                className='position-absolute translate-middle badge rounded-pill bg-primary'
                style={{ top: '0px', right: '-8px' }}
              >
                {totalItems}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <span className='fs-sm fw-bold'>
                Logged in as {authUsername || 'User'}
              </span>
              <button
                className='btn btn-secondary px-4 py-3 rounded-3'
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to='/login'
              className='fs-sm fw-bold text-white text-decoration-none'
            >
              <button className='btn btn-secondary px-4 py-3 rounded-3'>
                Sign&nbsp;In
              </button>
            </Link>
          )}
        </div>

        <Menu aria-label='Menu' size={30} className='d-md-none' />
      </div>
    </nav>
  );
};

const DefaultNavbar: React.FC = () => {
  return (
    <nav className='navbar-custom px-xl-5 px-lg-4 px-md-3 py-5 bg-white'>
      <div className='container-fluid d-flex justify-content-between align-items-center'>
        <img src={logo} alt='Logo' height='40' />
      </div>
    </nav>
  );
};

export { HomeNavbar, DefaultNavbar };
