import React, { useEffect, useState } from 'react';
import DataTable from './DataTable'; 
import '../assets/styles/Search.css';

const Search = ({products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  // const products = useSelector(state => state.products.products);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.url?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  console.log('products in search', products);
  console.log('filteredProducts in search', filteredProducts);
  
  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Product Name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <DataTable
        products={filteredProducts}
        setProducts={setProducts}
      />
    </div>
  );
};

export default Search;
