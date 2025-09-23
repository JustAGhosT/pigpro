import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductionEvent, ProductionRecord } from '@/lib/production-types';

const eventTypes: ProductionEvent[] = [
  'birth', 'death', 'weight', 'egg_count', 'milk_volume', 'sale', 'purchase', 'feed_intake', 'cull', 'treatment', 'transfer', 'grazing_move'
];

interface AddProductionRecordFormProps {
  onRecordAdded: () => void;
}

export const AddProductionRecordForm: React.FC<AddProductionRecordFormProps> = ({ onRecordAdded }) => {
  const [formData, setFormData] = useState<Partial<ProductionRecord>>({
    date: new Date().toISOString().split('T')[0], // Default to today
    event_type: 'weight',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      // Convert number fields from string to number
      weight_value: formData.weight_value ? parseFloat(formData.weight_value as any) : undefined,
      egg_count: formData.egg_count ? parseInt(formData.egg_count as any, 10) : undefined,
      milk_volume: formData.milk_volume ? parseFloat(formData.milk_volume as any) : undefined,
      // TODO: Add species_id, group_id, etc. from component props or state
      species_id: '1', // Hardcoded for now
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch('/api/v1/production-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create record');
      }

      const newRecord = await response.json();
      console.log('Record created successfully:', newRecord);
      alert('Production record saved!');
      onRecordAdded();
      // A simple reset, might need to be more sophisticated
      (e.target as HTMLFormElement).reset();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        event_type: formData.event_type,
      });

    } catch (error) {
      console.error('Error creating production record:', error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const renderDynamicFields = () => {
    switch (formData.event_type) {
      case 'weight':
        return (
          <>
            <div>
              <Label htmlFor="weight_value">Weight</Label>
              <Input id="weight_value" name="weight_value" type="number" step="0.1" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="weight_unit">Unit</Label>
              <select id="weight_unit" name="weight_unit" value={formData.weight_unit || 'kg'} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </>
        );
      case 'egg_count':
        return (
          <div>
            <Label htmlFor="egg_count">Egg Count</Label>
            <Input id="egg_count" name="egg_count" type="number" onChange={handleInputChange} />
          </div>
        );
      case 'milk_volume':
        return (
          <>
            <div>
              <Label htmlFor="milk_volume">Milk Volume</Label>
              <Input id="milk_volume" name="milk_volume" type="number" step="0.1" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="milk_unit">Unit</Label>
              <select id="milk_unit" name="milk_unit" value={formData.milk_unit || 'L'} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option value="L">Liters</option>
                <option value="gal">Gallons</option>
              </select>
            </div>
          </>
        );
      // Add more cases for other event types here...
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Production Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="event_type">Event Type</Label>
          <select id="event_type" name="event_type" value={formData.event_type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
            {eventTypes.map(type => (
              <option key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>

        {renderDynamicFields()}

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" name="notes" type="text" onChange={handleInputChange} />
        </div>

        <Button type="submit">Save Record</Button>
      </form>
    </div>
  );
};
