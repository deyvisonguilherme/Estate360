import React, { useState } from 'react';
import { Tour360, Development, ViewMode } from '../types';
import { Settings, Save, ChevronRight, Globe, MapPin, Search, Image as ImageIcon, Check } from 'lucide-react';

interface TourSettingsViewProps {
  tour: Tour360;
  developments: Development[];
  onSaveTour: (updatedTour: Tour360) => void;
  onNavigate: (view: ViewMode) => void;
}

export const TourSettingsView: React.FC<TourSettingsViewProps> = ({
  tour,
  developments,
  onSaveTour,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<Tour360>(tour);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTour(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">DADOS ESTÁTICOS & SEO</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Configurações da Visualização 360°</h1>
          <p className="text-xs text-[#525252] mt-0.5">Defina os parâmetros estáticos, localização geográfica e otimização para mecanismos de busca.</p>
        </div>

        {isSaved && (
          <div className="bg-[#defbe6] text-[#0e6027] border border-[#a7f0ba] px-3 py-1.5 text-xs font-mono flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0f62fe]" />
            <span>Informações Principais do Tour</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[#525252] font-semibold">Nome da Visualização *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">Slug (URL Identificadora)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="carbon-input w-full p-2.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">URL Amigável Pública</label>
              <input
                type="text"
                required
                value={formData.friendlyUrl}
                onChange={(e) => setFormData({ ...formData, friendlyUrl: e.target.value })}
                className="carbon-input w-full p-2.5 font-mono"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#525252] font-semibold">Descrição Comercial do Tour</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Geographic Location */}
        <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0f62fe]" />
            <span>Localização Geográfica</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[#525252] font-semibold">Endereço Completo</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">CEP</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="carbon-input w-full p-2.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">Estado (UF)</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">País</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="carbon-input w-full p-2.5 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="carbon-input w-full p-2.5 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Media Cover */}
        <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0f62fe]" />
            <span>Mídias e Capa do Tour</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">URL da Imagem de Capa</label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#525252] font-semibold">URL da Miniatura (Card Preview)</label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="carbon-input w-full p-2.5"
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0f62fe]" />
            <span>Otimização para SEO (Meta Tags)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[#525252] font-semibold">SEO Meta Description</label>
              <textarea
                rows={2}
                value={formData.seoDescription || ''}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Descrição resumida para ser exibida nos resultados do Google..."
                className="carbon-input w-full p-2.5"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#525252] font-semibold">Palavras-chave (Keywords separadas por vírgula)</label>
              <input
                type="text"
                value={formData.seoKeywords || ''}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                placeholder="tour 360, apartamento decorado, imobiliaria, itaim bibi"
                className="carbon-input w-full p-2.5"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="carbon-btn-primary px-6 py-3 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
