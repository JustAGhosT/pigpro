import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const ImportButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const pollJobStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/jobs/${id}`);
        const job = await response.json();

        if (job.status === 'completed') {
          clearInterval(interval);
          setIsImporting(false);
          setJobId(null);
          alert('Import completed successfully!');
        } else if (job.status === 'failed') {
          clearInterval(interval);
          setIsImporting(false);
          setJobId(null);
          alert('Import failed. Check server logs for details.');
        }
      } catch (error: any) {
        clearInterval(interval);
        setIsImporting(false);
        alert(`Error checking import status: ${error.message}`);
      }
    }, 3000); // Poll every 3 seconds
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const fileContent = await file.text();

    try {
      const response = await fetch('/api/v1/imports/production', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: fileContent,
      });

      if (response.status !== 202) {
        throw new Error('Failed to start import job.');
      }
      const result = await response.json();
      setJobId(result.jobId);
      pollJobStatus(result.jobId);

    } catch (error) {
      setIsImporting(false);
      alert(`Error starting import: ${(error as Error).message}`);
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleButtonClick} disabled={isImporting}>
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? `Importing (Job: ${jobId?.substring(0, 6)})...` : 'Import Production'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv"
        disabled={isImporting}
      />
    </>
  );
};
