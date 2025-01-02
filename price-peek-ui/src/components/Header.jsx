import logo from '../assets/images/PricePeek.png';
import '../assets/styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Price Peek Logo" className="logo" />
      <h1 className="app-name">Price Peek</h1>
    </header>
  );
};

export default Header;
