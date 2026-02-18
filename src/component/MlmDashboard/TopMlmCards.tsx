import React from "react";
import { IoTrendingUp, IoTrendingDown  } from "react-icons/io5";

type CardProps = {
  title: string;
  value: string;
  percentage: number;
  isPositive: boolean;
};

const StatCard: React.FC<CardProps> = ({
  title,
  value,
  percentage,
  isPositive,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group">
      
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-green-50/0 group-hover:from-teal-50/50 group-hover:to-green-50/50 transition-all duration-300" />
      
      {/* Right gradient border */}
      <span className="absolute right-0 top-0 h-full w-[6px] bg-gradient-to-b from-teal-400 to-green-400 rounded-r-xl shadow-lg shadow-teal-200/50" />
      
      {/* Bottom gradient border */}
      <span className="absolute bottom-0 left-0 h-[5px] w-full bg-gradient-to-r from-teal-400 to-green-400 shadow-lg shadow-green-200/50" />
      
      {/* Floating glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-green-200/20 rounded-full blur-3xl group-hover:from-teal-200/30 group-hover:to-green-200/30 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h4 className="text-gray-500 text-sm font-medium mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-green-600 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h4>

        {/* Value */}
        <div className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
          {value}
        </div>

        {/* Percentage - without background on icons */}
        <div
          className={`flex items-center text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <IoTrendingUp className="mr-1 text-lg" />
          ) : (
            <IoTrendingDown className="mr-1 text-lg" />
          )}

          <span className="font-bold">{percentage}%</span>

          <span className="text-gray-400 ml-2 font-normal group-hover:text-gray-500 transition-colors">
            vs yesterday
          </span>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
      </div>
    </div>
  );
};

const TopMlmCards = () => {
  const data = [
    { title: "Total Sales", value: "$40,689", percentage: 8.5, isPositive: true },
    { title: "Total Orders", value: "10,293", percentage: 8.5, isPositive: true },
    { title: "Active Vendors", value: "1,000", percentage: 8.5, isPositive: false },
    { title: "New Customers", value: "255", percentage: 8.5, isPositive: false },
    { title: "Pending Returns", value: "4,578", percentage: 8.5, isPositive: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {data.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
};

export default TopMlmCards;