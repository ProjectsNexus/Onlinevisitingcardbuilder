# Advanced Block-Based Card Editor Guide

## Overview

The CardLink application has been upgraded to a professional block-based card editor with advanced features including drag-and-drop layout, real-time styling, undo/redo, and QR code generation for sharing.

## Key Features

### 1. Block-Based Design System
- **9 Block Types**: Text, Heading, Image, Logo, Icon, Link, Shape, QR Code, Map
- **Full Customization**: Position, size, colors, typography, effects
- **Responsive Canvas**: 800x500px default layout, fully customizable

### 2. Advanced Editing Tools

#### Canvas Editor
- Drag blocks to reposition
- Resize blocks with handles
- Click to select blocks
- Multi-layer z-index management
- Snap-to-grid positioning (10px grid)

#### Style Panel (Right)
- Real-time font size adjustment (8-72px)
- Font weight options (Normal, 600, Bold)
- Text alignment (Left, Center, Right)
- Color picker for text and background
- Border radius, padding, opacity controls
- Shadow and border styling

#### Tools Panel (Left)
- Quick block addition buttons
- Duplicate selected block
- Delete block with keyboard (Del key)
- Undo/Redo with history manager (50-state limit)
- Export card as JSON

### 3. Publishing & Sharing

#### PublishModal
- Generate unique public URLs with custom slugs
- QR code generation and download
- Copy shareable link to clipboard
- Social media sharing (Twitter, Facebook, LinkedIn, Email)
- Public card viewer with view counter

### 4. History & Undo/Redo
- Automatic state capturing after each change
- Up to 50 states in history
- Undo/Redo buttons and keyboard shortcuts
- Full card state restoration

## Component Architecture

```
CardEditor (Main Container)
├── ToolsPanel (Left Sidebar)
│   ├── Block Addition Tools
│   ├── Block Actions (Duplicate, Delete)
│   └── Edit Controls (Undo/Redo)
├── Canvas (Center)
│   └── DraggableBlock (for each block)
│       └── BlockContent (Renders block type)
└── StylePanel (Right Sidebar)
    └── Style Controls (Typography, Colors, Spacing)

PublishModal
├── URL Slug Configuration
├── QR Code Generator
├── Share Options
└── Social Media Links

PublicCardViewer
├── Card Display
├── Share & Download Buttons
└── View Counter
```

## Data Schema

### VisitingCard
```typescript
{
  id: string;
  userId?: string;
  layout: CardLayout;           // Canvas dimensions & background
  blocks: CardBlock[];          // Array of blocks
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  publishedUrl?: string;
  publishedSlug?: string;       // URL slug for public sharing
  views: number;
  shares: number;
  downloads: number;
  isPublished?: boolean;
}
```

### CardBlock
```typescript
{
  id: string;
  type: BlockType;              // text | heading | image | logo | icon | link | shape | qr | map
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: BlockStyle;            // Colors, typography, spacing, effects
  content: string;              // Text, URL, or data
  metadata?: Record<string, any>;
  zIndex: number;
}
```

## Usage Guide

### Creating a New Card

1. Click "Create New" in the dashboard
2. Use Tools Panel to add blocks:
   - Click any block type button
   - Block appears on canvas
3. Click a block to select it
4. Use Style Panel to customize:
   - Change text content
   - Adjust colors and typography
   - Modify sizing and spacing

### Editing Blocks

**Moving**: Click and drag any block to new position
**Resizing**: Click selected block, drag blue handle at bottom-right
**Styling**: Select block, use Style Panel on right
**Deleting**: Select block, press Delete or click Delete button

### Undo/Redo

- **Undo**: Ctrl+Z or Click Undo button
- **Redo**: Ctrl+Y or Click Redo button
- **Export**: Download card as JSON for backup

### Publishing & Sharing

1. Click "Publish" button
2. Enter custom URL slug (or accept auto-generated)
3. Download QR code or copy public link
4. Share on social media or via QR code

## Utility Functions

