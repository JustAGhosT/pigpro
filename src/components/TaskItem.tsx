import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TaskItem: React.FC<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}> = ({ title, description, priority, dueDate }) => (
  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="flex items-center mt-2 space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            priority === 'high' ? 'bg-red-100 text-red-700' :
            priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
          <span className="text-xs text-gray-500">{dueDate}</span>
        </div>
      </div>
      <AlertCircle className="h-5 w-5 text-gray-400 ml-4" />
    </div>
  </div>
);
