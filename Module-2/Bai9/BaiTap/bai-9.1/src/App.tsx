import React from 'react';
import { CartProvider } from './context/CartContext';
import ShoppingPage from './pages/ShoppingPage';

function App() {
  return (
    <CartProvider>
      <ShoppingPage />
    </CartProvider>
  );
}

export default App;