import React from 'react';
import ProductDetails from "./ProductDetails";
import ProductLists from "./ProductLists";
import { Link } from "react-router-dom";
import './Home.css';  // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <div className="header">
        <Link to="/logout" className="btn btn-primary">Logout</Link>
        <p>You are inside Home Component.</p>
      </div>
      <div className="content">
        <div className="section-list">
          <h2>Product Lists</h2>
          <ProductLists />
        </div>
        <div className="section-details">
          <h2>Product Details</h2>
          <ProductDetails />
        </div>
      </div>
    </div>
  );
}

export default Home;
