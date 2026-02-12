
import React from 'react';
import { Quest, PillarType } from '../types';
import { PILLAR_COLORS } from '../constants';

interface QuestListProps {
  quests: Quest[];
  onToggle: (id: string) => void;
}

export const QuestList: React.FC<QuestListProps> = ({ quests, onToggle }) => {
  if (quests.length === 0) return (
    <div className="text-center p-8 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-500">
      No quests active for this category.
    </div>
  );

  return (
    <div className="space-y-3">
      {quests.map(quest => {
        const colors = PILLAR_COLORS[quest.pillar];
        return (
          <div 
            key={quest.id}
            onClick={() => onToggle(quest.id)}
            className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
              quest.completed 
                ? 'bg-slate-900/40 border-slate-800/50 opacity-60' 
                : `${colors.bg} ${colors.border} hover:bg-opacity-20`
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
              quest.completed ? 'bg-emerald-500 border-emerald-500' : colors.border
            }`}>
              {quest.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${quest.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                {quest.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{quest.description}</p>
            </div>
            <div className={`text-xs font-bold ${colors.text}`}>
              +{quest.xp} XP
            </div>
          </div>
        );
      })}
    </div>
  );
};
