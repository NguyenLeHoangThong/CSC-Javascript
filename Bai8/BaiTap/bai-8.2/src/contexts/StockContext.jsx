import React, { createContext } from "react";

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  // danh mục theo dõi
  const symbols = ["AAPL", "MSFT", "GOOGL", "TSLA"];

  return <StockContext.Provider value={{ symbols }}>{children}</StockContext.Provider>;
};
