
export enum PillarType {
  GYM = 'GYM',
  LOOKS = 'LOOKS',
  WORK = 'WORK'
}

export interface Quest {
  id: string;
  pillar: PillarType;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
}

export interface PillarStats {
  type: PillarType;
  level: number;
  currentXP: number;
  targetXP: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
