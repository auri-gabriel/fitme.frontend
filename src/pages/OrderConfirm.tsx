import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { formatCurrency } from '../utils/locale';
import { type OrderItem } from '../api/orderApi';

interface OrderConfirmState {
  orderId: string;
  totalAmount: number;
  paymentReference?: string;
  items?: OrderItem[];
}

const OrderConfirm: React.FC = () => {
  const location = useLocation();
  const state = location.state as OrderConfirmState | undefined;

  const groupedItems = (state?.items ?? []).reduce<Record<string, OrderItem[]>>(
    (accumulator, item) => {
      const key = item.restaurantName || 'Unknown restaurant';
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(item);
      return accumulator;
    },
    {},
  );

  if (!state) {
    return <Navigate to='/checkout' replace />;
  }

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-8'>
          <div className='card border-0 shadow-sm p-4'>
            <h2 className='fw-bold mb-3'>Order confirmed</h2>
            <p className='mb-2'>
              Your order <strong>#{state.orderId}</strong> has been confirmed.
            </p>
            <p className='mb-2'>
              <strong>Total paid:</strong> {formatCurrency(state.totalAmount)}
            </p>
            {state.paymentReference && (
              <p className='mb-3'>
                <strong>Payment reference:</strong> {state.paymentReference}
              </p>
            )}

            {state.items && state.items.length > 0 && (
              <div className='mb-3 border rounded-3 p-3'>
                {Object.entries(groupedItems).map(([restaurantName, items]) => (
                  <div key={restaurantName} className='mb-3'>
                    <p className='mb-2 text-muted'>
                      from{' '}
                      <span className='text-primary'>{restaurantName}</span>
                    </p>
                    <ul className='list-unstyled mb-0'>
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className='d-flex justify-content-between align-items-center py-1'
                        >
                          <span>
                            {item.quantity}x {item.dishName}
                          </span>
                          <span>{formatCurrency(item.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className='d-grid gap-2'>
              <Link to='/my-orders' className='btn btn-success'>
                View my orders
              </Link>
              <Link to='/' className='btn btn-primary'>
                Back to restaurants
              </Link>
              <Link to='/checkout' className='btn btn-outline-secondary'>
                Go to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;
