import { useEffect, useState } from 'react';
import DataTable from './DataTable'; 
import '../assets/styles/Search.css';

const Search = ({products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortState, setSortState] = useState({ field: null, direction: null });

  useEffect(() => {
    let updatedFilteredProducts = products.filter(product =>
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
        handleSort={handleSort}
        sortedField={sortState.field}
        sortDirection={sortState.direction}
      />
    </div>
  );
};

export default Search;
