import { VisitingCard } from '../types/card';

const STORAGE_KEY = 'visiting_cards';

export const saveCards = (cards: VisitingCard[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const loadCards = (): VisitingCard[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCard = (card: VisitingCard): void => {
  const cards = loadCards();
  const existingIndex = cards.findIndex(c => c.id === card.id);
  
  if (existingIndex >= 0) {
    cards[existingIndex] = card;
  } else {
    cards.push(card);
  }
  
  saveCards(cards);
};

export const deleteCard = (id: string): void => {
  const cards = loadCards();
  const filtered = cards.filter(c => c.id !== id);
  saveCards(filtered);
};

export const incrementView = (id: string): void => {
  const cards = loadCards();
  const card = cards.find(c => c.id === id);
  if (card) {
    card.views += 1;
    saveCards(cards);
  }
};

export const incrementShare = (id: string): void => {
  const cards = loadCards();
  const card = cards.find(c => c.id === id);
  if (card) {
    card.shares += 1;
    saveCards(cards);
  }
};

export const incrementDownload = (id: string): void => {
  const cards = loadCards();
  const card = cards.find(c => c.id === id);
  if (card) {
    card.downloads += 1;
    saveCards(cards);
  }
};
