/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserLevel } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Star, Trophy, GraduationCap, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface WelcomeScreenProps {
  onRegister: (name: string, age: number, level: UserLevel, birthYear: number, birthMonth: string, school: string) => void;
}

export default function WelcomeScreen({ onRegister }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('Yanvar');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState<UserLevel>(UserLevel.JUNIOR);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age && birthYear && school.trim()) {
      if (step === 1) {
        setStep(2);
      } else {
        onRegister(name, parseInt(age), level, parseInt(birthYear), birthMonth, school);
      }
    }
  };

  const levels = [
    {
      id: UserLevel.SENIOR,
      title: 'Senior',
      desc: 'Juda oson - Matematikani endi boshlayotganlar uchun eng oson daraja.',
      icon: <Star className="w-6 h-6 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    {
      id: UserLevel.JUNIOR,
      title: 'Junior',
      desc: 'O\'rtacha - Oddiy va tushunarli darajadagi bilimga ega bo\'lganlar uchun.',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    {
      id: UserLevel.MASTER,
      title: 'Master',
      desc: 'Juda qiyin - Matematika bilimdonlari uchun murakkab va muammoli masalalar.',
      icon: <Trophy className="w-6 h-6 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50 text-rose-700',
    },
  ];

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-indigo-600">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-10 bg-white rounded-[40px] shadow-2xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-2">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Math Master</h1>
          <p className="text-slate-500 font-medium">Bilim sari ilk qadam!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">Ismingizni kiriting</label>
                    <input
                      autoFocus
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Adhamjon"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 ml-1">Yoshingiz</label>
                      <input
                        type="number"
                        required
                        min="5"
                        max="100"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="18"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 ml-1">Tug'ilgan yilingiz</label>
                      <input
                        type="number"
                        required
                        min="1920"
                        max="2026"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="2006"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">Tug'ilgan oyingiz</label>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">Qaysi maktabda o'qiysiz?</label>
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Masalan: 1-IDUM"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!name.trim() || !age || !birthYear || !school.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                >
                  Davom etish
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 ml-1">O'rganish darajangizni tanlang</label>
                  <div className="grid gap-3">
                    {levels.map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setLevel(lvl.id)}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                          level === lvl.id
                            ? lvl.color
                            : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-600"
                        )}
                      >
                        <div className="mt-1">{lvl.icon}</div>
                        <div>
                          <div className="font-bold">{lvl.title}</div>
                          <div className="text-xs opacity-70">{lvl.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                >
                  Akademiyaga kirish
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Ortga qaytish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
