import React, { useEffect, useState } from 'react';
import {
  createMyAddress,
  deleteMyAddress,
  getMyAddresses,
  setDefaultAddress,
  type CreateAddressInput,
  type UserAddress,
} from '../api/addressApi';

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<CreateAddressInput>({
    label: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    isDefault: false,
  });

  const loadAddresses = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyAddresses();
      setAddresses(data);
    } catch {
      setError('Unable to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.currentTarget;
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateAddress = async (): Promise<void> => {
    if (
      !form.label?.trim() ||
      !form.line1?.trim() ||
      !form.city?.trim() ||
      !form.postalCode?.trim()
    ) {
      setError('Label, line 1, city and postal code are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createMyAddress({
        ...form,
        label: form.label.trim(),
        line1: form.line1.trim(),
        line2: form.line2?.trim() || undefined,
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
      });

      setForm({
        label: '',
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        isDefault: false,
      });

      await loadAddresses();
    } catch {
      setError('Unable to save address.');
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch {
      setError('Unable to set default address.');
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      await deleteMyAddress(addressId);
      await loadAddresses();
    } catch {
      setError('Unable to delete address.');
      setLoading(false);
    }
  };

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-lg-9'>
          <div className='card border-0 shadow-sm p-4'>
            <h2 className='fw-bold mb-3'>My Addresses</h2>

            {error && <div className='alert alert-danger'>{error}</div>}

            <div className='border rounded p-3 mb-4'>
              <p className='fw-semibold mb-3'>Add New Address</p>
              <div className='row g-2'>
                <div className='col-12 col-md-6'>
                  <input
                    className='form-control'
                    name='label'
                    placeholder='Label (e.g. Home)'
                    value={form.label}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-12 col-md-6'>
                  <input
                    className='form-control'
                    name='postalCode'
                    placeholder='Postal code'
                    value={form.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-12'>
                  <input
                    className='form-control'
                    name='line1'
                    placeholder='Address line 1'
                    value={form.line1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-12'>
                  <input
                    className='form-control'
                    name='line2'
                    placeholder='Address line 2 (optional)'
                    value={form.line2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-12 col-md-8'>
                  <input
                    className='form-control'
                    name='city'
                    placeholder='City'
                    value={form.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='col-12 col-md-4 d-flex align-items-center'>
                  <div className='form-check'>
                    <input
                      id='isDefaultAddress'
                      className='form-check-input'
                      type='checkbox'
                      name='isDefault'
                      checked={Boolean(form.isDefault)}
                      onChange={handleInputChange}
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
                className='btn btn-primary mt-3'
                onClick={handleCreateAddress}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>

            <h5 className='fw-semibold mb-3'>Saved Addresses</h5>
            {addresses.length === 0 ? (
              <p className='text-muted mb-0'>No addresses saved yet.</p>
            ) : (
              <div className='d-flex flex-column gap-3'>
                {addresses.map((address) => (
                  <div key={address.id} className='border rounded p-3'>
                    <div className='d-flex justify-content-between align-items-start gap-3'>
                      <div>
                        <p className='fw-semibold mb-1'>
                          {address.label}{' '}
                          {address.isDefault && (
                            <span className='badge text-bg-primary ms-2'>
                              Default
                            </span>
                          )}
                        </p>
                        <p className='mb-0'>{address.line1}</p>
                        {address.line2 && (
                          <p className='mb-0'>{address.line2}</p>
                        )}
                        <p className='mb-0'>
                          {address.city}, {address.postalCode}
                        </p>
                      </div>
                      <div className='d-flex gap-2'>
                        {!address.isDefault && (
                          <button
                            type='button'
                            className='btn btn-outline-primary btn-sm'
                            onClick={() => void handleSetDefault(address.id)}
                            disabled={loading}
                          >
                            Set default
                          </button>
                        )}
                        <button
                          type='button'
                          className='btn btn-outline-danger btn-sm'
                          onClick={() => void handleDelete(address.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAddresses;
