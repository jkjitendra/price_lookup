import { useState, useEffect, useRef } from 'react';
import '../assets/styles/DataTable.css';
import EditIcon from '../assets/svgs/EditIcon';
import DeleteIcon from '../assets/svgs/DeleteIcon';
import SaveIcon from '../assets/svgs/SaveIcon';
// import extractProductId from '../utils/extractFromURL';
import Modal from './Modal';
// import DashIcon from '../assets/svgs/DashIcon';
import api from '../api/query';
import { logger } from '../utils/logger';

const DELETE_URL = '/product';
const UPDATE_URL = '/update-product';

const DataTable = ({ products, setProducts, handleSort, sortedField, sortDirection }) => {

  const [editingProductId, setEditingProductId] = useState(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const editFieldRef = useRef(null);
  const saveIconRef = useRef(null);

  // const calculateLowestPrice = (priceList) => {
  //   return priceList && priceList.length ? `₹${Math.min(...priceList)}` : <DashIcon />;
  // };

  // Handle editing
  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setNewTargetPrice(product.target_price);

    // Focus the input field after setting editingProductId
    setTimeout(() => {
      if (editFieldRef.current) {
        editFieldRef.current.focus();
      }
    }, 0);
  };

  // Handle saving
  const handleSave = async (product) => {
    logger.log('Saving product changes:', product);
    if (product?.target_price === newTargetPrice) {
      setEditingProductId(null);
      setNewTargetPrice('');
      logger.log('No changes detected in target price.');
      return;
    }

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
        logger.log('Product updated successfully:', response.data);
      } else {
        logger.error('Failed to update product:', response.data);
      }
    } catch (error) {
      logger.error('Error updating product:', error);
    } finally {
      setEditingProductId(null); // Clear the editing ID after the API call
    }
  };

  // Handle delete
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  
    if (!productToDelete?.id) {
      console.error("Product ID is undefined. Cannot delete.");
      return;
    }
    const productId = productToDelete.id;
    
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
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const goToExternalURL = (url) => {
    window.open(url, '_blank');
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the editable input or SaveIcon
    if (
      editFieldRef.current &&
      !editFieldRef.current.contains(event.target) &&
      saveIconRef.current &&
      !saveIconRef.current.contains(event.target)
    ) {
      setEditingProductId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            {/* <th>Image</th> */}
            <th className="sortable">
              <div>
                Name
                <button
                  style={{ color: '#FFD700', border: 'none', background: 'none', fontSize: '16px' }}
                  onClick={() => handleSort('name')}
                >
                  {sortedField === 'name' && sortDirection === 'asc' ? '▲' : '▼'}
                </button>
              </div>
            </th>
            {/* <th>Current Price</th> */}
            {/* <th>Lowest Price</th> */}
            <th className="sortable">
              <div>
                Target Price 
                <button
                  style={{ color: '#FFD700', border: 'none', background: 'none', fontSize: '16px' }}
                  onClick={() => handleSort('target_price')}
                >
                  {sortedField === 'target_price' && sortDirection === 'asc' ? '▲' : '▼'}
                </button>
              </div>
            </th>
            <th>Update Product</th>
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
            <tr key={`${product.id}-${index}`}>
              <td style={{color: 'blue', fontWeight: 'bold'}}>{index + 1}</td>
              {/* <td><img src={product?.image} alt={product?.name} className="product-image" /></td> */}
              <td onClick={() => goToExternalURL(product.url)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>{product?.name}</td>
              {/* <td>₹{product?.price}</td> */}
              {/* <td>{calculateLowestPrice(product?.price_list)}</td> */}
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    ref={editFieldRef}
                    value={newTargetPrice}
                    // onChange={(e) => setNewTargetPrice(e.target.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === '') { // Regex to allow only digits
                        setNewTargetPrice(value);
                      }
                    }}
                    className="editable-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(product);
                    }}
                  />
                ) : (
                  `₹${product?.target_price}`
                )}
              </td>
              <td>
                <div className='svg-container'>
                  {editingProductId === product.id ? (
                    <div ref={saveIconRef} >
                      <SaveIcon onClick={() => handleSave(product)} />
                    </div>
                  ) : (
                    <>
                      {/* {console.log("EditIcon rendered for product:", product.id)} */}
                      <EditIcon onClick={() => handleEdit(product)} />
                    </>
                  )}
                  {editingProductId !== product.id && (
                    <DeleteIcon onClick={() => handleDelete(product)} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <Modal
          title="Delete Confirmation"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        >
          Are you sure you want to delete the product: {productToDelete?.name}?
        </Modal>
      )}
    </div>
  );
};

export default DataTable;
