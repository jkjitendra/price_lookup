import React, { useState } from 'react';
import axios from '../api/query';
import '../assets/styles/AddProduct.css';

const CREATE_PRODUCT = '/store-product';

const AddProduct = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [productLink, setProductLink] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const determinePlatform = (url) => {
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('flipkart')) return 'flipkart';
    if (url.includes('meesho')) return 'meesho';
    return 'unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const platform = determinePlatform(productLink);

    if (platform === 'unknown') {
      setError('Unsupported platform');
      return;
    }

    const data = {
      product_link: productLink,
      target_price: targetPrice,
      product_platform: platform
    };

    try {
      const response = await axios.post(CREATE_PRODUCT, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        // withCredentials: true
      });

      if (response.data.success) {
        setSuccess('Product added successfully');
        setProductLink('');
        setTargetPrice('');
      } else {
        setError('Failed to add product');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="add-product-container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productLink">Product Link</label>
          <input
            type="text"
            id="productLink"
            value={productLink}
            onChange={(e) => setProductLink(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetPrice">Target Price</label>
          <input
            type="number"
            id="targetPrice"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;
