import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheeseBatch, Species } from '@/lib/dairy-types';

interface AddCheeseBatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: CheeseBatch) => void;
}

export const AddCheeseBatchDialog: React.FC<AddCheeseBatchDialogProps> = ({ isOpen, onClose, onAddBatch }) => {
  const [cheeseType, setCheeseType] = useState('');
  const [species, setSpecies] = useState<Species>('goat');
  const [milkVolume, setMilkVolume] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [expectedAgingTime, setExpectedAgingTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBatch: CheeseBatch = {
      id: `batch-${Date.now()}`,
      cheese_type: cheeseType,
      species: species,
      start_date: new Date(),
      milk_volume: parseFloat(milkVolume),
      ingredients: ingredients.split(',').map(item => item.trim()),
      status: 'inoculation',
      expected_aging_time: parseInt(expectedAgingTime),
      aging_conditions: [],
      notes: notes,
    };

    onAddBatch(newBatch);
    onClose();
    // Reset form
    setCheeseType('');
    setSpecies('goat');
    setMilkVolume('');
    setIngredients('');
    setExpectedAgingTime('');
    setNotes('');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Add Cheese Batch</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-1">
            Start a new cheese production batch.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="cheeseType" className="block text-sm font-medium text-gray-700">Cheese Type</label>
              <Input id="cheeseType" value={cheeseType} onChange={(e) => setCheeseType(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
              <select
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value as Species)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
              >
                <option value="goat">Goat</option>
                <option value="cow">Cow</option>
                <option value="sheep">Sheep</option>
              </select>
            </div>
            <div>
              <label htmlFor="milkVolume" className="block text-sm font-medium text-gray-700">Milk Volume (L)</label>
              <Input id="milkVolume" type="number" value={milkVolume} onChange={(e) => setMilkVolume(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients (comma-separated)</label>
              <Input id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
            </div>
            <div>
              <label htmlFor="expectedAgingTime" className="block text-sm font-medium text-gray-700">Expected Aging Time (days)</label>
              <Input id="expectedAgingTime" type="number" value={expectedAgingTime} onChange={(e) => setExpectedAgingTime(e.target.value)} />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Save Batch</Button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
