import StockDashboard from "./components/StockDashboard";
import { StockProvider } from "./contexts/StockContext";

const App = () => {
  return (
    <StockProvider>
      <StockDashboard />
    </StockProvider>
  );
};

export default App;