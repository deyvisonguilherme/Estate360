import React, { useState } from 'react';
import { Tour360, ViewMode } from '../types';
import { 
  Share2, 
  Copy, 
  Check, 
  Code, 
  ExternalLink, 
  Globe, 
  QrCode, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Link as LinkIcon
} from 'lucide-react';

interface PublicationViewProps {
  tour: Tour360;
  onTogglePublishTour: (tourId: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const PublicationView: React.FC<PublicationViewProps> = ({
  tour,
  onTogglePublishTour,
  onNavigate,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const publicUrl = `${window.location.origin}/tour/${tour.slug}`;
  const directImageUrl = tour.images[0]?.url || tour.coverUrl;
  
  const iframeSnippet = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" allowfullscreen allow="gyroscope; accelerometer"></iframe>`;
  const htmlDirectSnippet = `<a href="${publicUrl}" target="_blank" rel="noopener"><img src="${directImageUrl}" alt="${tour.name} - Tour 360" width="100%" /></a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e0e0e0] pb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#525252] mb-1.5 font-mono">
            <span>PLATAFORMA ESTATE360</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#161616] font-semibold">PUBLICAÇÃO & INTEGRACAO</span>
          </nav>
          <h1 className="text-2xl font-light text-[#161616]">Publicação e Compartilhamento</h1>
          <p className="text-xs text-[#525252] mt-0.5">Gerencie links de acesso direto, links para imagens do HTML e código IFrame para portais imobiliários.</p>
        </div>

        <button
          onClick={() => onNavigate('public_viewer')}
          className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Abrir Tour Público</span>
        </button>
      </div>

      {/* Publication Status Control Card */}
      <div className="bg-white border border-[#c6c6c6] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${tour.isPublished ? 'bg-[#defbe6] text-[#0e6027]' : 'bg-[#fef3d6] text-[#8a3800]'}`}>
            {tour.isPublished ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#161616]">Status de Publicação</h2>
              {tour.isPublished ? (
                <span className="bg-[#defbe6] text-[#0e6027] px-2 py-0.5 text-xs font-mono font-medium border border-[#a7f0ba]">
                  PUBLICADO
                </span>
              ) : (
                <span className="bg-[#fef3d6] text-[#8a3800] px-2 py-0.5 text-xs font-mono font-medium border border-[#fddc9b]">
                  EM RASCUNHO (PRIVADO)
                </span>
              )}
            </div>
            <p className="text-xs text-[#525252] mt-1">
              {tour.isPublished
                ? 'Este tour está ativo e acessível através de seus links de integração.'
                : 'Este tour está privado. Apenas usuários logados no estúdio podem visualizar.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onTogglePublishTour(tour.id)}
          className={`px-5 py-2.5 text-xs font-medium transition-colors flex items-center gap-2 ${
            tour.isPublished
              ? 'bg-[#da1e28] text-white hover:bg-[#bc1b24]'
              : 'bg-[#198038] text-white hover:bg-[#116227]'
          }`}
        >
          {tour.isPublished ? 'Desabilitar Publicação' : 'Publicar Tour Agora'}
        </button>
      </div>

      {/* Direct Tour Links */}
      <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0f62fe]" />
          <span>1. Link Direto da Experiência 360°</span>
        </h2>

        <div className="space-y-2 text-xs">
          <label className="text-[#525252] font-semibold">URL de Acesso Direto (Para clientes / WhatsApp):</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="carbon-input w-full p-2.5 font-mono text-xs bg-[#f4f4f4]"
            />
            <button
              onClick={() => copyToClipboard(publicUrl, 'url')}
              className="carbon-btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5 shrink-0"
            >
              {copiedType === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'url' ? 'Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* HTML Image Direct Links */}
      <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#0f62fe]" />
          <span>2. Link Direto para as Imagens do HTML</span>
        </h2>

        <p className="text-xs text-[#525252]">
          Ideal para inserção em e-mails marketing, anúncios imobiliários e portais que requerem tag de imagem HTML vinculada ao tour.
        </p>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[#525252] font-semibold">URL da Imagem Equirretangular 360° Primária (JPG):</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directImageUrl}
                className="carbon-input w-full p-2.5 font-mono text-xs bg-[#f4f4f4]"
              />
              <button
                onClick={() => copyToClipboard(directImageUrl, 'img_url')}
                className="carbon-btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5 shrink-0"
              >
                {copiedType === 'img_url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'img_url' ? 'Copiado!' : 'Copiar URL da Imagem'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#525252] font-semibold">Código HTML da Imagem com Hiperlink:</label>
            <div className="flex items-center gap-2">
              <textarea
                readOnly
                rows={2}
                value={htmlDirectSnippet}
                className="carbon-input w-full p-2 font-mono text-xs bg-[#f4f4f4]"
              />
              <button
                onClick={() => copyToClipboard(htmlDirectSnippet, 'html_tag')}
                className="carbon-btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5 shrink-0"
              >
                {copiedType === 'html_tag' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'html_tag' ? 'Copiado!' : 'Copiar HTML'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embed IFrame Code */}
      <div className="bg-white border border-[#c6c6c6] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#161616] border-b border-[#e0e0e0] pb-2 flex items-center gap-2">
          <Code className="w-4 h-4 text-[#0f62fe]" />
          <span>3. Código de Incorporação (IFrame Embed)</span>
        </h2>

        <div className="space-y-2 text-xs">
          <label className="text-[#525252] font-semibold">Copie e cole este código no seu site imobiliário ou portal:</label>
          <div className="flex items-center gap-2">
            <textarea
              readOnly
              rows={2}
              value={iframeSnippet}
              className="carbon-input w-full p-2 font-mono text-xs bg-[#f4f4f4]"
            />
            <button
              onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
              className="carbon-btn-secondary px-4 py-2.5 text-xs flex items-center gap-1.5 shrink-0"
            >
              {copiedType === 'iframe' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'iframe' ? 'Copiado!' : 'Copiar IFrame'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
