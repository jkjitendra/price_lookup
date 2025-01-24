import { useEffect, useState, useContext } from 'react';
import LoadingContext, { LoadingProvider } from "../context/LoadingContext";
import Search from './Search';
import api from '../api/query';

const GET_ALL_PRODUCTS_URL = '/get-all-products?per_page=50';

const ProductsListContent = () => {
  const [products, setProducts] = useState([]);
  const { setLoading } = useContext(LoadingContext); // Use global loading context

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(GET_ALL_PRODUCTS_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setProducts(response.data.products.data || []);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [accessToken, setLoading]);

  return (
    <div>
      <Search products={products} setProducts={setProducts} />
    </div>
  );
}

const ProductsList = () => (
  <LoadingProvider>
    <ProductsListContent />
  </LoadingProvider>
);

export default ProductsList;
