import axios from 'axios';
import { getAuthHeaders } from './authApi';

const fetchRestaurants = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/graphql',
      {
        query: `
          query {
            getAllRestaurants {
              id
              name
              rating
              location
              deliveryTime
          }
        }
        `,
      },
      {
        headers: getAuthHeaders(),
      },
    );

    if (response.data.errors?.length) {
      throw new Error(
        response.data.errors[0].message || 'Failed to fetch restaurants',
      );
    }

    console.log(response.data);

    return response.data.data.getAllRestaurants;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw error;
  }
};

export default fetchRestaurants;
