/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types.ts';
import { motion } from 'motion/react';
import { Award, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface CertificateProps {
  user: UserProfile;
  onBack: () => void;
}

export default function Certificate({ user, onBack }: CertificateProps) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-full max-w-2xl bg-white aspect-[1.414/1] p-12 shadow-2xl rounded-sm border-[16px] border-double border-slate-200 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-indigo-500 m-4 rounded-tl-xl opacity-30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-indigo-500 m-4 rounded-tr-xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-indigo-500 m-4 rounded-bl-xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-indigo-500 m-4 rounded-br-xl opacity-30"></div>

        <div className="space-y-2">
          <Award className="w-20 h-20 text-indigo-600 mx-auto" />
          <h1 className="text-4xl font-serif font-black tracking-widest text-slate-900 border-b-2 border-indigo-600 pb-2">SERTIFIKAT</h1>
          <p className="text-sm font-bold text-indigo-600 tracking-widest uppercase py-2">Matematika Akademiyasi Tamomlaganlik To'g'risida</p>
        </div>

        <div className="space-y-4">
          <p className="font-serif italic text-slate-500">Ushbu sertifikat bilan quyidagi o'quvchi:</p>
          <h2 className="text-5xl font-serif font-bold text-slate-800 border-b border-slate-100 px-12 py-2">{user.name}</h2>
          <p className="text-slate-600 max-w-sm mx-auto">
            Matematika fanining <span className="font-black text-indigo-600 uppercase">{user.level}</span> darajasini namunali ravishda tamomlaganligi uchun taqdirlanadi.
          </p>
        </div>

        <div className="flex justify-between w-full pt-12 items-end">
          <div className="text-center space-y-1">
             <div className="w-32 border-b border-slate-400"></div>
             <p className="text-[10px] text-slate-400 font-bold uppercase">Sana</p>
             <p className="text-xs font-bold">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="relative">
             <div className="w-24 h-24 rounded-full border-4 border-indigo-500 opacity-20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-indigo-600" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-indigo-200 border-dashed animate-spin-slow"></div>
             </div>
          </div>
          <div className="text-center space-y-1">
             <div className="w-32 border-b border-slate-400"></div>
             <p className="text-[10px] text-slate-400 font-bold uppercase">Imzo</p>
             <p className="font-serif italic">M. Akademiyasi</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-4">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Download size={20} /> Yuklab olish
        </button>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={20} /> Dashboardga qaytish
        </button>
      </div>
    </div>
  );
}
