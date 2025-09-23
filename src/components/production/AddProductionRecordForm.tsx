import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductionEvent, ProductionRecord, Species, Group, Animal } from '@/lib/production-types';
import { formatLabel } from '@/lib/utils';

const eventTypes: ProductionEvent[] = [
  'birth', 'death', 'weight', 'egg_count', 'milk_volume', 'sale', 'purchase', 'feed_intake', 'cull', 'treatment', 'transfer', 'grazing_move'
];

interface AddProductionRecordFormProps {
  onRecordAdded: () => void;
}

export const AddProductionRecordForm: React.FC<AddProductionRecordFormProps> = ({ onRecordAdded }) => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [formData, setFormData] = useState<Partial<ProductionRecord>>({
    date: new Date().toISOString().split('T')[0], // Default to today
    event_type: 'weight',
    species_id: '',
    group_id: '',
    animal_id: '',
  });

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch('/api/v1/species');
        const data = await response.json();
        setSpeciesList(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, species_id: data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      }
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    if (!formData.species_id) {
        setGroups([]);
        setAnimals([]);
        return;
    };

    const fetchGroupsAndAnimals = async () => {
        try {
            const groupsResponse = await fetch(`/api/v1/groups?speciesId=${formData.species_id}`);
            const groupsData = await groupsResponse.json();
            setGroups(groupsData);

            const animalsResponse = await fetch(`/api/v1/animals?speciesId=${formData.species_id}`);
            const animalsData = await animalsResponse.json();
            setAnimals(animalsData);
        } catch (error) {
            console.error("Error fetching groups or animals:", error);
        }
    };

    fetchGroupsAndAnimals();
  }, [formData.species_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.species_id) {
      alert('Please select a species.');
      return;
    }

    const payload = {
      ...formData,
      weight_value: formData.weight_value ? Number.parseFloat(formData.weight_value as any) : undefined,
      egg_count: formData.egg_count ? Number.parseInt(formData.egg_count as any, 10) : undefined,
      milk_volume: formData.milk_volume ? Number.parseFloat(formData.milk_volume as any) : undefined,
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
      (e.target as HTMLFormElement).reset();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        event_type: formData.event_type,
        species_id: formData.species_id,
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
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Production Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="species_id">Species</Label>
            <select id="species_id" name="species_id" value={formData.species_id} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option value="" disabled>Select a species</option>
              {speciesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="event_type">Event Type</Label>
            <select id="event_type" name="event_type" value={formData.event_type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              {eventTypes.map(type => (
                <option key={type} value={type}>{formatLabel(type)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="group_id">Group (Optional)</Label>
                <select id="group_id" name="group_id" value={formData.group_id} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" disabled={groups.length === 0}>
                    <option value="">Select a group</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <Label htmlFor="animal_id">Animal (Optional)</Label>
                <select id="animal_id" name="animal_id" value={formData.animal_id} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" disabled={animals.length === 0}>
                    <option value="">Select an animal</option>
                    {animals.map(a => (
                        <option key={a.id} value={a.id}>{a.external_id || a.id}</option>
                    ))}
                </select>
            </div>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="event_type">Event Type</Label>
          <select id="event_type" name="event_type" value={formData.event_type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
            {eventTypes.map(type => (
              <option key={type} value={type}>{formatLabel(type)}</option>
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
