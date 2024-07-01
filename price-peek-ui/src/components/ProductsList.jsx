import { useEffect, useState } from 'react';
import Search from './Search';
import api from '../api/query';

const GET_ALL_PRODUCTS_URL = '/get-all-products';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    api.get(`${GET_ALL_PRODUCTS_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        // console.log(response.data.products.data);
        setProducts(response.data.products.data || []); // Fallback to empty array if undefined
      })
      .catch(error => {
        console.error('There was an error fetching the products data!', error);
      });
  }, [accessToken]);

  return (
    <>
      <div >
        <Search
          products={products}
          setProducts={setProducts}
        />
      </div>
    </>
  );
}

export default ProductsList;
