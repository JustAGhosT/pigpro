import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MilkProduction } from './MilkProduction';
import { DiyEquipment } from './DiyEquipment';
import { CheeseProduction } from './CheeseProduction';
import { RecipeLibrary } from './RecipeLibrary';

type DairyTab = 'milk' | 'cheese' | 'diy' | 'recipes';

export const DairyCheeseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DairyTab>('milk');

  const renderContent = () => {
    switch (activeTab) {
      case 'milk':
        return <MilkProduction />;
      case 'cheese':
        return <CheeseProduction />;
      case 'diy':
        return <DiyEquipment />;
      case 'recipes':
        return <RecipeLibrary />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dairy & Cheese Management</h1>
        <p className="text-gray-600 mt-1">
          Track milk production, manage cheese making, and find DIY plans.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'milk' ? 'default' : 'outline'}
                onClick={() => setActiveTab('milk')}
              >
                Milk Production
              </Button>
              <Button
                variant={activeTab === 'cheese' ? 'default' : 'outline'}
                onClick={() => setActiveTab('cheese')}
              >
                Cheese Production
              </Button>
              <Button
                variant={activeTab === 'diy' ? 'default' : 'outline'}
                onClick={() => setActiveTab('diy')}
              >
                DIY Plans
              </Button>
               <Button
                variant={activeTab === 'recipes' ? 'default' : 'outline'}
                onClick={() => setActiveTab('recipes')}
              >
                Recipes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
