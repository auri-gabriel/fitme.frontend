import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3 } from 'lucide-react';

interface FoodCardProps {
  title: string;
  imageUrl: string;
  region: string;
  rating: number;
  arrivalTime: string;
  url: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  title,
  imageUrl,
  region: location,
  rating,
  arrivalTime,
  url,
}) => {
  return (
    <Link
      className='text-decoration-none'
      to={url}
      style={{
        color: 'inherit',
        display: 'contents',
      }}
    >
      <div className='card card-elevate border-0 bg-grey-100 p-3 rounded-4'>
        <img
          className='object-fit-cover rounded-2 w-100'
          style={{ aspectRatio: 1 / 1 }}
          src={imageUrl}
          alt={title}
        />
        <h3 className='mt-3 fs-lg fw-bold'>{title}</h3>
        <div className='d-flex flex-row justify-content-between mt-2'>
          <span className='text-grey-600 fs-base'>{location}</span>
          <span>⭐ {rating}</span>
        </div>
        <div className='d-flex align-items-center justify-content-center mt-2 w-100'>
          <Clock3 style={{ width: '16px', height: '16px' }} className='mx-2' />
          {arrivalTime} min
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
