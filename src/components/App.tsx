import React from "react";
import TimeSeriesTable from "./tables/time-series-table";
import { StockProvider } from "../state/StockContext";
// import TimeSeriesChart from "./charts/time-series-chart";

const App: React.FC = () => {
  return (
    <StockProvider>
      <div>
        <TimeSeriesTable />
        {/* <TimeSeriesChart /> */}
      </div>
    </StockProvider>
  );
};

export default App;
