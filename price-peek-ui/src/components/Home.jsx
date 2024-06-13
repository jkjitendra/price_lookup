import React, { useState } from 'react';
import Header from './Header';
import SectionList from './SectionList';
import ProductsList from './ProductsList';
import AddProduct from './AddProduct';
import '../assets/styles/Home.css';

const Home = () => {
  const [activeSection, setActiveSection] = useState('productsList');

  return (
    <div className="home-container">
      <Header />
      <SectionList setActiveSection={setActiveSection} />
      <div className="content">
        {activeSection === 'productsList' && <ProductsList />}
        {activeSection === 'addproduct' && <AddProduct />}
      </div>
    </div>
  );
}

export default Home;
