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
import { Textarea } from '@/components/ui/textarea';

interface SimpleEventFormFieldsProps {
  animals: Animal[];
  groups: Group[];
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  config: {
    // Defines what fields to show for the specific simple event
    showAnimal?: boolean;
    showGroup?: boolean;
    showQuantity?: boolean;
    quantityLabel?: string;
    showNotes?: boolean;
  }
}

export const SimpleEventFormFields: React.FC<SimpleEventFormFieldsProps> = ({
  animals,
  groups,
  formData,
  onChange,
  onSelectChange,
  config,
}) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.showGroup && (
          <div>
            <Label htmlFor="group-select">Group</Label>
            <Select name="group_id" onValueChange={(value) => onSelectChange('group_id', value)} value={formData.group_id || ''}>
              <SelectTrigger id="group-select"><SelectValue placeholder="Select a group..." /></SelectTrigger>
              <SelectContent>{groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        {config.showAnimal && (
          <div>
            <Label htmlFor="animal-select">Animal</Label>
            <Select name="animal_id" onValueChange={(value) => onSelectChange('animal_id', value)} value={formData.animal_id || ''}>
              <SelectTrigger id="animal-select"><SelectValue placeholder="Select an animal..." /></SelectTrigger>
              <SelectContent>{animals.map(a => <SelectItem key={a.id} value={a.id}>{a.external_id || `(ID: ${a.id.substring(0,6)})`}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="datetime-local" name="date" value={formData.date || ''} onChange={onChange} required/>
        </div>
        {config.showQuantity && (
          <div>
            <Label htmlFor="quantity">{config.quantityLabel || 'Quantity'}</Label>
            <Input id="quantity" type="number" name="quantity" value={formData.quantity || ''} onChange={onChange} />
          </div>
        )}
      </div>
      {config.showNotes && (
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" placeholder="Optional notes..." value={formData.notes || ''} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
