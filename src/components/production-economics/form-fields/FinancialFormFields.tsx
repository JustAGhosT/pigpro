import React from 'react';
import { Category } from '@my-farm/domain';
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

interface FinancialFormFieldsProps {
  categories: Category[];
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  transactionType: 'income' | 'expense';
}

export const FinancialFormFields: React.FC<FinancialFormFieldsProps> = ({
  categories,
  formData,
  onChange,
  onSelectChange,
  transactionType
}) => {
  const filteredCategories = categories.filter(c => c.type === transactionType);

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="datetime-local" name="date" value={formData.date || ''} onChange={onChange} required />
        </div>
        <div>
          <Label htmlFor="category-select">Category</Label>
          <Select name="category_id" onValueChange={(value) => onSelectChange('category_id', value)} value={formData.category_id || ''} required>
            <SelectTrigger id="category-select">
              <SelectValue placeholder={`Select ${transactionType} category...`} />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" name="amount" placeholder="e.g., 150.75" value={formData.amount || ''} onChange={onChange} required />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" type="text" name="currency" placeholder="e.g., USD" value={formData.currency || ''} onChange={onChange} required />
        </div>
        <div>
          <Label htmlFor="vendor_or_buyer">{transactionType === 'expense' ? 'Vendor' : 'Buyer'}</Label>
          <Input id="vendor_or_buyer" type="text" name="vendor_or_buyer" value={formData.vendor_or_buyer || ''} onChange={onChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="memo">Memo / Notes</Label>
        <Textarea id="memo" name="memo" placeholder="Optional notes about the transaction" value={formData.memo || ''} onChange={onChange} />
      </div>
    </div>
  );
};
