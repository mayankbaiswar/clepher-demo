import React, { useContext } from "react";

import CircularLoader from "../base/CircularLoader";
import { StockContext } from "../../state/StockContext";
import RefreshButton from "../base/RefreshButton";

const TimeSeriesTable = () => {
  const context = useContext(StockContext);

  if (!context) {
    return <div className="text-center mt-10">Context not available</div>;
  }

  const { data, loading, symbol } = context;

  if (loading) {
    return (
      <div className="text-center mt-10">
        <CircularLoader />
      </div>
    );
  }

  const refreshData = () => {};

  return (
    <div className="container mx-auto p-5">
      <div className="container mx-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{symbol} Intraday Stock Data</h1>
          <RefreshButton onRefresh={refreshData} />
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Time</th>
            <th className="py-3 px-6 text-left">Open</th>
            <th className="py-3 px-6 text-left">High</th>
            <th className="py-3 px-6 text-left">Low</th>
            <th className="py-3 px-6 text-left">Close</th>
            <th className="py-3 px-6 text-left">Volume</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((entry, index) => (
            <tr
              key={entry.time}
              className={`border-b transition duration-300 ease-in-out ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <td className="py-3 px-6">{entry.time}</td>
              <td className="py-3 px-6">{entry.open}</td>
              <td className="py-3 px-6">{entry.high}</td>
              <td className="py-3 px-6">{entry.low}</td>
              <td className="py-3 px-6">{entry.close}</td>
              <td className="py-3 px-6">{entry.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSeriesTable;
