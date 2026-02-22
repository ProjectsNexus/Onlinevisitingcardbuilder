import { useState } from 'react';
import Draggable from 'react-draggable';
import { VisitingCard, ElementStyles, ElementStyle } from '../types/card';
import { Mail, Phone, Globe, MapPin, Linkedin, Twitter, Move, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

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
  editMode?: boolean;
  onElementStyleChange?: (elementStyles: ElementStyles) => void;
}

// Default element styles
const defaultElementStyles: ElementStyles = {
  name: { x: 0, y: 0, fontSize: 24 },
  title: { x: 0, y: 40, fontSize: 14 },
  company: { x: 0, y: 65, fontSize: 14 },
  email: { x: 0, y: 100, fontSize: 12 },
  phone: { x: 0, y: 120, fontSize: 12 },
  website: { x: 0, y: 140, fontSize: 12 },
  address: { x: 0, y: 160, fontSize: 12 },
  social: { x: 0, y: 185, fontSize: 16 },
};

export function CardPreview({ card, template, editMode = false, onElementStyleChange }: CardPreviewProps) {
  const colors = card.customColors || template?.colors || {
    primary: '#000000',
    secondary: '#ffffff',
    text: '#333333',
    background: '#ffffff',
  };

  const [elementStyles, setElementStyles] = useState<ElementStyles>(
    card.elementStyles || defaultElementStyles
  );

  const [activeElement, setActiveElement] = useState<string | null>(null);

  const isGradient = colors.background.includes('gradient');

  const handleDrag = (element: keyof ElementStyles, data: { x: number; y: number }) => {
    const newStyles = {
      ...elementStyles,
      [element]: {
        ...elementStyles[element],
        x: data.x,
        y: data.y,
      },
    };
    setElementStyles(newStyles);
    onElementStyleChange?.(newStyles);
  };

  const handleFontSizeChange = (element: keyof ElementStyles, fontSize: number) => {
    const newStyles = {
      ...elementStyles,
      [element]: {
        ...elementStyles[element],
        fontSize,
      },
    };
    setElementStyles(newStyles);
    onElementStyleChange?.(newStyles);
  };

  const DraggableElement = ({
    elementKey,
    children,
    style,
  }: {
    elementKey: keyof ElementStyles;
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => {
    const elementStyle = elementStyles[elementKey];
    const isActive = activeElement === elementKey;

    if (!editMode) {
      return (
        <div
          style={{
            ...style,
            fontSize: `${elementStyle.fontSize}px`,
            position: 'absolute',
            left: elementStyle.x,
            top: elementStyle.y,
          }}
        >
          {children}
        </div>
      );
    }

    return (
      <Draggable
        position={{ x: elementStyle.x, y: elementStyle.y }}
        onDrag={(e, data) => handleDrag(elementKey, data)}
        onStart={() => setActiveElement(elementKey)}
        onStop={() => setActiveElement(null)}
      >
        <div
          className={`cursor-move ${
            isActive ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'
          }`}
          style={{
            ...style,
            fontSize: `${elementStyle.fontSize}px`,
            position: 'absolute',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          }}
        >
          {isActive && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Move size={12} />
              Drag to move
            </div>
          )}
          {children}
        </div>
      </Draggable>
    );
  };

  return (
    <div className="space-y-4">
      <div
        className="w-full aspect-[1.75/1] rounded-xl shadow-2xl overflow-hidden relative"
        style={{
          background: isGradient ? colors.background : colors.primary,
        }}
      >
        <div className="absolute inset-0 p-6">
          {/* Name */}
          <DraggableElement
            elementKey="name"
            style={{ color: colors.text, lineHeight: 1.2 }}
          >
            {card.name || 'Your Name'}
          </DraggableElement>

          {/* Title */}
          {card.title && (
            <DraggableElement
              elementKey="title"
              style={{ color: colors.text, opacity: 0.9, lineHeight: 1.2 }}
            >
              {card.title}
            </DraggableElement>
          )}

          {/* Company */}
          {card.company && (
            <DraggableElement
              elementKey="company"
              style={{ color: colors.text, opacity: 0.8, lineHeight: 1.2 }}
            >
              {card.company}
            </DraggableElement>
          )}

          {/* Email */}
          {card.email && (
            <DraggableElement elementKey="email">
              <div className="flex items-center gap-2" style={{ color: colors.text }}>
                <Mail size={14} className="opacity-80" />
                <span>{card.email}</span>
              </div>
            </DraggableElement>
          )}

          {/* Phone */}
          {card.phone && (
            <DraggableElement elementKey="phone">
              <div className="flex items-center gap-2" style={{ color: colors.text }}>
                <Phone size={14} className="opacity-80" />
                <span>{card.phone}</span>
              </div>
            </DraggableElement>
          )}

          {/* Website */}
          {card.website && (
            <DraggableElement elementKey="website">
              <div className="flex items-center gap-2" style={{ color: colors.text }}>
                <Globe size={14} className="opacity-80" />
                <span>{card.website}</span>
              </div>
            </DraggableElement>
          )}

          {/* Address */}
          {card.address && (
            <DraggableElement elementKey="address">
              <div className="flex items-center gap-2" style={{ color: colors.text }}>
                <MapPin size={14} className="opacity-80" />
                <span>{card.address}</span>
              </div>
            </DraggableElement>
          )}

          {/* Social Links */}
          {(card.linkedin || card.twitter) && (
            <DraggableElement elementKey="social">
              <div className="flex gap-3" style={{ color: colors.text }}>
                {card.linkedin && <Linkedin size={16} className="opacity-80" />}
                {card.twitter && <Twitter size={16} className="opacity-80" />}
              </div>
            </DraggableElement>
          )}

          {/* Decorative Element */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 pointer-events-none"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
      </div>

      {/* Font Size Controls in Edit Mode */}
      {editMode && activeElement && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Type size={16} />
            <span className="font-medium">Font Size for {activeElement}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Size: {elementStyles[activeElement as keyof ElementStyles].fontSize}px</Label>
            </div>
            <Slider
              value={[elementStyles[activeElement as keyof ElementStyles].fontSize]}
              onValueChange={(value) =>
                handleFontSizeChange(activeElement as keyof ElementStyles, value[0])
              }
              min={8}
              max={48}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
