import React from 'react';
import { Tour360, Development, ViewMode } from '../types';
import { 
  Eye, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Layers,
  Share2
} from 'lucide-react';

interface ToursListViewProps {
  tours: Tour360[];
  developments: Development[];
  selectedDevId: string;
  onSelectDevId: (devId: string) => void;
  onSelectTourToEdit: (tour: Tour360) => void;
  onTogglePublishTour: (tourId: string) => void;
  onDuplicateTour: (tourId: string) => void;
  onDeleteTour: (tourId: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const ToursListView: React.FC<ToursListViewProps> = ({
  tours,
  developments,
  selectedDevId,
  onSelectDevId,
  onSelectTourToEdit,
  onTogglePublishTour,
  onDuplicateTour,
  onDeleteTour,
  onNavigate,
}) => {
  const currentDev = developments.find((d) => d.id === selectedDevId) || developments[0];
  const devTours = tours.filter((t) => t.developmentId === currentDev?.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">VISUALIZAÇÕES 360°</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Tours Virtuais 360°</h1>
          <p className="text-xs text-[#525252] mt-0.5">Gerencie os cenários imersivos do empreendimento selecionado.</p>
        </div>

        {/* Development Selector */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#c6c6c6] px-3 py-1.5 text-xs text-[#161616] flex items-center gap-2">
            <span className="text-[#525252] font-semibold">Empreendimento:</span>
            <select
              value={currentDev?.id || ''}
              onChange={(e) => onSelectDevId(e.target.value)}
              className="bg-transparent font-medium text-[#161616] outline-none cursor-pointer"
            >
              {developments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (devTours[0]) onSelectTourToEdit(devTours[0]);
              onNavigate('editor_360');
            }}
            className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Visualização 360°</span>
          </button>
        </div>
      </div>

      {/* Single Published Rule Notice */}
      <div className="bg-[#e8f2ff] border-l-4 border-[#0f62fe] p-3 px-4 text-xs text-[#0043ce] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider font-mono text-[10px] bg-[#0f62fe] text-white px-1.5 py-0.5">REGRA DE PUBLICAÇÃO</span>
          <span>Cada empreendimento pode possuir diversas visualizações 360°, porém <strong>apenas uma pode estar publicada</strong> por vez.</span>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white border border-[#c6c6c6]">
        <div className="p-4 border-b border-[#c6c6c6] bg-[#f4f4f4] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#161616]">
            Visualizações para {currentDev?.name} ({devTours.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e0e0e0] border-b border-[#c6c6c6] text-xs text-[#161616] font-semibold">
                <th className="p-3 pl-4">Nome da Visualização</th>
                <th className="p-3">Qtd. Imagens 360°</th>
                <th className="p-3">Data de Criação</th>
                <th className="p-3">Última Atualização</th>
                <th className="p-3">Status</th>
                <th className="p-3">Publicada</th>
                <th className="p-3 text-right pr-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0] text-xs text-[#161616]">
              {devTours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#525252]">
                    Nenhum tour cadastrado para este empreendimento.
                  </td>
                </tr>
              ) : (
                devTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-[#f4f4f4] transition-colors">
                    <td className="p-3 pl-4 font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={tour.coverUrl || tour.images[0]?.thumbnailUrl}
                          alt={tour.name}
                          className="w-12 h-8 object-cover border border-[#c6c6c6]"
                        />
                        <div>
                          <p className="font-semibold text-[#161616]">{tour.name}</p>
                          <p className="text-[11px] text-[#525252] font-mono">{tour.friendlyUrl}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{tour.images.length} cenas 360°</td>
                    <td className="p-3 text-[#525252]">{tour.createdAt}</td>
                    <td className="p-3 text-[#525252]">{tour.updatedAt}</td>
                    <td className="p-3">
                      {tour.isPublished ? (
                        <span className="bg-[#defbe6] text-[#0e6027] px-2 py-0.5 text-[11px] font-medium border border-[#a7f0ba]">
                          Publicada
                        </span>
                      ) : (
                        <span className="bg-[#fef3d6] text-[#8a3800] px-2 py-0.5 text-[11px] font-medium border border-[#fddc9b]">
                          Em Edição
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onTogglePublishTour(tour.id)}
                        className={`px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          tour.isPublished
                            ? 'bg-[#198038] text-white hover:bg-[#116227]'
                            : 'bg-[#e0e0e0] text-[#161616] hover:bg-[#c6c6c6]'
                        }`}
                      >
                        {tour.isPublished ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{tour.isPublished ? 'Publicada' : 'Publicar'}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectTourToEdit(tour);
                            onNavigate('editor_360');
                          }}
                          className="carbon-btn-primary px-2.5 py-1 text-xs flex items-center gap-1"
                          title="Editar Cenas e Hotspots"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => onDuplicateTour(tour.id)}
                          className="carbon-btn-secondary p-1 text-xs"
                          title="Duplicar Tour"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectTourToEdit(tour);
                            onNavigate('publication');
                          }}
                          className="carbon-btn-tertiary p-1 text-xs"
                          title="Gerar Embed e Compartilhar"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTour(tour.id)}
                          className="carbon-btn-danger p-1 text-xs"
                          title="Excluir Tour"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
