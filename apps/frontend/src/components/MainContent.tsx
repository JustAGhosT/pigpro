import React from 'react';
import { BreedEncyclopedia } from './BreedEncyclopedia';
import { Community } from './Community';
import { ComplianceCanvas } from './ComplianceCanvas';
import { ErrorBoundary } from './ErrorBoundary';
import { Events } from './Events';
import { LivestockIntelligence } from './LivestockIntelligence';
import { Members } from './Members';
import { News } from './News';
import { Resources } from './Resources';
import { Shopping } from './Shopping';
import { DairyCheeseManagement } from './dairy/DairyCheeseManagement';
import { DashboardPage } from './dashboard/DashboardPage';
import ProductionEconomicsPage from './production-economics/ProductionEconomicsPage';

interface MainContentProps {
  activeTab: string;
}

const renderContent = (activeTab: string) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage />;
    case 'prod-econ':
      return <ProductionEconomicsPage />;
    case 'breeds':
      return <BreedEncyclopedia />;
    case 'shopping':
      return <Shopping />;
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
      return <DashboardPage />;
  }
};

export const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Failed to load {activeTab} page
            </h2>
            <p className="text-red-700">
              There was an error loading this page. Please try refreshing or contact support if the problem persists.
            </p>
          </div>
        </div>
      }
    >
      {renderContent(activeTab)}
    </ErrorBoundary>
  );
};
