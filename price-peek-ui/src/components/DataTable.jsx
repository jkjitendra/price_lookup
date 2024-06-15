import React from 'react';
import '../assets/styles/DataTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditIcon from '../assets/svgs/EditIcon';
import DeleteIcon from '../assets/svgs/DeleteIcon';

const DataTable = ({ products }) => {
  const calculateLowestPrice = (priceList) => {
    return priceList.length ? Math.min(...priceList) : 'N/A';
  };

  console.log('products recieved ', products);
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Image</th>
            <th>Name</th>
            <th>Current Price</th>
            <th>Lowest Price</th>
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
              <td>{index+1}</td>
              <td><img src={product?.image} alt={product?.name} className="product-image" /></td>
              <td>{product?.name}</td>
              <td>₹{product?.currentPrice}</td>
              <td>₹{calculateLowestPrice(product?.price_list)}</td>
              <td>₹{product?.target_price}</td>
              <td>
                {/* <button className="action-btn edit-btn">Edit</button> */}
                {/* <button className="action-btn delete-btn">Delete</button> */}
                <div className='svg-container'>
                  <EditIcon />
                  <DeleteIcon />
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
