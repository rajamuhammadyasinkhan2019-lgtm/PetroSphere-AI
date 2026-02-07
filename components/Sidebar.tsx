
import React from 'react';
import { Database, Map, Microscope, BookOpen, MessageSquare, ChevronRight, Eye } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'lab' | 'microscope' | 'map' | 'knowledge' | 'chat';
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Database },
    { id: 'lab', label: 'Petro Synthesis', icon: Microscope },
    { id: 'microscope', label: 'Virtual Microscope', icon: Eye },
    { id: 'map', label: 'Field Explorer', icon: Map },
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'chat', label: 'AI Petro-Assistant', icon: MessageSquare },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Database className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-serif text-2xl tracking-tight">PetroSphere</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Advanced Petrology Suite</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                  ${activeTab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "Petrology is the record of the Earth's thermal and chemical history."
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
