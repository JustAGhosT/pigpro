import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className, headerContent }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {headerContent}
      </div>
      {children}
    </div>
  );
};
