import React, { useState, useEffect } from 'react';
import { KpiData } from '@/lib/production-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { tasks } from '@/lib/data';
import { TaskItem } from '@/components/TaskItem';
import { Calendar, Target, TrendingUp, FileText } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

const StatCard = ({ title, value, currency = false }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold text-gray-900">
                {currency ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value) : value}
            </p>
        </CardContent>
    </Card>
);

const recentActivityData = [
    {
        color: 'bg-green-500',
        title: 'Breeding optimization completed',
        description: 'Sow #247 recommended for Large White cross',
        time: '2h ago',
    },
    {
        color: 'bg-blue-500',
        title: 'New team member added',
        description: 'Johan joined as Feed Specialist',
        time: '4h ago',
    },
    {
        color: 'bg-yellow-500',
        title: 'Compliance check due',
        description: 'Health certificates need renewal',
        time: '1d ago',
    },
];

const quickActionsData = [
    {
        icon: Target,
        iconColor: 'text-emerald-600',
        title: 'AI Breed Analysis',
        description: 'Upload photos for breed identification',
    },
    {
        icon: TrendingUp,
        iconColor: 'text-blue-600',
        title: 'Optimize Breeding',
        description: 'Get AI-powered breeding recommendations',
    },
    {
        icon: FileText,
        iconColor: 'text-purple-600',
        title: 'Export Reports',
        description: 'Generate compliance documents',
    },
];


export const DashboardPage: React.FC = () => {
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKpis = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/v1/analytics/kpis');
                if (!response.ok) {
                    throw new Error('Failed to fetch KPI data');
                }
                const data = await response.json();
                setKpiData(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchKpis();
    }, []);

    const chartData = kpiData ? [
        { name: 'Financials', Revenue: kpiData.totalRevenue, Expenses: kpiData.totalExpense, Margin: kpiData.grossMargin }
    ] : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
                <p className="text-gray-600 mt-1">An overview of your farm's performance.</p>
            </div>

            {isLoading && <p>Loading dashboard...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {kpiData && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Revenue" value={kpiData.totalRevenue} currency />
                        <StatCard title="Total Expenses" value={kpiData.totalExpense} currency />
                        <StatCard title="Gross Margin" value={kpiData.grossMargin} currency />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)} />
                                    <Legend />
                                    <Bar dataKey="Revenue" fill="#22c55e" />
                                    <Bar dataKey="Expenses" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <DashboardCard title="Recent Activity" className="lg:col-span-2">
                            <div className="space-y-4">
                                {recentActivityData.map((activity) => (
                                    <div key={activity.title} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-xs text-gray-600">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Upcoming Tasks" headerContent={<Calendar className="h-5 w-5 text-gray-400" />}>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                <TaskItem
                                  key={task.title}
                                  title={task.title}
                                  description={task.description}
                                  priority={task.priority}
                                  dueDate={task.dueDate}
                                />
                              ))}
                            </div>
                        </DashboardCard>
                    </div>

                    <DashboardCard title="Quick Actions">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quickActionsData.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <button key={action.title} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                                        <Icon className={`h-6 w-6 ${action.iconColor} mb-2`} />
                                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                                        <p className="text-sm text-gray-600">{action.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </DashboardCard>
                </>
            )}
        </div>
    );
};
