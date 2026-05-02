import React from 'react';
import { TableRow, TableCell, Button, Avatar } from '@mui/material';

// React.memo ngăn việc render lại dòng này nếu dữ liệu sp không đổi
const ProductRow = React.memo(({ product, onDelete }) => {

  return (
    <TableRow hover>
      <TableCell>
        <Avatar src={product.thumbnail} variant="rounded" sx={{ width: 50, height: 50 }} />
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>{product.title}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell color="primary">${product.price}</TableCell>
      <TableCell>
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          onClick={() => onDelete(product.id)}
        >
          Xóa
        </Button>
      </TableCell>
    </TableRow>
  );
});

export default ProductRow;