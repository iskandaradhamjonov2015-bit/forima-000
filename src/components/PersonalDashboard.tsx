/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, UserLevel, Lesson } from '../types.ts';
import { LESSONS } from '../constants.ts';
import { 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  AlertCircle, 
  BookMarked,
  Sparkles,
  Printer,
  Calendar,
  History,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import Certificate from './Certificate.tsx';

interface PersonalDashboardProps {
  user: UserProfile;
  onNavigateToTab: (tab: any) => void;
  onUpdateUser: (user: UserProfile) => void;
}

const BADGES = [
  { id: 'b1', name: 'Junior Matematik', desc: 'Junior darajadagi imtihondan o\'tgan o\'quvchi', xp: 200, icon: '🎓', level: UserLevel.JUNIOR },
  { id: 'b2', name: 'Senior Matematik', desc: 'Senior darajadagi imtihondan o\'tgan o\'quvchi', xp: 500, icon: '⚡', level: UserLevel.SENIOR },
  { id: 'b3', name: 'Matematika Masteri', desc: 'Master darajadagi barcha imtihondan o\'tgan daho', xp: 1000, icon: '👑', level: UserLevel.MASTER },
  { id: 'b4', name: 'Mantiq Bilimdoni', desc: 'Mantiqiy masalalardan ball yig\'gan donishmand', xp: 300, icon: '🧠', isLogic: true }
];

export default function PersonalDashboard({ user, onNavigateToTab, onUpdateUser }: PersonalDashboardProps) {
  const [activeCertificateLevel, setActiveCertificateLevel] = useState<UserLevel | null>(null);

  // Group lessons by level
  const lessonsByLevel = {
    [UserLevel.JUNIOR]: LESSONS.filter(l => l.level === UserLevel.JUNIOR),
    [UserLevel.SENIOR]: LESSONS.filter(l => l.level === UserLevel.SENIOR),
    [UserLevel.MASTER]: LESSONS.filter(l => l.level === UserLevel.MASTER),
  };

  // Calculate percentages
  const completedCount = user.completedLessons.length;
  const totalLessonsCount = LESSONS.length;
  const overallPercentage = Math.round((completedCount / (totalLessonsCount || 1)) * 100);

  const levelProgress = {
    [UserLevel.JUNIOR]: Math.round(
      (user.completedLessons.filter(id => id.startsWith('jr')).length / (lessonsByLevel[UserLevel.JUNIOR].length || 1)) * 100
    ),
    [UserLevel.SENIOR]: Math.round(
      (user.completedLessons.filter(id => id.startsWith('sr')).length / (lessonsByLevel[UserLevel.SENIOR].length || 1)) * 100
    ),
    [UserLevel.MASTER]: Math.round(
      (user.completedLessons.filter(id => id.startsWith('ms')).length / (lessonsByLevel[UserLevel.MASTER].length || 1)) * 100
    ),
  };

  // Check which badges are unlocked
  const unlockedBadges = user.badges || [];
  
  // Custom badges logic if they solved mantiqiy masalalar
  const totalXp = user.xp;
  const showsLogicBadge = totalXp >= 200; // logic master badge custom indicator

  const isBadgeUnlocked = (badge: typeof BADGES[0]) => {
    if (badge.isLogic) return showsLogicBadge;
    return unlockedBadges.includes(badge.name);
  };

  // Recharts engagement activity data
  const activityData = [
    { day: 'Du', xp: 20 },
    { day: 'Se', xp: 45 },
    { day: 'Ch', xp: totalXp > 100 ? 70 : 10 },
    { day: 'Pa', xp: totalXp > 250 ? 95 : 15 },
    { day: 'Ju', xp: totalXp > 0 ? Math.min(180, totalXp) : 0 },
    { day: 'Sh', xp: 0 },
    { day: 'Ya', xp: 0 },
  ];

  const pieData = [
    { name: 'Bajarilgan', value: completedCount },
    { name: 'O\'rganilayotgan', value: Math.max(0, totalLessonsCount - completedCount) },
  ];
  const COLORS = ['#6366f1', '#f1f5f9'];

  // Handle Certificate View launch
  const handleViewCertificate = (level: UserLevel) => {
    // Inject level data into user so Certificate.tsx generates for this level
    const updatedUser = {
      ...user,
      level: level
    };
    onUpdateUser(updatedUser);
    setActiveCertificateLevel(level);
  };

  if (activeCertificateLevel) {
    return (
      <Certificate 
        user={user} 
        onBack={() => setActiveCertificateLevel(null)} 
      />
    );
  }

  // Get active exam recommendations
  const examKeys = Object.keys(user.completedExams || {});
  const lastExamKey = examKeys[examKeys.length - 1];
  const lastExam = lastExamKey ? user.completedExams?.[lastExamKey] : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Umumiy Yutuqlar (XP)" 
          value={`${user.xp} XP`} 
          icon={<TrendingUp className="text-indigo-600" />} 
          desc="O'quv tizimida to'plangan ochkolar"
          bgColor="bg-indigo-50"
        />
        <StatCard 
          title="Kursdagi Progress" 
          value={`${overallPercentage}%`}
          icon={<Target className="text-emerald-600" />} 
          desc="Tugallangan darslar nisbati"
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Bajarilgan darslar" 
          value={`${completedCount} / ${totalLessonsCount}`}
          icon={<BookOpen className="text-amber-600" />} 
          desc="Faol o'zlashtirilgan darslar ro'yxati"
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Sertifikatlar" 
          value={`${Object.keys(user.completedExams || {}).filter(k => (user.completedExams?.[k].score || 0) >= 4).length} ta`}
          icon={<Award className="text-rose-600" />} 
          desc="Qo'lga kiritilgan diplom va nishonlar"
          bgColor="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress breakdown per Moduli */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-600" size={20} /> Kurs Modullari O'zlashtirilishi
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">Har bir darajadagi darslar va yechilgan savollar bo'yicha yuksalish</p>
          </div>

          <div className="space-y-6">
            {/* Junior progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-800">Junior Alohida Moduli (Oson)</span>
                <span className="font-black text-emerald-600">{levelProgress[UserLevel.JUNIOR]}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-2xl overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-2xl progress-step-anim text-right" style={{ width: `${levelProgress[UserLevel.JUNIOR]}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Algebra va Geometriya asoslari</span>
                <span>{user.completedLessons.filter(id => id.startsWith('jr')).length} / {lessonsByLevel[UserLevel.JUNIOR].length} ta dars</span>
              </div>
            </div>

            {/* Senior progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-800">Senior Alohida Moduli (O'rta)</span>
                <span className="font-black text-amber-500">{levelProgress[UserLevel.SENIOR]}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-2xl overflow-hidden">
                <div className="bg-amber-400 h-full rounded-2xl progress-step-anim" style={{ width: `${levelProgress[UserLevel.SENIOR]}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Trigonometriya va Logarifmik tenglamalar</span>
                <span>{user.completedLessons.filter(id => id.startsWith('sr')).length} / {lessonsByLevel[UserLevel.SENIOR].length} ta dars</span>
              </div>
            </div>

            {/* Master progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-800">Master Alohida Moduli (Qiyin)</span>
                <span className="font-black text-rose-500">{levelProgress[UserLevel.MASTER]}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-2xl overflow-hidden">
                <div className="bg-rose-500 h-full rounded-2xl progress-step-anim" style={{ width: `${levelProgress[UserLevel.MASTER]}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Oliy matematika & Limit-Integrallar</span>
                <span>{user.completedLessons.filter(id => id.startsWith('ms')).length} / {lessonsByLevel[UserLevel.MASTER].length} ta dars</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tushunarli bo'lmagan darslarni qayta o'rganing</span>
            <button 
              onClick={() => onNavigateToTab('courses')}
              className="px-4 py-2 text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              Yangi darsga o'tish <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Visual progress pie chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="w-full text-left">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">O'zlashtirish Foizi</h3>
            <p className="text-xs text-slate-400 font-semibold">Tugallangan nazariy va amaliy darslar</p>
          </div>

          <div className="h-44 w-full relative -my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-black text-slate-900">{overallPercentage}%</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tugatildi</div>
            </div>
          </div>

          <div className="w-full space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-500"></div>
                <span className="text-slate-500">Bajarilgan darslar</span>
              </div>
              <span className="font-extrabold text-slate-800">{completedCount} ta</span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-100 border border-slate-200"></div>
                <span className="text-slate-500">Qulflangan darslar</span>
              </div>
              <span className="font-extrabold text-slate-800">{totalLessonsCount - completedCount} ta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges and Credentials */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="text-amber-500" size={20} /> Akademik Unvon Badgelari
            </h3>
            <p className="text-xs text-slate-400 font-semibold">Imtihonlarni topshirish orqali unvonlarni oching</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const unlocked = isBadgeUnlocked(badge);
              return (
                <div 
                  key={badge.id}
                  className={cn(
                    "p-4 rounded-3xl border text-center transition-all relative overflow-hidden flex flex-col items-center justify-center space-y-2",
                    unlocked 
                      ? "bg-amber-50/40 border-amber-200/60 text-amber-900" 
                      : "bg-slate-50/40 border-slate-100 text-slate-300"
                  )}
                >
                  <div className={cn(
                    "text-3xl filter transition-transform",
                    unlocked ? "scale-110 drop-shadow-sm animate-pulse-slow" : "opacity-30 grayscale"
                  )}>
                    {badge.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className={cn("text-xs font-black", unlocked ? "text-amber-800" : "text-slate-400")}>{badge.name}</p>
                    <p className="text-[8px] leading-tight font-medium text-slate-400 max-w-[100px] mx-auto">{badge.desc}</p>
                  </div>
                  
                  {!unlocked && (
                    <div className="absolute top-2 right-2 text-slate-300">
                      <Lock size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Vault & History */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Printer className="text-indigo-600" size={20} /> Sertifikatlar Ombodi
            </h3>
            <p className="text-xs text-slate-400 font-semibold">Muvaffaqiyatli yakunlangan imtihonlardan so'ng diplomlarni yuklang yoki chop eting</p>
          </div>

          <div className="space-y-3">
            {/* Junior level cert */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Junior Darajasi Sertifikati</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Algebra va Geometriya o'zlashtirganlik hujjati</p>
                </div>
              </div>
              
              {user.completedExams?.[`exam_${UserLevel.JUNIOR}`] && user.completedExams?.[`exam_${UserLevel.JUNIOR}`].score >= 4 ? (
                <button
                  onClick={() => handleViewCertificate(UserLevel.JUNIOR)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-md"
                >
                  Ko'rish / Chop etish
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Lock size={10} /> Qulflangan
                </span>
              )}
            </div>

            {/* Senior level cert */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Senior Darajasi Sertifikati</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Trigonometriya va Logarifmlarni bilish diplomi</p>
                </div>
              </div>

              {user.completedExams?.[`exam_${UserLevel.SENIOR}`] && user.completedExams?.[`exam_${UserLevel.SENIOR}`].score >= 4 ? (
                <button
                  onClick={() => handleViewCertificate(UserLevel.SENIOR)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-md"
                >
                  Ko'rish / Chop etish
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Lock size={10} /> Qulflangan
                </span>
              )}
            </div>

            {/* Master level cert */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Master Doirasidagi Daho Sertifikati</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Oliy matematika darajador hujjat</p>
                </div>
              </div>

              {user.completedExams?.[`exam_${UserLevel.MASTER}`] && user.completedExams?.[`exam_${UserLevel.MASTER}`].score >= 4 ? (
                <button
                  onClick={() => handleViewCertificate(UserLevel.MASTER)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-md"
                >
                  Ko'rish / Chop etish
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Lock size={10} /> Qulflangan
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 text-[10px] font-semibold text-slate-400 flex justify-between items-center">
            <span>Diplom yuklanishi va chop etilishi real brauzer tizimida tekshirilgan.</span>
            <span>M. Akademiya jamoasi</span>
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Block */}
      {lastExam && lastExam.recommendations && lastExam.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-6 rounded-[32px] border border-indigo-100/30 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-200">
              <Sparkles size={18} className="animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-lg font-black text-indigo-950 tracking-tight">Sun'iy Intellekt va O'qituvchi Maslahatlari</h4>
              <p className="text-xs text-indigo-900/60 font-semibold">Taqdim qilingan oxirgi imtihoningiz bo'yicha tahlillar darsligi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-indigo-50/50">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Mavzular To'plami</span>
              <p className="text-xs font-semibold leading-relaxed text-slate-600">
                Imtihon natijasiga ko'ra, sizda <span className="font-extrabold text-indigo-600">{lastExam.recommendations.length} ta</span> asosiy matematika bo'limlari bo'yicha o'zrashtirilishi qiyin kechgan nuqtalar aniqlandi. Biz sizga kerakli mavzu qoidalaridan foydalanishni taklif qilamiz.
              </p>
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div className="flex flex-wrap gap-2">
                {lastExam.recommendations.map((rec, i) => (
                  <span key={i} className="bg-indigo-100/80 text-indigo-800 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase border border-indigo-200/50">
                    {rec.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => onNavigateToTab('rules')}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                >
                  <BookMarked size={14} /> Qoidalardan takrorlash
                </button>
                <button
                  onClick={() => onNavigateToTab('courses')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-md shadow-indigo-100"
                >
                  <BookOpen size={14} /> Darslarni mustahkamlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week in numbers - graph report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" /> Haftalik Faollik ko'rsatkichi
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="xp" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Log */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History size={18} className="text-indigo-600" /> Imtihonlar Tarixi
          </h3>
          
          {Object.keys(user.completedExams || {}).length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold space-y-2">
              <Calendar size={32} className="mx-auto text-slate-300" />
              <p className="text-sm">Imtihonlar tarixi bo'sh.</p>
              <p className="text-[10px] font-medium leading-tight">Yutuqlarni tasdiqlash uchun imtihonlarni boshlang.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 space-y-3">
              {Object.keys(user.completedExams || {}).map((examKey, i) => {
                const exam = user.completedExams?.[examKey];
                if (!exam) return null;
                const passed = exam.score >= 4;
                return (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 capitalize">{examKey.replace('_', ' ')} Imtihoni</h4>
                      <p className="text-[9px] text-slate-400 font-semibold">{new Date(exam.date).toLocaleDateString()}</p>
                    </div>

                    <div className="text-right">
                      <span className={cn(
                        "text-[9px] px-2 py-1 rounded-xl uppercase font-black tracking-wider",
                        passed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {exam.score} / {exam.total} {passed ? "O'tdi" : "Yiqildi"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc, bgColor }: { title: string, value: string | number, icon: React.ReactNode, desc: string, bgColor: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all group">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bgColor)}>
        {icon}
      </div>
      <div>
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">{title}</div>
        <div className="text-3xl font-black text-slate-900">{value}</div>
        <p className="text-[10px] text-slate-400 font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}
