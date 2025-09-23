import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category, FinancialTransaction } from '@/lib/production-types';

interface AddTransactionFormProps {
  onTransactionAdded: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onTransactionAdded }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<FinancialTransaction>>({
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    currency: 'USD', // Default currency
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/categories');
        const data = await response.json();
        setCategories(data);
        // Set a default category if available
        const defaultCategory = data.find(c => c.type === formData.type);
        if (defaultCategory) {
          setFormData(prev => ({ ...prev, category_id: defaultCategory.id }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [formData.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_id || !formData.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      amount: Number.parseFloat(formData.amount as any),
    };

    try {
      const response = await fetch('/api/v1/financial-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      alert('Transaction saved!');
      onTransactionAdded();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 my-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="type">Type</Label>
                <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>
            <div>
                <Label htmlFor="category_id">Category</Label>
                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" disabled={filteredCategories.length === 0}>
                    <option value="">Select a category</option>
                    {filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" onChange={handleInputChange} />
            </div>
            <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
            </div>
        </div>
        <div>
          <Label htmlFor="memo">Memo / Description</Label>
          <Input id="memo" name="memo" type="text" onChange={handleInputChange} />
        </div>
        <Button type="submit">Save Transaction</Button>
      </form>
    </div>
  );
};
