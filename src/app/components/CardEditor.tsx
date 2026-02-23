import React, { useState, useCallback, useEffect } from 'react';
import { VisitingCard, CardBlock, BlockType, BlockPosition, BlockStyle, CardLayout } from '../types/card';
import { Canvas } from './Canvas';
import { ToolsPanel } from './ToolsPanel';
import { StylePanel } from './StylePanel';
import { ExportModal } from './ExportModal';
import { HistoryManager } from '../utils/historyManager';
import { createBlock, updateBlockPosition, updateBlockSize, updateBlockStyle, duplicateBlock, bringToFront, sortBlocksByZIndex } from '../utils/blockUtils';
import { saveCardToFirestore } from '../utils/firebaseStorage';
import { Button } from './ui/button';
import { Menu, X, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import './CardEditor.css';

interface CardEditorProps {
  card: VisitingCard;
  onSave: (card: VisitingCard) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CardEditor({
  card: initialCard,
  onSave,
  onCancel,
  isLoading = false,
}: CardEditorProps) {
  const [card, setCard] = useState<VisitingCard>(initialCard);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showToolsPanel, setShowToolsPanel] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [historyManager] = useState(() => new HistoryManager(initialCard));

  // Auto-save to history on card change
  useEffect(() => {
    historyManager.push(card, 'Card updated');
  }, [card]);

  const selectedBlock = card.blocks.find(b => b.id === selectedBlockId);

  const handleAddBlock = useCallback((type: BlockType) => {
    const newBlock = createBlock(
      type,
      { x: 100, y: 100 },
      { width: 150, height: 50 },
      type === 'text' ? 'Your text here' : type === 'heading' ? 'Heading' : ''
    );

    setCard(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));

    setSelectedBlockId(newBlock.id);
  }, []);

  const handleBlockMove = useCallback((blockId: string, position: BlockPosition) => {
    setCard(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId ? updateBlockPosition(b, position) : b
      ),
    }));
  }, []);

  const handleBlockResize = useCallback((blockId: string, width: number, height: number) => {
    setCard(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId ? updateBlockSize(b, { width, height }) : b
      ),
    }));
  }, []);

  const handleBlockSelect = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockDelete = useCallback((blockId: string) => {
    setCard(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId),
    }));
    setSelectedBlockId(null);
  }, []);

  const handleStyleChange = useCallback((style: Partial<BlockStyle>) => {
    if (!selectedBlockId) return;

    setCard(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === selectedBlockId
          ? updateBlockStyle(b, style)
          : b
      ),
    }));
  }, [selectedBlockId]);

  const handleBlockContentChange = useCallback((content: string) => {
    if (!selectedBlockId) return;

    setCard(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === selectedBlockId ? { ...b, content } : b
      ),
    }));
  }, [selectedBlockId]);

  const handleDuplicate = useCallback(() => {
    if (!selectedBlockId) return;

    const blockToDuplicate = card.blocks.find(b => b.id === selectedBlockId);
    if (!blockToDuplicate) return;

    const duplicatedBlock = duplicateBlock(blockToDuplicate);

    setCard(prev => ({
      ...prev,
      blocks: [...prev.blocks, duplicatedBlock],
    }));

    setSelectedBlockId(duplicatedBlock.id);
  }, [selectedBlockId, card.blocks]);

  const handleUndo = useCallback(() => {
    const previousCard = historyManager.undo();
    if (previousCard) {
      setCard(previousCard);
    }
  }, [historyManager]);

  const handleRedo = useCallback(() => {
    const nextCard = historyManager.redo();
    if (nextCard) {
      setCard(nextCard);
    }
  }, [historyManager]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(card, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `card-${card.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [card]);

  const handleLayoutChange = useCallback((layout: Partial<CardLayout>) => {
    setCard(prev => ({
      ...prev,
      layout: { ...prev.layout, ...layout },
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(card);
  }, [card, onSave]);

  const handlePublishCard = useCallback(async (slug: string) => {
    try {
      setIsPublishing(true);
      const updatedCard: VisitingCard = {
        ...card,
        publishedSlug: slug,
        publishedUrl: `${window.location.origin}/card/${slug}`,
        publishedAt: new Date().toISOString(),
        isPublished: true,
      };

      await saveCardToFirestore(updatedCard);
      setCard(updatedCard);
      toast.success('Card published successfully!');
      setShowExportModal(false);
    } catch (error) {
      console.error('Failed to publish card:', error);
      toast.error('Failed to publish card. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  }, [card]);

  return (
    <div className="card-editor">
      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowToolsPanel(!showToolsPanel)}
          >
            <Menu size={16} />
          </Button>
          <h2 className="editor-title">Card Editor</h2>
        </div>

        <div className="header-center">
          <div className="zoom-controls">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(z => Math.max(25, z - 10))}
            >
              −
            </Button>
            <span className="zoom-value">{zoom}%</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(z => Math.min(200, z + 10))}
            >
              +
            </Button>
          </div>
        </div>

        <div className="header-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Share2 size={16} className="mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save size={16} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="editor-content">
        {/* Tools Panel */}
        {showToolsPanel && (
          <ToolsPanel
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            onDelete={() => selectedBlockId && handleBlockDelete(selectedBlockId)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onExport={handleExport}
            selectedBlockId={selectedBlockId}
            canUndo={historyManager.canUndo()}
            canRedo={historyManager.canRedo()}
          />
        )}

        {/* Canvas */}
        <div className="editor-canvas-wrapper">
          <Canvas
            card={card}
            selectedBlockId={selectedBlockId}
            onBlockMove={handleBlockMove}
            onBlockResize={handleBlockResize}
            onBlockSelect={handleBlockSelect}
            onBlockDelete={handleBlockDelete}
            isEditing={true}
            zoom={zoom}
          />
        </div>

        {/* Style Panel */}
        {showStylePanel && (
          <StylePanel
            block={selectedBlock || null}
            onStyleChange={handleStyleChange}
          />
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        card={card}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onPublish={handlePublishCard}
        isLoading={isPublishing}
      />
    </div>
  );
}
