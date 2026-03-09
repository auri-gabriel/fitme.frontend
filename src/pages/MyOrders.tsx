import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getMyOrders, type Order } from '../api/orderApi';
import { formatCurrency } from '../utils/locale';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await getMyOrders();
        setOrders(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  if (!authToken) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-9'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h2 className='fw-bold mb-0'>My orders</h2>
            <Link to='/' className='btn btn-outline-secondary'>
              Back to restaurants
            </Link>
          </div>

          {loading && (
            <div className='card border-0 shadow-sm p-4'>
              <p className='mb-0 text-muted'>Loading orders...</p>
            </div>
          )}

          {!loading && error && (
            <div className='alert alert-danger mb-0'>{error}</div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className='card border-0 shadow-sm p-4'>
              <p className='mb-3 text-muted'>You do not have any orders yet.</p>
              <Link to='/' className='btn btn-primary'>
                Start ordering
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className='d-grid gap-3'>
              {orders.map((order) => (
                <div key={order.id} className='card border-0 shadow-sm p-4'>
                  <div className='d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2'>
                    <div>
                      <p className='mb-1 fw-bold'>Order #{order.id}</p>
                      <p className='mb-0 text-muted'>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : 'Date unavailable'}
                      </p>
                    </div>
                    <span className='badge bg-secondary'>{order.status}</span>
                  </div>

                  <ul className='list-unstyled mb-3'>
                    {order.items.map((item) => (
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

                  <div className='d-flex justify-content-between align-items-center border-top pt-2'>
                    <span className='fw-semibold'>Total</span>
                    <span className='fw-bold'>
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
