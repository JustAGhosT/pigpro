import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Species, Group, Animal, Category } from '@my-farm/domain';
import { WeightFormFields } from './form-fields/WeightFormFields';
import { FinancialFormFields } from './form-fields/FinancialFormFields';
import { MilkVolumeFormFields } from './form-fields/MilkVolumeFormFields';
import { EggCountFormFields } from './form-fields/EggCountFormFields';
import { SimpleEventFormFields } from './form-fields/SimpleEventFormFields';

// A comprehensive list of all possible event types, combining production and financials
const eventTypes = [
  // Production
  { value: 'weight', label: 'Log Weight', type: 'production' },
  { value: 'milk_volume', label: 'Log Milk Volume', type: 'production' },
  { value: 'egg_count', label: 'Log Egg Count', type: 'production' },
  { value: 'birth', label: 'Log Birth', type: 'production' },
  { value: 'death', label: 'Log Death', type: 'production' },
  // Financial
  { value: 'feed_purchase', label: 'Buy Feed', type: 'financial' },
  { value: 'vet_expense', label: 'Vet Expense', type: 'financial' },
  { value: 'animal_sale', label: 'Sell Animal', type: 'financial' },
  { value: 'milk_sale', label: 'Sell Milk', type: 'financial' },
  { value: 'other_income', label: 'Other Income', type: 'financial' },
  { value: 'other_expense', label: 'Other Expense', type: 'financial' },
];

interface FormData {
  animal_id?: string;
  group_id?: string;
  species_id?: string;
  date?: string;
  weight_value?: number;
  weight_unit?: string;
  milk_volume?: number;
  milk_unit?: string;
  egg_count?: number;
  category_id?: string;
  amount?: number;
  currency?: string;
  vendor_or_buyer?: string;
  memo?: string;
  event_type?: string;
  notes?: string;
  [key: string]: string | number | undefined;
}

export const AddRecordForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEventTypeInfo, setSelectedEventTypeInfo] = useState<{ value: string, type: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  // Data states for dropdowns
  const [, setSpecies] = useState<Species[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data for form dropdowns
  useEffect(() => {
    if (showForm) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [speciesRes, groupsRes, animalsRes, categoriesRes] = await Promise.all([
            fetch('/api/v1/species'),
            fetch('/api/v1/groups'),
            fetch('/api/v1/animals'),
            fetch('/api/v1/categories'),
          ]);
          setSpecies(await speciesRes.json());
          setGroups(await groupsRes.json());
          setAnimals(await animalsRes.json());
          setCategories(await categoriesRes.json());
        } catch (error) {
          console.error("Failed to fetch form data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [showForm]);

  const handleEventTypeChange = (value: string) => {
    const eventType = eventTypes.find(et => et.value === value);
    setSelectedEventTypeInfo(eventType || null);
    setFormData({}); // Reset form data on type change
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEventTypeInfo) return;

    setIsSubmitting(true);
    let endpoint = '';
    const payload: FormData = { ...formData };

    if (selectedEventTypeInfo.type === 'production') {
      endpoint = '/api/v1/production-records';
      payload.event_type = selectedEventTypeInfo.value;
      // You might need to find species_id from animal/group
      if(payload.animal_id && !payload.species_id) {
        const animal = animals.find(a => a.id === payload.animal_id);
        if(animal) payload.species_id = animal.species_id;
      }

    } else if (selectedEventTypeInfo.type === 'financial') {
      endpoint = '/api/v1/financial-transactions';
      // Determine if it's income or expense
      const isExpense = selectedEventTypeInfo.value.includes('expense') || selectedEventTypeInfo.value.includes('purchase');
      payload.type = isExpense ? 'expense' : 'income';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to submit record');
      }

      // Success
      setShowForm(false);
      setSelectedEventTypeInfo(null);
      setFormData({});
      // TODO: Implement a notification system to show success/error messages
    } catch (error) {
      console.error('Submission failed:', error);
      // TODO: Implement a notification system to show success/error messages
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderDynamicFields = () => {
    if (!selectedEventTypeInfo) return null;

    switch (selectedEventTypeInfo.value) {
      case 'weight':
        return <WeightFormFields animals={animals} formData={formData} onSelectChange={handleSelectChange} onChange={handleChange} />;

      case 'milk_volume':
        return <MilkVolumeFormFields animals={animals} groups={groups} formData={formData} onSelectChange={handleSelectChange} onChange={handleChange} />;

      case 'egg_count':
        return <EggCountFormFields groups={groups} formData={formData} onSelectChange={handleSelectChange} onChange={handleChange} />;

      case 'birth':
        return <SimpleEventFormFields {...{animals, groups, formData, onChange, onSelectChange}} config={{ showAnimal: true, showQuantity: true, quantityLabel: 'Number of Offspring', showNotes: true }} />;

      case 'death':
      case 'cull':
        return <SimpleEventFormFields {...{animals, groups, formData, onChange, onSelectChange}} config={{ showAnimal: true, showNotes: true }} />;

      case 'treatment':
        return <SimpleEventFormFields {...{animals, groups, formData, onChange, onSelectChange}} config={{ showAnimal: true, showGroup: true, showNotes: true }} />;

      case 'transfer':
      case 'grazing_move':
        return <SimpleEventFormFields {...{animals, groups, formData, onChange, onSelectChange}} config={{ showGroup: true, showNotes: true }} />;

      case 'feed_intake':
        return <SimpleEventFormFields {...{animals, groups, formData, onChange, onSelectChange}} config={{ showGroup: true, showQuantity: true, quantityLabel: 'Feed Amount (kg)', showNotes: true }} />;

      case 'feed_purchase':
      case 'vet_expense':
      case 'other_expense':
        return <FinancialFormFields categories={categories} formData={formData} onSelectChange={handleSelectChange} onChange={handleChange} transactionType="expense" />;

      case 'animal_sale':
      case 'milk_sale':
      case 'other_income':
        return <FinancialFormFields categories={categories} formData={formData} onSelectChange={handleSelectChange} onChange={handleChange} transactionType="income" />;

      // other cases will be added here
      default:
        return <div className="p-4 bg-gray-100 rounded-md my-4">Form fields for '{selectedEventTypeInfo.label}' are not implemented yet.</div>;
    }
  };

  if (!showForm) {
    return <Button onClick={() => setShowForm(true)}>Add New Record</Button>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Add a New Record</h2>
      <div className="space-y-4">
        <Select onValueChange={handleEventTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select record type..." />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map(et => (
              <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLoading && <p>Loading form data...</p>}

        {renderDynamicFields()}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </div>
    </form>
  );
};
