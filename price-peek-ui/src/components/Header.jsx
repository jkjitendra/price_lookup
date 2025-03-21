import { useState } from 'react';
import logo from '../assets/images/PricePeek.png';
import UserMenu from './UserMenu';
import SectionList from './SectionList';

import '../assets/styles/Header.css';

const Header = ({setActiveSection}) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Price Peek Logo" className="logo" />
        <SectionList setActiveSection={setActiveSection} />
      </div>
      <UserMenu />
    </header>
  );
};

export default Header;
