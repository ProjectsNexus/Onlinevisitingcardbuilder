import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { VisitingCard } from '../types/card';

// Collection references
const USERS_COLLECTION = 'users';
const CARDS_COLLECTION = 'cards';

// Save a card to Firestore
export const saveCardToFirebase = async (userId: string, card: VisitingCard): Promise<void> => {
  const cardRef = doc(db, CARDS_COLLECTION, card.id);
  
  const cardData = {
    ...card,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: card.createdAt || serverTimestamp(),
  };

  await setDoc(cardRef, cardData, { merge: true });
};

// Get all cards for a user
export const getUserCards = async (userId: string): Promise<VisitingCard[]> => {
  const q = query(collection(db, CARDS_COLLECTION), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const cards: VisitingCard[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    cards.push({
      ...data,
      id: doc.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as VisitingCard);
  });
  
  return cards;
};

// Get a single card by ID (for public viewing)
export const getCardById = async (cardId: string): Promise<VisitingCard | null> => {
  const cardRef = doc(db, CARDS_COLLECTION, cardId);
  const cardSnap = await getDoc(cardRef);
  
  if (cardSnap.exists()) {
    const data = cardSnap.data();
    return {
      ...data,
      id: cardSnap.id,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as VisitingCard;
  }
  
  return null;
};

// Delete a card
export const deleteCardFromFirebase = async (cardId: string): Promise<void> => {
  const cardRef = doc(db, CARDS_COLLECTION, cardId);
  await deleteDoc(cardRef);
};

// Update card analytics (views, shares, downloads)
export const incrementCardAnalytics = async (
  cardId: string,
  field: 'views' | 'shares' | 'downloads'
): Promise<void> => {
  const cardRef = doc(db, CARDS_COLLECTION, cardId);
  const cardSnap = await getDoc(cardRef);
  
  if (cardSnap.exists()) {
    const currentValue = cardSnap.data()[field] || 0;
    await updateDoc(cardRef, {
      [field]: currentValue + 1,
    });
  }
};

// Save user profile
export const saveUserProfile = async (userId: string, data: { email: string; name?: string }): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
