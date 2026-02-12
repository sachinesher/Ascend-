
import React, { useState, useEffect, useMemo } from 'react';
import { PillarType, Quest, PillarStats, UserStats } from './types';
import { INITIAL_QUESTS, INITIAL_PILLARS, PILLAR_COLORS } from './constants';
import { StatsCard } from './components/StatsCard';
import { QuestList } from './components/QuestList';
import { AstraMascot } from './components/AstraMascot';
import { getAIAdvice, getDailyQuote } from './geminiService';

const App: React.FC = () => {
  // State
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 5,
    lastActive: new Date().toISOString()
  });
  const [pillars, setPillars] = useState<PillarStats[]>(INITIAL_PILLARS);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activePillar, setActivePillar] = useState<PillarType | 'ALL'>('ALL');
  const [aiAdvice, setAiAdvice] = useState<string>("Initializing Astra systems...");
  const [dailyQuote, setDailyQuote] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [mascotState, setMascotState] = useState<'neutral' | 'proud' | 'beast' | 'roast'>('neutral');

  // Filtered Quests
  const filteredQuests = useMemo(() => {
    if (activePillar === 'ALL') return quests;
    return quests.filter(q => q.pillar === activePillar);
  }, [quests, activePillar]);

  // Initial Load
  useEffect(() => {
    const loadQuote = async () => {
      const q = await getDailyQuote();
      setDailyQuote(q);
    };
    loadQuote();
    refreshAdvice();
  }, []);

  const refreshAdvice = async () => {
    setIsLoadingAdvice(true);
    setMascotState('neutral');
    const pillarName = activePillar === 'ALL' ? 'General Performance' : activePillar;
    const advice = await getAIAdvice(pillarName, userStats.streak, quests);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
    
    // Determine mascot reaction based on streak or content (simple logic)
    if (userStats.streak >= 5) setMascotState('beast');
    else if (advice.toLowerCase().includes('roast') || advice.length < 50) setMascotState('roast');
    else setMascotState('neutral');
  };

  const toggleQuest = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    const newCompletedState = !quest.completed;
    const xpChange = newCompletedState ? quest.xp : -quest.xp;

    if (newCompletedState) {
      setMascotState('proud');
      setTimeout(() => setMascotState(userStats.streak >= 5 ? 'beast' : 'neutral'), 2000);
    }

    setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: newCompletedState } : q));

    // Update Pillar Stats
    setPillars(prev => prev.map(p => {
      if (p.type === quest.pillar) {
        let newXP = p.currentXP + xpChange;
        let newLevel = p.level;
        
        if (newXP >= p.targetXP) {
          newXP -= p.targetXP;
          newLevel += 1;
        } else if (newXP < 0 && newLevel > 1) {
          newXP = p.targetXP + newXP;
          newLevel -= 1;
        } else if (newXP < 0) {
          newXP = 0;
        }
        
        return { ...p, currentXP: newXP, level: newLevel };
      }
      return p;
    }));

    // Update Total User Stats
    setUserStats(prev => ({
      ...prev,
      xp: Math.max(0, prev.xp + xpChange)
    }));
  };

  const totalProgress = useMemo(() => {
    const completed = quests.filter(q => q.completed).length;
    return (completed / quests.length) * 100;
  }, [quests]);

  return (
    <div className="min-h-screen pb-24 bg-[#0a0a0c] text-slate-100 selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-black text-white italic">A</div>
            <h1 className="text-xl font-bold tracking-tight">ASCEND</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <span className="text-orange-500 font-bold">🔥</span>
              <span className="font-bold text-sm">{userStats.streak}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-blue-500 font-bold">✨</span>
              <span className="font-bold text-sm">{userStats.xp} XP</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
               <AstraMascot state={mascotState} className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Daily Motivation with Mascot */}
        <div className="mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 flex-shrink-0">
             <AstraMascot state={mascotState} className="w-full h-full" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 relative">
              {/* Speech Bubble Arrow */}
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-900 border-l border-b border-slate-800 rotate-45 -translate-y-1/2 hidden md:block" />
              
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Astra // Uplink Active</h2>
                <button 
                  onClick={refreshAdvice}
                  disabled={isLoadingAdvice}
                  className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 uppercase font-bold"
                >
                  {isLoadingAdvice ? 'Decrypting...' : '↻ Cycle Intel'}
                </button>
              </div>
              
              <p className={`text-lg font-heading font-medium leading-tight ${isLoadingAdvice ? 'opacity-30' : 'opacity-100'} transition-opacity`}>
                {aiAdvice}
              </p>
            </div>
            
            <div className="px-2">
               <p className="text-xs text-slate-500 italic">"{dailyQuote}"</p>
            </div>
          </div>
        </div>

        {/* Pillars Section */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold font-heading">The Pillars</h2>
            <p className="text-slate-500 text-sm">Targeted development zones.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(p => (
              <StatsCard 
                key={p.type} 
                stats={p} 
                onClick={() => setActivePillar(activePillar === p.type ? 'ALL' : p.type)} 
              />
            ))}
          </div>
        </section>

        {/* Quests Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold font-heading">Protocol Objectives</h2>
              <div className="bg-slate-800/50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase border border-slate-700">
                {activePillar} View
              </div>
            </div>
            <div className="text-sm font-medium text-slate-400">
              {Math.round(totalProgress)}% Efficiency
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <QuestList quests={filteredQuests} onToggle={toggleQuest} />
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-6">
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Focus Arrays</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">⏱️</div>
                      <div>
                        <div className="text-sm font-bold font-heading">Deep Work</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">25:00 Chrono</div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">▶️</button>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">🧘</div>
                      <div>
                        <div className="text-sm font-bold font-heading">Neural Prime</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">10:00 Meditation</div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">▶️</button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold font-heading mb-1">Elite Multiplier</h3>
                  <p className="text-white/70 text-xs mb-4">Astra detects high potential. Sync now for Weekend Surge.</p>
                  <button className="bg-white text-indigo-700 font-bold px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider hover:shadow-lg transition-all active:scale-95">
                    Execute Protocol
                  </button>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-2 right-2 p-2 opacity-10">
                   <AstraMascot state="beast" className="w-16 h-16 grayscale" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-slate-800 py-3 px-6 md:hidden flex justify-between items-center z-50">
        <button className="flex flex-col items-center space-y-1 text-purple-500">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold">CORE</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-slate-500">
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold">ELITE</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-slate-500">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold">VITAL</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-slate-500">
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-bold">BIAS</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
