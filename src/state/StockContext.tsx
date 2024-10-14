import React, { createContext, useState, useEffect, ReactNode } from "react";
import { StockTimeSeries, TimeSeries, StockContextType } from "../utils/types";

export const StockContext = createContext<StockContextType | undefined>(
  undefined
);

interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider = ({ children }: StockProviderProps) => {
  const [data, setData] = useState<TimeSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState("");
  const [rawTimeSeries, setTimeSeries] = useState<StockTimeSeries>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=RIBXT3XYLI69PC0Q");
        const result: StockTimeSeries = await response.json();
        const timeSeries: StockTimeSeries = result["Time Series (5min)"];
        setTimeSeries(timeSeries);
        const ticker = (result["Meta Data"] as unknown as { "2. Symbol": string })["2. Symbol"];
        setSymbol(ticker);
        // Format data
        const formattedData: TimeSeries[] = Object.entries(timeSeries).map(
          ([time, values]) => {
            const valueObj = values as unknown as { [key: string]: string };
            return {
              time,
              open: parseFloat(valueObj["1. open"]),
              high: parseFloat(valueObj["2. high"]),
              low: parseFloat(valueObj["3. low"]),
              close: parseFloat(valueObj["4. close"]),
              volume: parseInt(valueObj["5. volume"], 10),
            };
          }
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <StockContext.Provider value={{ data, loading, symbol, rawTimeSeries }}>
      {children}
    </StockContext.Provider>
  );
};
