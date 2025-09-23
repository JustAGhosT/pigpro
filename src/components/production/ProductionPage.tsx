import React, { useState, useEffect, useCallback } from 'react';
import { AddProductionRecordForm } from './AddProductionRecordForm';
import { ProductionRecord } from '@/lib/production-types';
import { formatLabel } from '@/lib/utils';

export const ProductionPage: React.FC = () => {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/production-records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleRecordAdded = () => {
    // Re-fetch the records when a new one is added
    fetchRecords();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Production Records</h1>
        <p className="text-gray-600 mt-1">Log and view production events for all your species.</p>
      </div>

      <AddProductionRecordForm onRecordAdded={handleRecordAdded} />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recorded Events</h2>
        {isLoading && <p>Loading records...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && records.length === 0 && (
          <p className="text-center text-gray-500">No production records found.</p>
        )}
        {!isLoading && !error && records.length > 0 && (
          <div className="space-y-2">
            {records.map(record => (
              <div key={record.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{formatLabel(record.event_type)}</span>
                  <span className="text-sm text-gray-600 ml-2">({new Date(record.date).toLocaleDateString()})</span>
                </div>
                <div className="text-sm text-gray-800">
                  {record.event_type === 'weight' && `${record.weight_value} ${record.weight_unit}`}
                  {record.event_type === 'egg_count' && `${record.egg_count} eggs`}
                  {record.event_type === 'milk_volume' && `${record.milk_volume} ${record.milk_unit}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
