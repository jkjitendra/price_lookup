// // Container.jsx
// import React from 'react';
// import '../assets/styles/Container.css';

// const Container = ({ children }) => {
//   return (
//     <div className="app-container min-h-screen bg-blue-600">
//       {children}
//     </div>
//   );
// };

// export default Container;

import React from 'react';
import '../assets/styles/Container.css';

const Container = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

export default Container;
