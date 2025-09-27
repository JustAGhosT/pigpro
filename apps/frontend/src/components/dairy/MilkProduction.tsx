import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { milkRecords, dairyAnimals } from '@/lib/dairy-data';
import { MilkRecord } from '@/lib/dairy-types';
import { format, startOfDay } from 'date-fns';
import { AddMilkRecordDialog } from './AddMilkRecordDialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MilkProduction: React.FC = () => {
  const [records, setRecords] = useState<MilkRecord[]>(milkRecords);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddRecord = (newRecord: MilkRecord) => {
    setRecords(prevRecords => [newRecord, ...prevRecords].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const chartData = records
    .reduce((acc, record) => {
      const day = format(startOfDay(record.timestamp), 'yyyy-MM-dd');
      const existing = acc.find(item => item.name === day);
      if (existing) {
        existing.volume += record.volume;
      } else {
        acc.push({ name: day, volume: record.volume });
      }
      return acc;
    }, [] as { name: string; volume: number }[])
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  const getAnimalName = (animalId: string) => {
    const animal = dairyAnimals.find(a => a.id === animalId);
    return animal ? animal.name : 'Unknown';
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Milk Production (L)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#10b981" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Milk Production Records</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Record</Button>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="p-2">Date</th>
                  <th className="p-2">Animal</th>
                  <th className="p-2">Volume (L)</th>
                  <th className="p-2">Quality Notes</th>
                  <th className="p-2">Storage Temp (°C)</th>
                <th className="p-2">Photo</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b">
                    <td className="p-2">{format(record.timestamp, 'yyyy-MM-dd HH:mm')}</td>
                    <td className="p-2">{getAnimalName(record.animal_id)} ({record.species})</td>
                    <td className="p-2">{record.volume}</td>
                    <td className="p-2">{record.quality_notes}</td>
                    <td className="p-2">{record.storage_temp}</td>
                  <td className="p-2">
                    {record.photo_url && (
                      <a href={record.photo_url} target="_blank" rel="noopener noreferrer">
                        <img src={record.photo_url} alt="Milk record" className="h-10 w-10 object-cover rounded-md" />
                      </a>
                    )}
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      <AddMilkRecordDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddRecord={handleAddRecord}
      />
    </>
  );
};
