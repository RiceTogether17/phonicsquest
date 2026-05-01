export interface Word {
  id: string;
  word: string;
  graphemes: string[];
  types: string[];
  pattern: string;
  group: string;
  level: number;
  emoji: string;
}

export interface ProgressRecord {
  attempts: number;
  correct: number;
  lastSeen?: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
  schoolLevel: 'preschool' | 'primary';
  readingBand?: string | null;
  createdAt: string;
}
