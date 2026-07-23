import React, { useState } from 'react';
import { ViewMode, Agency, Development, Tour360 } from './types';
import { initialAgencies, initialDevelopments, initialTours } from './data/mockData';
import { HeaderTopBar } from './components/HeaderTopBar';
import { SideNav } from './components/SideNav';
import { DashboardView } from './views/DashboardView';
import { AgenciesView } from './views/AgenciesView';
import { DevelopmentsView } from './views/DevelopmentsView';
import { ToursListView } from './views/ToursListView';
import { Editor360View } from './views/Editor360View';
import { FlowEditorView } from './views/FlowEditorView';
import { TourSettingsView } from './views/TourSettingsView';
import { PublicationView } from './views/PublicationView';
import { PublicTourViewer } from './views/PublicTourViewer';
import { X, Plus } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Core App Data State
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [developments, setDevelopments] = useState<Development[]>(initialDevelopments);
  const [tours, setTours] = useState<Tour360[]>(initialTours);

  // Selection state
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(initialAgencies[0]?.id || '');
  const [selectedDevId, setSelectedDevId] = useState<string>(initialDevelopments[0]?.id || '');
  const [activeTourId, setActiveTourId] = useState<string>(initialTours[0]?.id || '');

  // New Tour Modal State
  const [isNewTourModalOpen, setIsNewTourModalOpen] = useState(false);
  const [newTourName, setNewTourName] = useState('');
  const [newTourDevId, setNewTourDevId] = useState(initialDevelopments[0]?.id || '');

  const selectedAgency = agencies.find((a) => a.id === selectedAgencyId) || agencies[0];
  const selectedDevelopment = developments.find((d) => d.id === selectedDevId) || developments[0];
  const activeTour = tours.find((t) => t.id === activeTourId) || tours[0];

  // Handler: Save Agency
  const handleSaveAgency = (agencyToSave: Agency) => {
    setAgencies((prev) => {
      const exists = prev.some((a) => a.id === agencyToSave.id);
      if (exists) {
        return prev.map((a) => (a.id === agencyToSave.id ? agencyToSave : a));
      }
      return [...prev, agencyToSave];
    });
  };

  // Handler: Delete Agency
  const handleDeleteAgency = (agencyId: string) => {
    setAgencies((prev) => prev.filter((a) => a.id !== agencyId));
    setDevelopments((prev) => prev.filter((d) => d.agencyId !== agencyId));
  };

  // Handler: Save Development
  const handleSaveDevelopment = (devToSave: Development) => {
    setDevelopments((prev) => {
      const exists = prev.some((d) => d.id === devToSave.id);
      if (exists) {
        return prev.map((d) => (d.id === devToSave.id ? devToSave : d));
      }
      return [...prev, devToSave];
    });
  };

  // Handler: Delete Development
  const handleDeleteDevelopment = (devId: string) => {
    setDevelopments((prev) => prev.filter((d) => d.id !== devId));
    setTours((prev) => prev.filter((t) => t.developmentId !== devId));
  };

  // Handler: Save / Update Tour
  const handleSaveTour = (updatedTour: Tour360) => {
    setTours((prev) => prev.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
  };

  // Handler: Enforce Single Published Tour per Development Rule
  const handleTogglePublishTour = (tourId: string) => {
    const targetTour = tours.find((t) => t.id === tourId);
    if (!targetTour) return;

    const newPublishState = !targetTour.isPublished;

    setTours((prev) =>
      prev.map((t) => {
        if (t.id === tourId) {
          return { ...t, isPublished: newPublishState };
        }
        // If we are publishing this tour, unpublish all other tours for the SAME development
        if (newPublishState && t.developmentId === targetTour.developmentId) {
          return { ...t, isPublished: false };
        }
        return t;
      })
    );
  };

  // Handler: Duplicate Tour
  const handleDuplicateTour = (tourId: string) => {
    const original = tours.find((t) => t.id === tourId);
    if (!original) return;

    const duplicated: Tour360 = {
      ...original,
      id: `tour-${Date.now()}`,
      name: `${original.name} (Cópia)`,
      slug: `${original.slug}-copia-${Date.now().toString().slice(-4)}`,
      friendlyUrl: `${original.friendlyUrl}-copia`,
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setTours((prev) => [...prev, duplicated]);
    setActiveTourId(duplicated.id);
  };

  // Handler: Delete Tour
  const handleDeleteTour = (tourId: string) => {
    setTours((prev) => prev.filter((t) => t.id !== tourId));
  };

  // Create New Tour Modal Submit
  const handleCreateNewTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTourName) return;

    const dev = developments.find((d) => d.id === newTourDevId) || developments[0];
    const newTour: Tour360 = {
      id: `tour-${Date.now()}`,
      developmentId: dev.id,
      name: newTourName,
      description: `Tour virtual interativo 360° para ${dev.name}.`,
      slug: newTourName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      friendlyUrl: `https://360.estate360.com.br/tour/${newTourName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      address: dev.address,
      zipCode: '04538-132',
      city: dev.city,
      state: dev.state,
      country: 'Brasil',
      lat: dev.lat,
      lng: dev.lng,
      coverUrl: dev.coverUrl,
      thumbnailUrl: dev.coverUrl,
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      images: [
        {
          id: `img-${Date.now()}-1`,
          tourId: `tour-${Date.now()}`,
          name: 'Sala de Estar Ampliada',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
          order: 1,
          hotspots: []
        }
      ]
    };

    setTours((prev) => [...prev, newTour]);
    setActiveTourId(newTour.id);
    setSelectedDevId(dev.id);
    setIsNewTourModalOpen(false);
    setNewTourName('');
    setCurrentView('editor_360');
  };

  // If in Public Fullscreen Viewer Mode
  if (currentView === 'public_viewer' && activeTour) {
    const dev = developments.find((d) => d.id === activeTour.developmentId);
    const agency = agencies.find((a) => a.id === dev?.agencyId);

    return (
      <PublicTourViewer
        tour={activeTour}
        agency={agency}
        development={dev}
        onExitViewer={() => setCurrentView('editor_360')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#161616] font-sans antialiased">
      {/* Top Carbon Header Bar */}
      <HeaderTopBar
        currentView={currentView}
        onNavigate={setCurrentView}
        selectedAgency={selectedAgency}
        agencies={agencies}
        onSelectAgency={(agency) => setSelectedAgencyId(agency.id)}
        onNewProject={() => setIsNewTourModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex pt-[48px]">
        {/* Carbon Side Navigation Drawer */}
        <SideNav
          currentView={currentView}
          onNavigate={setCurrentView}
          activeTourName={activeTour?.name}
        />

        {/* Content View Container */}
        <main className="flex-1 ml-64 min-h-[calc(100vh-48px)]">
          {currentView === 'dashboard' && (
            <DashboardView
              agencies={agencies}
              developments={developments}
              tours={tours}
              onNavigate={setCurrentView}
              onSelectTourToEdit={(tour) => {
                setActiveTourId(tour.id);
                setCurrentView('editor_360');
              }}
              onSelectDevelopment={(dev) => {
                setSelectedDevId(dev.id);
                setCurrentView('tours_list');
              }}
              onNewProject={() => setIsNewTourModalOpen(true)}
            />
          )}

          {currentView === 'agencies' && (
            <AgenciesView
              agencies={agencies}
              developments={developments}
              onSaveAgency={handleSaveAgency}
              onDeleteAgency={handleDeleteAgency}
            />
          )}

          {currentView === 'developments' && (
            <DevelopmentsView
              developments={developments}
              agencies={agencies}
              onSaveDevelopment={handleSaveDevelopment}
              onDeleteDevelopment={handleDeleteDevelopment}
            />
          )}

          {currentView === 'tours_list' && (
            <ToursListView
              tours={tours}
              developments={developments}
              selectedDevId={selectedDevId}
              onSelectDevId={setSelectedDevId}
              onSelectTourToEdit={(tour) => {
                setActiveTourId(tour.id);
                setCurrentView('editor_360');
              }}
              onTogglePublishTour={handleTogglePublishTour}
              onDuplicateTour={handleDuplicateTour}
              onDeleteTour={handleDeleteTour}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'editor_360' && activeTour && (
            <Editor360View
              tour={activeTour}
              onSaveTour={handleSaveTour}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'flow_editor' && activeTour && (
            <FlowEditorView
              tour={activeTour}
              onSaveTour={handleSaveTour}
              onNavigate={setCurrentView}
              onSelectImageToEdit={() => setCurrentView('editor_360')}
            />
          )}

          {currentView === 'tour_settings' && activeTour && (
            <TourSettingsView
              tour={activeTour}
              developments={developments}
              onSaveTour={handleSaveTour}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'publication' && activeTour && (
            <PublicationView
              tour={activeTour}
              onTogglePublishTour={handleTogglePublishTour}
              onNavigate={setCurrentView}
            />
          )}
        </main>
      </div>

      {/* Carbon Modal: Create New Tour */}
      {isNewTourModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#393939] w-full max-w-lg shadow-2xl space-y-4">
            <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#393939]">
              <h3 className="text-sm font-semibold tracking-wide">Criar Novo Tour Virtual 360°</h3>
              <button onClick={() => setIsNewTourModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTourSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#525252] font-semibold">Empreendimento Destino *</label>
                <select
                  value={newTourDevId}
                  onChange={(e) => setNewTourDevId(e.target.value)}
                  className="carbon-input w-full p-2.5 bg-white"
                >
                  {developments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#525252] font-semibold">Nome da Visualização 360° *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Apartamento Decorado - Planta 120m²"
                  value={newTourName}
                  onChange={(e) => setNewTourName(e.target.value)}
                  className="carbon-input w-full p-2.5"
                />
              </div>

              <div className="p-3 bg-[#e8f2ff] border-l-4 border-[#0f62fe] text-xs text-[#0043ce]">
                <p>O projeto será inicializado com um ambiente padrão 360° pronto para edição de hotspots e navegação.</p>
              </div>

              <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTourModalOpen(false)}
                  className="carbon-btn-secondary px-4 py-2 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="carbon-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Iniciar Estúdio 360°</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
