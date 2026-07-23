import React, { useState } from 'react';
import { Tour360, Agency, Development } from '../types';
import { ThreeViewer360 } from '../components/ThreeViewer360';
import { 
  Building2, 
  Share2, 
  PhoneCall, 
  X, 
  ChevronLeft, 
  Maximize2, 
  Layers, 
  Compass, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface PublicTourViewerProps {
  tour: Tour360;
  agency?: Agency;
  development?: Development;
  onExitViewer: () => void;
}

export const PublicTourViewer: React.FC<PublicTourViewerProps> = ({
  tour,
  agency,
  development,
  onExitViewer,
}) => {
  const [selectedImageId, setSelectedImageId] = useState<string>(tour.images[0]?.id || '');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lead Form
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const currentImage = tour.images.find((img) => img.id === selectedImageId) || tour.images[0];

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadSubmitted(false);
      setIsLeadModalOpen(false);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] text-white overflow-hidden select-none">
      {/* 360 Interactive Sphere Background */}
      {currentImage ? (
        <ThreeViewer360
          imageUrl={currentImage.url}
          hotspots={currentImage.hotspots}
          isEditorMode={false}
          onNavigateToScene={(sceneId) => setSelectedImageId(sceneId)}
          className="w-full h-full"
          autoRotateDefault={true}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-sm text-[#8d8d8d]">
          Nenhuma imagem 360° disponível neste tour.
        </div>
      )}

      {/* Top Floating Branding Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
        <div className="flex items-center gap-3 bg-[#161616]/90 border border-white/10 p-2.5 px-4 backdrop-blur-md shadow-2xl pointer-events-auto">
          {agency?.logoUrl && (
            <img src={agency.logoUrl} alt={agency.name} className="w-8 h-8 object-cover border border-white/20 bg-white" />
          )}
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">{tour.name}</h1>
            <p className="text-[11px] text-[#c6c6c6] font-mono">
              {development?.name || 'Empreendimento'} • {tour.city}, {tour.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-[#161616]/90 hover:bg-[#393939] text-white border border-white/10 p-2.5 backdrop-blur-md shadow-2xl transition-colors"
            title="Compartilhar Tour"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="bg-[#0f62fe] hover:bg-[#0353e9] text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-2xl transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">Agendar Visita / Falar com Corretor</span>
          </button>

          <button
            onClick={onExitViewer}
            className="bg-[#161616]/90 hover:bg-[#393939] text-white border border-white/10 p-2.5 backdrop-blur-md shadow-2xl transition-colors"
            title="Sair da Visão Pública"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Room Selector Thumbnail Drawer */}
      <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto max-w-3xl z-30 pointer-events-auto">
        <div className="bg-[#161616]/90 border border-white/10 p-2 backdrop-blur-md shadow-2xl flex items-center gap-2 overflow-x-auto custom-dark-scrollbar">
          {tour.images.map((img) => {
            const isSelected = img.id === selectedImageId;
            return (
              <button
                key={img.id}
                onClick={() => setSelectedImageId(img.id)}
                className={`relative shrink-0 w-24 h-16 border transition-all overflow-hidden group ${
                  isSelected ? 'border-[#0f62fe] ring-2 ring-[#0f62fe]' : 'border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.thumbnailUrl} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                  <span className="text-[10px] font-medium text-white truncate w-full">{img.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#393939] w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#393939] pb-3">
              <div className="flex items-center gap-2 text-white">
                <Building2 className="w-5 h-5 text-[#0f62fe]" />
                <h3 className="text-sm font-semibold">Tenho Interesse no Empreendimento</h3>
              </div>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {leadSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-[#defbe6] text-[#0e6027] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-white">Mensagem Enviada!</h4>
                <p className="text-xs text-[#c6c6c6]">
                  Um corretor da <strong>{agency?.name || 'Imobiliária'}</strong> entrará em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <p className="text-xs text-[#c6c6c6]">
                  Preencha os dados abaixo para receber tabela de vendas e atendimento exclusivo sobre {development?.name}.
                </p>

                <div className="space-y-1">
                  <label className="text-[#c6c6c6] font-mono">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome"
                    className="carbon-input-dark w-full p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#c6c6c6] font-mono">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="carbon-input-dark w-full p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#c6c6c6] font-mono">E-mail</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="carbon-input-dark w-full p-2.5"
                  />
                </div>

                <div className="pt-3 border-t border-[#393939] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLeadModalOpen(false)}
                    className="carbon-btn-secondary px-4 py-2 text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="carbon-btn-primary px-4 py-2 text-xs"
                  >
                    Enviar Solicitação
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#393939] w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#393939] pb-3">
              <h3 className="text-sm font-semibold text-white">Compartilhar Tour 360°</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#c6c6c6]">URL Pública de acesso ao tour virtual:</p>
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="carbon-input-dark w-full p-2.5 font-mono text-xs"
              />
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="carbon-btn-primary w-full py-2 text-xs flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link do Tour'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
