import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/locale';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}
interface Dish {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: Category;
}

interface ItemBodyProps {
  dishes: Dish[];
  categories: Category[];
}

const ItemBody: React.FC<ItemBodyProps> = ({ dishes, categories }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id ?? '',
  );
  const {
    items,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    totalPrice,
  } = useCart();

  const filteredDishes = selectedCategory
    ? dishes.filter((dish) => dish.category.id === selectedCategory)
    : dishes;

  return (
    <div className='container'>
      <div className='row my-5'>
        <div className='col-12 col-lg-2 border-end'>
          <ul className='nav flex-column'>
            {categories.map((category) => (
              <li
                className='nav-item d-flex justify-content-lg-end'
                key={category.id}
              >
                <button
                  className={`nav-link fw-bold ${
                    selectedCategory === category.id
                      ? 'text-primary'
                      : 'text-secondary'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          <hr className='d-sm-none' />
        </div>
        <div className='col-12 col-lg-7'>
          {filteredDishes.map((dish) => (
            <ItemCard key={dish.id} dish={dish} />
          ))}
        </div>

        <div className='d-none d-lg-flex col-lg-3'>
          <div className='card border-0 shadow-sm p-4 w-100 h-fit'>
            <h5 className='fw-bold mb-3'>Cart</h5>

            {items.length === 0 ? (
              <p className='text-muted mb-0'>Your cart is empty.</p>
            ) : (
              <>
                <ul className='list-unstyled mb-3'>
                  {items.map((item) => (
                    <li key={item.id} className='mb-3 pb-3 border-bottom'>
                      <div className='d-flex justify-content-between gap-2'>
                        <p className='mb-0 fw-semibold text-black'>
                          {item.name}
                        </p>
                        <p className='mb-0 text-black'>
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className='d-flex align-items-center gap-2 mt-2'>
                        <button
                          className='btn btn-sm btn-outline-secondary px-2 py-0'
                          onClick={() => decrementItem(item.id)}
                        >
                          -
                        </button>
                        <span className='fw-semibold'>{item.quantity}</span>
                        <button
                          className='btn btn-sm btn-outline-secondary px-2 py-0'
                          onClick={() => incrementItem(item.id)}
                        >
                          +
                        </button>

                        <button
                          className='btn btn-sm btn-link text-danger ms-auto p-0 text-decoration-none'
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <p className='mb-0 fw-bold'>Total</p>
                  <p className='mb-0 fw-bold'>{formatCurrency(totalPrice)}</p>
                </div>

                <button
                  className='btn btn-outline-danger w-100'
                  onClick={clearCart}
                >
                  Clear cart
                </button>

                <button
                  className='btn btn-primary w-100 mt-2'
                  onClick={() => navigate('/checkout')}
                >
                  Go to checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBody;
