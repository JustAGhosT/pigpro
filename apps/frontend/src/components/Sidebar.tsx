import { LIVESTOCK_DATA as FALLBACK_LIVESTOCK } from '@/lib/livestock-data';
import {
  BookOpen,
  Brain,
  Calendar,
  FileText,
  Home,
  LeafyGreen,
  MessageCircle,
  Newspaper,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// NOTE: This is a mock implementation based on the available mock data.
// In a real application, this would check the current user's animals.
const hasDairyAnimalsFactory = (data: any) => () => data?.cattle?.breeds?.dairy?.length > 0;

const getMenuItems = (hasDairy: boolean) => [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'prod-econ', label: 'Prod & Econ', icon: TrendingUp },
  { id: 'breeds', label: 'Breed Database', icon: BookOpen },
  { id: 'shopping', label: 'Marketplace', icon: ShoppingCart },
  ...(hasDairy ? [{ id: 'dairy', label: 'Dairy & Cheese', icon: LeafyGreen }] : []),
  { id: 'intelligence', label: 'Livestock Intelligence', icon: Brain },
  { id: 'events', label: 'Events & Shows', icon: Calendar },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'compliance', label: 'Compliance Canvas', icon: Shield },
  { id: 'community', label: 'Community', icon: MessageCircle },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'news', label: 'News & Updates', icon: Newspaper },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const [livestockData, setLivestockData] = useState<any>(FALLBACK_LIVESTOCK);

  useEffect(() => {
    fetch('/api/v1/livestock')
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((json) => setLivestockData(json))
      .catch(() => setLivestockData(FALLBACK_LIVESTOCK));
  }, []);
  const hasDairyAnimals = hasDairyAnimalsFactory(livestockData);
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden w-full h-full"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-gray-900">Livestock Club SA</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" title="Close sidebar">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {getMenuItems(hasDairyAnimals()).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeTab === item.id
                      ? 'bg-green-100 text-green-800 border-l-4 border-green-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};