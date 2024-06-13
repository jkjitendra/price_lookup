import React, {useState} from 'react';
import '../assets/styles/SectionList.css';
import Logout from './Logout';

const SectionList = ({ setActiveSection }) => {

  const [activeLink, setActiveLink] = useState('productsList');

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setActiveLink(section);
  };

  return (
    <div className="section-list">
      <nav>
      <button
          onClick={() => handleSetActiveSection('productsList')}
          className={`nav-link ${activeLink === 'productsList' ? 'active' : ''}`}
        >
          Products
        </button>
        <button
          onClick={() => handleSetActiveSection('addproduct')}
          className={`nav-link ${activeLink === 'addproduct' ? 'active' : ''}`}
        >
          Add Product
        </button>
        <Logout />
      </nav>
    </div>
  );
};

export default SectionList;
