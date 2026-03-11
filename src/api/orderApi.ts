import axios from 'axios';
import { getAuthHeaders } from './authApi';

const GRAPHQL_URL = 'http://localhost:8080/graphql';

export interface CreateOrderItemInput {
  dishId: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  unitPrice: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  lineTotal: number;
}

export interface Order {
  id: string;
  status: 'CREATED' | 'PAYMENT_PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  totalAmount: number;
  paymentReference?: string;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
}

export interface PaymentAttempt {
  id: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  provider?: string;
  providerTransactionId?: string;
  paymentReference?: string;
  message?: string;
  createdAt?: string;
}

export interface CreateOrderResponse {
  order: Order;
  paymentAttempt?: PaymentAttempt;
  message: string;
}

export interface ConfirmPaymentResponse {
  order: Order;
  paymentAttempt?: PaymentAttempt;
  message: string;
}

export const createOrder = async (
  items: CreateOrderItemInput[],
  idempotencyKey: string,
  addressId: number,
): Promise<CreateOrderResponse> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        mutation CreateOrder($input: CreateOrderInput!) {
          createOrder(input: $input) {
            message
            order {
              id
              status
              totalAmount
              paymentReference
              createdAt
              updatedAt
              items {
                id
                dishId
                dishName
                unitPrice
                quantity
                restaurantId
                restaurantName
                lineTotal
              }
            }
            paymentAttempt {
              id
              status
              provider
              providerTransactionId
              paymentReference
              message
              createdAt
            }
          }
        }
      `,
      variables: {
        input: {
          items,
          idempotencyKey,
          addressId,
        },
      },
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message || 'Create order failed');
  }

  return response.data.data.createOrder;
};

export const confirmPayment = async (
  orderId: number,
  paymentReference: string,
  idempotencyKey: string,
): Promise<ConfirmPaymentResponse> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        mutation ConfirmPayment($input: ConfirmPaymentInput!) {
          confirmPayment(input: $input) {
            message
            order {
              id
              status
              totalAmount
              paymentReference
              createdAt
              updatedAt
              items {
                id
                dishId
                dishName
                unitPrice
                quantity
                restaurantId
                restaurantName
                lineTotal
              }
            }
            paymentAttempt {
              id
              status
              provider
              providerTransactionId
              paymentReference
              message
              createdAt
            }
          }
        }
      `,
      variables: {
        input: {
          orderId,
          paymentReference,
          idempotencyKey,
        },
      },
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(
      response.data.errors[0].message || 'Confirm payment failed',
    );
  }

  return response.data.data.confirmPayment;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: `
        query GetMyOrders {
          getMyOrders {
            id
            status
            totalAmount
            paymentReference
            createdAt
            updatedAt
            items {
              id
              dishId
              dishName
              unitPrice
              quantity
              restaurantId
              restaurantName
              lineTotal
            }
          }
        }
      `,
    },
    { headers: getAuthHeaders() },
  );

  if (response.data.errors?.length) {
    throw new Error(response.data.errors[0].message || 'Get orders failed');
  }

  return response.data.data.getMyOrders;
};
