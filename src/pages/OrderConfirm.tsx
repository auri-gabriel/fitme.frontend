import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { formatCurrency } from '../utils/locale';

interface OrderConfirmState {
  orderId: string;
  totalAmount: number;
  paymentReference?: string;
}

const OrderConfirm: React.FC = () => {
  const location = useLocation();
  const state = location.state as OrderConfirmState | undefined;

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
