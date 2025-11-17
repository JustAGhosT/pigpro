import { useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { MainContent } from './components/MainContent';
import { Sidebar } from './components/Sidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, isAuthModalOpen, hideAuthModal, authModalMode, showAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('shopping'); // Default to shopping for non-authenticated users
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGetStarted = () => {
    showAuthModal('signup');
  };

  const handleSignIn = () => {
    showAuthModal('signin');
  };

  // Show landing page only for non-authenticated users who haven't accessed the app yet
  if (!isAuthenticated && activeTab === 'shopping') {
    return (
      <ErrorBoundary>
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={hideAuthModal}
          initialMode={authModalMode}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex min-h-screen">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <main className="flex-1 p-6">
            <MainContent activeTab={activeTab} />
          </main>
        </div>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={hideAuthModal}
          initialMode={authModalMode}
        />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;