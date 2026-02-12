
import React from 'react';
import { PillarType, PillarStats } from '../types';
import { PILLAR_COLORS } from '../constants';

interface StatsCardProps {
  stats: PillarStats;
  onClick: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats, onClick }) => {
  const colors = PILLAR_COLORS[stats.type];
  const progress = (stats.currentXP / stats.targetXP) * 100;

  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-2xl border ${colors.border} ${colors.bg} cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-widest ${colors.text}`}>{stats.type}</h3>
          <p className="text-3xl font-bold mt-1">Level {stats.level}</p>
        </div>
        <div className={`p-2 rounded-lg ${colors.accent} ${colors.shadow} shadow-lg text-white`}>
          {stats.type === PillarType.GYM && '💪'}
          {stats.type === PillarType.LOOKS && '✨'}
          {stats.type === PillarType.WORK && '💼'}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs mb-2 text-slate-400 font-medium">
          <span>{stats.currentXP} XP</span>
          <span>{stats.targetXP} XP</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colors.accent} transition-all duration-500`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 text-center italic">
        Click to view focused quests
      </div>
    </div>
  );
};
