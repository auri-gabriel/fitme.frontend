import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootHomeLayout from './pages/Root';
import '@fontsource/poppins';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Item from './pages/Item';
import Checkout from './pages/Checkout';
import OrderConfirm from './pages/OrderConfirm';
import MyOrders from './pages/MyOrders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootHomeLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/restaurant/:id',
        element: <Item />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/orderConfirm',
        element: <OrderConfirm />,
      },
      {
        path: '/my-orders',
        element: <MyOrders />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
