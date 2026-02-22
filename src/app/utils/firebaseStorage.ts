import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { VisitingCard } from '../types/card';

const CARDS_COLLECTION = 'visitingCards';

// Save or update a card
export const saveCardToFirestore = async (userId: string, card: VisitingCard): Promise<void> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, card.id);
    await setDoc(cardRef, {
      ...card,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving card:', error);
    throw error;
  }
};

// Get all cards for a user
export const getUserCards = async (userId: string): Promise<VisitingCard[]> => {
  try {
    const q = query(
      collection(db, CARDS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as VisitingCard);
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

// Get a single card by ID (public access)
export const getCardById = async (cardId: string): Promise<VisitingCard | null> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    const snapshot = await getDoc(cardRef);
    return snapshot.exists() ? (snapshot.data() as VisitingCard) : null;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw error;
  }
};

// Delete a card
export const deleteCardFromFirestore = async (cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// Increment view count
export const incrementCardViews = async (cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    const docSnap = await getDoc(cardRef);
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(cardRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};

// Increment share count
export const incrementCardShares = async (cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    const docSnap = await getDoc(cardRef);
    if (docSnap.exists()) {
      const currentShares = docSnap.data().shares || 0;
      await updateDoc(cardRef, { shares: currentShares + 1 });
    }
  } catch (error) {
    console.error('Error incrementing shares:', error);
    throw error;
  }
};

// Increment download count
export const incrementCardDownloads = async (cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    const docSnap = await getDoc(cardRef);
    if (docSnap.exists()) {
      const currentDownloads = docSnap.data().downloads || 0;
      await updateDoc(cardRef, { downloads: currentDownloads + 1 });
    }
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    throw error;
  }
};
