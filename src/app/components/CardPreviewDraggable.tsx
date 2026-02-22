import { useState } from 'react';
import { VisitingCard, ElementPosition } from '../types/card';
import { Mail, Phone, Globe, MapPin, Linkedin, Twitter } from 'lucide-react';
import Draggable from 'react-draggable';
import { Button } from './ui/button';

interface CardPreviewDraggableProps {
  card: VisitingCard;
  isEditing: boolean;
  onUpdateStyles?: (elementName: string, fontSize: number, position: ElementPosition) => void;
  template?: {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
  };
}

export function CardPreviewDraggable({
  card,
  isEditing,
  onUpdateStyles,
  template,
}: CardPreviewDraggableProps) {
  const colors = card.customColors || template?.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    text: '#333333',
    background: '#ffffff',
  };

  const [localFontSizes, setLocalFontSizes] = useState({
    name: card.elementStyles?.name?.fontSize || 24,
    title: card.elementStyles?.title?.fontSize || 14,
    company: card.elementStyles?.company?.fontSize || 12,
    contact: card.elementStyles?.email?.fontSize || 12,
  });

  const [positions, setPositions] = useState({
    header: card.elementStyles?.name?.position || { x: 0, y: 0 },
    contact: card.elementStyles?.email?.position || { x: 0, y: 80 },
  });

  const isGradient = colors.background.includes('gradient');

  const handleFontSizeChange = (element: string, size: number) => {
    setLocalFontSizes(prev => ({ ...prev, [element]: size }));
    if (onUpdateStyles) {
      onUpdateStyles(element, size, positions[element as keyof typeof positions]);
    }
  };

  const handleDragStop = (element: string, d: { x: number; y: number }) => {
    const newPosition = { x: d.x, y: d.y };
    setPositions(prev => ({ ...prev, [element]: newPosition }));
    if (onUpdateStyles) {
      onUpdateStyles(element, localFontSizes[element as keyof typeof localFontSizes], newPosition);
    }
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-3">Editing Mode - Drag elements and adjust sizes</p>
          
          <div className="space-y-3">
            {/* Name Font Size Control */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Name Font Size: {localFontSizes.name}px
              </label>
              <input
                type="range"
                min="16"
                max="36"
                value={localFontSizes.name}
                onChange={(e) => handleFontSizeChange('name', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Title Font Size Control */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Title Font Size: {localFontSizes.title}px
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={localFontSizes.title}
                onChange={(e) => handleFontSizeChange('title', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Company Font Size Control */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Company Font Size: {localFontSizes.company}px
              </label>
              <input
                type="range"
                min="8"
                max="18"
                value={localFontSizes.company}
                onChange={(e) => handleFontSizeChange('company', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Contact Font Size Control */}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">
                Contact Font Size: {localFontSizes.contact}px
              </label>
              <input
                type="range"
                min="8"
                max="16"
                value={localFontSizes.contact}
                onChange={(e) => handleFontSizeChange('contact', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Card Preview */}
      <div 
        className="w-full aspect-[1.75/1] rounded-xl shadow-2xl overflow-hidden relative bg-white"
        style={{
          background: isGradient ? colors.background : colors.primary,
        }}
      >
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Header - Draggable in edit mode */}
          <Draggable
            disabled={!isEditing}
            onStop={(e, d) => handleDragStop('header', d)}
            defaultPosition={positions.header}
          >
            <div className={isEditing ? 'cursor-move bg-blue-100 bg-opacity-10 p-2 rounded' : ''}>
              <h2 
                className="mb-1"
                style={{
                  color: colors.text,
                  fontSize: `${localFontSizes.name}px`,
                  fontWeight: 600,
                }}
              >
                {card.name || 'Your Name'}
              </h2>
              <p 
                className="opacity-90"
                style={{
                  color: colors.text,
                  fontSize: `${localFontSizes.title}px`,
                }}
              >
                {card.title || 'Your Title'}
              </p>
              <p 
                className="opacity-80 mt-0.5"
                style={{
                  color: colors.text,
                  fontSize: `${localFontSizes.company}px`,
                }}
              >
                {card.company || 'Company Name'}
              </p>
            </div>
          </Draggable>

          {/* Contact Info - Draggable in edit mode */}
          <Draggable
            disabled={!isEditing}
            onStop={(e, d) => handleDragStop('contact', d)}
            defaultPosition={positions.contact}
          >
            <div className={isEditing ? 'cursor-move bg-blue-100 bg-opacity-10 p-2 rounded' : ''}>
              <div className="space-y-1.5">
                {card.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: colors.text }} className="opacity-80" />
                    <span style={{
                      color: colors.text,
                      fontSize: `${localFontSizes.contact}px`,
                    }}>
                      {card.email}
                    </span>
                  </div>
                )}
                {card.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: colors.text }} className="opacity-80" />
                    <span style={{
                      color: colors.text,
                      fontSize: `${localFontSizes.contact}px`,
                    }}>
                      {card.phone}
                    </span>
                  </div>
                )}
                {card.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} style={{ color: colors.text }} className="opacity-80" />
                    <span style={{
                      color: colors.text,
                      fontSize: `${localFontSizes.contact}px`,
                    }}>
                      {card.website}
                    </span>
                  </div>
                )}
                {card.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: colors.text }} className="opacity-80" />
                    <span style={{
                      color: colors.text,
                      fontSize: `${localFontSizes.contact}px`,
                    }}>
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
            </div>
          </Draggable>

          {/* Decorative Element */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 pointer-events-none"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
      </div>
    </div>
  );
}
