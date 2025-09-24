import React from 'react';
import { Animal } from '@my-farm/domain';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WeightFormFieldsProps {
  animals: Animal[];
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const WeightFormFields: React.FC<WeightFormFieldsProps> = ({ animals, formData, onChange, onSelectChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
      <div>
        <Label htmlFor="animal-select">Animal</Label>
        <Select name="animal_id" onValueChange={(value) => onSelectChange('animal_id', value)} value={formData.animal_id || ''}>
          <SelectTrigger id="animal-select">
            <SelectValue placeholder="Select an animal..." />
          </SelectTrigger>
          <SelectContent>
            {animals.map(animal => (
              <SelectItem key={animal.id} value={animal.id}>
                {animal.external_id || `(ID: ${animal.id.substring(0, 6)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="datetime-local" name="date" value={formData.date || ''} onChange={onChange} />
      </div>

      <div>
        <Label htmlFor="weight_value">Weight</Label>
        <Input id="weight_value" type="number" name="weight_value" placeholder="e.g., 55.5" value={formData.weight_value || ''} onChange={onChange} />
      </div>

      <div>
        <Label htmlFor="weight_unit">Unit</Label>
        <Select name="weight_unit" onValueChange={(value) => onSelectChange('weight_unit', value)} value={formData.weight_unit || ''}>
          <SelectTrigger id="weight_unit">
            <SelectValue placeholder="Select unit..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">Kilograms (kg)</SelectItem>
            <SelectItem value="lb">Pounds (lb)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
