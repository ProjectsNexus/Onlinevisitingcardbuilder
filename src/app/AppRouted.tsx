import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { VisitingCard, CardLayout } from './types/card';
import { getUserCards, saveCardToFirestore, deleteCardFromFirestore } from './utils/firebaseStorage';
import { Dashboard } from './components/Dashboard';
import { CardEditor } from './components/CardEditor';
import { PublicCardViewer } from './components/PublicCardViewer';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Toaster } from './components/ui/sonner';
import { CreditCard, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './components/ui/button';

type View = 'dashboard' | 'create' | 'edit' | 'view';

function AuthenticatedApp() {
  const [cards, setCards] = useState<VisitingCard[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCard, setSelectedCard] = useState<VisitingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load user's cards from Firestore
  useEffect(() => {
    const loadUserCards = async () => {
      if (user) {
        try {
          const userCards = await getUserCards(user.uid);
          setCards(userCards);
        } catch (error) {
          console.error('Error loading cards:', error);
          toast.error('Failed to load your cards');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserCards();
  }, [user]);

  const handleCreateNew = () => {
    // Create a new empty card with block-based structure
    const newCard: VisitingCard = {
      id: `card-${Date.now()}`,
      layout: {
        width: 800,
        height: 500,
        backgroundColor: '#ffffff',
      },
      blocks: [],
      createdAt: new Date().toISOString(),
      views: 0,
      shares: 0,
      downloads: 0,
    };
    setSelectedCard(newCard);
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

  const handleSaveCard = async (card: VisitingCard) => {
    if (!user) return;
    
    try {
      await saveCardToFirestore(user.uid, card);
      
      // Reload cards
      const updatedCards = await getUserCards(user.uid);
      setCards(updatedCards);
      
      setCurrentView('dashboard');
      toast.success(selectedCard ? 'Card updated successfully!' : 'Card created successfully!');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCardFromFirestore(id);
      
      // Reload cards
      const updatedCards = cards.filter(c => c.id !== id);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">CardLink</h1>
                <p className="text-xs text-gray-600">Digital Visiting Cards</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </Button>
                </>
              )}
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

        {(currentView === 'create' || currentView === 'edit') && selectedCard && (
          <CardEditor
            card={selectedCard}
            onSave={handleSaveCard}
            onCancel={handleCancel}
            isLoading={loading}
          />
        )}
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/card/:cardSlug" element={<PublicCardViewer />} />
      <Route 
        path="/dashboard" 
        element={user ? <AuthenticatedApp /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}
