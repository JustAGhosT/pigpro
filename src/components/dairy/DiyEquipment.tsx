import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { diyPlans } from '@/lib/dairy-data';
import { Download } from 'lucide-react';

export const DiyEquipment: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {diyPlans.map(plan => (
        <Card key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold">Materials:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {plan.materials.map((material, index) => (
                  <li key={`${plan.id}-material-${index}`}>{material}</li>
                ))}
              </ul>
            </div>
            {plan.safety_notes && (
              <div className="mt-4">
                <h4 className="font-semibold">Safety Notes:</h4>
                <p className="text-sm text-gray-600">{plan.safety_notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-gray-500">
              By {plan.author} on {plan.publish_date.toLocaleDateString()}
            </span>
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download Plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
