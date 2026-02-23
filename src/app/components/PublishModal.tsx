import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { VisitingCard } from '../types/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Download, Copy, Check } from 'lucide-react';
import './PublishModal.css';

interface PublishModalProps {
  card: VisitingCard;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (slug: string) => Promise<void>;
  isLoading?: boolean;
}

export function PublishModal({
  card,
  isOpen,
  onClose,
  onPublish,
  isLoading = false,
}: PublishModalProps) {
  const [slug, setSlug] = useState(
    card.publishedSlug || card.id.replace(/[^a-z0-9]/g, '')
  );
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/card/${slug}`;

  const handlePublish = async () => {
    await onPublish(slug);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr-${slug}.png`;
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

  return (
    <div className="publish-modal-overlay" onClick={onClose}>
      <div className="publish-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Publish Card</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Slug Configuration */}
          <div className="modal-section">
            <Label>Card URL Slug</Label>
            <div className="slug-input-group">
              <span className="slug-prefix">{window.location.origin}/card/</span>
              <Input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="my-card"
                className="slug-input"
              />
            </div>
            <p className="slug-help">
              Public URL: <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a>
            </p>
          </div>

          {/* QR Code */}
          <div className="modal-section">
            <Label>QR Code</Label>
            <div className="qr-container" ref={qrRef}>
              <QRCode
                value={publicUrl}
                size={256}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: undefined,
                  x: undefined,
                  y: undefined,
                  height: 0,
                  width: 0,
                }}
              />
            </div>
          </div>

          {/* Share Options */}
          <div className="modal-section">
            <Label>Share Options</Label>
            <div className="share-buttons">
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="share-btn"
              >
                <Download size={16} className="mr-2" />
                Download QR
              </Button>
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                className="share-btn"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div className="modal-section">
            <Label>Share on Social Media</Label>
            <div className="social-buttons">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=Check%20out%20my%20digital%20card!`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn twitter"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn facebook"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn linkedin"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=My%20Digital%20Card&body=${encodeURIComponent(publicUrl)}`}
                className="social-btn email"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading || !slug}
          >
            {isLoading ? 'Publishing...' : 'Publish & Share'}
          </Button>
        </div>
      </div>
    </div>
  );
}
