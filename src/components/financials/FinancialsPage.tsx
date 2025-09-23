import React, { useState, useEffect, useCallback } from 'react';
import { FinancialTransaction } from '@/lib/production-types'; // Assuming types will be added here
import { formatLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddTransactionForm } from './AddTransactionForm';

export const FinancialsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/financial-transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch financial transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionAdded = () => {
    fetchTransactions();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Financials</h1>
            <p className="text-gray-600 mt-1">Track income and expenses across your farm.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>Add Transaction</Button>
      </div>

      {showAddForm && <AddTransactionForm onTransactionAdded={handleTransactionAdded} />}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Transactions</h2>
        {isLoading && <p>Loading transactions...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && transactions.length === 0 && (
          <p className="text-center text-gray-500">No financial records found.</p>
        )}
        {!isLoading && !error && transactions.length > 0 && (
          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <span className={`font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{formatLabel(t.type)}</span>
                  <span className="text-sm text-gray-600 ml-2">({new Date(t.date).toLocaleDateString()})</span>
                  <p className="text-sm text-gray-800">{t.memo}</p>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: t.currency }).format(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
