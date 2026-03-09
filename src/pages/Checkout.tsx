import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  confirmPayment,
  createOrder,
  type CreateOrderItemInput,
} from '../api/orderApi';
import { formatCurrency } from '../utils/locale';

const Checkout: React.FC = () => {
  const { items, clearCart, totalPrice } = useCart();
  const [paymentReference, setPaymentReference] = useState<string>(
    `MOCK-${Date.now()}`,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const generateIdempotencyKey = (): string => {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  const handleConfirmOrder = async (): Promise<void> => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!paymentReference.trim()) {
      setError('Payment reference is required.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('Please sign in before confirming your order.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const orderItems: CreateOrderItemInput[] = items.map((item) => ({
        dishId: Number(item.id),
        quantity: item.quantity,
      }));

      const createOrderResponse = await createOrder(
        orderItems,
        generateIdempotencyKey(),
      );

      const paymentResponse = await confirmPayment(
        Number(createOrderResponse.order.id),
        paymentReference,
        generateIdempotencyKey(),
      );

      if (paymentResponse.order.status === 'PAID') {
        clearCart();
        setSuccess(`Order #${paymentResponse.order.id} confirmed and paid.`);
      } else {
        setError(
          paymentResponse.message ||
            'Payment failed. Please update the reference and try again.',
        );
      }
    } catch (checkoutError) {
      console.error(checkoutError);
      setError('Unable to confirm your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-8'>
          <div className='card border-0 shadow-sm p-4'>
            <h2 className='fw-bold mb-3'>Checkout</h2>

            {items.length === 0 ? (
              <>
                <p className='text-muted mb-3'>Your cart is empty.</p>
                <Link to='/' className='btn btn-primary'>
                  Back to restaurants
                </Link>
              </>
            ) : (
              <>
                <ul className='list-unstyled mb-3'>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className='d-flex justify-content-between align-items-center py-2 border-bottom'
                    >
                      <div>
                        <p className='mb-0 fw-semibold'>{item.name}</p>
                        <small className='text-muted'>
                          Qty: {item.quantity}
                        </small>
                      </div>
                      <p className='mb-0 fw-semibold'>
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className='d-flex justify-content-between mb-1'>
                  <span className='fw-semibold'>Items</span>
                  <span className='fw-semibold'>{totalItems}</span>
                </div>
                <div className='d-flex justify-content-between mb-3'>
                  <span className='fw-bold'>Total</span>
                  <span className='fw-bold'>{formatCurrency(totalPrice)}</span>
                </div>

                <label htmlFor='paymentReference' className='form-label'>
                  Mock payment reference
                </label>
                <input
                  id='paymentReference'
                  className='form-control mb-3'
                  value={paymentReference}
                  onChange={(event) =>
                    setPaymentReference(event.currentTarget.value)
                  }
                />

                <button
                  className='btn btn-success w-100'
                  onClick={handleConfirmOrder}
                  disabled={loading}
                >
                  {loading ? 'Confirming order...' : 'Confirm order'}
                </button>

                <Link to='/' className='btn btn-outline-secondary w-100 mt-2'>
                  Continue shopping
                </Link>

                {success && (
                  <div className='alert alert-success mt-3 mb-0'>{success}</div>
                )}

                {error && (
                  <div className='alert alert-danger mt-3 mb-0'>{error}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
