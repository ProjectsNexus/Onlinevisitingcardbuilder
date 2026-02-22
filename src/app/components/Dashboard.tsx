import { useState } from 'react';
import { VisitingCard } from '../types/card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus, Eye, Share2, Download, Trash2, Edit, BarChart3 } from 'lucide-react';
import { CardPreview } from './CardPreview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DashboardProps {
  cards: VisitingCard[];
  onCreateNew: () => void;
  onEdit: (card: VisitingCard) => void;
  onDelete: (id: string) => void;
  onView: (card: VisitingCard) => void;
}

export function Dashboard({ cards, onCreateNew, onEdit, onDelete, onView }: DashboardProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalViews = cards.reduce((sum, card) => sum + card.views, 0);
  const totalShares = cards.reduce((sum, card) => sum + card.shares, 0);
  const totalDownloads = cards.reduce((sum, card) => sum + card.downloads, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Cards</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{cards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalShares}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalDownloads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>My Cards</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track your digital visiting cards
          </p>
        </div>
        <Button onClick={onCreateNew} className="gap-2">
          <Plus size={16} />
          Create New Card
        </Button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3>No cards yet</h3>
            <p className="text-sm text-gray-600">
              Create your first digital visiting card to get started
            </p>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus size={16} />
              Create Your First Card
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <Card key={card.id} className="overflow-hidden">
              <div className="p-4">
                <div className="mb-4">
                  <CardPreview card={card} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Eye size={14} />
                    </div>
                    <p className="text-sm">{card.views}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Share2 size={14} />
                    </div>
                    <p className="text-sm">{card.shares}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <Download size={14} />
                    </div>
                    <p className="text-sm">{card.downloads}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => onView(card)}
                  >
                    <Eye size={14} />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(card)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDeleteId(card.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
