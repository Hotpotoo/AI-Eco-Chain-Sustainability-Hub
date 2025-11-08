
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-medium text-brand-gray">{title}</p>
        <p className="text-2xl font-bold text-brand-dark">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
