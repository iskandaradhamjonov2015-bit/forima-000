/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProfile } from '../types.ts';
import { MANTIQIY_MASALALAR } from '../constants.ts';
import { cn } from '../lib/utils.ts';
import { PlayCircle, Brain, HelpCircle, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserLevel } from '../types.ts';

interface LogicPuzzlesProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  currentLevel: UserLevel;
}

export default function LogicPuzzles({ user, onUpdateUser, currentLevel }: LogicPuzzlesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const filteredPuzzles = MANTIQIY_MASALALAR.filter(p => p.level === currentLevel);
  const current = filteredPuzzles[currentIndex] || filteredPuzzles[0];

  const handleLevelFinished = () => {
    // End logic
  };

  const handleNext = () => {
    if (currentIndex < filteredPuzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      setShowVideo(false);
    } else {
      handleLevelFinished();
    }
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;
    const correct = selectedIdx === current.answer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      confetti({ particleCount: 50, spread: 60 });
      const updated = { ...user, xp: user.xp + 20 };
      onUpdateUser(updated);
    }
  };

   return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {!current ? (
         <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
           <p className="text-slate-400 font-bold">Ushbu daraja uchun masalalar hali qo'shilmagan.</p>
         </div>
      ) : (
        <>
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600 shadow-inner">
                  <Brain size={36} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mantiqiy Masalalar</h2>
                  <p className="text-slate-500 font-medium">Miyangizni charxlang!</p>
                </div>
              </div>
              {current.videoUrl && (
                <button 
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                >
                  <PlayCircle size={16} /> {showVideo ? "Video darsni yopish" : "Video darsni ko'rish"}
                </button>
              )}
            </div>

            {showVideo && current.videoUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border-4 border-white shadow-2xl"
              >
                <iframe 
                  src={current.videoUrl} 
                  className="w-full h-full"
                  title="Puzzle Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
            )}

            <div className="space-y-6">
             <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <h3 className="text-xl font-medium text-slate-800 leading-relaxed text-center">
                  "{current.question}"
                </h3>
             </div>

             <div className="grid gap-3">
                {current.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedIdx(idx)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                      selectedIdx === idx ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-slate-200",
                      isAnswered && idx === current.answer && "border-emerald-500 bg-emerald-50",
                      isAnswered && selectedIdx === idx && !isCorrect && "border-rose-500 bg-rose-50"
                    )}
                  >
                    <span className="font-medium text-slate-700">{opt}</span>
                     {isAnswered && idx === current.answer && <CheckCircle2 className="text-emerald-500" />}
                     {isAnswered && selectedIdx === idx && !isCorrect && <XCircle className="text-rose-500" />}
                  </button>
                ))}
             </div>

             <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={cn(
                    "p-4 rounded-xl flex gap-3",
                    isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                  )}
                >
                  <AlertCircle className="shrink-0" />
                  <div>
                     <div className="font-bold">{isCorrect ? "Barakalla!" : "Keyingi safar albatta topasiz!"}</div>
                     <p className="text-sm opacity-80">{current.explanation}</p>
                  </div>
                </motion.div>
              )}
             </AnimatePresence>

             <div className="flex justify-end pt-4">
                {!isAnswered ? (
                  <button
                    onClick={handleCheck}
                    disabled={selectedIdx === null}
                    className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Tekshirish
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-slate-800 flex items-center gap-2"
                  >
                    Keyingisi <ArrowRight />
                  </button>
                )}
             </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <HelpCircle className="text-slate-400" />
                <div className="text-sm font-medium text-slate-500">Savol {currentIndex + 1} / {filteredPuzzles.length}</div>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="text-sm font-bold text-amber-500">+20 XP</div>
                <div className="text-sm font-medium text-slate-500">To'g'ri javob uchun</div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
