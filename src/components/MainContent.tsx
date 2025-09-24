import React from 'react';
import { BreedEncyclopedia } from './BreedEncyclopedia';
import { Events } from './Events';
import { Members } from './Members';
import { Community } from './Community';
import { Resources } from './Resources';
import { News } from './News';
import { ComplianceCanvas } from './ComplianceCanvas';
import { LivestockIntelligence } from './LivestockIntelligence';
import { DairyCheeseManagement } from './dairy/DairyCheeseManagement';
import { DashboardPage } from './dashboard/DashboardPage';
import ProductionEconomicsPage from './production-economics/ProductionEconomicsPage';

interface MainContentProps {
  activeTab: string;
}

export const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage />;
    case 'prod-econ':
      return <ProductionEconomicsPage />;
    case 'breeds':
      return <BreedEncyclopedia />;
    case 'events':
      return <Events />;
    case 'members':
      return <Members />;
    case 'community':
      return <Community />;
    case 'resources':
      return <Resources />;
    case 'news':
      return <News />;
    case 'compliance':
      return <ComplianceCanvas />;
    case 'intelligence':
      return <LivestockIntelligence />;
    case 'dairy':
      return <DairyCheeseManagement />;
    case 'settings':
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        </div>
      );
    default:
      return <Dashboard />;
  }
};
