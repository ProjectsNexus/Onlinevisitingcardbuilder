import React, { useRef, useState } from 'react';
import { CardBlock, BlockPosition } from '../types/card';
import { snapToGrid } from '../utils/blockUtils';
import { BlockContent } from './BlockContent';

interface DraggableBlockProps {
  block: CardBlock;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onMove: (blockId: string, position: BlockPosition) => void;
  onResize: (blockId: string, width: number, height: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function DraggableBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onMove,
  onResize,
  onDragStart,
  onDragEnd,
}: DraggableBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditing) return;

    onSelect();

    if (isResizing) return;

    setIsDragging(true);
    onDragStart();

    const rect = blockRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !blockRef.current) return;

    const parentRect = blockRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const newX = snapToGrid(e.clientX - parentRect.left - dragOffset.x);
    const newY = snapToGrid(e.clientY - parentRect.top - dragOffset.y);

    onMove(block.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) return;

    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = block.size.width;
    const startHeight = block.size.height;

    const handleResizeMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.max(40, snapToGrid(startWidth + deltaX));
      const newHeight = Math.max(40, snapToGrid(startHeight + deltaY));

      onResize(block.id, newWidth, newHeight);
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeUp);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  };

  return (
    <div
      ref={blockRef}
      className={`draggable-block ${isSelected ? 'selected' : ''}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: block.size.width,
        height: block.size.height,
        zIndex: block.zIndex,
        cursor: isEditing ? 'grab' : 'pointer',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditing) onSelect();
      }}
    >
      <BlockContent block={block} isEditing={isEditing} isSelected={isSelected} />

      {isEditing && isSelected && (
        <div
          className="block-resize-handle"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
