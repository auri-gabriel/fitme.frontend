import axios from 'axios';
import { getAuthHeaders } from './authApi';

const GRAPHQL_URL = 'http://localhost:8080/graphql';

export interface UserAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressInput {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export const getMyAddresses = async (): Promise<UserAddress[]> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        query GetMyAddresses {
          getMyAddresses {
            id
            label
            line1
            line2
            city
            postalCode
            isDefault
            createdAt
            updatedAt
          }
        }
      `,
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message || 'Get addresses failed');
  }

  return response.data.data.getMyAddresses;
};

export const createMyAddress = async (
  input: CreateAddressInput,
): Promise<UserAddress> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        mutation CreateMyAddress($input: CreateAddressInput!) {
          createMyAddress(input: $input) {
            id
            label
            line1
            line2
            city
            postalCode
            isDefault
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        input,
      },
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message || 'Create address failed');
  }

  return response.data.data.createMyAddress;
};

export const setDefaultAddress = async (
  addressId: string,
): Promise<UserAddress> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        mutation SetDefaultAddress($addressId: ID!) {
          setDefaultAddress(addressId: $addressId) {
            id
            label
            line1
            line2
            city
            postalCode
            isDefault
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        addressId,
      },
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(
      response.data.errors[0].message || 'Set default address failed',
    );
  }

  return response.data.data.setDefaultAddress;
};

export const deleteMyAddress = async (addressId: string): Promise<boolean> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        mutation DeleteMyAddress($addressId: ID!) {
          deleteMyAddress(addressId: $addressId)
        }
      `,
      variables: {
        addressId,
      },
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message || 'Delete address failed');
  }

  return Boolean(response.data.data.deleteMyAddress);
};
