import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  BarChart3,
  Target,
  AlertCircle,
  Zap
} from 'lucide-react';

interface PriceData {
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

interface MarketAlert {
  id: string;
  type: 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  date: string;
}

interface ForecastData {
  category: string;
  currentValue: number;
  forecast: number;
  confidence: number;
  timeframe: string;
}

const priceData: PriceData[] = [
  {
    category: 'Pork Chops (Premium)',
    currentPrice: 89.50,
    previousPrice: 85.20,
    change: 5.0,
    trend: 'up',
    unit: 'per kg'
  },
  {
    category: 'Bacon (Streaky)',
    currentPrice: 124.00,
    previousPrice: 128.50,
    change: -3.5,
    trend: 'down',
    unit: 'per kg'
  },
  {
    category: 'Shoulder (Bone-in)',
    currentPrice: 68.75,
    previousPrice: 67.30,
    change: 2.2,
    trend: 'up',
    unit: 'per kg'
  },
  {
    category: 'Mince (Lean)',
    currentPrice: 95.00,
    previousPrice: 95.00,
    change: 0,
    trend: 'stable',
    unit: 'per kg'
  },
  {
    category: 'Pork Belly',
    currentPrice: 78.90,
    previousPrice: 82.10,
    change: -3.9,
    trend: 'down',
    unit: 'per kg'
  },
  {
    category: 'Spare Ribs',
    currentPrice: 105.50,
    previousPrice: 102.80,
    change: 2.6,
    trend: 'up',
    unit: 'per kg'
  }
];

const marketAlerts: MarketAlert[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Premium Pork Chops Surge',
    description: 'Demand for premium cuts increased 15% this week. Consider prioritizing high-quality breeding lines.',
    impact: 'high',
    date: '2024-03-15'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Feed Costs Rising',
    description: 'Maize prices up 8% this month. Review feed efficiency strategies to maintain margins.',
    impact: 'medium',
    date: '2024-03-14'
  },
  {
    id: '3',
    type: 'info',
    title: 'Export Opportunities',
    description: 'New trade agreements may open premium export markets for South African pork.',
    impact: 'medium',
    date: '2024-03-13'
  }
];

const forecastData: ForecastData[] = [
  {
    category: 'Average Pig Price',
    currentValue: 2840,
    forecast: 3150,
    confidence: 85,
    timeframe: '3 months'
  },
  {
    category: 'Feed Costs',
    currentValue: 320,
    forecast: 340,
    confidence: 78,
    timeframe: '3 months'
  },
  {
    category: 'Profit Margin',
    currentValue: 18.5,
    forecast: 21.2,
    confidence: 72,
    timeframe: '3 months'
  }
];

const PriceCard: React.FC<{ data: PriceData }> = ({ data }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-medium text-gray-900">{data.category}</h4>
        <p className="text-sm text-gray-600">{data.unit}</p>
      </div>
      <div className="flex items-center space-x-1">
        {data.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
        {data.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
        {data.trend === 'stable' && <div className="h-4 w-4 rounded-full bg-gray-400"></div>}
        <span className={`text-sm font-medium ${
          data.trend === 'up' ? 'text-green-600' : 
          data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {data.change > 0 ? '+' : ''}{data.change}%
        </span>
      </div>
    </div>

    <div className="flex items-end justify-between">
      <div>
        <div className="text-2xl font-bold text-gray-900">
          R{data.currentPrice.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600">
          Previous: R{data.previousPrice.toFixed(2)}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600">Change</div>
        <div className={`font-medium ${
          data.change > 0 ? 'text-green-600' : 
          data.change < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          R{Math.abs(data.currentPrice - data.previousPrice).toFixed(2)}
        </div>
      </div>
    </div>
  </div>
);

const AlertCard: React.FC<{ alert: MarketAlert }> = ({ alert }) => (
  <div className={`p-4 rounded-lg border-l-4 ${
    alert.type === 'opportunity' ? 'border-green-500 bg-green-50' :
    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
    'border-blue-500 bg-blue-50'
  }`}>
    <div className="flex items-start space-x-3">
      <div className={`p-1 rounded-full ${
        alert.type === 'opportunity' ? 'bg-green-100 text-green-600' :
        alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {alert.type === 'opportunity' && <TrendingUp className="h-4 w-4" />}
        {alert.type === 'warning' && <AlertCircle className="h-4 w-4" />}
        {alert.type === 'info' && <Zap className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{alert.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            alert.impact === 'high' ? 'bg-red-100 text-red-700' :
            alert.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {alert.impact} impact
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
        <p className="text-xs text-gray-500 mt-2">{new Date(alert.date).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);

const ForecastCard: React.FC<{ data: ForecastData }> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-medium text-gray-900">{data.category}</h4>
      <div className="flex items-center space-x-1">
        <BarChart3 className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{data.confidence}% confidence</span>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-gray-600">Current</div>
          <div className="text-xl font-bold text-gray-900">
            {data.category.includes('Margin') ? `${data.currentValue}%` : `R${data.currentValue.toLocaleString()}`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Forecast ({data.timeframe})</div>
          <div className="text-xl font-bold text-emerald-600">
            {data.category.includes('Margin') ? `${data.forecast}%` : `R${data.forecast.toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${data.confidence}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Confidence</span>
        <span className="font-medium">{data.confidence}%</span>
      </div>
    </div>
  </div>
);

export const MarketInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prices' | 'alerts' | 'forecast'>('prices');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
        <p className="text-gray-600 mt-1">Real-time market data and predictions for South African pork industry</p>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Avg. Pig Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">R2,840</div>
          <div className="text-sm text-green-600">+12% vs last month</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Best Performer</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">Pork Chops</div>
          <div className="text-sm text-green-600">+5.0% this week</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Profit Margin</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">18.5%</div>
          <div className="text-sm text-green-600">Above industry avg</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Last Updated</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">Today</div>
          <div className="text-sm text-gray-600">14:30 SAST</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'prices'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="h-4 w-4 inline mr-2" />
          Current Prices
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Market Alerts
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'forecast'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Forecast
        </button>
      </div>

      {/* Content */}
      {activeTab === 'prices' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Market Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceData.map((data, index) => (
              <PriceCard key={index} data={data} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Market Alerts & Opportunities</h3>
          <div className="space-y-3">
            {marketAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Market Forecasts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecastData.map((data, index) => (
              <ForecastCard key={index} data={data} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};