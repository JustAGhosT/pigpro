import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Animal } from '@my-farm/domain';
import { AnimalSelect, DateField } from './FormFields';
import React from 'react';

interface WeightFormFieldsProps {
  animals: Animal[];
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const WeightFormFields: React.FC<WeightFormFieldsProps> = ({ animals, formData, onChange, onSelectChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
      <AnimalSelect
        animals={animals}
        value={formData.animal_id || ''}
        onValueChange={(value) => onSelectChange('animal_id', value)}
      />

      <DateField
        value={formData.date || ''}
        onChange={onChange}
      />

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
