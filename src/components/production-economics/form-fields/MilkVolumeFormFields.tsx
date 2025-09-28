import React from 'react';
import { Animal, Group } from '@my-farm/domain';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimalSelect, DateField } from './FormFields';

interface MilkVolumeFormFieldsProps {
  animals: Animal[];
  groups: Group[]; // Can be a group event
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const MilkVolumeFormFields: React.FC<MilkVolumeFormFieldsProps> = ({
  animals,
  groups,
  formData,
  onChange,
  onSelectChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
      <div>
        <Label htmlFor="group-select">Group (Optional)</Label>
        <Select name="group_id" onValueChange={(value) => onSelectChange('group_id', value)} value={formData.group_id || ''}>
          <SelectTrigger id="group-select">
            <SelectValue placeholder="Select a group..." />
          </SelectTrigger>
          <SelectContent>
            {groups.map(group => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimalSelect
        animals={animals}
        value={formData.animal_id || ''}
        onValueChange={(value) => onSelectChange('animal_id', value)}
        label="Animal (Optional)"
      />

      <DateField
        value={formData.date || ''}
        onChange={onChange}
      />

      <div>
        <Label htmlFor="milk_volume">Milk Volume</Label>
        <Input id="milk_volume" type="number" name="milk_volume" placeholder="e.g., 3.5" value={formData.milk_volume || ''} onChange={onChange} required/>
      </div>

      <div>
        <Label htmlFor="milk_unit">Unit</Label>
        <Select name="milk_unit" onValueChange={(value) => onSelectChange('milk_unit', value)} value={formData.milk_unit || ''} required>
          <SelectTrigger id="milk_unit">
            <SelectValue placeholder="Select unit..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Liters (L)</SelectItem>
            <SelectItem value="gal">Gallons (gal)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
