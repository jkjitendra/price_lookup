import { useEffect, useState } from 'react';
import axios from '../api/query';
import Search from './Search';

const GET_ALL_PRODUCTS_URL = '/get-all-products';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  // useEffect(() => {
  //   axios.get(`${GET_ALL_PRODUCTS_URL}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then(response => {
  //       console.log(response.data.products);
  //       setProducts(response.data.products || []); // Fallback to empty array if undefined
  //     })
  //     .catch(error => {
  //       console.error('There was an error fetching the products data!', error);
  //     });
  // }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${GET_ALL_PRODUCTS_URL}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const products = response.data.products || [];
        // const detailedProducts = await Promise.all(products.map(fetchProductDetails));
        const detailedProducts = products;
        setProducts(detailedProducts);
      } catch (error) {
        if (error.message === 'No products found for this user') {
          setProducts([]);
        }
        console.error('There was an error fetching the products data!', error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const fetchProductDetails = async (product) => {
    try {
      const productDetails = await axios.get(product.url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(productDetails.data, 'text/html');

      // Extracting image and name
      const imgElement = doc.querySelector('#imgTagWrapperId img');
      const imageUrl = imgElement?.src || '';
      const name = imgElement?.alt || '';

      // Extracting current price
      const priceElement = doc.querySelector('.a-price-whole');
      const currentPrice = priceElement
        ? `{priceElement.innerText}` 
        : '';

      return {
        ...product,
        imageUrl,
        name,
        currentPrice,
      };
    } catch (error) {
      console.error(`Error fetching details for product ${product.id}:`, error);
      return product; // Return the original product object if there's an error
    }
  };

  return (
    <>
      <div>
        <Search products={products} />
      </div>
    </>
  );
}

export default ProductsList;
