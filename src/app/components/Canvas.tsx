import React, { useState, useRef, useEffect } from 'react';
import { VisitingCard, CardBlock, BlockPosition } from '../types/card';
import { DraggableBlock } from './DraggableBlock';
import { sortBlocksByZIndex } from '../utils/blockUtils';
import './Canvas.css';

interface CanvasProps {
  card: VisitingCard;
  selectedBlockId?: string;
  onBlockMove: (blockId: string, position: BlockPosition) => void;
  onBlockResize: (blockId: string, width: number, height: number) => void;
  onBlockSelect: (blockId: string | null) => void;
  onBlockDelete: (blockId: string) => void;
  isEditing: boolean;
  zoom: number;
}

export function Canvas({
  card,
  selectedBlockId,
  onBlockMove,
  onBlockResize,
  onBlockSelect,
  onBlockDelete,
  isEditing,
  zoom,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sortedBlocks = sortBlocksByZIndex(card.blocks);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onBlockSelect(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedBlockId && isEditing) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onBlockDelete(selectedBlockId);
      }
    }
  };

  useEffect(() => {
    if (isEditing) {
      canvasRef.current?.addEventListener('keydown', handleKeyDown as any);
      return () => {
        canvasRef.current?.removeEventListener('keydown', handleKeyDown as any);
      };
    }
  }, [selectedBlockId, isEditing, onBlockDelete]);

  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      style={{
        backgroundColor: card.layout.backgroundColor,
        backgroundImage: card.layout.backgroundImage
          ? `url(${card.layout.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: card.layout.width,
        height: card.layout.height,
        position: 'relative',
        cursor: isEditing ? 'default' : 'pointer',
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
        overflow: 'hidden',
      }}
      onClick={handleCanvasClick}
    >
      {sortedBlocks.map((block) => (
        <DraggableBlock
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          isEditing={isEditing}
          onSelect={() => onBlockSelect(block.id)}
          onMove={onBlockMove}
          onResize={onBlockResize}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      ))}
    </div>
  );
}
