import { useState, useEffect, useRef } from 'react';
import '../assets/styles/DataTable.css';
import EditIcon from '../assets/svgs/EditIcon';
import DeleteIcon from '../assets/svgs/DeleteIcon';
import SaveIcon from '../assets/svgs/SaveIcon';
// import extractProductId from '../utils/extractFromURL';
import Modal from './Modal';
import api from '../api/query';
import { logger } from '../utils/logger';

const DELETE_URL = '/product';
const UPDATE_URL = '/update-product';

const DataTable = ({ products, setProducts, handleSort, sortedField, sortDirection }) => {

  const [editingProductId, setEditingProductId] = useState(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [newProductName, setNewProductName] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const editFieldRef = useRef(null);
  const nameFieldRef = useRef(null);
  const saveIconRef = useRef(null);

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name);
    setNewTargetPrice(product.target_price);

    setTimeout(() => {
      if (editFieldRef.current) {
        editFieldRef.current.focus();
      }
    }, 0);
  };

  const handleSave = async (product) => {
    logger.log('Saving product changes:', product);
    if (product?.target_price === newTargetPrice && product?.name === newProductName) {
      setEditingProductId(null);
      setNewProductName('');
      setNewTargetPrice('');
      logger.log('No changes detected.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    try {

      const response = await api.put(`${UPDATE_URL}/${product.id}`, {
        name: newProductName,
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
            p.id === product.id
              ? {
                  ...p,
                  name: newProductName,
                  target_price: response.data.changes.target_price || p.target_price
                }
              : p
          )
        );
        logger.log('Product updated successfully:', response.data);
      } else {
        logger.error('Failed to update product:', response.data);
      }
    } catch (error) {
      logger.error('Error updating product:', error);
    } finally {
      setEditingProductId(null);
      setNewProductName('');
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
    if (
      (editFieldRef.current &&
        editFieldRef.current.contains(event.target))
      || (nameFieldRef.current && 
        nameFieldRef.current.contains(event.target))
      ||(saveIconRef.current &&
        saveIconRef.current.contains(event.target))
    ) {
      return;
    }
    setEditingProductId(null);
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
            <th className="sortable">
              <div style={{ justifyContent: 'flex-start' }}>
                Name
                <button
                  style={{ color: '#FFD700', border: 'none', background: 'none', fontSize: '16px' }}
                  onClick={() => handleSort('name')}
                >
                  {sortedField === 'name' && sortDirection === 'asc' ? '▲' : '▼'}
                </button>
              </div>
            </th>
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
                <h2>No Records Found, Please Add Products</h2>
              </td>
            </tr>
          </tbody>
        )}
        <tbody>
          {products.map((product, index) => (
            <tr key={`${product.id}-${index}`}>
              <td style={{color: 'blue', fontWeight: 'bold'}}>{index + 1}</td>
              <td className='product-name'>
                {editingProductId === product.id ? (
                  <input
                    type="text"
                    ref={nameFieldRef}
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="editable-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(product);
                    }}
                  />
                ) : (
                  <span
                    onClick={() => goToExternalURL(product.url)}
                    style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                  >
                    {product?.name}
                  </span>
                )}
              </td>
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    ref={editFieldRef}
                    value={newTargetPrice}
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
