import React, { useState } from 'react';
import { Agency, Development } from '../types';
import { Building2, Plus, Edit2, Trash2, Globe, Phone, Mail, MapPin, ChevronRight, X, Upload } from 'lucide-react';

interface AgenciesViewProps {
  agencies: Agency[];
  developments: Development[];
  onSaveAgency: (agency: Agency) => void;
  onDeleteAgency: (agencyId: string) => void;
}

export const AgenciesView: React.FC<AgenciesViewProps> = ({
  agencies,
  developments,
  onSaveAgency,
  onDeleteAgency,
}) => {
  const [selectedAgency, setSelectedAgency] = useState<Agency>(agencies[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Partial<Agency>>({});

  const handleOpenModal = (agency?: Agency) => {
    if (agency) {
      setEditingAgency(agency);
    } else {
      setEditingAgency({
        id: `ag-${Date.now()}`,
        name: '',
        logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80',
        cnpj: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgency.name) return;
    onSaveAgency(editingAgency as Agency);
    setIsModalOpen(false);
    if (!selectedAgency || selectedAgency.id === editingAgency.id) {
      setSelectedAgency(editingAgency as Agency);
    }
  };

  const linkedDevelopments = developments.filter((d) => d.agencyId === selectedAgency?.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">CADASTRO DE IMOBILIÁRIAS</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Gestão de Imobiliárias</h1>
          <p className="text-xs text-[#525252] mt-0.5">Cadastre e gerencie agências parceiras e empresas de comercialização.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Imobiliária</span>
        </button>
      </div>

      {/* Main Grid: Left Agencies List, Right Selected Agency Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agencies Cards / List */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase text-[#525252] tracking-wider mb-2">IMOBILIÁRIAS CADASTRADAS</h2>
          {agencies.map((agency) => {
            const countDevs = developments.filter((d) => d.agencyId === agency.id).length;
            const isSelected = selectedAgency?.id === agency.id;

            return (
              <div
                key={agency.id}
                onClick={() => setSelectedAgency(agency)}
                className={`p-4 border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#0f62fe] bg-white border-l-4 border-l-[#0f62fe] shadow-sm'
                    : 'border-[#c6c6c6] bg-white hover:bg-[#f4f4f4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={agency.logoUrl}
                    alt={agency.name}
                    className="w-10 h-10 object-cover border border-[#c6c6c6] bg-[#f4f4f4]"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-[#161616]">{agency.name}</h3>
                    <p className="text-xs text-[#525252] font-mono">{agency.city}, {agency.state}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-[#f4f4f4] text-[#161616] border border-[#c6c6c6] px-2 py-0.5 text-[11px] font-mono">
                    {countDevs} Empreend.
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Agency Details & Form / Linked Developments Table */}
        {selectedAgency && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#c6c6c6] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAgency.logoUrl}
                    alt={selectedAgency.name}
                    className="w-16 h-16 object-cover border border-[#c6c6c6] p-1 bg-[#f4f4f4]"
                  />
                  <div>
                    <h2 className="text-xl font-medium text-[#161616]">{selectedAgency.name}</h2>
                    <p className="text-xs text-[#525252] font-mono mt-0.5">CNPJ: {selectedAgency.cnpj || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(selectedAgency)}
                    className="carbon-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onDeleteAgency(selectedAgency.id)}
                    className="carbon-btn-danger px-3 py-1.5 text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#525252]">
                    <Globe className="w-4 h-4 text-[#0f62fe]" />
                    <a href={selectedAgency.website} target="_blank" rel="noreferrer" className="hover:underline text-[#0f62fe]">
                      {selectedAgency.website || 'Sem website'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[#525252]">
                    <Phone className="w-4 h-4 text-[#0f62fe]" />
                    <span>{selectedAgency.phone || 'Sem telefone'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#525252]">
                    <Mail className="w-4 h-4 text-[#0f62fe]" />
                    <span>{selectedAgency.email || 'Sem e-mail'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#525252]">
                    <MapPin className="w-4 h-4 text-[#0f62fe]" />
                    <span>{selectedAgency.address}, {selectedAgency.city} - {selectedAgency.state}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Developments Table */}
            <div className="bg-white border border-[#c6c6c6]">
              <div className="p-4 border-b border-[#c6c6c6] bg-[#f4f4f4] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#161616]">Empreendimentos Vinculados</h3>
                  <p className="text-xs text-[#525252]">Projetos associados a {selectedAgency.name}</p>
                </div>
                <span className="bg-[#0f62fe] text-white px-2 py-0.5 text-xs font-mono">
                  {linkedDevelopments.length} Empreendimentos
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e0e0e0] border-b border-[#c6c6c6] text-xs text-[#161616] font-semibold">
                      <th className="p-3 pl-4">Empreendimento</th>
                      <th className="p-3">Código</th>
                      <th className="p-3">Localização</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e0e0] text-xs text-[#161616]">
                    {linkedDevelopments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-[#525252]">
                          Nenhum empreendimento vinculado a esta imobiliária.
                        </td>
                      </tr>
                    ) : (
                      linkedDevelopments.map((dev) => (
                        <tr key={dev.id} className="hover:bg-[#f4f4f4] transition-colors">
                          <td className="p-3 pl-4 font-medium flex items-center gap-3">
                            <img src={dev.coverUrl} alt={dev.name} className="w-8 h-8 object-cover border border-[#c6c6c6]" />
                            <span>{dev.name}</span>
                          </td>
                          <td className="p-3 font-mono text-[#525252]">{dev.code}</td>
                          <td className="p-3 text-[#525252]">{dev.city}, {dev.state}</td>
                          <td className="p-3">
                            <span className="bg-[#e0e0e0] text-[#161616] px-2 py-0.5 text-[11px] font-medium border border-[#c6c6c6]">
                              {dev.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Carbon Modal: Create / Edit Agency */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#393939] w-full max-w-xl shadow-2xl space-y-4">
            <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#393939]">
              <h3 className="text-sm font-semibold tracking-wide">
                {editingAgency.id ? 'Editar Imobiliária' : 'Cadastrar Imobiliária'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Nome da Imobiliária *</label>
                  <input
                    type="text"
                    required
                    value={editingAgency.name || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, name: e.target.value })}
                    placeholder="Ex: Vanguard Properties"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">CNPJ</label>
                  <input
                    type="text"
                    value={editingAgency.cnpj || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Telefone</label>
                  <input
                    type="text"
                    value={editingAgency.phone || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, phone: e.target.value })}
                    placeholder="(11) 3000-0000"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">E-mail Corporativo</label>
                  <input
                    type="email"
                    value={editingAgency.email || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, email: e.target.value })}
                    placeholder="contato@imobiliaria.com.br"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Website</label>
                  <input
                    type="url"
                    value={editingAgency.website || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, website: e.target.value })}
                    placeholder="https://www.imobiliaria.com.br"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">Endereço Completo</label>
                  <input
                    type="text"
                    value={editingAgency.address || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, address: e.target.value })}
                    placeholder="Av. Faria Lima, 1000 - Itaim Bibi"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Cidade</label>
                  <input
                    type="text"
                    value={editingAgency.city || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, city: e.target.value })}
                    placeholder="São Paulo"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#525252] font-semibold">Estado (UF)</label>
                  <input
                    type="text"
                    value={editingAgency.state || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, state: e.target.value })}
                    placeholder="SP"
                    className="carbon-input w-full p-2"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[#525252] font-semibold">URL da Logo</label>
                  <input
                    type="url"
                    value={editingAgency.logoUrl || ''}
                    onChange={(e) => setEditingAgency({ ...editingAgency, logoUrl: e.target.value })}
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
                  Salvar Imobiliária
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
