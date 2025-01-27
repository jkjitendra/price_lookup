import { useEffect, useState, useContext } from 'react';
import LoadingContext, { LoadingProvider } from "../context/LoadingContext";
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import api from '../api/query';
import '../assets/styles/ProductsList.css';
import { logger } from '../utils/logger';
import { getErrorMessage } from "../utils/error/errorHandler";

const GET_ALL_PRODUCTS_URL = '/get-all-products?per_page=50';

const ProductsListContent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortState, setSortState] = useState({ field: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { setLoading } = useContext(LoadingContext); // Use global loading context

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      logger.log('Fetching products from API...');
      try {
        const response = await api.get(GET_ALL_PRODUCTS_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const data = response.data.products.data || [];
        setProducts(data);
        setFilteredProducts(data);
        logger.log('Fetched products successfully:', data);
      } catch (error) {
        logger.error('Error fetching products:', error);
        const errorMsg = getErrorMessage(error);
        setErrMsg(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken, setLoading]);

  // Handle search and filtering
  useEffect(() => {
    let updatedFilteredProducts = products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortState.field) {
      updatedFilteredProducts = updatedFilteredProducts.sort((a, b) => {
        if (sortState.field === 'name') {
          return sortState.direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortState.field === 'target_price') {
          return sortState.direction === 'asc'
            ? a.target_price - b.target_price
            : b.target_price - a.target_price;
        }
        return 0;
      });
    }

    setFilteredProducts(updatedFilteredProducts);
  }, [searchTerm, products, sortState]);

  const handleSort = (field) => {
    logger.log('Sorting by field:', field);
    setSortState((prevSortState) => {
      if (prevSortState.field === field) {
        return {
          field,
          direction: prevSortState.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        return { field, direction: 'asc' };
      }
    });
  };

  return (
    <div className="products-list">
      {errMsg && (
        <p className="text-red-500 text-center mb-4">{errMsg}</p>
      )}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <DataTable
        products={filteredProducts}
        setProducts={setProducts}
        handleSort={handleSort}
        sortedField={sortState.field}
        sortDirection={sortState.direction}
      />
    </div>
  );
}

const ProductsList = () => (
  <LoadingProvider>
    <ProductsListContent />
  </LoadingProvider>
);

export default ProductsList;
