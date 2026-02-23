import { useState } from 'react';
import { VisitingCard, CardTemplate, ElementPosition } from '../types/card';
import { cardTemplates } from '../data/templates';
import { TemplateSelector } from './TemplateSelector';
import { CardForm } from './CardForm';
import { CardPreviewDraggable } from './CardPreviewDraggable';
import { QRCodeModal } from './QRCodeModal';
import { Button } from './ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Card } from './ui/card';

interface CardCreatorProps {
  initialCard?: VisitingCard;
  onSave: (card: VisitingCard) => void;
  onCancel: () => void;
}

export function CardCreator({ initialCard, onSave, onCancel }: CardCreatorProps) {
  const [step, setStep] = useState<'template' | 'details'>(initialCard ? 'details' : 'template');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(
    initialCard
      ? cardTemplates.find(t => t.id === initialCard.templateId) || cardTemplates[0]
      : cardTemplates[0]
  );
  
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  
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
    }
  );

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
      updatedAt: new Date().toISOString(),
      views: initialCard?.views || 0,
      shares: initialCard?.shares || 0,
      downloads: initialCard?.downloads || 0,
    };

    onSave(fullCard);
  };

  const handleFormChange = (cardData: Partial<VisitingCard>) => {
    setPreviewCard(prev => ({ ...prev, ...cardData }));
  };

  const handleUpdateStyles = (elementName: string, fontSize: number, position: ElementPosition) => {
    setPreviewCard(prev => ({
      ...prev,
      elementStyles: {
        ...prev.elementStyles,
        [elementName]: {
          fontSize,
          position,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            />
          </Card>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Live Preview</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isEditingLayout ? "default" : "outline"}
                    onClick={() => setIsEditingLayout(!isEditingLayout)}
                  >
                    {isEditingLayout ? 'Done Editing' : 'Edit Layout'}
                  </Button>
                  {initialCard && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowQRModal(true)}
                    >
                      <Share2 size={14} className="mr-1" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
              <CardPreviewDraggable
                card={{
                  id: initialCard?.id || `card-${Date.now()}`,
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
                  createdAt: initialCard?.createdAt || '',
                  views: initialCard?.views || 0,
                  shares: initialCard?.shares || 0,
                  downloads: initialCard?.downloads || 0,
                  elementStyles: previewCard.elementStyles,
                }}
                isEditing={isEditingLayout}
                onUpdateStyles={handleUpdateStyles}
                template={selectedTemplate}
              />
            </Card>
          </div>

          {/* QR Code Modal */}
          {initialCard && (
            <QRCodeModal
              cardId={initialCard.id}
              cardName={initialCard.name}
              isOpen={showQRModal}
              onClose={() => setShowQRModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
