/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProfile, UserLevel, Lesson } from '../types.ts';
import { LESSONS, MANTIQIY_MASALALAR } from '../constants.ts';
import { cn } from '../lib/utils.ts';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy as TrophyIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  PlayCircle,
  BrainCircuit,
  Award,
  BookMarked,
  Calculator,
  Star
} from 'lucide-react';
import LessonView from './LessonView.tsx';
import PersonalDashboard from './PersonalDashboard.tsx';
import RankingBoard from './RankingBoard.tsx';
import LogicPuzzles from './LogicPuzzles.tsx';
import RulesView from './RulesView.tsx';
import ModuleExams from './ModuleExams.tsx';
import DiscussionForum from './DiscussionForum.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { clearUser } from '../lib/utils.ts';
import { MessageSquare } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

type Tab = 'overview' | 'rules' | 'courses' | 'logic' | 'stats' | 'rankings' | 'exams' | 'forum';

export default function Dashboard({ user, onUpdateUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [viewingLevel, setViewingLevel] = useState<UserLevel>(user.level);

  const filteredLessons = LESSONS.filter(l => l.level === viewingLevel);
  
  const handleLogout = () => {
    if (confirm('Tizimdan chiqmoqchimisiz?')) {
      clearUser();
      window.location.reload();
    }
  };

  const handleLevelSelect = (level: UserLevel) => {
    setViewingLevel(level);
    setActiveTab('courses');
    setSelectedLesson(null);
  };

  const menuItems = [
    { id: 'overview', label: 'Bosh sahifa', icon: <LayoutDashboard size={20} /> },
    { id: 'rules', label: 'Qoidalar', icon: <BookMarked size={20} /> },
    { id: 'courses', label: 'Darslar', icon: <BookOpen size={20} /> },
    { id: 'logic', label: 'Mantiqiy masalalar', icon: <BrainCircuit size={20} /> },
    { id: 'exams', label: 'Modul Imtihonlari', icon: <Award size={20} /> },
    { id: 'forum', label: 'Munozara Forumi', icon: <MessageSquare size={20} /> },
    { id: 'stats', label: 'Shaxsiy Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'rankings', label: 'Reyting', icon: <TrophyIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-600 p-6 flex flex-col justify-between text-white hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600">
              <Award size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">Math Master</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setSelectedLesson(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold",
                  activeTab === item.id
                    ? "bg-indigo-500/30 border-l-4 border-white"
                    : "hover:bg-indigo-500/20 text-indigo-100 hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-indigo-700/50 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] opacity-70 uppercase font-black">Xush kelibsiz,</p>
              <p className="font-bold text-sm truncate">{user.name}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-transparent flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-6">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 px-6">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">🔥</div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Yutuqlar</p>
                <p className="text-xl font-black">{user.xp} XP</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 px-6">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">🎓</div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Darslar</p>
                <p className="text-xl font-black">{user.completedLessons.length} ta</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('stats')}
              className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm"
            >
              Statistika
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 text-sm"
            >
              Chiqish
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {selectedLesson ? (
              <motion.div
                key="lesson-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <LessonView 
                  lesson={selectedLesson} 
                  user={user} 
                  onUpdateUser={onUpdateUser} 
                  onBack={() => setSelectedLesson(null)} 
                />
              </motion.div>
            ) : activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Level Selection Grid Pattern from Theme */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Junior */}
                  <div className={cn(
                    "p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group transition-all cursor-pointer hover:scale-[1.02] active:scale-95",
                    "bg-emerald-400 shadow-emerald-100"
                  )}
                  onClick={() => handleLevelSelect(UserLevel.JUNIOR)}
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                      <Calculator size={120} />
                    </div>
                    <span className="bg-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">LEVEL: OSON</span>
                    <h3 className="text-3xl font-black mt-2">Junior</h3>
                    <p className="text-emerald-50 mt-2 text-sm">Boshlang'ich algebra va geometriya asoslari.</p>
                    <div className="mt-6 flex justify-between items-end font-bold">
                      <span className="text-sm underline">Darslarni ko'rish</span>
                      <button className="bg-white text-emerald-600 px-4 py-2 rounded-xl text-sm shadow-sm">
                        O'tish
                      </button>
                    </div>
                  </div>

                  {/* Senior */}
                  <div className={cn(
                    "p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group transition-all cursor-pointer hover:scale-[1.02] active:scale-95",
                    "bg-amber-400 shadow-amber-100"
                  )}
                  onClick={() => handleLevelSelect(UserLevel.SENIOR)}
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                      <Star size={120} />
                    </div>
                    <span className="bg-amber-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">LEVEL: O'RTA</span>
                    <h3 className="text-3xl font-black mt-2">Senior</h3>
                    <p className="text-amber-50 mt-2 text-sm">Trigonometriya va Logarifmik tenglamalar.</p>
                    <div className="mt-6 flex justify-between items-end font-bold">
                      <span className="text-sm underline">Darslarni ko'rish</span>
                      <button className="bg-white text-amber-600 px-4 py-2 rounded-xl text-sm shadow-sm">
                        O'tish
                      </button>
                    </div>
                  </div>

                  {/* Master */}
                  <div className={cn(
                    "p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden group transition-all cursor-pointer hover:scale-[1.02] active:scale-95",
                    "bg-rose-500 shadow-rose-100"
                  )}
                  onClick={() => handleLevelSelect(UserLevel.MASTER)}
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                      <TrophyIcon size={120} />
                    </div>
                    <span className="bg-rose-600/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">LEVEL: QIYIN</span>
                    <h3 className="text-3xl font-black mt-2">Master</h3>
                    <p className="text-rose-50 mt-2 text-sm">Oliy matematika va differensial tenglamalar.</p>
                    <div className="mt-6 flex justify-between items-end font-bold">
                      <span className="text-sm underline">Darslarni ko'rish</span>
                      <button className="bg-white text-rose-600 px-4 py-2 rounded-xl text-sm shadow-sm">
                        O'tish
                      </button>
                    </div>
                  </div>
                </section>

                <div className="flex gap-6 flex-col lg:flex-row">
                  <div className="flex-[2] bg-white rounded-[32px] p-8 shadow-sm flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black">Muammoli Masalalar Kursi</h4>
                      <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">Yangi darslar qo'shildi</span>
                    </div>
                    
                    <div className="relative group overflow-hidden rounded-2xl bg-indigo-600 aspect-video flex flex-col justify-end p-6 text-white">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle size={64} className="opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <div className="relative z-10">
                        <p className="font-bold text-lg">Haftalik muammoli masala #04</p>
                        <p className="text-indigo-100 text-sm">Mantiqiy yondashuv va yechimlar</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                    >
                      Darslarni ko'rish <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="flex-1 bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                    <h4 className="text-xl font-black">Sizning Yutuqlaringiz</h4>
                    <div className="bg-indigo-600 p-6 rounded-2xl text-white text-center space-y-4">
                      <div className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Akademiya Sertifikati</div>
                      <p className="text-lg font-black leading-tight">{user.level.toUpperCase()} DARAJASI BITIRUVCHISI</p>
                      <button 
                        onClick={() => user.completedLessons.length >= 2 && setActiveTab('stats')}
                        className="w-full bg-white text-indigo-600 text-xs font-black px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        YUKLAB OLISH
                      </button>
                    </div>
                    <div className="space-y-4 pt-2">
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Bajarilgan darslar</span>
                          <span className="font-black">{user.completedLessons.length} ta</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Umumiy reyting</span>
                          <span className="font-black text-amber-500">Top 5%</span>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'rules' ? (
               <RulesView level={viewingLevel} />
            ) : activeTab === 'courses' ? (
              <motion.div
                key="courses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Darslar ro'yxati</h2>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setViewingLevel(UserLevel.SENIOR)}
                       className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest", viewingLevel === UserLevel.SENIOR ? "bg-emerald-600 text-white" : "bg-white text-slate-400")}
                     >
                       Senior (Oson)
                     </button>
                     <button 
                       onClick={() => setViewingLevel(UserLevel.JUNIOR)}
                       className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest", viewingLevel === UserLevel.JUNIOR ? "bg-amber-500 text-white" : "bg-white text-slate-400")}
                     >
                       Junior (O'rta)
                     </button>
                     <button 
                       onClick={() => setViewingLevel(UserLevel.MASTER)}
                       className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest", viewingLevel === UserLevel.MASTER ? "bg-rose-500 text-white" : "bg-white text-slate-400")}
                     >
                       Master (Qiyin)
                     </button>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left space-y-4"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <PlayCircle size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">{lesson.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{lesson.description}</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                           <span className={cn(
                            "text-[10px] uppercase font-bold px-2 py-1 rounded-lg",
                            lesson.isProblemSolving ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                          )}>
                            {lesson.isProblemSolving ? "Muammoli masala" : "Nazariya"}
                          </span>
                           {user.completedLessons.includes(lesson.id) && (
                            <div className="bg-indigo-50 text-indigo-600 p-1 rounded-full">
                              <TrophyIcon size={14} />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
              </motion.div>
            ) : activeTab === 'logic' ? (
               <LogicPuzzles user={user} onUpdateUser={onUpdateUser} currentLevel={viewingLevel} />
            ) : activeTab === 'exams' ? (
               <ModuleExams user={user} onUpdateUser={onUpdateUser} onNavigateToTab={(tab) => { setActiveTab(tab); setSelectedLesson(null); }} />
            ) : activeTab === 'forum' ? (
               <DiscussionForum user={user} currentLevel={viewingLevel} />
            ) : activeTab === 'stats' ? (
               <PersonalDashboard user={user} onUpdateUser={onUpdateUser} onNavigateToTab={(tab) => { setActiveTab(tab); setSelectedLesson(null); }} />
            ) : (
               <RankingBoard user={user} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
