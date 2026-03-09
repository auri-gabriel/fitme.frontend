import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import logo from '/src/assets/logo-color.svg';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/locale';

const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement | null>(null);
  const authToken = localStorage.getItem('authToken');
  const authUsername = localStorage.getItem('authUsername');
  const isLoggedIn = Boolean(authToken);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
          <div className='position-relative' ref={cartDropdownRef}>
            <button
              type='button'
              className='btn border-0 p-0 bg-transparent position-relative'
              onClick={() => setIsCartOpen((previous) => !previous)}
              aria-label='Toggle cart'
            >
              <ShoppingBag
                aria-label='Bag'
                size={30}
                className='cursor-pointer'
              />
            </button>
            {totalItems > 0 && (
              <span
                className='position-absolute translate-middle badge rounded-pill bg-primary'
                style={{ top: '0px', right: '-8px' }}
              >
                {totalItems}
              </span>
            )}

            {isCartOpen && (
              <div
                className='position-absolute end-0 mt-3 card border-0 shadow p-3'
                style={{ width: '340px', zIndex: 1050 }}
              >
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <h6 className='fw-bold mb-0'>Cart</h6>
                  <span className='text-muted small'>{totalItems} items</span>
                </div>

                {items.length === 0 ? (
                  <p className='text-muted mb-0'>Your cart is empty.</p>
                ) : (
                  <>
                    <ul className='list-unstyled mb-3'>
                      {items.slice(0, 3).map((item) => (
                        <li key={item.id} className='mb-3'>
                          <p className='mb-1 text-muted small'>
                            from{' '}
                            <span className='text-primary'>
                              {item.restaurantName}
                            </span>
                          </p>
                          <div className='d-flex justify-content-between align-items-center gap-2'>
                            <p className='mb-0 fw-semibold small'>
                              {item.name} x{item.quantity}
                            </p>
                            <span className='small'>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {items.length > 3 && (
                      <p className='text-muted small mb-3'>
                        +{items.length - 3} more item(s)
                      </p>
                    )}

                    <div className='d-flex justify-content-between align-items-center border-top pt-2 mb-3'>
                      <span className='fw-semibold'>Subtotal</span>
                      <span className='fw-bold'>
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>

                    <button
                      className='btn btn-primary w-100'
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                      }}
                    >
                      Go to checkout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <Link
                to='/my-orders'
                className='fs-sm fw-bold text-dark text-decoration-none'
              >
                My Orders
              </Link>
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
