import { VisitingCard } from '../types/card';
import { Mail, Phone, Globe, MapPin, Linkedin, Twitter } from 'lucide-react';

interface CardPreviewProps {
  card: VisitingCard;
  template?: {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
  };
}

export function CardPreview({ card, template }: CardPreviewProps) {
  const colors = card.customColors || template?.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    text: '#333333',
    background: '#ffffff',
  };

  const isGradient = colors.background.includes('gradient');

  return (
    <div 
      className="w-full aspect-[1.75/1] rounded-xl shadow-2xl overflow-hidden relative"
      style={{
        background: isGradient ? colors.background : colors.primary,
      }}
    >
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <h2 
            className="text-2xl mb-1"
            style={{ color: colors.text }}
          >
            {card.name || 'Your Name'}
          </h2>
          <p 
            className="text-sm opacity-90"
            style={{ color: colors.text }}
          >
            {card.title || 'Your Title'}
          </p>
          <p 
            className="text-sm opacity-80 mt-0.5"
            style={{ color: colors.text }}
          >
            {card.company || 'Company Name'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5">
          {card.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: colors.text }} className="opacity-80" />
              <span className="text-xs" style={{ color: colors.text }}>
                {card.email}
              </span>
            </div>
          )}
          {card.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: colors.text }} className="opacity-80" />
              <span className="text-xs" style={{ color: colors.text }}>
                {card.phone}
              </span>
            </div>
          )}
          {card.website && (
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: colors.text }} className="opacity-80" />
              <span className="text-xs" style={{ color: colors.text }}>
                {card.website}
              </span>
            </div>
          )}
          {card.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: colors.text }} className="opacity-80" />
              <span className="text-xs" style={{ color: colors.text }}>
                {card.address}
              </span>
            </div>
          )}
          
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            {card.linkedin && (
              <Linkedin size={16} style={{ color: colors.text }} className="opacity-80" />
            )}
            {card.twitter && (
              <Twitter size={16} style={{ color: colors.text }} className="opacity-80" />
            )}
          </div>
        </div>

        {/* Decorative Element */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10"
          style={{ backgroundColor: colors.secondary }}
        />
      </div>
    </div>
  );
}
