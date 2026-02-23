import React, { useState } from 'react';
import { CardBlock } from '../types/card';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface BlockContentProps {
  block: CardBlock;
  isEditing: boolean;
  isSelected: boolean;
}

export function BlockContent({
  block,
  isEditing,
  isSelected,
}: BlockContentProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const getBlockContent = () => {
    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      fontSize: block.style.fontSize,
      fontWeight: block.style.fontWeight === 'bold' ? 'bold' : 'normal',
      fontFamily: block.style.fontFamily,
      color: block.style.color,
      backgroundColor: block.style.backgroundColor,
      textAlign: block.style.textAlign as any,
      borderRadius: block.style.borderRadius,
      padding: block.style.padding,
      opacity: block.style.opacity,
      lineHeight: block.style.lineHeight,
      letterSpacing: block.style.letterSpacing,
      border: block.style.border
        ? `${block.style.border.width}px ${block.style.border.style} ${block.style.border.color}`
        : undefined,
      boxShadow: block.style.shadow
        ? `${block.style.shadow.offsetX}px ${block.style.shadow.offsetY}px ${block.style.shadow.blur}px ${block.style.shadow.color}`
        : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    };

    switch (block.type) {
      case 'text':
      case 'heading':
        return (
          <div style={style}>
            {isEditing && !block.content ? (
              <span style={{ opacity: 0.5 }}>Click to edit</span>
            ) : (
              block.content || 'Text'
            )}
          </div>
        );

      case 'image':
        return (
          <div style={style}>
            {block.content && !imageError ? (
              <>
                {isLoadingImage && <Loader2 size={20} className="animate-spin" />}
                <img
                  src={block.content}
                  alt="Block content"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isLoadingImage ? 'none' : 'block',
                  }}
                  onLoad={() => setIsLoadingImage(false)}
                  onError={() => {
                    setImageError(true);
                    setIsLoadingImage(false);
                  }}
                  onLoadingCapture={() => setIsLoadingImage(true)}
                />
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <ImageIcon size={32} opacity={0.5} />
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  {imageError ? 'Failed to load' : 'Add image URL'}
                </p>
              </div>
            )}
          </div>
        );

      case 'logo':
        return (
          <div style={style}>
            {block.content && !imageError ? (
              <img
                src={block.content}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: isLoadingImage ? 'none' : 'block',
                }}
                onLoad={() => setIsLoadingImage(false)}
                onError={() => {
                  setImageError(true);
                  setIsLoadingImage(false);
                }}
                onLoadingCapture={() => setIsLoadingImage(true)}
              />
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>Logo</div>
            )}
          </div>
        );

      case 'link':
        return (
          <a
            href={block.content || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...style,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={(e) => isEditing && e.preventDefault()}
          >
            {block.content || 'Link'}
          </a>
        );

      case 'shape':
        return <div style={style} />;

      case 'qr':
        return (
          <div style={style}>
            {block.content ? (
              <img
                src={block.content}
                alt="QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>QR Code</div>
            )}
          </div>
        );

      case 'icon':
        return (
          <div style={style}>
            <span style={{ fontSize: block.style.fontSize }}>
              {block.content || '★'}
            </span>
          </div>
        );

      case 'map':
        return (
          <div style={style}>
            {block.content ? (
              <iframe
                src={block.content}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: block.style.borderRadius,
                }}
                title="Map"
              />
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>Map</div>
            )}
          </div>
        );

      default:
        return <div style={style}>{block.content}</div>;
    }
  };

  return getBlockContent();
}
