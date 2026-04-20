import React from 'react';

const ProductItem = ({ name, price }) => {
  return (
    <div className="product-item">
      <span className="product-name">{name}</span>
      <span className="product-price">{price.toLocaleString()} VNĐ</span>
    </div>
  );
};

export default ProductItem;