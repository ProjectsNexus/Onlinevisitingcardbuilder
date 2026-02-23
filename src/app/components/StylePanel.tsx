import React from 'react';
import { CardBlock, BlockStyle } from '../types/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import './StylePanel.css';

interface StylePanelProps {
  block: CardBlock | null;
  onStyleChange: (style: Partial<BlockStyle>) => void;
}

export function StylePanel({ block, onStyleChange }: StylePanelProps) {
  if (!block) {
    return (
      <div className="style-panel">
        <div className="empty-state">
          <p>Select a block to edit its style</p>
        </div>
      </div>
    );
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = parseInt(e.target.value);
    if (!isNaN(fontSize)) {
      onStyleChange({ fontSize });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({ color: e.target.value });
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({ backgroundColor: e.target.value });
  };

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    onStyleChange({ textAlign: align });
  };

  const handleFontWeightChange = (weight: 'normal' | 'bold' | '600') => {
    onStyleChange({ fontWeight: weight });
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = parseInt(e.target.value);
    if (!isNaN(radius)) {
      onStyleChange({ borderRadius: radius });
    }
  };

  const handlePaddingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const padding = parseInt(e.target.value);
    if (!isNaN(padding)) {
      onStyleChange({ padding });
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value);
    if (!isNaN(opacity)) {
      onStyleChange({ opacity });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // This would be handled by parent component
  };

  const isTextBlock = ['text', 'heading', 'link'].includes(block.type);

  return (
    <div className="style-panel">
      <div className="style-section">
        <h3 className="style-title">Block: {block.type.toUpperCase()}</h3>
      </div>

      {/* Content */}
      {['text', 'heading', 'link', 'icon'].includes(block.type) && (
        <div className="style-section">
          <Label>Content</Label>
          <input
            type={block.type === 'icon' ? 'text' : 'text'}
            value={block.content}
            onChange={handleContentChange}
            placeholder="Enter content"
            className="style-input"
            maxLength={block.type === 'icon' ? 1 : 500}
          />
        </div>
      )}

      {['image', 'logo', 'qr'].includes(block.type) && (
        <div className="style-section">
          <Label>Image URL</Label>
          <input
            type="url"
            value={block.content}
            onChange={handleContentChange}
            placeholder="https://..."
            className="style-input"
          />
        </div>
      )}

      {block.type === 'link' && (
        <div className="style-section">
          <Label>URL</Label>
          <input
            type="url"
            value={block.content}
            onChange={handleContentChange}
            placeholder="https://..."
            className="style-input"
          />
        </div>
      )}

      {block.type === 'map' && (
        <div className="style-section">
          <Label>Map Embed URL</Label>
          <input
            type="url"
            value={block.content}
            onChange={handleContentChange}
            placeholder="Google Maps embed URL"
            className="style-input"
          />
        </div>
      )}

      {/* Font Size */}
      {isTextBlock && (
        <div className="style-section">
          <div className="style-label-row">
            <Label>Font Size</Label>
            <span className="style-value">{block.style.fontSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="72"
            value={block.style.fontSize || 16}
            onChange={handleFontSizeChange}
            className="style-slider"
          />
        </div>
      )}

      {/* Font Weight */}
      {isTextBlock && (
        <div className="style-section">
          <Label>Font Weight</Label>
          <div className="style-button-group">
            <button
              className={`style-btn ${block.style.fontWeight === 'normal' ? 'active' : ''}`}
              onClick={() => handleFontWeightChange('normal')}
            >
              Normal
            </button>
            <button
              className={`style-btn ${block.style.fontWeight === '600' ? 'active' : ''}`}
              onClick={() => handleFontWeightChange('600')}
            >
              600
            </button>
            <button
              className={`style-btn ${block.style.fontWeight === 'bold' ? 'active' : ''}`}
              onClick={() => handleFontWeightChange('bold')}
            >
              Bold
            </button>
          </div>
        </div>
      )}

      {/* Text Align */}
      {isTextBlock && (
        <div className="style-section">
          <Label>Text Align</Label>
          <div className="style-button-group">
            <button
              className={`style-btn ${block.style.textAlign === 'left' ? 'active' : ''}`}
              onClick={() => handleTextAlignChange('left')}
            >
              Left
            </button>
            <button
              className={`style-btn ${block.style.textAlign === 'center' ? 'active' : ''}`}
              onClick={() => handleTextAlignChange('center')}
            >
              Center
            </button>
            <button
              className={`style-btn ${block.style.textAlign === 'right' ? 'active' : ''}`}
              onClick={() => handleTextAlignChange('right')}
            >
              Right
            </button>
          </div>
        </div>
      )}

      {/* Color */}
      <div className="style-section">
        <Label>Color</Label>
        <div className="color-input-group">
          <input
            type="color"
            value={block.style.color || '#000000'}
            onChange={handleColorChange}
            className="color-input"
          />
          <input
            type="text"
            value={block.style.color || '#000000'}
            onChange={handleColorChange}
            className="style-input"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="style-section">
        <Label>Background</Label>
        <div className="color-input-group">
          <input
            type="color"
            value={block.style.backgroundColor || '#ffffff'}
            onChange={handleBackgroundChange}
            className="color-input"
          />
          <input
            type="text"
            value={block.style.backgroundColor || '#ffffff'}
            onChange={handleBackgroundChange}
            className="style-input"
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Border Radius */}
      <div className="style-section">
        <div className="style-label-row">
          <Label>Border Radius</Label>
          <span className="style-value">{block.style.borderRadius || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={block.style.borderRadius || 0}
          onChange={handleBorderRadiusChange}
          className="style-slider"
        />
      </div>

      {/* Padding */}
      <div className="style-section">
        <div className="style-label-row">
          <Label>Padding</Label>
          <span className="style-value">{block.style.padding || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={block.style.padding || 0}
          onChange={handlePaddingChange}
          className="style-slider"
        />
      </div>

      {/* Opacity */}
      <div className="style-section">
        <div className="style-label-row">
          <Label>Opacity</Label>
          <span className="style-value">{Math.round((block.style.opacity || 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={block.style.opacity || 1}
          onChange={handleOpacityChange}
          className="style-slider"
        />
      </div>
    </div>
  );
}
