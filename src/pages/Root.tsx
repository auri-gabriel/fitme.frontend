import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { HomeNavbar } from '../components/Navbar/Navbar';

function RootLayout() {
  return (
    <>
      <HomeNavbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
