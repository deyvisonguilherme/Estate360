import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Hotspot, HotspotIcon } from '../types';
import { 
  Info, 
  ArrowRight, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Star, 
  Compass, 
  Camera,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Target,
  Grid
} from 'lucide-react';

interface ThreeViewer360Props {
  imageUrl: string;
  hotspots: Hotspot[];
  isEditorMode?: boolean;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (hotspotId: string) => void;
  onAddHotspotAtCoords?: (yaw: number, pitch: number) => void;
  onUpdateHotspotCoords?: (hotspotId: string, yaw: number, pitch: number) => void;
  onNavigateToScene?: (sceneId: string) => void;
  className?: string;
  autoRotateDefault?: boolean;
}

export const ThreeViewer360: React.FC<ThreeViewer360Props> = ({
  imageUrl,
  hotspots,
  isEditorMode = false,
  selectedHotspotId = null,
  onSelectHotspot,
  onAddHotspotAtCoords,
  onUpdateHotspotCoords,
  onNavigateToScene,
  className = '',
  autoRotateDefault = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const isHotspotDraggingRef = useRef<string | null>(null);

  // Camera angles
  const [yaw, setYaw] = useState(0); // horizontal degrees
  const [pitch, setPitch] = useState(0); // vertical degrees
  const [fov, setFov] = useState(75);
  const [isAutoRotate, setIsAutoRotate] = useState(autoRotateDefault);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [projectedHotspots, setProjectedHotspots] = useState<
    Array<{ hotspot: Hotspot; x: number; y: number; visible: boolean; isSelected: boolean }>
  >([]);

  // Convert Pitch/Yaw to 3D Vector on Sphere
  const getVectorFromYawPitch = (hYaw: number, hPitch: number, radius = 490) => {
    const phi = THREE.MathUtils.degToRad(90 - hPitch);
    const theta = THREE.MathUtils.degToRad(hYaw);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  // Convert 3D Vector on Sphere back to Yaw/Pitch
  const getYawPitchFromVector = (vec: THREE.Vector3) => {
    const radius = vec.length();
    const phi = Math.acos(vec.y / radius);
    const theta = Math.atan2(vec.z, vec.x);

    const hPitch = 90 - THREE.MathUtils.radToDeg(phi);
    const hYaw = THREE.MathUtils.radToDeg(theta);
    return { yaw: hYaw, pitch: hPitch };
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sphere Geometry (Inverted scale for interior 360 viewer)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Initial Material & Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      imageUrl,
      () => {
        renderer.render(scene, camera);
      },
      undefined,
      (err) => console.error('Failed to load 360 texture:', err)
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  // Update Texture when imageUrl changes
  useEffect(() => {
    if (!sphereRef.current) return;
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (newTexture) => {
      newTexture.colorSpace = THREE.SRGBColorSpace;
      const mat = sphereRef.current!.material as THREE.MeshBasicMaterial;
      if (mat.map) mat.map.dispose();
      mat.map = newTexture;
      mat.needsUpdate = true;
    });
  }, [imageUrl]);

  // Main Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDraggingRef.current) {
        setYaw((prev) => (prev + 0.08) % 360);
      }

      if (cameraRef.current && sceneRef.current && rendererRef.current) {
        // Clamp pitch to prevent flipping
        const clampedPitch = Math.max(-85, Math.min(85, pitch));
        const phi = THREE.MathUtils.degToRad(90 - clampedPitch);
        const theta = THREE.MathUtils.degToRad(yaw);

        const targetX = 500 * Math.sin(phi) * Math.cos(theta);
        const targetY = 500 * Math.cos(phi);
        const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

        cameraRef.current.lookAt(targetX, targetY, targetZ);
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        // Project Hotspots to 2D Screen Space
        if (mountRef.current) {
          const container = mountRef.current;
          const w = container.clientWidth;
          const h = container.clientHeight;

          const updatedProjected = hotspots.map((hs) => {
            const worldVec = getVectorFromYawPitch(hs.yaw, hs.pitch);
            const screenVec = worldVec.clone();
            screenVec.project(cameraRef.current!);

            // Check if hotspot is in front of the camera (dot product with camera direction)
            const camDir = new THREE.Vector3();
            cameraRef.current!.getWorldDirection(camDir);
            const isVisible = worldVec.dot(camDir) > 0;

            const screenX = ((screenVec.x + 1) * w) / 2;
            const screenY = ((-screenVec.y + 1) * h) / 2;

            return {
              hotspot: hs,
              x: screenX,
              y: screenY,
              visible: isVisible,
              isSelected: hs.id === selectedHotspotId
            };
          });

          setProjectedHotspots(updatedProjected);
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [yaw, pitch, isAutoRotate, hotspots, selectedHotspotId, fov]);

  // Update Camera FOV
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // Handle Dragging / Orbiting
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary click
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = fov / 500;
    setYaw((prev) => (prev - deltaX * sensitivity) % 360);
    setPitch((prev) => Math.max(-85, Math.min(85, prev + deltaY * sensitivity)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isHotspotDraggingRef.current = null;
  };

  // Handle Double Click to Add Hotspot in Editor Mode
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditorMode || !onAddHotspotAtCoords || !mountRef.current || !cameraRef.current) return;

    const container = mountRef.current;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    // Raycast onto sphere
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    if (sphereRef.current) {
      const intersects = raycaster.intersectObject(sphereRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const coords = getYawPitchFromVector(point);
        onAddHotspotAtCoords(Math.round(coords.yaw), Math.round(coords.pitch));
      }
    }
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setFov((prev) => Math.max(25, Math.min(95, prev + e.deltaY * 0.05)));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Render Hotspot Icon
  const renderHotspotIcon = (iconName: HotspotIcon) => {
    switch (iconName) {
      case 'arrow':
        return <ArrowRight className="w-5 h-5 text-white" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-white" />;
      case 'video':
        return <Video className="w-5 h-5 text-white" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-white" />;
      case 'star':
        return <Star className="w-5 h-5 text-white" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-white" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-white" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden select-none bg-[#0a0a0a] cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
    >
      {/* Grid Overlay Option */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none border border-white/10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      )}

      {/* Render Hotspots on 2D Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {projectedHotspots.map(({ hotspot, x, y, visible, isSelected }) => {
          if (!visible) return null;

          const isNav = hotspot.type === 'nav';
          const bgColor = hotspot.color || '#0f62fe';

          return (
            <div
              key={hotspot.id}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto transition-transform duration-75 group"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectHotspot) onSelectHotspot(hotspot.id);
                if (isNav && hotspot.targetSceneId && onNavigateToScene) {
                  onNavigateToScene(hotspot.targetSceneId);
                }
              }}
            >
              {/* Hotspot Outer Marker Container */}
              <div
                className={`relative flex items-center justify-center cursor-pointer transition-all ${
                  isSelected ? 'scale-125 ring-4 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'
                }`}
              >
                {/* Pulse Ring */}
                {hotspot.animation === 'pulse' && (
                  <span
                    style={{ backgroundColor: bgColor }}
                    className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  />
                )}

                {/* Hotspot Core Button */}
                <div
                  style={{ backgroundColor: bgColor }}
                  className="relative z-10 w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                >
                  {renderHotspotIcon(hotspot.icon)}
                </div>

                {/* Hotspot Tooltip Preview Card */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#161616]/95 border border-[#525252] text-white p-2 px-3 text-xs rounded-none shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                  <p className="font-semibold text-white">{hotspot.title}</p>
                  {hotspot.description && <p className="text-[11px] text-[#c6c6c6] mt-0.5 max-w-xs truncate">{hotspot.description}</p>}
                  {isNav && <span className="text-[10px] text-[#78a9ff] font-mono mt-1 block">Clique para navegar →</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Guide Badge when in Editor Mode */}
      {isEditorMode && (
        <div className="absolute top-4 left-4 pointer-events-none bg-[#161616]/80 backdrop-blur-md border border-[#525252] p-2 px-3 text-xs font-mono text-white flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#0f62fe] animate-pulse" />
          <span>SCENE 360° | YAW: {Math.round(yaw)}° | PITCH: {Math.round(pitch)}° | FOV: {Math.round(fov)}°</span>
          <span className="text-[#8d8d8d] hidden md:inline">| Dê duplo clique para criar hotspot</span>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#161616]/90 border border-[#525252] p-1 px-2 shadow-2xl z-20 backdrop-blur-md text-white">
        <button
          onClick={() => setFov((prev) => Math.max(25, prev - 5))}
          title="Zoom In"
          className="p-2 hover:bg-[#393939] transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => setFov((prev) => Math.min(95, prev + 5))}
          title="Zoom Out"
          className="p-2 hover:bg-[#393939] transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>

        <div className="w-px h-5 bg-[#525252] mx-1" />

        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          title="Auto Rotação"
          className={`p-2 transition-colors ${isAutoRotate ? 'bg-[#0f62fe] text-white' : 'hover:bg-[#393939] text-[#c6c6c6]'}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setYaw(0);
            setPitch(0);
            setFov(75);
          }}
          title="Centralizar Visão"
          className="p-2 hover:bg-[#393939] transition-colors text-[#c6c6c6]"
        >
          <Target className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          title="Alternar Grade Guia"
          className={`p-2 transition-colors ${showGrid ? 'bg-[#0f62fe] text-white' : 'hover:bg-[#393939] text-[#c6c6c6]'}`}
        >
          <Grid className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#525252] mx-1" />

        <button
          onClick={toggleFullscreen}
          title="Tela Cheia"
          className="p-2 hover:bg-[#393939] transition-colors text-[#c6c6c6]"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
