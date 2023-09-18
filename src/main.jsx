import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/style/index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider'
import { CartProvider } from './context/CartContext';
// import { SearchProvider } from './context/searchContext'
// import { SearchProvider } from './context/searchContext'
import { SearchProvider } from './context/SearchContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
