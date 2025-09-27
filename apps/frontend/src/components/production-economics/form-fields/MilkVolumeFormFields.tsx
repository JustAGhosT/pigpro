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
import { AnimalSelect, DateField, GroupSelect } from './FormFields';

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
      <GroupSelect
        groups={groups}
        value={formData.group_id || ''}
        onValueChange={(value) => onSelectChange('group_id', value)}
        label="Group (Optional)"
      />

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
        <Label htmlFor="milk_unit" id="milk_unit-label">Unit</Label>
        <Select onValueChange={(value) => onSelectChange('milk_unit', value)} value={formData.milk_unit || ''}>
          <SelectTrigger 
            id="milk_unit"
            aria-labelledby="milk_unit-label"
            aria-required="true"
          >
            <SelectValue placeholder="Select unit..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Liters (L)</SelectItem>
            <SelectItem value="gal">Gallons (gal)</SelectItem>
          </SelectContent>
        </Select>
        {/* Hidden input for form submission and validation */}
        <input 
          type="hidden" 
          name="milk_unit" 
          value={formData.milk_unit || ''} 
          required 
        />
      </div>
    </div>
  );
};
