import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingContext, { LoadingProvider } from "../context/LoadingContext";
import DataTable from './DataTable';
import api from '../api/query';
import '../assets/styles/ProductsList.css';
import { logger } from '../utils/logger';
import { getErrorMessage } from "../utils/error/errorHandler";
import { FaSearch } from "react-icons/fa";

const GET_ALL_PRODUCTS_URL = '/get-all-products?per_page=50';

const ProductsListContent = ({setActiveSection}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortState, setSortState] = useState({ field: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const { setLoading } = useContext(LoadingContext); // Use global loading context
  const navigate = useNavigate();

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
      <div className='search-add-container'>
        <div className="search-container">
          <input
            type="text"
            id="searchProduct" 
            name="searchProduct"
            placeholder="Search Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-icon" onClick={() => {}}>
            <FaSearch />
          </button>
        </div>
        <button
          onClick={() => setActiveSection('addproduct')}
          className='add-product-btn'
        >
          Add Product <span className="circle">+</span>
        </button>
      </div>
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

const ProductsList = ({setActiveSection}) => (
  <LoadingProvider>
    <ProductsListContent setActiveSection={setActiveSection}/>
  </LoadingProvider>
);

export default ProductsList;
