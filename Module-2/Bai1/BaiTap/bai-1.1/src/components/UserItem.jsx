import React from 'react';

const UserItem = ({ name }) => {
  return (
    <li className="user-item">
      {name}
    </li>
  );
};

export default UserItem;