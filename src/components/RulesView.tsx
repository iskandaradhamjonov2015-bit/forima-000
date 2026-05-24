/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Rule, UserLevel } from '../types.ts';
import { RULES } from '../constants.ts';
import { BookMarked, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface RulesViewProps {
  level: UserLevel;
}

export default function RulesView({ level }: RulesViewProps) {
  const filteredRules = RULES.filter(r => r.level === level);

  const levelLabel = level === UserLevel.SENIOR ? 'Oson' : level === UserLevel.JUNIOR ? 'O\'rtacha' : 'Qiyin';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-[22px] flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
            <BookMarked size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Matematika Qoidalari</h2>
            <p className="text-slate-500 font-medium italic">Bilim bu qudrat!</p>
          </div>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
           <ShieldCheck className="text-emerald-500" size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daraja:</span>
           <span className="text-sm font-black text-emerald-600">{levelLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full">
                Qoida #{index + 1}
              </div>
              <h3 className="text-xl font-black text-slate-900">{rule.title}</h3>
              <p className="text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {rule.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
           <p className="text-slate-400 font-bold">Ushbu daraja uchun qoidalar hali qo'shilmagan.</p>
        </div>
      )}
    </div>
  );
}
