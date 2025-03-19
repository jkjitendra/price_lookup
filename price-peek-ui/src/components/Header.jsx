import { useState } from 'react';
import logo from '../assets/images/PricePeek.png';
import UserMenu from './UserMenu';
import SectionList from './SectionList';
import ProductsList from './ProductsList';
import AddProduct from './AddProduct';

import '../assets/styles/Header.css';

const Header = () => {
  const [activeSection, setActiveSection] = useState('productsList');
  return (
    <header className="header">
      {/* <img src={logo} alt="Price Peek Logo" className="logo" />
      <SectionList setActiveSection={setActiveSection} /> */}
      <div className="header-left">
        <img src={logo} alt="Price Peek Logo" className="logo" />
        <SectionList setActiveSection={setActiveSection} />
      </div>
      <UserMenu />
    </header>
  );
};

export default Header;
