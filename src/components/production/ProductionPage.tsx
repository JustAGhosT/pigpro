import React, { useState, useEffect, useCallback } from 'react';
import { AddProductionRecordForm } from './AddProductionRecordForm';
import { ProductionRecord, Species, Group, Animal } from '@/lib/production-types';
import { formatLabel } from '@/lib/utils';

export const ProductionPage: React.FC = () => {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [recordsRes, speciesRes, groupsRes, animalsRes] = await Promise.all([
        fetch('/api/v1/production-records'),
        fetch('/api/v1/species'),
        fetch('/api/v1/groups'),
        fetch('/api/v1/animals'),
      ]);
      if (!recordsRes.ok || !speciesRes.ok || !groupsRes.ok || !animalsRes.ok) {
        throw new Error('Failed to fetch page data');
      }
      const recordsData = await recordsRes.json();
      const speciesData = await speciesRes.json();
      const groupsData = await groupsRes.json();
      const animalsData = await animalsRes.json();

      setRecords(recordsData);
      setSpecies(speciesData);
      setGroups(groupsData);
      setAnimals(animalsData);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRecordAdded = () => {
    // Re-fetch all data when a new one is added
    fetchData();
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
          <div className="space-y-3">
            {records.map(record => {
              const speciesName = species.find(s => s.id === record.species_id)?.name;
              const groupName = groups.find(g => g.id === record.group_id)?.name;
              const animalName = animals.find(a => a.id === record.animal_id)?.external_id;

              return (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{formatLabel(record.event_type)}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{speciesName}</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        {new Date(record.date).toLocaleDateString()}
                        {groupName && ` | Group: ${groupName}`}
                        {animalName && ` | Animal: ${animalName}`}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-800">
                    {record.event_type === 'weight' && <p><span className="font-bold">{record.weight_value}</span> {record.weight_unit}</p>}
                    {record.event_type === 'egg_count' && <p><span className="font-bold">{record.egg_count}</span> eggs</p>}
                    {record.event_type === 'milk_volume' && <p><span className="font-bold">{record.milk_volume}</span> {record.milk_unit}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
