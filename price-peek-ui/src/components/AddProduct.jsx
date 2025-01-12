import { useState, useContext } from 'react';
import LoadingContext, { LoadingProvider } from "../context/LoadingContext";
import '../assets/styles/AddProduct.css';
import api from '../api/query';

const CREATE_PRODUCT = '/store-product';

const AddProductContent = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [favName, setFavName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setLoading } = useContext(LoadingContext);


  const determinePlatform = (url) => {
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('flipkart')) return 'flipkart';
    if (url.includes('meesho')) return 'meesho';
    if (url.includes('snapdeal')) return'snapdeal';
    return 'unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const platform = determinePlatform(productLink);

    if (platform === 'unknown') {
      setError('Unsupported platform');
      setLoading(false);
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
        setFavName('');
        setProductLink('');
        setTargetPrice('');
      } else {
        setError('Failed to add product');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
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

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

const AddProduct = () => (
  <LoadingProvider>
    <AddProductContent />
  </LoadingProvider>
);


export default AddProduct;
