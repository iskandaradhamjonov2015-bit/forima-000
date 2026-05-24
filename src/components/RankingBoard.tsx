/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserLevel } from '../types.ts';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';

interface RankingBoardProps {
  user: UserProfile;
}

export default function RankingBoard({ user }: RankingBoardProps) {
  // Mock rankings
  const rankings = [
    { name: 'Sardorbek Kamilov', xp: 2450, level: UserLevel.MASTER },
    { name: 'Malika Karimova', xp: 2100, level: UserLevel.MASTER },
    { name: 'Jasur Ahmedov', xp: 1850, level: UserLevel.SENIOR },
    { name: user.name, xp: user.xp, level: user.level, isCurrent: true },
    { name: 'Nilufar Oripova', xp: 950, level: UserLevel.JUNIOR },
    { name: 'Otabek Soliyev', xp: 820, level: UserLevel.JUNIOR },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Dunyo Reytingi</h2>
        <p className="text-slate-500 font-medium">Eng yaxshi akademiklar ro'yxati</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Crown className="text-amber-400" size={28} />
             </div>
             <div>
                <div className="text-[10px] text-white/70 uppercase font-black tracking-widest">Sizning o'rningiz</div>
                <div className="text-2xl font-black">Top {Math.round((rankings.findIndex(r => r.isCurrent) + 1) / rankings.length * 100)}%</div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] text-white/70 uppercase font-black tracking-widest">Sizning ballingiz</div>
             <div className="text-2xl font-black text-amber-400">{user.xp} XP</div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {rankings.map((entry, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className={cn(
                "p-4 flex items-center gap-6 transition-colors",
                entry.isCurrent ? "bg-indigo-50/50" : "hover:bg-slate-50/50"
              )}
            >
              <div className="w-8 text-center font-black text-slate-300">
                {idx + 1}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                  {entry.name.charAt(0)}
                </div>
                {idx === 0 && <Crown className="absolute -top-2 -right-2 text-amber-400 w-6 h-6 rotate-12 drop-shadow-sm" />}
                {idx === 1 && <Medal className="absolute -top-2 -right-2 text-slate-300 w-5 h-5 rotate-12" />}
                {idx === 2 && <Medal className="absolute -top-2 -right-2 text-amber-600 w-5 h-5 rotate-12" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    "font-bold truncate",
                    entry.isCurrent ? "text-indigo-600" : "text-slate-900"
                  )}>{entry.name}</h4>
                  {entry.isCurrent && <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black">Siz</span>}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{entry.level}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900 flex items-center gap-1 justify-end">
                   {entry.xp} <Star size={12} className="text-amber-400 fill-amber-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Tajriba ballari</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
