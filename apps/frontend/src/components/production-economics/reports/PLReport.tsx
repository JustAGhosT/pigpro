import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface PLReportData {
  period: { from: string; to: string };
  income: {
    total: number;
    byCategory: Record<string, number>;
  };
  expense: {
    total: number;
    byCategory: Record<string, number>;
  };
  netProfit: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const PLReport: React.FC = () => {
  const [reportData, setReportData] = useState<PLReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/v1/reports/p-and-l?${params.toString()}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate report');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2">
                <Label htmlFor="from">From:</Label>
                <Input id="from" name="from" type="date" value={dateRange.from} onChange={handleDateChange} />
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="to">To:</Label>
                <Input id="to" name="to" type="date" value={dateRange.to} onChange={handleDateChange} />
            </div>
            <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-700">Income</h3>
                <div className="space-y-1">
                  {Object.entries(reportData.income.byCategory).map(([cat, amount]) => (
                    <div key={cat} className="flex justify-between text-sm"><span>{cat}</span><span>{formatCurrency(amount)}</span></div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t pt-1"><span>Total Income</span><span>{formatCurrency(reportData.income.total)}</span></div>
              </div>
              {/* Expense Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-700">Expenses</h3>
                <div className="space-y-1">
                  {Object.entries(reportData.expense.byCategory).map(([cat, amount]) => (
                    <div key={cat} className="flex justify-between text-sm"><span>{cat}</span><span>{formatCurrency(amount)}</span></div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t pt-1"><span>Total Expenses</span><span>{formatCurrency(reportData.expense.total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {reportData && (
        <CardFooter className="flex justify-end font-bold text-xl border-t pt-4">
            <div className={`flex justify-between w-full ${reportData.netProfit >= 0 ? 'text-black' : 'text-red-600'}`}>
                <span>Net Profit</span>
                <span>{formatCurrency(reportData.netProfit)}</span>
            </div>
        </CardFooter>
      )}
    </Card>
  );
};
