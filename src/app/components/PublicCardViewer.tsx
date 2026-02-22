import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VisitingCard } from '../types/card';
import { getCardById, incrementCardViews } from '../utils/firebaseStorage';
import { CardPreview } from './CardPreview';
import { Button } from './ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function PublicCardViewer() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<VisitingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!cardId) {
        setError('Card not found');
        setLoading(false);
        return;
      }

      try {
        const cardData = await getCardById(cardId);
        if (cardData) {
          setCard(cardData);
          // Increment view count
          await incrementCardViews(cardId);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card');
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [cardId]);

  const handleShare = () => {
    if (card && navigator.share) {
      navigator.share({
        title: `${card.name}'s Business Card`,
        text: `${card.name} - ${card.title}`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else if (card) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This card does not exist or has been deleted.'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">{card.name}'s Card</h1>
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
              >
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Card Preview */}
          <CardPreview card={card} />

          {/* Card Details */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{card.name}</h2>
            
            <div className="space-y-3">
              {card.title && (
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="text-gray-900">{card.title}</p>
                </div>
              )}
              
              {card.company && (
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="text-gray-900">{card.company}</p>
                </div>
              )}

              {card.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${card.email}`} className="text-blue-600 hover:underline">
                    {card.email}
                  </a>
                </div>
              )}

              {card.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href={`tel:${card.phone}`} className="text-blue-600 hover:underline">
                    {card.phone}
                  </a>
                </div>
              )}

              {card.website && (
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <a href={card.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {card.website}
                  </a>
                </div>
              )}

              {card.address && (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900">{card.address}</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{card.views}</p>
                <p className="text-xs text-gray-600">Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{card.shares}</p>
                <p className="text-xs text-gray-600">Shares</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{card.downloads}</p>
                <p className="text-xs text-gray-600">Downloads</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
