import React from 'react';
import { ViewMode, Agency } from '../types';
import { Building2, Compass, Bell, HelpCircle, Layers, Plus } from 'lucide-react';

interface HeaderTopBarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  selectedAgency: Agency | null;
  agencies: Agency[];
  onSelectAgency: (agency: Agency) => void;
  onNewProject: () => void;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  currentView,
  onNavigate,
  selectedAgency,
  agencies,
  onSelectAgency,
  onNewProject,
}) => {
  return (
    <header className="bg-[#161616] text-white h-[48px] border-b border-[#393939] px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 select-none">
      <div className="flex items-center gap-6">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="bg-[#0f62fe] p-1 text-white">
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </div>
          <span className="font-semibold text-base tracking-tight font-sans text-white">Estate360</span>
          <span className="text-[10px] bg-[#393939] text-[#c6c6c6] px-1.5 py-0.5 tracking-wider font-mono">CARBON</span>
        </div>

        <div className="h-5 w-px bg-[#393939]" />

        {/* Global Nav Bar */}
        <nav className="hidden md:flex items-center gap-1 h-[48px]">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 text-xs font-normal h-full flex items-center border-b-2 transition-colors ${
              currentView === 'dashboard'
                ? 'border-[#0f62fe] text-white font-medium bg-[#262626]'
                : 'border-transparent text-[#c6c6c6] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('agencies')}
            className={`px-3 text-xs font-normal h-full flex items-center border-b-2 transition-colors ${
              currentView === 'agencies'
                ? 'border-[#0f62fe] text-white font-medium bg-[#262626]'
                : 'border-transparent text-[#c6c6c6] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Imobiliárias
          </button>
          <button
            onClick={() => onNavigate('developments')}
            className={`px-3 text-xs font-normal h-full flex items-center border-b-2 transition-colors ${
              currentView === 'developments'
                ? 'border-[#0f62fe] text-white font-medium bg-[#262626]'
                : 'border-transparent text-[#c6c6c6] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Empreendimentos
          </button>
          <button
            onClick={() => onNavigate('tours_list')}
            className={`px-3 text-xs font-normal h-full flex items-center border-b-2 transition-colors ${
              currentView === 'tours_list' || currentView === 'editor_360' || currentView === 'flow_editor'
                ? 'border-[#0f62fe] text-white font-medium bg-[#262626]'
                : 'border-transparent text-[#c6c6c6] hover:text-white hover:bg-[#262626]'
            }`}
          >
            Tours 360°
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Agency Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-2 bg-[#262626] border border-[#393939] px-2.5 py-1 text-xs text-[#c6c6c6]">
          <Building2 className="w-3.5 h-3.5 text-[#78a9ff]" />
          <select
            value={selectedAgency?.id || ''}
            onChange={(e) => {
              const found = agencies.find((a) => a.id === e.target.value);
              if (found) onSelectAgency(found);
            }}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
          >
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id} className="bg-[#161616] text-white">
                {agency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick New Tour Button */}
        <button
          onClick={onNewProject}
          className="carbon-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-[#0353e9]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Criar Novo Tour</span>
        </button>

        <div className="h-4 w-px bg-[#393939]" />

        <button className="p-1.5 text-[#c6c6c6] hover:text-white hover:bg-[#262626] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[#c6c6c6] hover:text-white hover:bg-[#262626] transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Tile */}
        <div className="w-7 h-7 bg-[#0f62fe] text-white flex items-center justify-center font-semibold text-xs border border-white/20">
          ES
        </div>
      </div>
    </header>
  );
};
