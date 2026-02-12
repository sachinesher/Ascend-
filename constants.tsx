
import React from 'react';
import { PillarType } from './types';

export const PILLAR_COLORS: Record<PillarType, { bg: string; text: string; border: string; accent: string; shadow: string }> = {
  [PillarType.GYM]: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/20'
  },
  [PillarType.LOOKS]: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    accent: 'bg-purple-500',
    shadow: 'shadow-purple-500/20'
  },
  [PillarType.WORK]: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
    shadow: 'shadow-blue-500/20'
  }
};

export const INITIAL_PILLARS = [
  { type: PillarType.GYM, level: 1, currentXP: 0, targetXP: 1000 },
  { type: PillarType.LOOKS, level: 1, currentXP: 0, targetXP: 1000 },
  { type: PillarType.WORK, level: 1, currentXP: 0, targetXP: 1000 }
];

export const INITIAL_QUESTS = [
  { id: '1', pillar: PillarType.GYM, title: 'Hit the Iron', description: 'Complete your daily workout routine.', xp: 250, completed: false },
  { id: '2', pillar: PillarType.GYM, title: 'Protein Shield', description: 'Hit your macro protein goal today.', xp: 150, completed: false },
  { id: '3', pillar: PillarType.LOOKS, title: 'Glass Skin', description: 'Complete morning and evening skincare.', xp: 100, completed: false },
  { id: '4', pillar: PillarType.LOOKS, title: 'Posture Check', description: 'Maintain good posture throughout the day.', xp: 50, completed: false },
  { id: '5', pillar: PillarType.WORK, title: 'Deep Work', description: '2 hours of uninterrupted focus time.', xp: 300, completed: false },
  { id: '6', pillar: PillarType.WORK, title: 'Inbox Zero', description: 'Clear your pending high-priority tasks.', xp: 100, completed: false },
];
