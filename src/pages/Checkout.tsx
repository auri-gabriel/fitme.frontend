import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  confirmPayment,
  createOrder,
  type CreateOrderItemInput,
} from '../api/orderApi';
import {
  createMyAddress,
  getMyAddresses,
  type CreateAddressInput,
  type UserAddress,
} from '../api/addressApi';
import { formatCurrency } from '../utils/locale';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice } = useCart();
  const [paymentReference, setPaymentReference] = useState<string>(
    `MOCK-${Date.now()}`,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const NEW_ADDRESS_OPTION = '__new__';
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [addressForm, setAddressForm] = useState<CreateAddressInput>({
    label: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    isDefault: false,
  });
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<string>('');

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const generateIdempotencyKey = (): string => {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  useEffect(() => {
    const loadAddresses = async (): Promise<void> => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        return;
      }

      try {
        setAddressLoading(true);
        setAddressError('');
        const loadedAddresses = await getMyAddresses();
        setAddresses(loadedAddresses);
        const defaultAddress = loadedAddresses.find(
          (address) => address.isDefault,
        );
        setSelectedAddressId(
          defaultAddress?.id ?? loadedAddresses[0]?.id ?? NEW_ADDRESS_OPTION,
        );
      } catch {
        setAddressError(
          'Unable to load your addresses. Please refresh and try again.',
        );
      } finally {
        setAddressLoading(false);
      }
    };

    void loadAddresses();
  }, []);

  const handleAddressInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value, type, checked } = event.currentTarget;
    setAddressForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateAddress = async (): Promise<void> => {
    if (
      !addressForm.label.trim() ||
      !addressForm.line1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.postalCode.trim()
    ) {
      setAddressError('Label, line 1, city and postal code are required.');
      return;
    }

    try {
      setAddressLoading(true);
      setAddressError('');
      const createdAddress = await createMyAddress({
        ...addressForm,
        label: addressForm.label.trim(),
        line1: addressForm.line1.trim(),
        line2: addressForm.line2?.trim() || undefined,
        city: addressForm.city.trim(),
        postalCode: addressForm.postalCode.trim(),
      });

      setAddresses((previous) => {
        if (createdAddress.isDefault) {
          return [
            createdAddress,
            ...previous.map((address) => ({ ...address, isDefault: false })),
          ];
        }
        return [...previous, createdAddress];
      });
      setSelectedAddressId(createdAddress.id);
      setAddressForm({
        label: '',
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        isDefault: false,
      });
    } catch {
      setAddressError('Unable to save address. Please try again.');
    } finally {
      setAddressLoading(false);
    }
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

    if (!selectedAddressId || selectedAddressId === NEW_ADDRESS_OPTION) {
      setError('Please select a delivery address.');
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

      const orderItems: CreateOrderItemInput[] = items.map((item) => ({
        dishId: Number(item.id),
        quantity: item.quantity,
      }));

      const createOrderResponse = await createOrder(
        orderItems,
        generateIdempotencyKey(),
        Number(selectedAddressId),
      );

      const paymentResponse = await confirmPayment(
        Number(createOrderResponse.order.id),
        paymentReference,
        generateIdempotencyKey(),
      );

      if (paymentResponse.order.status === 'PAID') {
        clearCart();
        navigate('/orderConfirm', {
          state: {
            orderId: paymentResponse.order.id,
            totalAmount: paymentResponse.order.totalAmount,
            paymentReference: paymentResponse.order.paymentReference,
            items: paymentResponse.order.items,
          },
        });
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

                <label htmlFor='deliveryAddress' className='form-label'>
                  Delivery address
                </label>
                <select
                  id='deliveryAddress'
                  className='form-select mb-3'
                  value={selectedAddressId}
                  onChange={(event) =>
                    setSelectedAddressId(event.currentTarget.value)
                  }
                  disabled={addressLoading}
                >
                  <option value=''>Select an address</option>
                  <option value={NEW_ADDRESS_OPTION}>+ Add new address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label} - {address.line1}, {address.city}{' '}
                      {address.postalCode}
                    </option>
                  ))}
                </select>

                {selectedAddressId === NEW_ADDRESS_OPTION && (
                  <div className='border rounded p-3 mb-3'>
                    <p className='fw-semibold mb-2'>Add new address</p>
                    <div className='row g-2'>
                      <div className='col-12 col-md-6'>
                        <input
                          className='form-control'
                          name='label'
                          placeholder='Label (e.g. Home)'
                          value={addressForm.label}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className='col-12 col-md-6'>
                        <input
                          className='form-control'
                          name='postalCode'
                          placeholder='Postal code'
                          value={addressForm.postalCode}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className='col-12'>
                        <input
                          className='form-control'
                          name='line1'
                          placeholder='Address line 1'
                          value={addressForm.line1}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className='col-12'>
                        <input
                          className='form-control'
                          name='line2'
                          placeholder='Address line 2 (optional)'
                          value={addressForm.line2}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className='col-12 col-md-8'>
                        <input
                          className='form-control'
                          name='city'
                          placeholder='City'
                          value={addressForm.city}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className='col-12 col-md-4 d-flex align-items-center'>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='isDefaultAddress'
                            name='isDefault'
                            checked={Boolean(addressForm.isDefault)}
                            onChange={handleAddressInputChange}
                          />
                          <label
                            className='form-check-label'
                            htmlFor='isDefaultAddress'
                          >
                            Default
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type='button'
                      className='btn btn-outline-primary mt-3'
                      onClick={handleCreateAddress}
                      disabled={addressLoading}
                    >
                      {addressLoading ? 'Saving address...' : 'Save address'}
                    </button>
                    {addressError && (
                      <div className='alert alert-danger mt-3 mb-0'>
                        {addressError}
                      </div>
                    )}
                  </div>
                )}

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
