import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/PricePeek.jpg';
import UserMenu from './UserMenu';

import '../assets/styles/Header.css';

const Header = ({setActiveSection}) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src={logo} 
          alt="Price Peek Logo" 
          className="logo" 
          onClick={() => navigate('/home')}
        />
        {/* <SectionList setActiveSection={setActiveSection} className='' /> */}
      </div>
      <div className="header-center">
        <span 
          className="brand-name"
          onClick={() => {
            setActiveSection('productsList');
            navigate('/home')
          }}
        >Price Peek</span>
      </div>
      <div className="header-right">
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
