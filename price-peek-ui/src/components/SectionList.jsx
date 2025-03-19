import {useState} from 'react';
import '../assets/styles/SectionList.css';

const SectionList = ({ setActiveSection }) => {

  const [activeLink, setActiveLink] = useState('productsList');

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setActiveLink(section);
  };

  return (
    <div className="section-list">
      <nav>
      <span
          onClick={() => handleSetActiveSection('productsList')}
          className={`nav-link ${activeLink === 'productsList' ? 'active' : ''}`}
        >
          Products
        </span>
        <span
          onClick={() => handleSetActiveSection('addproduct')}
          className={`nav-link ${activeLink === 'addproduct' ? 'active' : ''}`}
        >
          Add Product
        </span>
      </nav>
    </div>
  );
};

export default SectionList;
