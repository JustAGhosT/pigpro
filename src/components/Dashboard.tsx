import React from 'react';
import { 
  TrendingUp, 
  PiggyBank, 
  Users, 
  Calendar,
  Target,
  Award,
  FileText
} from 'lucide-react';
import { stats, tasks } from '../lib/data';
import { StatCard } from './StatCard';
import { TaskItem } from './TaskItem';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Sipho. Here's your farm overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={
              index === 0 ? <PiggyBank className="h-8 w-8" /> :
              index === 1 ? <TrendingUp className="h-8 w-8" /> :
              index === 2 ? <Users className="h-8 w-8" /> :
              <Award className="h-8 w-8" />
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Breeding optimization completed</p>
                  <p className="text-xs text-gray-600">Sow #247 recommended for Large White cross</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New team member added</p>
                  <p className="text-xs text-gray-600">Johan joined as Feed Specialist</p>
                </div>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Compliance check due</p>
                  <p className="text-xs text-gray-600">Health certificates need renewal</p>
                </div>
                <span className="text-xs text-gray-500">1d ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskItem
                  key={index}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  dueDate={task.dueDate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Target className="h-6 w-6 text-emerald-600 mb-2" />
            <h4 className="font-medium text-gray-900">AI Breed Analysis</h4>
            <p className="text-sm text-gray-600">Upload photos for breed identification</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Optimize Breeding</h4>
            <p className="text-sm text-gray-600">Get AI-powered breeding recommendations</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Reports</h4>
            <p className="text-sm text-gray-600">Generate compliance documents</p>
          </button>
        </div>
      </div>
    </div>
  );
};