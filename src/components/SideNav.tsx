import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  Building2, 
  Building, 
  Eye, 
  Edit3, 
  GitMerge, 
  Settings, 
  Share2, 
  ExternalLink,
  ChevronRight,
  FolderTree
} from 'lucide-react';

interface SideNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeTourName?: string;
}

export const SideNav: React.FC<SideNavProps> = ({ currentView, onNavigate, activeTourName }) => {
  const isTourView = ['editor_360', 'flow_editor', 'tour_settings', 'publication'].includes(currentView);

  return (
    <aside className="w-64 bg-[#f4f4f4] border-r border-[#e0e0e0] flex flex-col fixed top-[48px] bottom-0 left-0 z-40 select-none">
      {/* Header Section */}
      <div className="p-4 border-b border-[#e0e0e0] bg-[#ffffff]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#525252] block">GERENCIAMENTO</span>
        <h2 className="text-sm font-semibold text-[#161616] mt-0.5 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[#0f62fe]" />
          <span>Estate360 Platform</span>
        </h2>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="px-3 py-1">
          <p className="text-[10px] font-mono uppercase text-[#8d8d8d] px-2 mb-1">VISÃO GERAL</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
              currentView === 'dashboard'
                ? 'bg-[#e0e0e0] text-[#0f62fe] font-medium border-l-4 border-[#0f62fe]'
                : 'text-[#393939] hover:bg-[#e8e8e8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-[#525252]" />
              <span>Dashboard</span>
            </div>
          </button>
        </div>

        <div className="px-3 py-1 mt-2">
          <p className="text-[10px] font-mono uppercase text-[#8d8d8d] px-2 mb-1">CADASTROS</p>
          <button
            onClick={() => onNavigate('agencies')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
              currentView === 'agencies'
                ? 'bg-[#e0e0e0] text-[#0f62fe] font-medium border-l-4 border-[#0f62fe]'
                : 'text-[#393939] hover:bg-[#e8e8e8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-[#525252]" />
              <span>Imobiliárias</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('developments')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
              currentView === 'developments'
                ? 'bg-[#e0e0e0] text-[#0f62fe] font-medium border-l-4 border-[#0f62fe]'
                : 'text-[#393939] hover:bg-[#e8e8e8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-[#525252]" />
              <span>Empreendimentos</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('tours_list')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
              currentView === 'tours_list'
                ? 'bg-[#e0e0e0] text-[#0f62fe] font-medium border-l-4 border-[#0f62fe]'
                : 'text-[#393939] hover:bg-[#e8e8e8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#525252]" />
              <span>Lista de Tours 360°</span>
            </div>
          </button>
        </div>

        {/* Active Tour Studio Section */}
        {isTourView && (
          <div className="px-3 py-1 mt-3 border-t border-[#e0e0e0] pt-3 bg-[#f4f4f4]">
            <div className="px-2 mb-2">
              <p className="text-[10px] font-mono uppercase text-[#0f62fe] font-semibold">ESTÚDIO DE TOUR ATIVO</p>
              <p className="text-xs font-medium text-[#161616] truncate mt-0.5">{activeTourName || 'Tour Em Edição'}</p>
            </div>

            <button
              onClick={() => onNavigate('editor_360')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
                currentView === 'editor_360'
                  ? 'bg-[#161616] text-white font-medium border-l-4 border-[#0f62fe]'
                  : 'text-[#393939] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-[#0f62fe]" />
                <span>Editor 360° (Ambientes)</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('flow_editor')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
                currentView === 'flow_editor'
                  ? 'bg-[#161616] text-white font-medium border-l-4 border-[#0f62fe]'
                  : 'text-[#393939] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GitMerge className="w-4 h-4 text-[#0f62fe]" />
                <span>Editor de Fluxo</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('tour_settings')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
                currentView === 'tour_settings'
                  ? 'bg-[#161616] text-white font-medium border-l-4 border-[#0f62fe]'
                  : 'text-[#393939] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#525252]" />
                <span>Dados & SEO</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('publication')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-normal transition-colors ${
                currentView === 'publication'
                  ? 'bg-[#161616] text-white font-medium border-l-4 border-[#0f62fe]'
                  : 'text-[#393939] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-[#198038]" />
                <span>Publicação & Links</span>
              </div>
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Public Reader Quick Access Button */}
      <div className="p-3 border-t border-[#e0e0e0] bg-[#ffffff]">
        <button
          onClick={() => onNavigate('public_viewer')}
          className="carbon-btn-tertiary w-full py-2 px-3 text-xs flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Ver Tour Público</span>
        </button>
      </div>
    </aside>
  );
};
