import { useEffect, useState } from 'react';
import axios from '../api/query';
import Search from './Search';

const GET_ALL_PRODUCTS_URL = '/get-all-products';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get(`${GET_ALL_PRODUCTS_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log(response.data.products.data);
        setProducts(response.data.products.data || []); // Fallback to empty array if undefined
      })
      .catch(error => {
        console.error('There was an error fetching the products data!', error);
      });
  }, [accessToken]);

  return (
    <>
      <div >
        <Search
          products={products}
          setProducts={setProducts}
        />
      </div>
    </>
  );
}

export default ProductsList;

// import { useEffect, useState } from 'react';
// import axios from '../api/query';
// import Search from './Search';
// import DataTable from './DataTable';

// const GET_ALL_PRODUCTS_URL = '/get-all-products';

// const ProductsList = () => {
//   const [products, setProducts] = useState([]);
//   const accessToken = localStorage.getItem('accessToken');

//   useEffect(() => {
//     axios.get(`${GET_ALL_PRODUCTS_URL}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     })
//       .then(response => {
//         const products = response.data.products.data || [];
//         setProducts(products);

//         // Create iframes for each product to fetch data
//         products.forEach((product, index) => {
//           const iframe = document.createElement('iframe');
//           iframe.src = product.url;
//           iframe.style.display = 'none';
//           iframe.id = `iframe-${index}`;
//           document.body.appendChild(iframe);

//           // Listen for the iframe to load
//           iframe.onload = () => {
//             try {
//               const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//               const imageElement = iframeDocument.querySelector('img#landingImage');
//               const priceElement = iframeDocument.querySelector('.a-price-whole');
//               const nameElement = iframeDocument.querySelector('span#productTitle');

//               const image = imageElement ? imageElement.src : '';
//               const price = priceElement ? priceElement.innerText : '';
//               const name = nameElement ? nameElement.innerText.trim() : '';

//               setProducts((prevProducts) => prevProducts.map((p, i) => {
//                 if (i === index) {
//                   return {
//                     ...p,
//                     image,
//                     currentPrice: price,
//                     name,
//                   };
//                 }
//                 return p;
//               }));
//             } catch (error) {
//               console.error('Error accessing iframe content:', error);
//             }
//           };
//         });
//       })
//       .catch(error => {
//         console.error('There was an error fetching the products data!', error);
//       });
//   }, [accessToken]);

//   return (
//     <>
//       <div>
//         <Search products={products} />
//         <DataTable products={products} setProducts={setProducts} />
//       </div>
//     </>
//   );
// };

// export default ProductsList;
