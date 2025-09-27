import React, { useState, useEffect } from 'react';
import { AddRecordForm } from './AddRecordForm';
import { Dashboard } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { ImportButton } from './ImportButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PLReport } from './reports/PLReport';
import { CohortReport } from './reports/CohortReport';
import { TierBanner } from './TierBanner';
import { UserTier } from '@/lib/auth-types';

const ProductionEconomicsPage: React.FC = () => {
  const [reportJobId, setReportJobId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier | null>(null);
  const isGeneratingReport = !!reportJobId;

  const handleExport = (type: 'production' | 'financials') => {
    globalThis.location.href = `/api/v1/export/${type}.csv`;
  };

  const pollReportJob = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/jobs/${id}`);
        const job = await res.json();
        if (job.status === 'completed') {
            clearInterval(interval);
            setReportJobId(null);
            alert(`Report generated! Available at: ${job.uri}`);
        } else if (job.status === 'failed') {
            clearInterval(interval);
            setReportJobId(null);
            alert('Report generation failed.');
        }
      } catch (e: any) {
        clearInterval(interval);
        setReportJobId(null);
        alert(`Error checking report status: ${e.message}`);
      }
    }, 3000);
  };

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const response = await fetch('/api/v1/auth/tier');
        const data = await response.json();
        setUserTier(data.tier);
      } catch (error) { console.error(error); }
    };
    fetchTier();
  }, []);

  const handleGenerateReport = async () => {
    if (userTier === 'free') {
        alert("This is a premium feature. Please upgrade your plan.");
        return;
    }
    setReportJobId('pending');
    try {
      const response = await fetch('/api/v1/reports/investor', { method: 'POST' });
      if (response.status !== 202) throw new Error('Failed to start report generation job.');
      const result = await response.json();
      setReportJobId(result.jobId);
      pollReportJob(result.jobId);
    } catch (error) {
        alert(`Error: ${(error as Error).message}`);
        setReportJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Production & Economics</h1>
          <p className="mt-1 text-sm text-gray-600">
            A unified module for tracking cross-species production events and financials.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport || userTier === 'free'}>
                <FileText className="mr-2 h-4 w-4" />
                {isGeneratingReport ? `Generating (${reportJobId?.substring(0,6)})...` : 'Investor Report'}
            </Button>
            <ImportButton />
            <Button variant="outline" onClick={() => handleExport('production')}>
                <Download className="mr-2 h-4 w-4" />
                Export Production
            </Button>
            <Button variant="outline" onClick={() => handleExport('financials')}>
                <Download className="mr-2 h-4 w-4" />
                Export Financials
            </Button>
            <AddRecordForm />
        </div>
      </header>

      <TierBanner />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="records">Data Records</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4">
            <Dashboard />
        </TabsContent>
        <TabsContent value="reports" className="mt-4 space-y-6">
            <PLReport />
            <CohortReport />
        </TabsContent>
        <TabsContent value="records" className="mt-4">
            <p>A list of all production and financial records will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionEconomicsPage;
