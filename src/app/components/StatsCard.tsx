import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-gray-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
