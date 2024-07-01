import React, { useState } from 'react';
import '../assets/styles/AddProduct.css';
import api from '../api/query';

const CREATE_PRODUCT = '/store-product';

const AddProduct = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [favName, setFavName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const determinePlatform = (url) => {
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('flipkart')) return 'flipkart';
    if (url.includes('meesho')) return 'meesho';
    if (url.includes('snapdeal')) return'snapdeal';
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
      name: favName,
      product_link: productLink,
      target_price: targetPrice,
      product_platform: platform
    };

    try {
      const response = await api.post(CREATE_PRODUCT, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
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
          <label htmlFor="favName">Add Name to your Product</label>
          <input
            type="text"
            id="favName"
            value={favName}
            onChange={(e) => setFavName(e.target.value)}
            required
          />
        </div>
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
