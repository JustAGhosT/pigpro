import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Group } from '@my-farm/domain';
import { formatLabel } from '@/lib/utils'; // Assuming this helper exists

interface CohortReportData {
  summary: {
    groupName: string;
    animalCount: number;
    totalCost: number;
    totalRevenue: number;
    netProfit: number;
  };
  timeline: Array<{
    type: string;
    event_type?: string;
    quantity?: number;
    weight_value?: number;
    egg_count?: number;
    weight_unit?: string;
    amount?: number;
    memo?: string;
    [key: string]: unknown;
  }>; // Combined events
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);


export const CohortReport: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [reportData, setReportData] = useState<CohortReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all groups for the selector
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/v1/groups');
        setGroups(await response.json());
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };
    fetchGroups();
  }, []);

  const handleGenerate = async () => {
    if (!selectedGroup) {
        setError("Please select a group.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      const response = await fetch(`/api/v1/reports/cohort/${selectedGroup}`);
      if (!response.ok) {
        throw new Error('Failed to generate cohort report');
      }
      setReportData(await response.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEvent = (event: CohortReportData['timeline'][number]) => {
    if (event.type === 'production') {
        return `[PROD] ${formatLabel(event.event_type)}: ` +
               `${event.quantity || event.weight_value || event.egg_count || ''} ` +
               `${event.weight_unit || ''}`;
    }
    if (event.type === 'financial') {
        return `[FIN] ${formatLabel(event.type)}: ${formatCurrency(event.amount)} (${event.memo || 'No memo'})`;
    }
    return 'Unknown event';
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Lifecycle Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex-grow">
                <label htmlFor="group-select" className="text-sm font-medium">Select Cohort/Group</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger id="group-select">
                        <SelectValue placeholder="Select a group..." />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading || !selectedGroup}>
                {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {reportData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">{reportData.summary.groupName} - Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><p className="text-sm text-muted-foreground">Animals</p><p className="font-bold text-lg">{reportData.summary.animalCount}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Cost</p><p className="font-bold text-lg">{formatCurrency(reportData.summary.totalCost)}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="font-bold text-lg">{formatCurrency(reportData.summary.totalRevenue)}</p></div>
                <div><p className="text-sm text-muted-foreground">Net Profit</p><p className="font-bold text-lg">{formatCurrency(reportData.summary.netProfit)}</p></div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Event Timeline</h3>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    {reportData.timeline.length === 0 ? (
                        <p className="text-center text-muted-foreground">No events found for this cohort.</p>
                    ) : (
                        <ul className="space-y-2">
                            {reportData.timeline.map(event => (
                                <li key={event.id} className="flex items-center text-sm">
                                    <span className="font-mono text-xs text-muted-foreground mr-4">{new Date(event.date).toLocaleDateString()}</span>
                                    <span>{renderEvent(event)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
