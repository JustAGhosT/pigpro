import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Animal, Group } from '@my-farm/domain';
import React from 'react';

interface AnimalSelectProps {
  animals: Animal[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const AnimalSelect: React.FC<AnimalSelectProps> = ({
  animals,
  value,
  onValueChange,
  label = "Animal",
  placeholder = "Select an animal...",
  required = false,
}) => {
  return (
    <div>
      <Label htmlFor="animal-select" id="animal-select-label">{label}{required && ' *'}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger 
          id="animal-select"
          aria-labelledby="animal-select-label"
          aria-required={required}
        >
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
      {/* Hidden input for form submission and validation */}
      <input 
        type="hidden" 
        name="animal_id" 
        value={value || ''} 
        required={required}
      />
    </div>
  );
};

interface GroupSelectProps {
  groups: Group[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const GroupSelect: React.FC<GroupSelectProps> = ({
  groups,
  value,
  onValueChange,
  label = "Group",
  placeholder = "Select a group...",
  required = false,
}) => {
  return (
    <div>
      <Label htmlFor="group-select" id="group-select-label">{label}{required && ' *'}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger 
          id="group-select"
          aria-labelledby="group-select-label"
          aria-required={required}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {groups.map(group => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Hidden input for form submission and validation */}
      <input 
        type="hidden" 
        name="group_id" 
        value={value || ''} 
        required={required}
      />
    </div>
  );
};

interface DateFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  label = "Date",
  required = false,
}) => {
  return (
    <div>
      <Label htmlFor="date">{label}{required && ' *'}</Label>
      <Input 
        id="date" 
        type="datetime-local" 
        name="date" 
        value={value} 
        onChange={onChange} 
        required={required}
      />
    </div>
  );
};
