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

interface AnimalSelectProps {
  animals: Animal[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  id?: string;
  placeholder?: string;
}

export const AnimalSelect: React.FC<AnimalSelectProps> = ({
  animals,
  value,
  onValueChange,
  label = 'Animal',
  id = 'animal-select',
  placeholder = 'Select an animal...',
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Select name="animal_id" onValueChange={onValueChange} value={value}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
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
);

interface DateFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  label = 'Date',
  id = 'date',
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type="datetime-local" name="date" value={value} onChange={onChange} />
  </div>
);