### Block Operations (blockUtils.ts)

```typescript
createBlock(type, position, size, content)     // Create new block
updateBlockPosition(block, position)           // Move block
updateBlockSize(block, size)                   // Resize block
updateBlockStyle(block, style)                 // Apply styles
updateBlockContent(block, content)             // Update text/URL
duplicateBlock(block, offset)                  // Duplicate with offset
bringToFront(block, blocks)                    // Set max z-index
sendToBack(block)                              // Set z-index to 0
sortBlocksByZIndex(blocks)                     // Sort by z-order
```

### History Management (historyManager.ts)

```typescript
historyManager.push(card, description)         // Save state
historyManager.undo()                          // Go back
historyManager.redo()                          // Go forward
historyManager.canUndo()                       // Check if can undo
historyManager.canRedo()                       // Check if can redo
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete Block | Delete / Backspace |
| Undo | Ctrl+Z / Cmd+Z |
| Redo | Ctrl+Y / Cmd+Y |
| Zoom In | Canvas Control + |
| Zoom Out | Canvas Control − |
| Select Block | Click |
| Deselect | Click Canvas |

## Styling Options

### Typography
- Font Size: 8px - 72px
- Font Weight: Normal, 600, Bold
- Font Family: Inter, sans-serif (customizable)
- Line Height: Adjustable
- Letter Spacing: Adjustable
- Text Align: Left, Center, Right

### Colors
- Text Color: Full color picker
- Background Color: Full color picker
- Border Color & Width: Customizable
- Shadow: X, Y, Blur, Color

### Spacing
- Padding: 0px - 50px
- Border Radius: 0px - 50px
- Opacity: 0% - 100%

## Block Types

### Text
- Basic text content
- Full typography control
- Great for body text

### Heading
- Large text with bold weight
- Perfect for titles
- Highly visible

### Image
- URL-based images
- Object-fit: cover
- Rounded corners supported

### Logo
- Same as image but object-fit: contain
- Ideal for logos and icons

### Icon
- Single character emoji or symbol
- Customizable size and color

### Link
- Clickable hyperlink
- Shows as blue underlined text
- Opens in new tab

### Shape
- Solid colored rectangle
- Customizable background
- Good for dividers

### QR Code
- Embed QR codes on card
- Links to external URLs
- Can be generated dynamically

### Map
- Embed iframe-based maps
- Use Google Maps embed URLs
- Responsive sizing

## Firebase Integration

The editor saves all changes to Firestore:

- Cards are stored per user (by userId)
- Auto-save triggered after save button
- Real-time view counter
- Published cards accessible via slug

## Performance Tips

1. **Limit Blocks**: Keep under 20 blocks per card for smooth performance
2. **Image Optimization**: Use compressed images
3. **Layer Management**: Use z-index effectively
4. **History Limit**: Auto-trimmed to 50 states

## Troubleshooting

### Card Won't Save
- Check Firebase connection
- Verify user is authenticated
- Check browser console for errors

### Blocks Not Dragging
- Ensure editing mode is enabled
- Check z-index values
- Try refreshing the page

### QR Code Not Generating
- Verify slug is valid (alphanumeric + hyphen)
- Check if card is published
- Try different slug

### Styles Not Applying
- Ensure block is selected
- Check for conflicting CSS
- Try exporting and reimporting

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Limited editing, full viewing

## Advanced Customization

### Custom Block Types
Extend `blockTools` array in `ToolsPanel.tsx` to add new types

### Custom Styles
Modify `getDefaultStyle()` in `blockUtils.ts` for type defaults

### Theme Colors
Update design tokens in `globals.css` or component CSS files

## Future Enhancements

- [ ] Batch operations
- [ ] Advanced templates
- [ ] Animation support
- [ ] Collaborative editing
- [ ] Custom fonts
- [ ] Image cropping tool
- [ ] Color palette management
- [ ] Lock/unlock blocks
- [ ] Guides and alignment tools
- [ ] Mobile responsive preview
