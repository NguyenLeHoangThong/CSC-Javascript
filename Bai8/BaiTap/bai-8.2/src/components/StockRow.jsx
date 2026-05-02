import React from "react";
import { TableRow, TableCell, Box } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const StockRow = React.memo(({ stock }) => {
  const isUp = stock.change > 0;
  const isDown = stock.change < 0;
  const color = isUp ? "#2e7d32" : isDown ? "#d32f2f" : "#ed6c02";

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>{stock.symbol}</TableCell>
      <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
      <TableCell align="right" sx={{ color: color, fontWeight: "bold" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          {isUp && <ArrowDropUpIcon />}
          {isDown && <ArrowDropDownIcon />}
          {stock.change.toFixed(2)}
        </Box>
      </TableCell>
      <TableCell align="right" sx={{ color: color }}>
        {stock.changePercent}
      </TableCell>
      <TableCell align="right" sx={{ color: "text.secondary" }}>
        {parseInt(stock.volume).toLocaleString()}
      </TableCell>
    </TableRow>
  );
});

export default StockRow;
