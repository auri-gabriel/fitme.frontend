import React from 'react';
import { normalizeCurrencyText } from '../../../utils/locale';
import { Star } from 'lucide-react';
interface RestaurantData {
  name: string;
  location?: string;
  rating?: number;
  deliveryTime?: string | number;
  cost?: string;
  offers?: string[];
  image?: string;
}

interface ItemHeaderProps {
  restaurantData: RestaurantData;
}

const ItemHeader: React.FC<ItemHeaderProps> = ({ restaurantData }) => {
  const safeOffers = Array.isArray(restaurantData?.offers)
    ? restaurantData.offers
    : [];
  const displayOffers =
    safeOffers.length > 0
      ? safeOffers
      : ['20% off your first order | Use code WELCOME'];

  return (
    <div className='bg-secondary text-white'>
      <div className='container'>
        <div className='row py-4'>
          <div className='col-12 col-lg-4 col-xl-3 rounded-3 overflow-hidden'>
            <img
              className='object-fit-cover'
              src='/src/assets/placeholder2.png'
              alt='Item'
            />
          </div>
          <div className='d-flex flex-column justify-content-center col-12 pt-4 pt-xl-0 col-lg-8 px-lg-5 col-xl-5'>
            <div>
              <h2 className='m-0'>{restaurantData.name || 'Restaurant'}</h2>
              <p className='mb-sm-5 text-grey-500'>
                {restaurantData.location || 'Local area'}
              </p>
            </div>
            <div className='d-flex flex-column flex-sm-row justify-content-between'>
              <hr className='d-sm-none' />
              <div>
                <p className='m-0'>
                  <Star size={20} color='#FC8019' />{' '}
                  {restaurantData.rating ?? '-'}
                </p>
                <p className='m-0'>100+ ratings</p>
              </div>
              <div className='d-none d-sm-block vertical-divider bg-white' />
              <hr className='d-sm-none' />
              <div>
                <p className='m-0'>{restaurantData.deliveryTime || '-'} min</p>
                <p className='m-0'>Delivery Time</p>
              </div>
              <div className='d-none d-sm-block vertical-divider bg-white' />
              <hr className='d-sm-none' />
              <div>
                <p>{normalizeCurrencyText(restaurantData.cost || '')}</p>
                <p>Cost for two</p>
              </div>
              <hr className='d-sm-none' />
            </div>
          </div>
          <div className='item-header__offers rounded-5 mt-4 mt-xl-0 offset-xl-1 border-primary col-12 col-xl-3 p-5'>
            <h3 className='text-primary'>Offers</h3>
            {displayOffers.map((offer, index) => (
              <p key={index}>{normalizeCurrencyText(offer)}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemHeader;
