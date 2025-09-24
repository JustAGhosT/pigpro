import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Egg, Users, Scale, Activity, Baby, Milk } from 'lucide-react';
import { Species, Group } from '@my-farm/domain';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KpiData {
  totalRevenue: number;
  totalExpense: number;
  grossMargin: number;
  totalAnimals: number;
  adg: number;
  mortality: number;
  avgLitterSize: number;
  totalEggs: number;
  totalMilk: number;
}

const StatCard = ({ title, value, icon: Icon, note }: { title: string, value: string, icon: React.ElementType, note?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </CardContent>
  </Card>
);


import { Button } from '@/components/ui/button';
import { TimeSeriesChart } from './TimeSeriesChart';

interface TimeSeriesData {
  name: string;
  revenue: number;
  expense: number;
}

export const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [species, setSpecies] = useState<Species[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Fetch data for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [speciesRes, groupsRes] = await Promise.all([
          fetch('/api/v1/species'),
          fetch('/api/v1/groups'),
        ]);
        setSpecies(await speciesRes.json());
        setGroups(await groupsRes.json());
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };
    fetchFilterData();
  }, []);


  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedSpecies !== 'all') params.append('speciesId', selectedSpecies);
      if (selectedGroup !== 'all') params.append('groupId', selectedGroup);
      if (dateRange.from) params.append('from', dateRange.from);
      if (dateRange.to) params.append('to', dateRange.to);

      try {
        const [kpiRes, timeSeriesRes] = await Promise.all([
            fetch(`/api/v1/analytics/kpis?${params.toString()}`),
            fetch(`/api/v1/analytics/time-series?${params.toString()}`)
        ]);

        if (!kpiRes.ok || !timeSeriesRes.ok) throw new Error('Failed to fetch dashboard data');

        setKpiData(await kpiRes.json());
        setTimeSeriesData(await timeSeriesRes.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedSpecies, selectedGroup, dateRange]);

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!kpiData) {
      return <p>No KPI data available.</p>
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({...prev, [e.target.name]: e.target.value }));
  }

  const clearFilters = () => {
    setSelectedSpecies('all');
    setSelectedGroup('all');
    setDateRange({ from: '', to: '' });
  }

  const filteredGroups = selectedSpecies === 'all' ? groups : groups.filter(g => g.species_id === selectedSpecies);

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Farm Dashboard</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg border">
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Species" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    {species.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Group" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {filteredGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <Label htmlFor="from" className="text-sm font-medium">From:</Label>
                <Input id="from" name="from" type="date" value={dateRange.from} onChange={handleDateChange} className="w-[140px]" />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="to" className="text-sm font-medium">To:</Label>
                <Input id="to" name="to" type="date" value={dateRange.to} onChange={handleDateChange} className="w-[140px]" />
            </div>
            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Financial KPIs */}
            <StatCard title="Revenue" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpiData.totalRevenue)} icon={DollarSign} />
            <StatCard title="Expenses" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpiData.totalExpense)} icon={DollarSign} />
            <StatCard title="Gross Margin" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpiData.grossMargin)} icon={TrendingUp} />
            <StatCard title="Active Animals" value={kpiData.totalAnimals.toString()} icon={Users} />

            {/* Production KPIs */}
            <StatCard title="Avg. Daily Gain" value={`${kpiData.adg.toFixed(3)} kg/day`} icon={Scale} />
            <StatCard title="Mortality (90-day)" value={`${kpiData.mortality.toFixed(2)}%`} icon={Activity} />
            <StatCard title="Avg. Litter Size" value={kpiData.avgLitterSize.toFixed(2)} icon={Baby} />
            <StatCard title="Total Eggs" value={kpiData.totalEggs.toString()} icon={Egg} />
            <StatCard title="Total Milk" value={`${kpiData.totalMilk.toFixed(1)} L`} icon={Milk} />
        </div>
        <div>
            <TimeSeriesChart data={timeSeriesData} />
        </div>
    </div>
  );
};
