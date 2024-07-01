import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/DataTable.css';
import EditIcon from '../assets/svgs/EditIcon';
import DeleteIcon from '../assets/svgs/DeleteIcon';
import SaveIcon from '../assets/svgs/SaveIcon';
// import extractProductId from '../utils/extractFromURL';
import DashIcon from '../assets/svgs/DashIcon';
import api from '../api/query';

const DELETE_URL = '/product';
const UPDATE_URL = '/update-product';

const DataTable = ({ products, setProducts }) => {

  const [editingProductId, setEditingProductId] = useState(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const editFieldRef = useRef(null);

  const calculateLowestPrice = (priceList) => {
    return priceList && priceList.length ? `₹${Math.min(...priceList)}` : <DashIcon />;
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setNewTargetPrice(product.target_price);
  };

  const handleSave = async (product) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await api.put(`${UPDATE_URL}/${product.id}`, {
        name: product.name,
        product_link: product.url,
        target_price: newTargetPrice,
        product_platform: product.platform
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, target_price: response.data.changes.target_price } : p
          )
        );
        setEditingProductId(null);
      } else {
        console.error('Failed to update the product');
        setEditingProductId(null);
      }
    } catch (error) {
      console.error('There was an error updating the product!', error);
      setEditingProductId(null);
    }
  };

  const handleDelete = async (product) => {
    const productId = product.id;
    const userConfirmed = window.confirm(`Delete product: ${product.name}?`);
    if (userConfirmed) {
        const accessToken = localStorage.getItem('accessToken');
        try {
          const response = await api.delete(`${DELETE_URL}/${productId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
    
          if (response.data.status === 'Product deleted successfully') {
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
          } else {
            console.error('Failed to delete the product');
          }
        } catch (error) {
          console.error('There was an error deleting the product!', error);
        }
    }
  };

  const goToExternalURL = (url) => {
    window.open(url, '_blank');
  };

  const handleClickOutside = (event) => {
    if (editFieldRef.current && !editFieldRef.current.contains(event.target)) {
      setEditingProductId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   console.log('products recieved ', products);
  // }, [products]);

  // console.log('products recieved ', products);
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            {/* <th>Image</th> */}
            <th>Name</th>
            {/* <th>Current Price</th> */}
            {/* <th>Lowest Price</th> */}
            <th>Target Price</th>
            <th>Action</th>

          </tr>
        </thead>
        {products.length === 0 && (
          <tbody>
            <tr>
              <td colSpan="7">
                <h2>No Record Found</h2>
              </td>
            </tr>
          </tbody>
        )}
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td style={{color: 'blue', fontWeight: 'bold'}}>{index+1}</td>
              {/* <td><img src={product?.image} alt={product?.name} className="product-image" /></td> */}
              <td onClick={() => goToExternalURL(product.url)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>{product?.name}</td>
              {/* <td onClick={() => goToExternalURL(product.url)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
                {extractProductId(product.url)}
              </td> */}
              {/* <td>₹{product?.price}</td> */}
              {/* <td>{calculateLowestPrice(product?.price_list)}</td> */}
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    className="editable-input"
                  />
                ) : (
                  `₹${product?.target_price}`
                )}
              </td>
              <td>
                <div className='svg-container'>
                  {editingProductId === product.id ? (
                    <SaveIcon onClick={() => handleSave(product)} />
                  ) : (
                    <EditIcon onClick={() => handleEdit(product)} />
                  )}
                  <DeleteIcon onClick={() => handleDelete(product)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
