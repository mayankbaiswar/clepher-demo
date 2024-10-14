import React, { useContext, useEffect, useRef, useState } from "react";
import { StockContext } from "../../state/StockContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js/auto";
import CircularLoader from "../base/CircularLoader";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

export default function TimeSeriesChart() {
  const context = useContext(StockContext);
  const chartRef = useRef<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartId, setChartId] = useState(Date.now());
  const symbol = context?.symbol;
  const rawTimeSeries: any = context?.rawTimeSeries || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const labels = Object.keys(rawTimeSeries).map((time) => new Date(time));
        const closePrices = labels.map((time) => parseFloat(rawTimeSeries[time.toISOString()]['4. close']));


        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Close Price`,
              data: closePrices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup the chart instance
      }
    };
  }, [context]);

  useEffect(() => {
    if (chartData) {
      setChartId(Date.now());
    }
  }, [chartData]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <CircularLoader />
      </div>
    );
  }

  if (!context) {
    return <div className="text-center mt-10">Context not available</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">{symbol} Intraday Stock Data</h1>
      {chartData && (
        <Line
          key={chartId}
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.dataset.label}: $${(tooltipItem.raw as number).toFixed(2)}`;
                  },
                },
              },
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute',
                  tooltipFormat: 'MMM D, h:mm a',
                },
                title: {
                  display: true,
                  text: 'Time',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Price ($)',
                },
                beginAtZero: false,
              },
            },
          }}
        />
      )}
    </div>
  );
}
