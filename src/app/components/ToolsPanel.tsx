import React from 'react';
import { BlockType } from '../types/card';
import { Button } from './ui/button';
import {
  Type,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  Square,
  QrCode,
  Map,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  Download,
} from 'lucide-react';
import './ToolsPanel.css';

interface ToolsPanelProps {
  onAddBlock: (type: BlockType) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  selectedBlockId: string | null;
  canUndo: boolean;
  canRedo: boolean;
}

const blockTools: Array<{ type: BlockType; icon: any; label: string }> = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'heading', icon: Heading2, label: 'Heading' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'logo', icon: ImageIcon, label: 'Logo' },
  { type: 'link', icon: LinkIcon, label: 'Link' },
  { type: 'shape', icon: Square, label: 'Shape' },
  { type: 'qr', icon: QrCode, label: 'QR Code' },
  { type: 'map', icon: Map, label: 'Map' },
];

export function ToolsPanel({
  onAddBlock,
  onDuplicate,
  onDelete,
  onUndo,
  onRedo,
  onExport,
  selectedBlockId,
  canUndo,
  canRedo,
}: ToolsPanelProps) {
  return (
    <div className="tools-panel">
      <div className="tools-section">
        <h3 className="tools-title">Add Blocks</h3>
        <div className="block-buttons">
          {blockTools.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              className="block-button"
              onClick={() => onAddBlock(type)}
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedBlockId && (
        <div className="tools-section">
          <h3 className="tools-title">Block Actions</h3>
          <div className="action-buttons">
            <Button
              size="sm"
              variant="outline"
              onClick={onDuplicate}
              className="w-full justify-start"
            >
              <Copy size={16} className="mr-2" />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="w-full justify-start text-red-600"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="tools-section">
        <h3 className="tools-title">Edit</h3>
        <div className="edit-buttons">
          <Button
            size="sm"
            variant="outline"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1"
          >
            <Redo2 size={16} />
          </Button>
        </div>
      </div>

      <div className="tools-section">
        <Button
          size="sm"
          onClick={onExport}
          className="w-full"
        >
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
