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
  elementStyles?: ElementStyles;
}

export interface ElementStyle {
  x: number;
  y: number;
  fontSize: number;
}

export interface ElementStyles {
  name: ElementStyle;
  title: ElementStyle;
  company: ElementStyle;
  email: ElementStyle;
  phone: ElementStyle;
  website: ElementStyle;
  address: ElementStyle;
  social: ElementStyle;
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