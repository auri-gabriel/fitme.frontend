import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemHeader from '../components/pages/Item/ItemHeader';
import ItemBody from '../components/pages/Item/ItemBody';
import fetchItemDetails from '../api/itemApi';

interface RestaurantData {
  name: string;
  location: string;
  rating: number;
  deliveryTime: string;
  cost: string;
  offers: string[];
  image: string;
  categories: Category[];
  topDishes: Dish[];
}

interface Category {
  id: string;
  name: string;
}
interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Category;
}

const Item: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError('Restaurant id is missing.');
          return;
        }

        const data = await fetchItemDetails(id);
        setRestaurant(data);
      } catch (err) {
        setError('Failed to fetch item details. Please try again later.');
        console.error('Error fetching item details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container'>
        <div className='alert alert-danger my-5' role='alert'>
          {error}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className='text-center'>No restaurant data available.</div>;
  }

  return (
    <>
      <ItemHeader restaurantData={restaurant} />
      <ItemBody
        dishes={restaurant.topDishes}
        categories={restaurant.categories}
      />
    </>
  );
};

export default Item;
