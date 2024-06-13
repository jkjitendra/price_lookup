import { useEffect, useState } from 'react';
import axios from '../api/query';
import Search from './Search';

const GET_ALL_PRODUCTS_URL = '/get-all-products';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get(`${GET_ALL_PRODUCTS_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data.products);
        setProducts(response.data.products || []); // Fallback to empty array if undefined
      })
      .catch(error => {
        console.error('There was an error fetching the products data!', error);
      });
  }, []);

  return (
    <div>
      <Search products={products} />
    </div>
  );
}

export default ProductsList;
