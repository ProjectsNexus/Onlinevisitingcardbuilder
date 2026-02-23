export type BlockType = 'text' | 'heading' | 'image' | 'logo' | 'icon' | 'link' | 'shape' | 'qr' | 'map';

export interface BlockPosition {
  x: number;
  y: number;
}

export interface BlockSize {
  width: number;
  height: number;
}

export interface BlockStyle {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '600';
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  padding?: number;
  opacity?: number;
  lineHeight?: number;
  letterSpacing?: number;
  border?: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

export interface CardBlock {
  id: string;
  type: BlockType;
  position: BlockPosition;
  size: BlockSize;
  style: BlockStyle;
  content: string; // text content or URL
  metadata?: Record<string, any>; // for QR, map, etc.
  zIndex: number;
}

export interface CardLayout {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
}

export interface VisitingCard {
  id: string;
  userId?: string;
  layout: CardLayout;
  blocks: CardBlock[];
  templateId?: string; // legacy support
  
  // Legacy fields for backwards compatibility
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
  logo?: string;
  customColors?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  
  // Metadata
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  publishedUrl?: string;
  publishedSlug?: string;
  views: number;
  shares: number;
  downloads: number;
  isPublished?: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}
