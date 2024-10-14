export interface StockTimeSeries {
  [time: string]: StockTimeSeries;
}

export interface TimeSeries {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockContextType {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  loading: boolean;
  symbol: string;
  rawTimeSeries: StockTimeSeries;
}
