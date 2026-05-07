import React from "react";
import { Box, Typography, Divider, List, ListItem, ListItemText, IconButton, Button } from "@mui/material";
import { DeleteOutlined } from '@mui/icons-material';
import { useCart } from "../context/CartContext";

export const ShoppingCart: React.FC = () => {
  const { state, dispatch } = useCart();

  // Đảm bảo giá trị luôn là số trước khi gọi toLocaleString
  const displayPrice = state.totalPrice || 0;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Giỏ hàng ({state.totalCount})
      </Typography>
      <Divider />

      <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
        {state.items.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            Trống
          </Typography>
        ) : (
          state.items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>
                  <DeleteOutlined color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity} x ${item.price.toLocaleString()}đ`}
                primaryTypographyProps={{ variant: "body2", fontWeight: "600", noWrap: true }}
              />
            </ListItem>
          ))
        )}
      </List>

      {state.items.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography fontWeight="bold">Tổng cộng:</Typography>
            <Typography fontWeight="900" color="error.main">
              {displayPrice.toLocaleString()}đ
            </Typography>
          </Box>
          <Button fullWidth variant="contained" color="success" size="large">
            THANH TOÁN
          </Button>
        </Box>
      )}
    </Box>
  );
};
