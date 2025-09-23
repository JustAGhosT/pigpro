import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cheeseBatches } from '@/lib/dairy-data';
import { CheeseBatch } from '@/lib/dairy-types';
import { format, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AddCheeseBatchDialog } from './AddCheeseBatchDialog';
import { Progress } from '@/components/ui/progress';

export const CheeseProduction: React.FC = () => {
  const [batches, setBatches] = useState<CheeseBatch[]>(cheeseBatches);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddBatch = (newBatch: CheeseBatch) => {
    setBatches(prevBatches => [newBatch, ...prevBatches]);
  };

  const calculateMaturationProgress = (batch: CheeseBatch) => {
    if (batch.status === 'complete') return 100;
    const daysSinceStart = differenceInDays(new Date(), batch.start_date);
    const progress = (daysSinceStart / batch.expected_aging_time) * 100;
    return Math.min(progress, 100);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'aging':
        return 'default';
      case 'complete':
        return 'secondary';
      case 'inoculation':
        return 'outline';
      case 'pressing':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cheese Production Batches</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Batch</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map(batch => (
              <Card key={batch.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{batch.cheese_type} ({batch.species})</CardTitle>
                      <CardDescription>
                        Started on {format(batch.start_date, 'PPP')}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(batch.status)}>{batch.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-2">
                  <p><strong>Milk Volume:</strong> {batch.milk_volume}L</p>
                  <p><strong>Expected Aging:</strong> {batch.expected_aging_time} days</p>
                  {batch.status === 'aging' && (
                    <div>
                      <p className="text-sm font-medium">Maturation Progress</p>
                      <Progress value={calculateMaturationProgress(batch)} className="w-[60%]" />
                    </div>
                  )}
                  {batch.notes && <p className="mt-2 text-sm text-gray-600"><strong>Notes:</strong> {batch.notes}</p>}
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <AddCheeseBatchDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddBatch={handleAddBatch}
      />
    </>
  );
};
