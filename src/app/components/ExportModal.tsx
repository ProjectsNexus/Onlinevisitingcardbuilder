import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { VisitingCard } from '../types/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Download, Copy, Check, FileJson, Share2 } from 'lucide-react';
import './ExportModal.css';

interface ExportModalProps {
  card: VisitingCard;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (slug: string) => Promise<void>;
  isLoading?: boolean;
}

export function ExportModal({
  card,
  isOpen,
  onClose,
  onPublish,
  isLoading = false,
}: ExportModalProps) {
  const [slug, setSlug] = useState(
    card.publishedSlug || card.id.replace(/[^a-z0-9]/g, '')
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'json'>('qr');
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/card/${slug}`;

  const handlePublish = async () => {
    try {
      await onPublish(slug);
    } catch (error) {
      console.error('Failed to publish card:', error);
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `card-qr-${slug}.png`;
    link.click();
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(card, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `card-${card.id}.json`;
    link.click();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(value);
  };

  const handleShareOnSocial = (platform: string) => {
    const text = `Check out my digital visiting card!`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
      email: `mailto:?subject=My Digital Card&body=${encodeURIComponent(text)}%0A%0A${publicUrl}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export & Publish Card</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="tab-selector">
          <button
            className={`tab-button ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <Share2 size={16} />
            QR & Publish
          </button>
          <button
            className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            <FileJson size={16} />
            Export JSON
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'qr' && (
            <>
              {/* URL Configuration */}
              <div className="modal-section">
                <Label>Card URL Slug</Label>
                <div className="slug-input-group">
                  <span className="slug-prefix">{window.location.origin}/card/</span>
                  <Input
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="my-card"
                  />
                </div>
                <p className="slug-hint">Enter a custom URL slug for your card</p>
              </div>

              {/* QR Code Display */}
              <div className="modal-section">
                <Label>QR Code</Label>
                <div className="qr-container" ref={qrRef}>
                  <QRCode
                    value={publicUrl}
                    size={256}
                    level="H"
                    includeMargin
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                </div>
              </div>

              {/* Public URL Preview */}
              <div className="modal-section">
                <Label>Public URL</Label>
                <div className="url-display">
                  <code>{publicUrl}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="modal-section">
                <Label>Share on Social Media</Label>
                <div className="social-buttons">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareOnSocial('twitter')}
                  >
                    Twitter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareOnSocial('facebook')}
                  >
                    Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareOnSocial('linkedin')}
                  >
                    LinkedIn
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareOnSocial('email')}
                  >
                    Email
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <Button
                  variant="outline"
                  onClick={handleDownloadQR}
                >
                  <Download size={14} className="mr-2" />
                  Download QR Code
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isLoading}
                >
                  {isLoading ? 'Publishing...' : 'Publish Card'}
                </Button>
              </div>
            </>
          )}

          {activeTab === 'json' && (
            <>
              <div className="modal-section">
                <Label>Export as JSON</Label>
                <p className="export-hint">
                  Download your card as a JSON file. You can import this file later or share it with others.
                </p>
              </div>

              <div className="json-preview">
                <pre>
                  {JSON.stringify(
                    {
                      id: card.id,
                      layout: card.layout,
                      blocks: card.blocks.length,
                      createdAt: card.createdAt,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="modal-actions">
                <Button
                  onClick={handleDownloadJSON}
                >
                  <Download size={14} className="mr-2" />
                  Download JSON
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
