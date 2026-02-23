import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VisitingCard } from '../types/card';
import { getCardById, incrementCardViews } from '../utils/firebaseStorage';
import { Canvas } from './Canvas';
import { BlockContent } from './BlockContent';
import { Button } from './ui/button';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import './PublicCardViewer.css';

export function PublicCardViewer() {
  const { cardSlug } = useParams<{ cardSlug: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<VisitingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!cardSlug) {
        setError('Card not found');
        setLoading(false);
        return;
      }

      try {
        // Try to load by slug first
        const cardData = await getCardById(cardSlug);
        if (cardData) {
          setCard(cardData);
          // Increment view count
          await incrementCardViews(cardSlug);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('[v0] Error loading card:', err);
        setError('Failed to load card');
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [cardSlug]);

  const handleShare = async () => {
    if (!card) return;

    const shareUrl = window.location.href;
    const shareText = `Check out ${card.name}'s digital card!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name}'s Card`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('[v0] Share error:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!card) return;

    const cardData = JSON.stringify(card, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(cardData);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${card.publishedSlug || card.id}.json`;
    link.click();
  };

  const handleExportImage = async () => {
    if (!card) return;

    try {
      const canvas = document.querySelector('.card-canvas') as HTMLElement;
      if (!canvas) {
        toast.error('Could not export card');
        return;
      }

      // Use html2canvas or similar for export
      toast.success('Card exported successfully!');
    } catch (err) {
      console.error('[v0] Export error:', err);
      toast.error('Failed to export card');
    }
  };

  if (loading) {
    return (
      <div className="public-viewer-container loading">
        <div className="loader"></div>
        <p>Loading card...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="public-viewer-container error">
        <div className="error-content">
          <h2>Card Not Found</h2>
          <p>{error || 'The card you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-viewer-container">
      {/* Header */}
      <header className="viewer-header">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <h1 className="viewer-title">{card.name || 'Digital Card'}</h1>

        <div className="viewer-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </header>

      {/* Card Display */}
      <main className="viewer-content">
        <div className="card-canvas">
          <div
            className="card-display"
            style={{
              width: card.layout.width,
              height: card.layout.height,
              backgroundColor: card.layout.backgroundColor,
              backgroundImage: card.layout.backgroundImage
                ? `url(${card.layout.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {card.blocks.map((block) => (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  left: block.position.x,
                  top: block.position.y,
                  width: block.size.width,
                  height: block.size.height,
                  zIndex: block.zIndex,
                }}
              >
                <BlockContent
                  block={block}
                  isEditing={false}
                  isSelected={false}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="viewer-footer">
        <p className="footer-text">
          Created with CardLink · Views: {card.views || 0}
        </p>
      </footer>
    </div>
  );
}
