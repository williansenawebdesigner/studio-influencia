
import React from 'react';

interface FunctionCardProps {
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick: () => void;
  [key: string]: any; // To allow for data-* attributes
}

const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick, ...props }) => {
  return (
    <div
      className={`function-card flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition duration-200 border-2 ${
        isActive ? 'bg-lime-500/10 border-lime-500 text-lime-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700/50 hover:border-gray-600'
      }`}
      onClick={onClick}
      {...props}
    >
      <div className="icon flex items-center justify-center mb-1.5 opacity-90">
        {icon}
      </div>
      <div className="name text-sm font-medium">{name}</div>
    </div>
  );
};

export default FunctionCard;
