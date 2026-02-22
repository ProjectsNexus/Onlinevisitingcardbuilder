export interface ElementPosition {
  x: number;
  y: number;
}

export interface ElementStyles {
  fontSize?: number;
  position?: ElementPosition;
}

export interface VisitingCard {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin?: string;
  twitter?: string;
  templateId: string;
  customColors?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  logo?: string;
  createdAt: string;
  views: number;
  shares: number;
  downloads: number;
  elementStyles?: {
    name?: ElementStyles;
    title?: ElementStyles;
    company?: ElementStyles;
    email?: ElementStyles;
    phone?: ElementStyles;
    website?: ElementStyles;
    address?: ElementStyles;
  };
  userId?: string;
  updatedAt?: string;
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
