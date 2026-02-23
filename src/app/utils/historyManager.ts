import { VisitingCard } from '../types/card';

export interface HistoryState {
  card: VisitingCard;
  timestamp: number;
  description?: string;
}

export class HistoryManager {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxStates: number = 50;

  constructor(initialCard?: VisitingCard) {
    if (initialCard) {
      this.push(initialCard, 'Initial state');
    }
  }

  push(card: VisitingCard, description?: string): void {
    // Remove any redo history when a new action is performed
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push({
      card: JSON.parse(JSON.stringify(card)), // Deep copy
      timestamp: Date.now(),
      description,
    });

    // Limit history size
    if (this.history.length > this.maxStates) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): VisitingCard | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex].card));
    }
    return null;
  }

  redo(): VisitingCard | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex].card));
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getCurrentState(): HistoryState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  getHistory(): HistoryState[] {
    return this.history.slice();
  }

  reset(card: VisitingCard): void {
    this.clear();
    this.push(card, 'Initial state');
  }
}
