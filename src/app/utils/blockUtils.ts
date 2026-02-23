import { CardBlock, BlockType, BlockStyle, BlockPosition, BlockSize } from '../types/card';

export function createBlock(
  type: BlockType,
  position: BlockPosition,
  size: BlockSize,
  content: string = ''
): CardBlock {
  return {
    id: `block-${Date.now()}-${Math.random()}`,
    type,
    position,
    size,
    content,
    style: getDefaultStyle(type),
    zIndex: 1,
  };
}

export function getDefaultStyle(type: BlockType): BlockStyle {
  const defaults: Record<BlockType, BlockStyle> = {
    text: {
      fontSize: 14,
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      textAlign: 'left',
      padding: 8,
    },
    heading: {
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      color: '#000000',
      textAlign: 'left',
      padding: 8,
    },
    image: {
      borderRadius: 4,
      opacity: 1,
    },
    logo: {
      opacity: 1,
      padding: 4,
    },
    icon: {
      color: '#000000',
      opacity: 1,
    },
    link: {
      fontSize: 14,
      color: '#0066cc',
      textAlign: 'left',
      padding: 4,
    },
    shape: {
      backgroundColor: '#cccccc',
      borderRadius: 0,
    },
    qr: {
      backgroundColor: '#ffffff',
      padding: 8,
    },
    map: {
      borderRadius: 4,
    },
  };

  return defaults[type] || {};
}

export function updateBlockPosition(block: CardBlock, position: BlockPosition): CardBlock {
  return { ...block, position };
}

export function updateBlockSize(block: CardBlock, size: BlockSize): CardBlock {
  return { ...block, size };
}

export function updateBlockStyle(block: CardBlock, style: Partial<BlockStyle>): CardBlock {
  return {
    ...block,
    style: { ...block.style, ...style },
  };
}

export function updateBlockContent(block: CardBlock, content: string): CardBlock {
  return { ...block, content };
}

export function updateBlockZIndex(block: CardBlock, zIndex: number): CardBlock {
  return { ...block, zIndex };
}

export function duplicateBlock(block: CardBlock, offset: number = 20): CardBlock {
  const newBlock = { ...block };
  newBlock.id = `block-${Date.now()}-${Math.random()}`;
  newBlock.position = {
    x: block.position.x + offset,
    y: block.position.y + offset,
  };
  return newBlock;
}

export function sortBlocksByZIndex(blocks: CardBlock[]): CardBlock[] {
  return [...blocks].sort((a, b) => a.zIndex - b.zIndex);
}

export function getMaxZIndex(blocks: CardBlock[]): number {
  if (blocks.length === 0) return 0;
  return Math.max(...blocks.map(b => b.zIndex));
}

export function bringToFront(block: CardBlock, blocks: CardBlock[]): CardBlock {
  const maxZ = getMaxZIndex(blocks);
  return updateBlockZIndex(block, maxZ + 1);
}

export function sendToBack(block: CardBlock): CardBlock {
  return updateBlockZIndex(block, 0);
}

export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

export function isBlockOverlapping(block1: CardBlock, block2: CardBlock): boolean {
  return !(
    block1.position.x + block1.size.width < block2.position.x ||
    block2.position.x + block2.size.width < block1.position.x ||
    block1.position.y + block1.size.height < block2.position.y ||
    block2.position.y + block2.size.height < block1.position.y
  );
}
