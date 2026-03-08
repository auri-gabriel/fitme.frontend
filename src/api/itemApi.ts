import axios from 'axios';
import { getAuthHeaders } from './authApi';

const fetchItemDetails = async (id: string) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/graphql',
      {
        query: `
          query getRestaurant($id: ID!) {
              getRestaurant(id: $id){
                id
                name
                createdAt
                updatedAt
                rating
                deliveryTime
                image
                location
                categories {
                  id
                  name
                }
                topDishes {
                  id
                  name
                  price
                  image
                  description
                  category {
                    id
                    name
                  }
                }
              }
          }
        `,
        variables: {
          id: id,
        },
      },
      {
        headers: getAuthHeaders(),
      },
    );

    if (response.data.errors?.length) {
      throw new Error(
        response.data.errors[0].message || 'Failed to fetch restaurant details',
      );
    }

    console.log(response.data);
    return response.data.data.getRestaurant;
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error;
  }
};

export default fetchItemDetails;
