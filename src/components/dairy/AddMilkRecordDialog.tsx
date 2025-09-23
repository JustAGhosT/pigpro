import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DairyAnimal, MilkRecord, Species } from '@/lib/dairy-types';
import { dairyAnimals } from '@/lib/dairy-data';

interface AddMilkRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MilkRecord) => void;
}

export const AddMilkRecordDialog: React.FC<AddMilkRecordDialogProps> = ({ isOpen, onClose, onAddRecord }) => {
  const [animalId, setAnimalId] = useState<string>(dairyAnimals[0]?.id || '');
  const [volume, setVolume] = useState('');
  const [qualityNotes, setQualityNotes] = useState('');
  const [storageTemp, setStorageTemp] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAnimal = dairyAnimals.find(a => a.id === animalId);
    if (!selectedAnimal) return;

    const newRecord: MilkRecord = {
      id: `milk-${Date.now()}`,
      animal_id: animalId,
      species: selectedAnimal.species,
      timestamp: new Date(),
      volume: parseFloat(volume),
      quality_notes: qualityNotes,
      storage_temp: parseFloat(storageTemp),
      photo_url: photo ? URL.createObjectURL(photo) : undefined,
    };

    onAddRecord(newRecord);
    onClose();
    // Reset form
    setAnimalId(dairyAnimals[0]?.id || '');
    setVolume('');
    setQualityNotes('');
    setStorageTemp('');
    setPhoto(null);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Add Milk Record</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-1">
            Log a new milk production entry.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="animal" className="block text-sm font-medium text-gray-700">Animal</label>
              <select
                id="animal"
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
              >
                {dairyAnimals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} ({animal.species})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700">Volume (Liters)</label>
              <Input id="volume" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="quality_notes" className="block text-sm font-medium text-gray-700">Quality Notes</label>
              <Input id="quality_notes" value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} />
            </div>
            <div>
              <label htmlFor="storage_temp" className="block text-sm font-medium text-gray-700">Storage Temp (°C)</label>
              <Input id="storage_temp" type="number" value={storageTemp} onChange={(e) => setStorageTemp(e.target.value)} />
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
              <Input id="photo" type="file" onChange={handlePhotoChange} accept="image/*" />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Save Record</Button>
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
