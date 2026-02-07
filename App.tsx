
import React, { useState, useEffect } from 'react';
import { RockType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RockLab from './components/RockLab';
import MapExplorer from './components/MapExplorer';
import KnowledgeHub from './components/KnowledgeHub';
import ChatBot from './components/ChatBot';
import VirtualMicroscope from './components/VirtualMicroscope';
import { Menu, X, Database, Map, Microscope, BookOpen, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lab' | 'microscope' | 'map' | 'knowledge' | 'chat'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-500" />
          <span className="font-serif text-xl">PetroSphere AI</span>
        </div>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto mt-16 lg:mt-0 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'lab' && <RockLab />}
          {activeTab === 'microscope' && <VirtualMicroscope />}
          {activeTab === 'map' && <MapExplorer />}
          {activeTab === 'knowledge' && <KnowledgeHub />}
          {activeTab === 'chat' && <ChatBot />}
        </div>
      </main>

      {/* Footer Credits */}
      <div className="fixed bottom-0 right-0 p-4 text-xs text-slate-500 pointer-events-none">
        Concept & Lead Geologist: Muhammad Yasin Khan
      </div>
    </div>
  );
};

export default App;
