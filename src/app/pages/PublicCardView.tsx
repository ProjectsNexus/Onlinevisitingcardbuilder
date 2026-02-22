import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VisitingCard } from '../types/card';
import { getCardById, incrementCardAnalytics } from '../services/firebaseService';
import { CardPreview } from '../components/CardPreview';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';

export function PublicCardView() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<VisitingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!cardId) {
        setError('Invalid card ID');
        setLoading(false);
        return;
      }

      try {
        const cardData = await getCardById(cardId);
        if (cardData) {
          setCard(cardData);
          // Increment view count
          await incrementCardAnalytics(cardId, 'views');
        } else {
          setError('Card not found');
        }
      } catch (err) {
        setError('Failed to load card');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [cardId]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card?.name} - Digital Card`,
          text: `Check out ${card?.name}'s digital visiting card`,
          url: url,
        });
        if (cardId) {
          await incrementCardAnalytics(cardId, 'shares');
        }
        toast.success('Card shared successfully!');
      } catch (err) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        if (cardId) {
          await incrementCardAnalytics(cardId, 'shares');
        }
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleDownload = async () => {
    if (cardId) {
      await incrementCardAnalytics(cardId, 'downloads');
    }
    toast.success('Card downloaded! (Demo mode)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="mb-2">Card Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'This card does not exist or has been removed.'}</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl">CardLink</h1>
                <p className="text-xs text-gray-600">Digital Visiting Cards</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={16} className="mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Card Display */}
          <Card className="p-8">
            <div className="max-w-2xl mx-auto">
              <CardPreview card={card} editMode={false} />
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="mb-4">Share & Download</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 size={16} />
                Share
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleDownload}>
                <Download size={16} />
                Download
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
                  <a href={`mailto:${card.email}`} className="text-blue-600 hover:underline">
                    {card.email}
                  </a>
                </div>
              )}
              {card.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a href={`tel:${card.phone}`} className="text-blue-600 hover:underline">
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

          {/* CTA */}
          <Card className="p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <h3 className="mb-2">Create Your Own Digital Card</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join thousands of professionals using CardLink for their digital visiting cards
            </p>
            <Button onClick={() => navigate('/signup')}>Get Started Free</Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
