import { useEffect } from 'react';
import { VisitingCard } from '../types/card';
import { CardPreview } from './CardPreview';
import { Button } from './ui/button';
import { ArrowLeft, Share2, Download, QrCode, Link as LinkIcon } from 'lucide-react';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { incrementShare, incrementDownload } from '../utils/storage';

interface CardViewerProps {
  card: VisitingCard;
  onBack: () => void;
  onViewIncrement: () => void;
}

export function CardViewer({ card, onBack, onViewIncrement }: CardViewerProps) {
  useEffect(() => {
    // Increment view count when card is viewed
    onViewIncrement();
  }, [card.id, onViewIncrement]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} - Digital Card`,
          text: `Check out ${card.name}'s digital visiting card`,
          url: url,
        });
        incrementShare(card.id);
        toast.success('Card shared successfully!');
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        incrementShare(card.id);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image
    incrementDownload(card.id);
    toast.success('Card downloaded! (Demo mode)');
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleGenerateQR = () => {
    toast.success('QR code generated! (Demo mode)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <h2>{card.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{card.title} at {card.company}</p>
        </div>
      </div>

      {/* Card Display */}
      <Card className="p-8">
        <div className="max-w-2xl mx-auto">
          <CardPreview card={card} />
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Share & Download</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share2 size={16} />
            Share
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleDownload}>
            <Download size={16} />
            Download
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleCopyLink}>
            <LinkIcon size={16} />
            Copy Link
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleGenerateQR}>
            <QrCode size={16} />
            QR Code
          </Button>
        </div>
      </Card>

      {/* Contact Details */}
      <Card className="p-6">
        <h3 className="mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {card.email && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <a 
                href={`mailto:${card.email}`}
                className="text-blue-600 hover:underline"
              >
                {card.email}
              </a>
            </div>
          )}
          {card.phone && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <a 
                href={`tel:${card.phone}`}
                className="text-blue-600 hover:underline"
              >
                {card.phone}
              </a>
            </div>
          )}
          {card.website && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Website</p>
              <a 
                href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {card.website}
              </a>
            </div>
          )}
          {card.address && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p>{card.address}</p>
            </div>
          )}
          {card.linkedin && (
            <div>
              <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
              <a 
                href={card.linkedin.startsWith('http') ? card.linkedin : `https://${card.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Profile
              </a>
            </div>
          )}
          {card.twitter && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Twitter/X</p>
              <a 
                href={card.twitter.startsWith('http') ? card.twitter : `https://${card.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Profile
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Analytics */}
      <Card className="p-6">
        <h3 className="mb-4">Card Analytics</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl mb-1">{card.views}</p>
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">{card.shares}</p>
            <p className="text-sm text-gray-600">Times Shared</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">{card.downloads}</p>
            <p className="text-sm text-gray-600">Downloads</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
