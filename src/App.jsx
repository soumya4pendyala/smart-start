import { useState } from 'react';
import Chatbot from './Components/Chatbot/Chatbot';
import CabBookingModal from './Components/CabBookingModal';
import ITTicketModal from './Components/ITTicketModal';
import Dashboard from './Pages/Dashboard/Dashboard';
import TeamDirectory from './Pages/TeamDirectory';
import DocumentHub from './Pages/DocumentHub';
import OnboardingChecklistPage from './Pages/OnboardingChecklistPage';
import SettingsPage from './Pages/SettingsPage';
import Sidebar from './Components/Sidebar';


// Mock Data - In a real application, this would come from an API



// Main App Component
export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [showCabModal, setShowCabModal] = useState(false);
  const [showITModal, setShowITModal] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Dashboard />;
      case 'team':
        return <TeamDirectory />;
      case 'docs':
        return <DocumentHub />;
      // For simplicity, 'tasks' and 'settings' can show the dashboard or a placeholder
      case 'tasks':
         return <OnboardingChecklistPage />;
      case 'settings':
         return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 mx-auto">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {renderPage()}
      </main>
      <Chatbot 
        openCabModal={() => setShowCabModal(true)}
        openITModal={() => setShowITModal(true)}
      />
      {showCabModal && <CabBookingModal closeModal={() => setShowCabModal(false)} />}
      {showITModal && <ITTicketModal closeModal={() => setShowITModal(false)} />}
    </div>
  );
}

// Sidebar Navigation





