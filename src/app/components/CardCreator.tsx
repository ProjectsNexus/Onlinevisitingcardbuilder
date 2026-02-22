import { useState } from 'react';
import { VisitingCard, CardTemplate, ElementStyles } from '../types/card';
import { cardTemplates } from '../data/templates';
import { TemplateSelector } from './TemplateSelector';
import { CardForm } from './CardForm';
import { CardPreview } from './CardPreview';
import { QRCodeModal } from './QRCodeModal';
import { Button } from './ui/button';
import { ArrowLeft, QrCode, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface CardCreatorProps {
  initialCard?: VisitingCard;
  onSave: (card: VisitingCard) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function CardCreator({ initialCard, onSave, onCancel, isSaving }: CardCreatorProps) {
  const [step, setStep] = useState<'template' | 'details'>(initialCard ? 'details' : 'template');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(
    initialCard
      ? cardTemplates.find(t => t.id === initialCard.templateId) || cardTemplates[0]
      : cardTemplates[0]
  );

  const [previewCard, setPreviewCard] = useState<Partial<VisitingCard>>(
    initialCard || {
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      linkedin: '',
      twitter: '',
      elementStyles: undefined,
    }
  );

  const [editMode, setEditMode] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [savedCardId, setSavedCardId] = useState<string | null>(initialCard?.id || null);

  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setStep('details');
  };

  const handleSaveCard = (cardData: Partial<VisitingCard>) => {
    const fullCard: VisitingCard = {
      id: initialCard?.id || `card-${Date.now()}`,
      name: cardData.name || '',
      title: cardData.title || '',
      company: cardData.company || '',
      email: cardData.email || '',
      phone: cardData.phone || '',
      website: cardData.website || '',
      address: cardData.address || '',
      linkedin: cardData.linkedin,
      twitter: cardData.twitter,
      templateId: selectedTemplate.id,
      customColors: cardData.customColors,
      elementStyles: previewCard.elementStyles,
      createdAt: initialCard?.createdAt || new Date().toISOString(),
      views: initialCard?.views || 0,
      shares: initialCard?.shares || 0,
      downloads: initialCard?.downloads || 0,
    };

    setSavedCardId(fullCard.id);
    onSave(fullCard);
  };

  const handleFormChange = (cardData: Partial<VisitingCard>) => {
    setPreviewCard(prev => ({ ...prev, ...cardData }));
  };

  const handleElementStyleChange = (elementStyles: ElementStyles) => {
    setPreviewCard(prev => ({ ...prev, elementStyles }));
  };

  const handleShowQR = () => {
    if (!savedCardId) {
      // Prompt user to save first
      alert('Please save your card first before generating QR code');
      return;
    }
    setShowQRModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h2>{initialCard ? 'Edit Card' : 'Create New Card'}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'template'
                ? 'Choose a template for your card'
                : 'Fill in your card details'}
            </p>
          </div>
        </div>

        {step === 'details' && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleShowQR}
              className="gap-2"
              disabled={!savedCardId}
            >
              <QrCode size={16} />
              Generate QR
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {step === 'template' ? (
        <TemplateSelector
          selectedTemplate={selectedTemplate.id}
          onSelectTemplate={handleTemplateSelect}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="p-6">
            <div className="mb-6">
              <h3>Card Details</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">Template:</span>
                <span className="text-sm">{selectedTemplate.name}</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setStep('template')}
                  className="text-xs"
                >
                  Change
                </Button>
              </div>
            </div>

            <CardForm
              initialCard={initialCard}
              onSave={handleSaveCard}
              onCancel={onCancel}
              onPreviewUpdate={handleFormChange}
              isSaving={isSaving}
            />
          </Card>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-6 h-fit space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Live Preview</h3>
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-mode"
                    checked={editMode}
                    onCheckedChange={setEditMode}
                  />
                  <Label htmlFor="edit-mode" className="text-sm cursor-pointer">
                    Edit Layout
                  </Label>
                </div>
              </div>

              {editMode && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <strong>Edit Mode:</strong> Drag elements to reposition them. Click an element to adjust its font size.
                </div>
              )}

              <CardPreview
                card={{
                  id: '',
                  name: previewCard.name || 'Your Name',
                  title: previewCard.title || 'Your Title',
                  company: previewCard.company || 'Company Name',
                  email: previewCard.email || '',
                  phone: previewCard.phone || '',
                  website: previewCard.website || '',
                  address: previewCard.address || '',
                  linkedin: previewCard.linkedin,
                  twitter: previewCard.twitter,
                  templateId: selectedTemplate.id,
                  customColors: previewCard.customColors,
                  elementStyles: previewCard.elementStyles,
                  createdAt: '',
                  views: 0,
                  shares: 0,
                  downloads: 0,
                }}
                template={selectedTemplate}
                editMode={editMode}
                onElementStyleChange={handleElementStyleChange}
              />
            </Card>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {savedCardId && (
        <QRCodeModal
          open={showQRModal}
          onOpenChange={setShowQRModal}
          cardId={savedCardId}
          cardName={previewCard.name || 'Digital Card'}
        />
      )}
    </div>
  );
}
