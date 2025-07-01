import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Users, 
  AlertCircle,
  Calendar,
  Target,
  Award,
  FileText
} from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}> = ({ title, value, change, trend, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

const TaskItem: React.FC<{
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

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Sipho. Here's your farm overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Herd"
          value="247"
          change="+12 this month"
          trend="up"
          icon={<PiggyBank className="h-8 w-8" />}
        />
        <StatCard
          title="Avg. Revenue/Pig"
          value="R2,840"
          change="+18% vs last year"
          trend="up"
          icon={<TrendingUp className="h-8 w-8" />}
        />
        <StatCard
          title="Team Members"
          value="8"
          change="2 new this month"
          trend="up"
          icon={<Users className="h-8 w-8" />}
        />
        <StatCard
          title="Breeding Score"
          value="92%"
          change="+5% this quarter"
          trend="up"
          icon={<Award className="h-8 w-8" />}
        />
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
              <TaskItem
                title="Vaccination Schedule"
                description="Batch A pigs due for vaccination"
                priority="high"
                dueDate="Tomorrow"
              />
              <TaskItem
                title="Feed Optimization"
                description="Review feed efficiency metrics"
                priority="medium"
                dueDate="This week"
              />
              <TaskItem
                title="Market Analysis"
                description="Check pricing trends for premium cuts"
                priority="low"
                dueDate="Next week"
              />
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