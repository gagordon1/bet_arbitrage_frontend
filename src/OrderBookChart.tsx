// OrderBookChart.tsx

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Order } from "./BetOpportunityDetails";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface OrderBookChartProps {
  orders: Order[];
  label: string;
  color: string;
}

const OrderBookChart: React.FC<OrderBookChartProps> = ({ orders, label, color }) => {
  // Limit the orders to at most 10 entries
  const limitedOrders = orders.slice(0, 10);

  const data = {
    labels: limitedOrders.map(order => order.price.toFixed(2)), // Using price as labels
    datasets: [
      {
        label: `${label} Size`,
        data: limitedOrders.map(order => order.size),
        backgroundColor: color, // Use color prop for the background color
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${label} - Price vs Size`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Price",
        },
      },
      y: {
        title: {
          display: true,
          text: "Size",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default OrderBookChart;
