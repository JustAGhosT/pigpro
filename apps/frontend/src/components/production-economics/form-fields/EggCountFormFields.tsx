import React from 'react';
import { Group } from '@my-farm/domain';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormData {
  [key: string]: string | number | undefined;
}

interface EggCountFormFieldsProps {
  groups: Group[];
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const EggCountFormFields: React.FC<EggCountFormFieldsProps> = ({
  groups,
  formData,
  onChange,
  onSelectChange,
}) => {
  // Egg-laying species are typically poultry. We could filter groups by species here.
  // Removing unused variable that was causing lint error
  // const poultryGroups = groups.filter(g => g.species_id === 'your-poultry-species-id');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
      <div>
        <Label htmlFor="group-select">Group</Label>
        <Select name="group_id" onValueChange={(value) => onSelectChange('group_id', value)} value={formData.group_id || ''} required>
          <SelectTrigger id="group-select">
            <SelectValue placeholder="Select a group..." />
          </SelectTrigger>
          <SelectContent>
            {/* Using all groups for now as we don't have the species ID here easily */}
            {groups.map(group => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="datetime-local" name="date" value={formData.date || ''} onChange={onChange} required/>
      </div>

      <div>
        <Label htmlFor="egg_count">Number of Eggs</Label>
        <Input id="egg_count" type="number" name="egg_count" placeholder="e.g., 120" value={formData.egg_count || ''} onChange={onChange} required/>
      </div>
    </div>
  );
};
