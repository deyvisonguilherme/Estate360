import React, { useState } from 'react';
import { Agency, Development, Tour360, ViewMode } from '../types';
import { 
  Building2, 
  Building, 
  Eye, 
  Edit3, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  agencies: Agency[];
  developments: Development[];
  tours: Tour360[];
  onNavigate: (view: ViewMode) => void;
  onSelectTourToEdit: (tour: Tour360) => void;
  onSelectDevelopment: (dev: Development) => void;
  onNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  agencies,
  developments,
  tours,
  onNavigate,
  onSelectTourToEdit,
  onSelectDevelopment,
  onNewProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');

  // Stats
  const totalAgencies = agencies.length;
  const totalDevelopments = developments.length;
  const publishedTours = tours.filter((t) => t.isPublished).length;
  const draftTours = tours.filter((t) => !t.isPublished).length;
  const totalImages = tours.reduce((sum, t) => sum + t.images.length, 0);
  const totalLinks = tours.reduce(
    (sum, t) => sum + t.images.reduce((imgSum, img) => imgSum + img.hotspots.length, 0),
    0
  );

  const filteredTours = tours.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.slug.includes(searchTerm.toLowerCase());
    if (selectedStatusFilter === 'publicados') return matchesSearch && t.isPublished;
    if (selectedStatusFilter === 'rascunhos') return matchesSearch && !t.isPublished;
    return matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">DASHBOARD OVERVIEW</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Dashboard de Gestão 360°</h1>
          <p className="text-xs text-[#525252] mt-0.5">Indicadores operacionais de empreendimentos e tours virtuais imobiliários.</p>
        </div>

        <button
          onClick={onNewProject}
          className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Projeto / Tour</span>
        </button>
      </div>

      {/* Carbon Metric Bento Grid Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-l border-[#c6c6c6] bg-white">
        {/* Total Imobiliárias */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Total Imobiliárias</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{totalAgencies}</span>
            <Building2 className="w-5 h-5 text-[#0f62fe] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Total Empreendimentos */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Total Empreendimentos</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{totalDevelopments}</span>
            <Building className="w-5 h-5 text-[#0f62fe] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Visualizações Publicadas */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Publicadas</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{publishedTours}</span>
            <CheckCircle2 className="w-5 h-5 text-[#198038] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Visualizações Em Edição */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Em Edição</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{draftTours}</span>
            <Edit3 className="w-5 h-5 text-[#b28600] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Total Imagens 360 */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Total Imagens 360°</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{totalImages}</span>
            <ImageIcon className="w-5 h-5 text-[#0f62fe] group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Links Publicados / Hotspots */}
        <div className="p-4 border-r border-b border-[#c6c6c6] hover:bg-[#f4f4f4] transition-colors group">
          <p className="text-xs text-[#525252] mb-3 font-normal">Links & Hotspots</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-light text-[#161616]">{totalLinks}</span>
            <LinkIcon className="w-5 h-5 text-[#0f62fe] group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Section: Últimos Projetos Editados (Data Table) */}
      <section className="bg-white border border-[#c6c6c6]">
        <div className="p-4 border-b border-[#c6c6c6] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4f4f4]">
          <div>
            <h2 className="text-sm font-semibold text-[#161616]">Últimos projetos editados</h2>
            <p className="text-xs text-[#525252]">Gerencie os tours virtuais e atualize pontos de hotspot 360°.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar projeto ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="carbon-input text-xs pl-8 pr-3 py-1.5 w-64"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#525252]" />
            </div>

            <div className="flex items-center gap-1 border border-[#c6c6c6] bg-white p-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#525252] ml-1" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-[#161616] outline-none cursor-pointer pr-2"
              >
                <option value="todos">Todos Status</option>
                <option value="publicados">Publicados</option>
                <option value="rascunhos">Em Rascunho</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e0e0e0] border-b border-[#c6c6c6] text-xs text-[#161616] font-semibold">
                <th className="p-3 pl-4">Nome do Tour</th>
                <th className="p-3">Empreendimento Vinculado</th>
                <th className="p-3">Qtd. Imagens 360°</th>
                <th className="p-3">Última Atualização</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0] text-xs text-[#161616]">
              {filteredTours.map((tour) => {
                const dev = developments.find((d) => d.id === tour.developmentId);
                return (
                  <tr key={tour.id} className="hover:bg-[#f4f4f4] transition-colors">
                    <td className="p-3 pl-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={tour.coverUrl || tour.images[0]?.thumbnailUrl}
                          alt={tour.name}
                          className="w-10 h-7 object-cover border border-[#c6c6c6]"
                        />
                        <div>
                          <p className="font-medium text-[#161616]">{tour.name}</p>
                          <p className="text-[11px] text-[#525252] font-mono">{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#525252]">{dev?.name || 'Não vinculado'}</td>
                    <td className="p-3 font-mono">{tour.images.length} cenas</td>
                    <td className="p-3 text-[#525252]">{tour.updatedAt}</td>
                    <td className="p-3">
                      {tour.isPublished ? (
                        <span className="bg-[#defbe6] text-[#0e6027] px-2 py-0.5 text-[11px] font-medium border border-[#a7f0ba]">
                          Publicado
                        </span>
                      ) : (
                        <span className="bg-[#fef3d6] text-[#8a3800] px-2 py-0.5 text-[11px] font-medium border border-[#fddc9b]">
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectTourToEdit(tour)}
                          className="carbon-btn-primary text-xs px-2.5 py-1 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar 360°</span>
                        </button>
                        <button
                          onClick={() => onNavigate('public_viewer')}
                          className="carbon-btn-tertiary p-1"
                          title="Visualizar Tour"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Empreendimentos Recentes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
          <h2 className="text-base font-medium text-[#161616]">Empreendimentos Recentes</h2>
          <button
            onClick={() => onNavigate('developments')}
            className="text-xs text-[#0f62fe] hover:underline flex items-center gap-1"
          >
            <span>Ver todos os empreendimentos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developments.map((dev) => {
            const agency = agencies.find((a) => a.id === dev.agencyId);
            const devTours = tours.filter((t) => t.developmentId === dev.id);

            return (
              <div
                key={dev.id}
                className="bg-white border border-[#c6c6c6] hover:border-[#0f62fe] transition-all flex flex-col group cursor-pointer"
                onClick={() => onSelectDevelopment(dev)}
              >
                <div className="relative h-40 bg-[#161616] overflow-hidden">
                  <img
                    src={dev.coverUrl}
                    alt={dev.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#161616]/80 backdrop-blur-sm text-white px-2 py-0.5 text-[11px] font-mono border border-white/20">
                    {dev.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0f62fe] text-white px-2 py-0.5 text-[11px] font-medium">
                    {dev.status}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] text-[#0f62fe] font-medium uppercase tracking-wider">{agency?.name}</p>
                    <h3 className="text-sm font-semibold text-[#161616] mt-0.5">{dev.name}</h3>
                    <p className="text-xs text-[#525252] mt-1 line-clamp-2">{dev.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between text-xs text-[#525252]">
                    <span className="font-mono">{dev.city}, {dev.state}</span>
                    <span className="bg-[#f4f4f4] px-2 py-0.5 font-medium text-[#161616]">
                      {devTours.length} Tours
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
