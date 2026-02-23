import { VisitingCard } from '../types/card';

export interface Template {
  id: string;
  name: string;
  description: string;
  file: string;
  thumbnail: string;
  category: string;
  features: string[];
  colors: string[];
}

export interface TemplateManifest {
  templates: Template[];
}

/**
 * Load all available templates from manifest
 */
export async function loadTemplateManifest(): Promise<TemplateManifest> {
  try {
    const response = await fetch('/templates/manifest.json');
    if (!response.ok) throw new Error('Failed to load manifest');
    return await response.json();
  } catch (error) {
    console.error('Error loading template manifest:', error);
    throw error;
  }
}

/**
 * Load a specific template by ID
 */
export async function loadTemplate(templateId: string): Promise<VisitingCard> {
  try {
    const manifest = await loadTemplateManifest();
    const template = manifest.templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const response = await fetch(`/templates/${template.file}`);
    if (!response.ok) throw new Error('Failed to load template file');
    return await response.json();
  } catch (error) {
    console.error('Error loading template:', error);
    throw error;
  }
}

/**
 * Create a new card from a template
 */
export async function createCardFromTemplate(
  templateId: string,
  cardData?: Partial<VisitingCard>
): Promise<VisitingCard> {
  try {
    const template = await loadTemplate(templateId);
    
    return {
      ...template,
      id: `card-${Date.now()}`,
      userId: cardData?.userId,
      createdAt: new Date().toISOString(),
      views: 0,
      shares: 0,
      downloads: 0,
      ...cardData,
    };
  } catch (error) {
    console.error('Error creating card from template:', error);
    throw error;
  }
}

/**
 * Get template categories
 */
export function getTemplateCategories(manifest: TemplateManifest): string[] {
  const categories = new Set(manifest.templates.map(t => t.category));
  return Array.from(categories);
}

/**
 * Filter templates by category
 */
export function filterTemplatesByCategory(
  manifest: TemplateManifest,
  category: string
): Template[] {
  return manifest.templates.filter(t => t.category === category);
}

/**
 * Search templates by name or description
 */
export function searchTemplates(
  manifest: TemplateManifest,
  query: string
): Template[] {
  const lowerQuery = query.toLowerCase();
  return manifest.templates.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.features.some(f => f.toLowerCase().includes(lowerQuery))
  );
}
