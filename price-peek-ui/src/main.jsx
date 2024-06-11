import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/store.js';
import Container from'./components/Container.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Container>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </Container>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
