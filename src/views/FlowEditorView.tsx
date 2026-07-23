import React, { useState } from 'react';
import { Tour360, Image360, ViewMode } from '../types';
import { 
  GitMerge, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Move, 
  ChevronRight, 
  Check, 
  Sparkles,
  Zap,
  Edit3
} from 'lucide-react';

interface FlowEditorViewProps {
  tour: Tour360;
  onSaveTour: (updatedTour: Tour360) => void;
  onNavigate: (view: ViewMode) => void;
  onSelectImageToEdit: (imageId: string) => void;
}

interface NodePos {
  id: string;
  x: number;
  y: number;
}

export const FlowEditorView: React.FC<FlowEditorViewProps> = ({
  tour,
  onSaveTour,
  onNavigate,
  onSelectImageToEdit,
}) => {
  const [currentTour, setCurrentTour] = useState<Tour360>(tour);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(tour.images[0]?.id || null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Position coordinates for flow nodes
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const initial: Record<string, { x: number; y: number }> = {};
    tour.images.forEach((img, i) => {
      initial[img.id] = {
        x: 80 + (i % 3) * 280,
        y: 100 + Math.floor(i / 3) * 220
      };
    });
    return initial;
  });

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle Drag Node
  const handleMouseDownNode = (e: React.MouseEvent, imgId: string) => {
    e.stopPropagation();
    setDraggingNodeId(imgId);
    const pos = positions[imgId] || { x: 100, y: 100 };
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    setPositions((prev) => ({
      ...prev,
      [draggingNodeId]: {
        x: Math.max(20, Math.min(1000, e.clientX - dragOffset.x)),
        y: Math.max(20, Math.min(600, e.clientY - dragOffset.y))
      }
    }));
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
  };

  // Add Link / Hotspot between Node A -> Node B
  const handleConnectNodes = (targetImgId: string) => {
    if (!connectingFromId || connectingFromId === targetImgId) {
      setConnectingFromId(null);
      return;
    }

    const sourceImage = currentTour.images.find((img) => img.id === connectingFromId);
    const targetImage = currentTour.images.find((img) => img.id === targetImgId);

    if (!sourceImage || !targetImage) return;

    // Check if link already exists
    const existingLink = sourceImage.hotspots.find((hs) => hs.targetSceneId === targetImgId);
    if (existingLink) {
      alert(`O ambiente "${sourceImage.name}" já possui um link direto para "${targetImage.name}".`);
      setConnectingFromId(null);
      return;
    }

    // Create Navigation Hotspot
    const newHotspot = {
      id: `hs-${Date.now()}`,
      title: `Ir para ${targetImage.name}`,
      description: `Navegação para o ambiente ${targetImage.name}.`,
      type: 'nav' as const,
      icon: 'arrow' as const,
      color: '#0f62fe',
      targetSceneId: targetImage.id,
      yaw: 0,
      pitch: 0,
      animation: 'pulse' as const
    };

    const updatedImages = currentTour.images.map((img) => {
      if (img.id === sourceImage.id) {
        return {
          ...img,
          hotspots: [...img.hotspots, newHotspot]
        };
      }
      return img;
    });

    const updatedTour = { ...currentTour, images: updatedImages };
    setCurrentTour(updatedTour);
    onSaveTour(updatedTour);
    setConnectingFromId(null);
  };

  // Remove Link between Node A -> Node B
  const handleRemoveLink = (sourceImgId: string, hotspotId: string) => {
    const updatedImages = currentTour.images.map((img) => {
      if (img.id === sourceImgId) {
        return {
          ...img,
          hotspots: img.hotspots.filter((hs) => hs.id !== hotspotId)
        };
      }
      return img;
    });

    const updatedTour = { ...currentTour, images: updatedImages };
    setCurrentTour(updatedTour);
    onSaveTour(updatedTour);
  };

  // Calculate SVGs Lines between linked scenes
  const renderConnectionsSVG = () => {
    const lines: Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      sourceName: string;
      targetName: string;
      sourceId: string;
      hotspotId: string;
    }> = [];

    currentTour.images.forEach((sourceImg) => {
      const sourcePos = positions[sourceImg.id] || { x: 100, y: 100 };
      sourceImg.hotspots.forEach((hs) => {
        if (hs.type === 'nav' && hs.targetSceneId) {
          const targetPos = positions[hs.targetSceneId];
          if (targetPos) {
            lines.push({
              id: `${sourceImg.id}-${hs.id}`,
              x1: sourcePos.x + 100, // Center of card (width 200)
              y1: sourcePos.y + 70, // Center of card (height 140)
              x2: targetPos.x + 100,
              y2: targetPos.y + 70,
              sourceName: sourceImg.name,
              targetName: currentTour.images.find((i) => i.id === hs.targetSceneId)?.name || '',
              sourceId: sourceImg.id,
              hotspotId: hs.id
            });
          }
        }
      });
    });

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#0f62fe" />
          </marker>
        </defs>

        {lines.map((line) => (
          <g key={line.id}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#0f62fe"
              strokeWidth="3"
              strokeDasharray="6,4"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />
            {/* Delete link badge at midpoint */}
            <foreignObject
              x={(line.x1 + line.x2) / 2 - 12}
              y={(line.y1 + line.y2) / 2 - 12}
              width="24"
              height="24"
              className="pointer-events-auto"
            >
              <button
                onClick={() => handleRemoveLink(line.sourceId, line.hotspotId)}
                title={`Remover conexão de ${line.sourceName} para ${line.targetName}`}
                className="w-6 h-6 bg-[#da1e28] text-white rounded-full flex items-center justify-center hover:scale-125 transition-transform shadow-md"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </foreignObject>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-[#161616] text-[#f4f4f4] flex flex-col overflow-hidden select-none">
      {/* Top Flow Header */}
      <header className="bg-[#161616] border-b border-[#393939] h-12 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-xs text-[#c6c6c6]">
            <span className="font-semibold text-white">{tour.name}</span>
            <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
            <span className="text-[#0f62fe] font-mono">EDITOR DE FLUXO DE NAVEGAÇÃO</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {connectingFromId ? (
            <div className="bg-[#0f62fe] text-white px-3 py-1 text-xs font-mono flex items-center gap-2 animate-pulse">
              <span>Selecione o ambiente de destino para conectar...</span>
              <button onClick={() => setConnectingFromId(null)} className="underline ml-2">
                Cancelar
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#8d8d8d]">
              Arraste os cards para organizar ou clique em <strong>+ Conectar</strong> para criar um portal 360°.
            </span>
          )}

          <button
            onClick={() => onNavigate('editor_360')}
            className="carbon-btn-primary px-3 py-1 text-xs flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Voltar ao Editor 360°</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Flow Canvas Area */}
      <div
        className="flex-1 relative overflow-auto bg-[#0a0a0a] bg-[radial-gradient(#393939_1px,transparent_1px)] [background-size:24px_24px]"
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
      >
        {/* Render Connection Lines */}
        {renderConnectionsSVG()}

        {/* Render Room Cards */}
        {currentTour.images.map((img) => {
          const pos = positions[img.id] || { x: 100, y: 100 };
          const isSelected = selectedNodeId === img.id;
          const isConnectingSource = connectingFromId === img.id;
          const navHotspots = img.hotspots.filter((hs) => hs.type === 'nav');

          return (
            <div
              key={img.id}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`
              }}
              onClick={() => {
                if (connectingFromId && connectingFromId !== img.id) {
                  handleConnectNodes(img.id);
                } else {
                  setSelectedNodeId(img.id);
                }
              }}
              className={`absolute w-56 bg-[#262626] border-2 shadow-2xl z-20 cursor-move transition-shadow ${
                isConnectingSource
                  ? 'border-[#f1c21b] ring-4 ring-[#f1c21b]/30'
                  : isSelected
                  ? 'border-[#0f62fe] ring-2 ring-[#0f62fe]/20'
                  : 'border-[#393939] hover:border-[#525252]'
              }`}
              onMouseDown={(e) => handleMouseDownNode(e, img.id)}
            >
              {/* Card Header */}
              <div className="bg-[#161616] p-2 border-b border-[#393939] flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">{img.name}</span>
                <span className="bg-[#0f62fe] text-white text-[10px] font-mono px-1 py-0.2">
                  #{img.order}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-2 space-y-2">
                <img src={img.thumbnailUrl} alt={img.name} className="w-full h-24 object-cover border border-[#393939]" />

                <div className="text-[11px] text-[#c6c6c6] space-y-1">
                  <div className="flex justify-between font-mono">
                    <span>Portais de Saída:</span>
                    <span className="text-[#78a9ff] font-semibold">{navHotspots.length}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-[#393939] flex items-center justify-between gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConnectingFromId(img.id);
                    }}
                    className={`text-[11px] px-2 py-1 flex items-center gap-1 font-mono transition-colors ${
                      isConnectingSource
                        ? 'bg-[#f1c21b] text-black font-semibold'
                        : 'bg-[#0f62fe] text-white hover:bg-[#0353e9]'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Conectar</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectImageToEdit(img.id);
                      onNavigate('editor_360');
                    }}
                    className="carbon-btn-secondary text-[11px] px-2 py-1 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3 text-[#78a9ff]" />
                    <span>Abrir 360°</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
