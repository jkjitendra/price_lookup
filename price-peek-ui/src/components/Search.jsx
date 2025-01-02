import { useEffect, useState } from 'react';
import DataTable from './DataTable'; 
import '../assets/styles/Search.css';

const Search = ({products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);
  
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
