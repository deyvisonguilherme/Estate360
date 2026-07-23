export type HotspotType = 'nav' | 'info' | 'image' | 'video' | 'link';

export type HotspotIcon = 'info' | 'arrow' | 'image' | 'video' | 'link' | 'star' | 'compass' | 'camera';

export type DevelopmentStatus = 'Ativo' | 'Em Obras' | 'Lançamento' | 'Inativo';

export type TourStatus = 'Publicado' | 'Rascunho' | 'Privado';

export interface Hotspot {
  id: string;
  title: string;
  description?: string;
  type: HotspotType;
  icon: HotspotIcon;
  color: string; // e.g. '#0f62fe'
  targetSceneId?: string; // Scene ID for navigation
  linkUrl?: string; // External link
  mediaUrl?: string; // Image or video modal
  yaw: number; // Degrees (-180 to 180)
  pitch: number; // Degrees (-90 to 90)
  autoShow?: boolean;
  animation?: 'pulse' | 'bounce' | 'none';
  rotation?: number;
  visible?: boolean;
}

export interface Image360 {
  id: string;
  tourId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  hotspots: Hotspot[];
  order: number;
}

export interface Tour360 {
  id: string;
  developmentId: string;
  name: string;
  description: string;
  slug: string;
  friendlyUrl: string;
  status: TourStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image360[];
  coverUrl?: string;
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  location: {
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    lat: number;
    lng: number;
  };
}

export interface Development {
  id: string;
  agencyId: string;
  name: string;
  code: string;
  description: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  coverUrl: string;
  status: DevelopmentStatus;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  logoUrl: string;
  cnpj: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface NodePosition {
  sceneId: string;
  x: number;
  y: number;
}

export type ViewMode = 
  | 'dashboard'
  | 'agencies'
  | 'developments'
  | 'tours_list'
  | 'editor_360'
  | 'flow_editor'
  | 'tour_settings'
  | 'publication'
  | 'public_viewer';
