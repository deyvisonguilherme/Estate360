import React, { useState } from 'react';
import { Tour360, Image360, Hotspot, HotspotType, HotspotIcon, ViewMode } from '../types';
import { ThreeViewer360 } from '../components/ThreeViewer360';
import { 
  Save, 
  Eye, 
  Share2, 
  Link as LinkIcon, 
  Download, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  ArrowRight, 
  Image as ImageIcon, 
  Video, 
  Star, 
  Compass, 
  Camera, 
  GitMerge, 
  Check, 
  Sparkles,
  Upload,
  X
} from 'lucide-react';

interface Editor360ViewProps {
  tour: Tour360;
  onSaveTour: (updatedTour: Tour360) => void;
  onNavigate: (view: ViewMode) => void;
}

export const Editor360View: React.FC<Editor360ViewProps> = ({ tour, onSaveTour, onNavigate }) => {
  const [currentTour, setCurrentTour] = useState<Tour360>(tour);
  const [selectedImageId, setSelectedImageId] = useState<string>(tour.images[0]?.id || '');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState<boolean>(false);

  // New Image Form State
  const [newImageName, setNewImageName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const currentImage = currentTour.images.find((img) => img.id === selectedImageId) || currentTour.images[0];
  const selectedHotspot = currentImage?.hotspots.find((hs) => hs.id === selectedHotspotId) || null;

  // Handler: Add Hotspot at 360 Coords (Yaw/Pitch)
  const handleAddHotspot = (yaw: number, pitch: number) => {
    if (!currentImage) return;

    const newHotspot: Hotspot = {
      id: `hs-${Date.now()}`,
      title: `Novo Hotspot ${currentImage.hotspots.length + 1}`,
      description: 'Descrição do ponto de interesse 360°.',
      type: 'info',
      icon: 'info',
      color: '#0f62fe',
      yaw,
      pitch,
      autoShow: false,
      animation: 'pulse'
    };

    const updatedImages = currentTour.images.map((img) => {
      if (img.id === currentImage.id) {
        return {
          ...img,
          hotspots: [...img.hotspots, newHotspot]
        };
      }
      return img;
    });

    setCurrentTour({ ...currentTour, images: updatedImages });
    setSelectedHotspotId(newHotspot.id);
    setHasUnsavedChanges(true);
  };

  // Handler: Update Hotspot Properties
  const handleUpdateHotspot = (updatedHs: Hotspot) => {
    if (!currentImage) return;

    const updatedImages = currentTour.images.map((img) => {
      if (img.id === currentImage.id) {
        return {
          ...img,
          hotspots: img.hotspots.map((hs) => (hs.id === updatedHs.id ? updatedHs : hs))
        };
      }
      return img;
    });

    setCurrentTour({ ...currentTour, images: updatedImages });
    setHasUnsavedChanges(true);
  };

  // Handler: Delete Hotspot
  const handleDeleteHotspot = (hsId: string) => {
    if (!currentImage) return;

    const updatedImages = currentTour.images.map((img) => {
      if (img.id === currentImage.id) {
        return {
          ...img,
          hotspots: img.hotspots.filter((hs) => hs.id !== hsId)
        };
      }
      return img;
    });

    setCurrentTour({ ...currentTour, images: updatedImages });
    setSelectedHotspotId(null);
    setHasUnsavedChanges(true);
  };

  // Reorder Images
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...currentTour.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setCurrentTour({ ...currentTour, images: newImages });
    setHasUnsavedChanges(true);
  };

  // Save Tour
  const handleSave = () => {
    onSaveTour(currentTour);
    setHasUnsavedChanges(false);
  };

  // Preset Photospheres for quick adding
  const presetPhotospheres = [
    {
      name: 'Salão de Jogos & Bar',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop'
    },
    {
      name: 'Piscina & Solarium Rooftop',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2400&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300&auto=format&fit=crop'
    },
    {
      name: 'Academia & Espaço Fitness',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2400&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop'
    }
  ];

  const handleAddNewImage = (name: string, url: string) => {
    if (!name || !url) return;
    const newImg: Image360 = {
      id: `img-${Date.now()}`,
      tourId: currentTour.id,
      name,
      url,
      thumbnailUrl: url,
      order: currentTour.images.length + 1,
      hotspots: []
    };

    setCurrentTour({ ...currentTour, images: [...currentTour.images, newImg] });
    setSelectedImageId(newImg.id);
    setHasUnsavedChanges(true);
    setIsAddImageModalOpen(false);
    setNewImageName('');
    setNewImageUrl('');
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-[#161616] text-[#f4f4f4] flex flex-col overflow-hidden select-none">
      {/* Top Professional Editor Bar */}
      <header className="bg-[#161616] border-b border-[#393939] h-12 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[#c6c6c6]">
            <span className="font-semibold text-white">{currentTour.name}</span>
            <span className="text-[#8d8d8d]">/</span>
            <span className="text-[#0f62fe] font-mono">{currentImage?.name}</span>
          </div>

          {/* Unsaved Changes Badge */}
          {hasUnsavedChanges ? (
            <div className="flex items-center gap-2 bg-[#ff8389]/10 text-[#ff8389] border border-[#ff8389]/30 px-2 py-0.5 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8389] animate-pulse" />
              <span>Alterações não salvas</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#198038]/10 text-[#42be65] border border-[#42be65]/30 px-2 py-0.5 text-[11px] font-mono">
              <Check className="w-3 h-3" />
              <span>Salvo</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('flow_editor')}
            className="carbon-btn-secondary px-3 py-1 text-xs flex items-center gap-1.5"
            title="Editor de Fluxo de Navegação"
          >
            <GitMerge className="w-3.5 h-3.5 text-[#0f62fe]" />
            <span className="hidden sm:inline">Editor de Fluxo</span>
          </button>

          <button
            onClick={() => onNavigate('public_viewer')}
            className="carbon-btn-secondary px-3 py-1 text-xs flex items-center gap-1.5"
            title="Visualizar Tour"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Visualizar</span>
          </button>

          <button
            onClick={handleSave}
            className="carbon-btn-primary px-3 py-1 text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar</span>
          </button>

          <button
            onClick={() => onNavigate('publication')}
            className="bg-white text-[#161616] hover:bg-[#e0e0e0] px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#0f62fe]" />
            <span>Publicar</span>
          </button>
        </div>
      </header>

      {/* Main Studio 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: 360 Image Thumbnails Drawer */}
        <aside className="w-72 bg-[#262626] border-r border-[#393939] flex flex-col shrink-0 z-20">
          <div className="p-3 border-b border-[#393939] flex items-center justify-between bg-[#161616]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#78a9ff] font-mono">
              IMAGENS 360° ({currentTour.images.length})
            </h2>
            <button
              onClick={() => setIsAddImageModalOpen(true)}
              className="p-1 hover:bg-[#393939] text-[#78a9ff] transition-colors"
              title="Adicionar imagem 360°"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-dark-scrollbar p-2 space-y-2">
            {currentTour.images.map((img, index) => {
              const isSelected = img.id === selectedImageId;
              const hasNavLinks = img.hotspots.some((hs) => hs.type === 'nav');

              return (
                <div
                  key={img.id}
                  onClick={() => {
                    setSelectedImageId(img.id);
                    setSelectedHotspotId(null);
                  }}
                  className={`p-2 border transition-all cursor-pointer flex items-center gap-2.5 group ${
                    isSelected
                      ? 'bg-[#393939] border-[#0f62fe] border-l-4 border-l-[#0f62fe] text-white shadow-lg'
                      : 'bg-[#161616] border-[#393939] text-[#c6c6c6] hover:bg-[#262626]'
                  }`}
                >
                  <img src={img.thumbnailUrl} alt={img.name} className="w-12 h-9 object-cover border border-[#525252]" />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{img.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#8d8d8d] mt-0.5">
                      <span>{img.hotspots.length} Hotspots</span>
                      {hasNavLinks && <span className="text-[#78a9ff]">• Com links</span>}
                    </div>
                  </div>

                  {/* Move Up/Down Controls */}
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(index, 'up');
                      }}
                      disabled={index === 0}
                      className="p-0.5 text-[#8d8d8d] hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(index, 'down');
                      }}
                      disabled={index === currentTour.images.length - 1}
                      className="p-0.5 text-[#8d8d8d] hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#393939] bg-[#161616]">
            <button
              onClick={() => setIsAddImageModalOpen(true)}
              className="carbon-btn-tertiary w-full py-2 text-xs flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Adicionar Imagem 360°</span>
            </button>
          </div>
        </aside>

        {/* Center Canvas Viewport */}
        <main className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
          {currentImage ? (
            <ThreeViewer360
              imageUrl={currentImage.url}
              hotspots={currentImage.hotspots}
              isEditorMode={true}
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={(hsId) => setSelectedHotspotId(hsId)}
              onAddHotspotAtCoords={handleAddHotspot}
              onNavigateToScene={(sceneId) => {
                setSelectedImageId(sceneId);
                setSelectedHotspotId(null);
              }}
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[#8d8d8d]">
              Nenhuma imagem 360° selecionada.
            </div>
          )}
        </main>

        {/* Right Panel: Hotspot Properties Inspector */}
        <aside className="w-80 bg-[#262626] border-l border-[#393939] flex flex-col shrink-0 z-20 overflow-y-auto custom-dark-scrollbar">
          <div className="p-3 border-b border-[#393939] bg-[#161616]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#78a9ff] font-mono">
              PROPRIEDADES DO HOTSPOT
            </h2>
          </div>

          {selectedHotspot ? (
            <div className="p-4 space-y-4 text-xs text-[#f4f4f4]">
              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Título do Hotspot</label>
                <input
                  type="text"
                  value={selectedHotspot.title}
                  onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, title: e.target.value })}
                  className="carbon-input-dark w-full p-2"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Descrição / Tooltip</label>
                <textarea
                  rows={2}
                  value={selectedHotspot.description || ''}
                  onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, description: e.target.value })}
                  className="carbon-input-dark w-full p-2"
                />
              </div>

              {/* Hotspot Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Tipo do Hotspot</label>
                <select
                  value={selectedHotspot.type}
                  onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, type: e.target.value as HotspotType })}
                  className="carbon-input-dark w-full p-2 bg-[#161616]"
                >
                  <option value="nav">Navegação (Portal de Ambiente)</option>
                  <option value="info">Informação (Tooltip Informativo)</option>
                  <option value="image">Imagem (Modal / Foto)</option>
                  <option value="video">Vídeo (Embed / Mídia)</option>
                  <option value="link">Link Externo</option>
                </select>
              </div>

              {/* Target Scene (If Type = Nav) */}
              {selectedHotspot.type === 'nav' && (
                <div className="space-y-1 bg-[#161616] p-3 border border-[#393939]">
                  <label className="text-[11px] font-mono uppercase text-[#78a9ff] block">Cena de Destino *</label>
                  <select
                    value={selectedHotspot.targetSceneId || ''}
                    onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, targetSceneId: e.target.value })}
                    className="carbon-input-dark w-full p-2 bg-[#262626]"
                  >
                    <option value="">Selecione o ambiente de destino...</option>
                    {currentTour.images
                      .filter((img) => img.id !== currentImage.id)
                      .map((img) => (
                        <option key={img.id} value={img.id}>
                          {img.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Ícone do Hotspot</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['info', 'arrow', 'image', 'video', 'star', 'compass', 'camera', 'link'] as HotspotIcon[]).map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleUpdateHotspot({ ...selectedHotspot, icon })}
                      className={`h-9 border flex items-center justify-center transition-colors ${
                        selectedHotspot.icon === icon
                          ? 'border-[#0f62fe] bg-[#0f62fe] text-white'
                          : 'border-[#525252] bg-[#161616] text-[#c6c6c6] hover:border-white'
                      }`}
                    >
                      {icon === 'info' && <Info className="w-4 h-4" />}
                      {icon === 'arrow' && <ArrowRight className="w-4 h-4" />}
                      {icon === 'image' && <ImageIcon className="w-4 h-4" />}
                      {icon === 'video' && <Video className="w-4 h-4" />}
                      {icon === 'star' && <Star className="w-4 h-4" />}
                      {icon === 'compass' && <Compass className="w-4 h-4" />}
                      {icon === 'camera' && <Camera className="w-4 h-4" />}
                      {icon === 'link' && <LinkIcon className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Cor do Hotspot</label>
                <div className="flex gap-2 items-center">
                  {['#0f62fe', '#ff8389', '#42be65', '#ffffff', '#f1c21b', '#a855f7'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleUpdateHotspot({ ...selectedHotspot, color: c })}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 border transition-transform ${
                        selectedHotspot.color === c ? 'scale-125 border-white ring-2 ring-white' : 'border-transparent hover:scale-110'
                      }`}
                    />
                  ))}
                  <input
                    type="text"
                    value={selectedHotspot.color}
                    onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, color: e.target.value })}
                    className="carbon-input-dark w-20 text-[11px] p-1 font-mono text-center ml-auto"
                  />
                </div>
              </div>

              {/* Position Sliders (Yaw & Pitch) */}
              <div className="space-y-3 pt-2 border-t border-[#393939]">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-mono text-[#c6c6c6]">Ângulo Horizontal (Yaw):</span>
                    <span className="font-mono text-[#78a9ff]">{Math.round(selectedHotspot.yaw)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedHotspot.yaw}
                    onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, yaw: parseFloat(e.target.value) })}
                    className="w-full accent-[#0f62fe] bg-[#161616]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-mono text-[#c6c6c6]">Ângulo Vertical (Pitch):</span>
                    <span className="font-mono text-[#78a9ff]">{Math.round(selectedHotspot.pitch)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-85"
                    max="85"
                    value={selectedHotspot.pitch}
                    onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, pitch: parseFloat(e.target.value) })}
                    className="w-full accent-[#0f62fe] bg-[#161616]"
                  />
                </div>
              </div>

              {/* Animation option */}
              <div className="space-y-1 pt-2 border-t border-[#393939]">
                <label className="text-[11px] font-mono uppercase text-[#c6c6c6]">Animação Visual</label>
                <select
                  value={selectedHotspot.animation || 'pulse'}
                  onChange={(e) => handleUpdateHotspot({ ...selectedHotspot, animation: e.target.value as any })}
                  className="carbon-input-dark w-full p-2 bg-[#161616]"
                >
                  <option value="pulse">Pulso Circular (Pulse)</option>
                  <option value="bounce">Salto (Bounce)</option>
                  <option value="none">Sem Animação</option>
                </select>
              </div>

              {/* Delete Hotspot Action */}
              <div className="pt-4 border-t border-[#393939]">
                <button
                  onClick={() => handleDeleteHotspot(selectedHotspot.id)}
                  className="carbon-btn-danger w-full py-2 text-xs flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Hotspot</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#8d8d8d] space-y-3">
              <Sparkles className="w-8 h-8 text-[#525252] mx-auto" />
              <p>Nenhum hotspot selecionado.</p>
              <p className="text-[11px] text-[#525252]">Clique em um hotspot existente ou dê <strong>duplo clique na imagem 360°</strong> para criar um novo ponto.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Modal: Add New 360 Image */}
      {isAddImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161616]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#262626] border border-[#393939] w-full max-w-lg shadow-2xl p-6 space-y-5 text-xs text-[#f4f4f4]">
            <div className="flex items-center justify-between border-b border-[#393939] pb-3">
              <h3 className="text-sm font-semibold text-white">Adicionar Imagem 360° (Equirretangular)</h3>
              <button onClick={() => setIsAddImageModalOpen(false)} className="text-[#c6c6c6] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[#78a9ff] uppercase">Escolher de Modelos 360° Prontos:</label>
              <div className="grid grid-cols-3 gap-2">
                {presetPhotospheres.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => handleAddNewImage(preset.name, preset.url)}
                    className="p-2 border border-[#393939] bg-[#161616] hover:border-[#0f62fe] cursor-pointer text-center space-y-1.5 transition-colors group"
                  >
                    <img src={preset.thumb} alt={preset.name} className="w-full h-16 object-cover" />
                    <p className="text-[11px] font-medium text-white truncate">{preset.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border-t border-[#393939] pt-4">
              <span className="text-[11px] font-mono text-[#c6c6c6] uppercase block mb-2">Ou Informar URL Customizada de Imagem 360°:</span>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome do Ambiente (Ex: Sala de Estar, Recepção)"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  className="carbon-input-dark w-full p-2"
                />
                <input
                  type="url"
                  placeholder="URL Direta da Imagem Equirretangular 360° (JPG/PNG)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="carbon-input-dark w-full p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#393939]">
              <button
                type="button"
                onClick={() => setIsAddImageModalOpen(false)}
                className="carbon-btn-secondary px-4 py-2 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleAddNewImage(newImageName, newImageUrl)}
                disabled={!newImageName || !newImageUrl}
                className="carbon-btn-primary px-4 py-2 text-xs disabled:opacity-40"
              >
                Adicionar Categoria 360°
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
