import React, { useState } from 'react';
import { Agency, Development } from '../types';
import { Building, Plus, Edit2, Trash2, MapPin, ChevronRight, X, Globe, Phone, Mail, Building2 } from 'lucide-react';

interface DevelopmentsViewProps {
  developments: Development[];
  agencies: Agency[];
  onSaveDevelopment: (dev: Development) => void;
  onDeleteDevelopment: (devId: string) => void;
}

export const DevelopmentsView: React.FC<DevelopmentsViewProps> = ({
  developments,
  agencies,
  onSaveDevelopment,
  onDeleteDevelopment,
}) => {
  const [selectedDev, setSelectedDev] = useState<Development>(developments[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState<Partial<Development>>({});

  const handleOpenModal = (dev?: Development) => {
    if (dev) {
      setEditingDev(dev);
    } else {
      setEditingDev({
        id: `dev-${Date.now()}`,
        agencyId: agencies[0]?.id || '',
        name: '',
        code: `DEV-${Math.floor(100 + Math.random() * 900)}`,
        description: '',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Itaim Bibi',
        address: '',
        lat: -23.5855,
        lng: -46.6806,
        coverUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        status: 'Ativo',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDev.name) return;
    onSaveDevelopment(editingDev as Development);
    setIsModalOpen(false);
    if (!selectedDev || selectedDev.id === editingDev.id) {
      setSelectedDev(editingDev as Development);
    }
  };

  const linkedAgency = agencies.find((a) => a.id === selectedDev?.agencyId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">CADASTRO DE EMPREENDIMENTOS</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Gestão de Empreendimentos</h1>
          <p className="text-xs text-[#525252] mt-0.5">Cadastre empreendimentos e associe-os a imobiliárias para geração de tours 360°.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Empreendimento</span>
        </button>
      </div>

      {/* Main Grid: Left Developments List, Center Details, Right Linked Agency Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase text-[#525252] tracking-wider mb-2">EMPREENDIMENTOS CADASTRADOS</h2>
          {developments.map((dev) => {
            const isSelected = selectedDev?.id === dev.id;
            return (
              <div
                key={dev.id}
                onClick={() => setSelectedDev(dev)}
                className={`p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#0f62fe] bg-white border-l-4 border-l-[#0f62fe] shadow-sm'
                    : 'border-[#c6c6c6] bg-white hover:bg-[#f4f4f4]'
                }`}
              >
                <img src={dev.coverUrl} alt={dev.name} className="w-12 h-12 object-cover border border-[#c6c6c6]" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-[#161616] truncate">{dev.name}</h3>
                  <p className="text-[11px] text-[#525252] font-mono">{dev.code} • {dev.city}, {dev.state}</p>
                </div>
                <span className="bg-[#e0e0e0] text-[#161616] text-[10px] font-mono px-1.5 py-0.5">
                  {dev.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center & Right Detail View */}
        {selectedDev && (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Center Main Info */}
            <div className="md:col-span-2 bg-white border border-[#c6c6c6] p-6 space-y-6">
              <div className="relative h-48 bg-[#161616] overflow-hidden border border-[#c6c6c6]">
                <img src={selectedDev.coverUrl} alt={selectedDev.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#161616]/80 backdrop-blur-sm text-white px-2 py-0.5 text-xs font-mono">
                  {selectedDev.code}
                </div>
                <div className="absolute top-3 right-3 bg-[#0f62fe] text-white px-2 py-0.5 text-xs font-medium">
                  {selectedDev.status}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-[#e0e0e0] pb-4">
                <div>
                  <h2 className="text-xl font-medium text-[#161616]">{selectedDev.name}</h2>
                  <p className="text-xs text-[#525252] mt-1">{selectedDev.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenModal(selectedDev)}
                    className="carbon-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onDeleteDevelopment(selectedDev.id)}
                    className="carbon-btn-danger px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Location Fields */}
              <div className="space-y-3 text-xs">
                <h3 className="font-semibold text-[#161616] uppercase font-mono text-[11px] text-[#525252]">
                  ENDEREÇO E COORDENADAS
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-[#f4f4f4] p-4 border border-[#e0e0e0]">
                  <div>
                    <span className="text-[#525252] block text-[11px]">Bairro & Endereço:</span>
                    <span className="font-medium text-[#161616]">{selectedDev.neighborhood}, {selectedDev.address}</span>
                  </div>
                  <div>
                    <span className="text-[#525252] block text-[11px]">Cidade/Estado:</span>
                    <span className="font-medium text-[#161616]">{selectedDev.city} - {selectedDev.state}</span>
                  </div>
                  <div>
                    <span className="text-[#525252] block text-[11px]">Latitude:</span>
                    <span className="font-mono text-[#161616]">{selectedDev.lat}</span>
                  </div>
                  <div>
                    <span className="text-[#525252] block text-[11px]">Longitude:</span>
                    <span className="font-mono text-[#161616]">{selectedDev.lng}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Linked Agency Info */}
            <div className="bg-[#f4f4f4] border border-[#c6c6c6] p-5 space-y-4">
              <div className="border-b border-[#c6c6c6] pb-3">
                <p className="text-[10px] font-mono text-[#525252] uppercase tracking-wider">IMOBILIÁRIA VINCULADA</p>
                <h3 className="text-sm font-semibold text-[#161616] mt-0.5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0f62fe]" />
                  <span>{linkedAgency?.name || 'Não informada'}</span>
                </h3>
              </div>

              {linkedAgency && (
                <div className="space-y-4 text-xs">
                  <img
                    src={linkedAgency.logoUrl}
                    alt={linkedAgency.name}
                    className="w-16 h-16 object-cover border border-[#c6c6c6] bg-white p-1"
                  />

                  <div className="space-y-2 text-[#525252]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#0f62fe]" />
                      <span className="truncate">{linkedAgency.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#0f62fe]" />
                      <span>{linkedAgency.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#0f62fe]" />
                      <span className="truncate">{linkedAgency.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#0f62fe]" />
                      <span>{linkedAgency.city}, {linkedAgency.state}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Carbon Modal: Create / Edit Development */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#393939] w-full max-w-xl shadow-2xl space-y-4">
            <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#393939]">
              <h3 className="text-sm font-semibold tracking-wide">
                {editingDev.id ? 'Editar Empreendimento' : 'Cadastrar Empreendimento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Imobiliária Responsável *</label>
                  <select
                    value={editingDev.agencyId || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, agencyId: e.target.value })}
                    className="carbon-input w-full p-2 bg-white"
                  >
                    {agencies.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Nome do Empreendimento *</label>
                  <input
                    type="text"
                    required
                    value={editingDev.name || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, name: e.target.value })}
                    placeholder="Ex: Residencial Aurora Sky"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Código Interno</label>
                  <input
                    type="text"
                    value={editingDev.code || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, code: e.target.value })}
                    placeholder="AURORA-360"
                    className="carbon-input w-full p-2 font-mono"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Descrição do Empreendimento</label>
                  <textarea
                    rows={2}
                    value={editingDev.description || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, description: e.target.value })}
                    placeholder="Breve descrição dos diferenciais..."
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Bairro</label>
                  <input
                    type="text"
                    value={editingDev.neighborhood || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, neighborhood: e.target.value })}
                    placeholder="Itaim Bibi"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Status</label>
                  <select
                    value={editingDev.status || 'Ativo'}
                    onChange={(e) => setEditingDev({ ...editingDev, status: e.target.value as any })}
                    className="carbon-input w-full p-2 bg-white"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Lançamento">Lançamento</option>
                    <option value="Em Obras">Em Obras</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Cidade</label>
                  <input
                    type="text"
                    value={editingDev.city || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, city: e.target.value })}
                    placeholder="São Paulo"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Estado (UF)</label>
                  <input
                    type="text"
                    value={editingDev.state || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, state: e.target.value })}
                    placeholder="SP"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Foto de Capa (URL)</label>
                  <input
                    type="url"
                    value={editingDev.coverUrl || ''}
                    onChange={(e) => setEditingDev({ ...editingDev, coverUrl: e.target.value })}
                    placeholder="https://..."
                    className="carbon-input w-full p-2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="carbon-btn-secondary px-4 py-2 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="carbon-btn-primary px-4 py-2 text-xs"
                >
                  Salvar Empreendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
