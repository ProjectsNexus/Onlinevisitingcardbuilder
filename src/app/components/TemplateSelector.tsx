import { cardTemplates } from '../data/templates';
import { CardTemplate } from '../types/card';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: CardTemplate) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const categories = Array.from(new Set(cardTemplates.map(t => t.category)));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Choose a Template</h3>
        <p className="text-sm text-gray-600 mb-6">
          Select from our collection of professionally designed templates
        </p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h4 className="text-sm mb-3 text-gray-700">{category}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardTemplates
              .filter(t => t.category === category)
              .map(template => {
                const isGradient = template.colors.background.includes('gradient');
                
                return (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="relative group"
                  >
                    <div 
                      className={`aspect-[1.75/1] rounded-lg transition-all ${
                        selectedTemplate === template.id 
                          ? 'ring-4 ring-blue-500 ring-offset-2' 
                          : 'hover:scale-105'
                      }`}
                      style={{
                        background: isGradient ? template.colors.background : template.colors.primary,
                      }}
                    >
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div className="p-3 h-full flex flex-col justify-between">
                        <div>
                          <div 
                            className="text-xs mb-0.5"
                            style={{ color: template.colors.text }}
                          >
                            Name
                          </div>
                          <div 
                            className="text-[10px] opacity-80"
                            style={{ color: template.colors.text }}
                          >
                            Title
                          </div>
                        </div>
                        
                        <div className="space-y-0.5">
                          <div 
                            className="h-1 w-full rounded opacity-50"
                            style={{ backgroundColor: template.colors.text }}
                          />
                          <div 
                            className="h-1 w-3/4 rounded opacity-50"
                            style={{ backgroundColor: template.colors.text }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-center">{template.name}</p>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
