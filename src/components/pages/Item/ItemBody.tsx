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
  restaurantName: string;
}

const ItemBody: React.FC<ItemBodyProps> = ({
  dishes,
  categories,
  restaurantName,
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id ?? '',
  );
  const { items, incrementItem, decrementItem, totalPrice } = useCart();

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
            <ItemCard
              key={dish.id}
              dish={dish}
              restaurantName={restaurantName}
            />
          ))}
        </div>

        <div className='d-none d-lg-flex col-lg-3'>
          <div className='card border-0 shadow-sm p-4 w-100 h-fit bg-light'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h5 className='fw-bold mb-0'>Cart</h5>
              <span className='fw-semibold'>{items.length} Items</span>
            </div>

            {items.length === 0 ? (
              <p className='text-muted mb-0'>Your cart is empty.</p>
            ) : (
              <>
                <ul className='list-unstyled mb-4'>
                  {items.map((item) => (
                    <li key={item.id} className='mb-4'>
                      <p className='mb-2 text-muted'>
                        from{' '}
                        <span className='text-primary'>
                          {item.restaurantName}
                        </span>
                      </p>
                      <div className='d-flex justify-content-between align-items-center gap-2'>
                        <div>
                          <p className='mb-1 fw-semibold text-black'>
                            {item.name}
                          </p>
                          <p className='mb-0 text-secondary'>
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                          <button
                            className='btn btn-sm border-0 px-2 py-0 fs-5'
                            onClick={() => decrementItem(item.id)}
                          >
                            -
                          </button>
                          <span className='fw-semibold'>{item.quantity}</span>
                          <button
                            className='btn btn-sm border-0 px-2 py-0 fs-5'
                            onClick={() => incrementItem(item.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className='d-flex justify-content-between align-items-center mb-1'>
                  <p className='mb-0 fw-bold fs-3'>Subtotal</p>
                  <p className='mb-0 fw-bold fs-3'>
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
                <p className='text-muted mb-4'>Extra charges may apply</p>

                <button
                  className='btn btn-primary w-100 rounded-3 text-white fs-4 py-3'
                  onClick={() => navigate('/checkout')}
                >
                  Checkout
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
