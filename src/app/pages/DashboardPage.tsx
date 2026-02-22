import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisitingCard } from '../types/card';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserCards,
  saveCardToFirebase,
  deleteCardFromFirebase,
  incrementCardAnalytics,
} from '../services/firebaseService';
import { Dashboard } from '../components/Dashboard';
import { CardCreator } from '../components/CardCreator';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

type View = 'dashboard' | 'create' | 'edit';

export function DashboardPage() {
  const [cards, setCards] = useState<VisitingCard[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCard, setSelectedCard] = useState<VisitingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load cards from Firebase
  useEffect(() => {
    const loadCards = async () => {
      if (!user) return;

      try {
        const userCards = await getUserCards(user.uid);
        setCards(userCards);
      } catch (error) {
        console.error('Error loading cards:', error);
        toast.error('Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [user]);

  const handleCreateNew = () => {
    setSelectedCard(null);
    setCurrentView('create');
  };

  const handleEdit = (card: VisitingCard) => {
    setSelectedCard(card);
    setCurrentView('edit');
  };

  const handleView = (card: VisitingCard) => {
    // Navigate to public card view
    navigate(`/card/${card.id}`);
  };

  const handleSaveCard = async (card: VisitingCard) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await saveCardToFirebase(user.uid, card);
      const updatedCards = await getUserCards(user.uid);
      setCards(updatedCards);
      setCurrentView('dashboard');
      toast.success(selectedCard ? 'Card updated successfully!' : 'Card created successfully!');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!user) return;

    try {
      await deleteCardFromFirebase(id);
      const updatedCards = await getUserCards(user.uid);
      setCards(updatedCards);
      toast.success('Card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl">CardLink</h1>
              <p className="text-xs text-gray-600">Digital Visiting Cards</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            cards={cards}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onDelete={handleDeleteCard}
            onView={handleView}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <CardCreator
            initialCard={selectedCard || undefined}
            onSave={handleSaveCard}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
  );
}