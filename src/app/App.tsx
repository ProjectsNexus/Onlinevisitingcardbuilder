import { useState, useEffect } from 'react';
import { VisitingCard } from './types/card';
import { loadCards, saveCard, deleteCard, incrementView } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { CardCreator } from './components/CardCreator';
import { CardViewer } from './components/CardViewer';
import { Toaster } from './components/ui/sonner';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

type View = 'dashboard' | 'create' | 'edit' | 'view';

export default function App() {
  const [cards, setCards] = useState<VisitingCard[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCard, setSelectedCard] = useState<VisitingCard | null>(null);

  // Load cards on mount
  useEffect(() => {
    const loadedCards = loadCards();
    setCards(loadedCards);
  }, []);

  const handleCreateNew = () => {
    setSelectedCard(null);
    setCurrentView('create');
  };

  const handleEdit = (card: VisitingCard) => {
    setSelectedCard(card);
    setCurrentView('edit');
  };

  const handleView = (card: VisitingCard) => {
    setSelectedCard(card);
    setCurrentView('view');
  };

  const handleSaveCard = (card: VisitingCard) => {
    saveCard(card);
    setCards(loadCards());
    setCurrentView('dashboard');
    toast.success(selectedCard ? 'Card updated successfully!' : 'Card created successfully!');
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    setCards(loadCards());
    toast.success('Card deleted successfully!');
  };

  const handleCancel = () => {
    setSelectedCard(null);
    setCurrentView('dashboard');
  };

  const handleViewIncrement = () => {
    if (selectedCard) {
      incrementView(selectedCard.id);
      setCards(loadCards());
    }
  };

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
          />
        )}

        {currentView === 'view' && selectedCard && (
          <CardViewer
            card={selectedCard}
            onBack={handleCancel}
            onViewIncrement={handleViewIncrement}
          />
        )}
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
