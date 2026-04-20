import React from 'react';

const Product = (props) => {
  const { name, price, img } = props.item;

  return (
    <div className="product-card">
      <h3 className="product-title">{name}</h3>
      <p className="product-price">{price} VNĐ</p>
      <div className="product-image-wrapper">
        <img src={img} alt={name} className="product-image" />
      </div>
    </div>
  );
};

export default Product;