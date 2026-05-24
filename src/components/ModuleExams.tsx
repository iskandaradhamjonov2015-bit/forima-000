/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserProfile, UserLevel } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  Timer, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  BookOpen, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  BookMarked,
  X,
  PlayCircle
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import confetti from 'canvas-confetti';

interface ModuleExamsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onNavigateToTab: (tab: any) => void;
}

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  categoryLabel: string;
  explanation: string;
}

const JUNIOR_EXAM: ExamQuestion[] = [
  {
    id: 'jq-1',
    question: 'Tenglamani yeching: 3x - 7 = 11. x nechaga teng?',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 8'],
    correctAnswer: 2,
    category: 'equations',
    categoryLabel: 'Chiziqli tenglamalar',
    explanation: '3x - 7 = 11 => 3x = 18 => x = 6.'
  },
  {
    id: 'jq-2',
    question: "To'g'ri burchakli uchburchakning katetlari 3 va 4 ga teng. Gipotenuza uzunligini toping.",
    options: ['5', '6', '7', 'sqrt(7)'],
    correctAnswer: 0,
    category: 'geometry_pifagor',
    categoryLabel: 'Pifagor teoremasi',
    explanation: "Pifagor teoremasiga ko'ra: c² = a² + b² = 3² + 4² = 25. Demak, c = 5."
  },
  {
    id: 'jq-3',
    question: "Ko'paytirish amalini bajaring: 3/4 * 8/9",
    options: ['27/32', '2/3', '24/36', '5/6'],
    correctAnswer: 1,
    category: 'fractions',
    categoryLabel: 'Oddiy kasrlar',
    explanation: "(3 * 8) / (4 * 9) = 24 / 36 = 2/3."
  },
  {
    id: 'jq-4',
    question: "Soddalashtiring: 2(a + 3b) - 5b",
    options: ['2a + b', '2a + 11b', '2a - b', '2a + 6b'],
    correctAnswer: 0,
    category: 'algebra',
    categoryLabel: 'Algebraik ifodalar',
    explanation: "2(a + 3b) - 5b = 2a + 6b - 5b = 2a + b."
  },
  {
    id: 'jq-5',
    question: "Aylana radiusi r = 7 ga teng. Uning yuzini toping. (pi = 22/7 deb oling)",
    options: ['44', '154', '49', '98'],
    correctAnswer: 1,
    category: 'geometry_circle',
    categoryLabel: 'Geometrik shakllar va yuzalar',
    explanation: "S = pi * r² = 22/7 * 7 * 7 = 22 * 7 = 154."
  }
];

const SENIOR_EXAM: ExamQuestion[] = [
  {
    id: 'sq-1',
    question: 'Agar log_2(x) = 5 bo\'lsa, x ning qiymatini toping.',
    options: ['x = 10', 'x = 25', 'x = 32', 'x = 64'],
    correctAnswer: 2,
    category: 'logarithms',
    categoryLabel: 'Logarifmlar va ko\'rsatkichli tenglamalar',
    explanation: 'Logarifm ta\'rifiga ko\'ra: x = 2^5 = 32.'
  },
  {
    id: 'sq-2',
    question: 'Quyidagi trigonometrik ifodaning qiymati nechaga teng? sin²(15°) + cos²(15°)',
    options: ['0.5', '1', '1.5', 'aniqlab bo\'lmaydi'],
    correctAnswer: 1,
    category: 'trigonometry',
    categoryLabel: 'Trigonometriya asoslari',
    explanation: "Har qanday x burchak uchun asosiy trigonometrik ayniyat: sin²(x) + cos²(x) = 1 ga teng."
  },
  {
    id: 'sq-3',
    question: 'Kvadrat tenglamani yeching: x² - 5x + 6 = 0',
    options: ['x = 1; x = 6', 'x = -2; x = -3', 'x = 2; x = 3', 'x = -1; x = 5'],
    correctAnswer: 2,
    category: 'equations_quadratic',
    categoryLabel: 'Kvadrat tenglamalar',
    explanation: "Viyet teoremasiga ko'ra, ildizlar yig'indisi 5, ko'paytmasi 6 bo'lgan sonlar bu 2 va 3."
  },
  {
    id: 'sq-4',
    question: 'Tog\'ri chiziqning burchak koeffitsiyenti k = 3. Unga perpendikulyar bo\'lgan to\'g\'ri chiziqning burchak koeffitsiyentini toping.',
    options: ['3', '-3', '1/3', '-1/3'],
    correctAnswer: 3,
    category: 'coord_geometry',
    categoryLabel: 'Koordinatalar va algebraik geometriya',
    explanation: "Perpendikulyar to'g'ri chiziqlar burchak koeffitsiyentlari ko'paytmasi k1 * k2 = -1 ga teng. Demak k2 = -1/3."
  },
  {
    id: 'sq-5',
    question: 'Quyidagi arifmetik progressiyaning dastlabki 10 ta hadi yig\'indisini hisoblang: 2, 4, 6, 8, ...',
    options: ['110', '100', '120', '90'],
    correctAnswer: 0,
    category: 'progressions',
    categoryLabel: 'Arifmetik va geometrik progressiya',
    explanation: "a1=2, d=2. S10 = ((2*a1 + 9*d)/2) * 10 = ((4 + 18)/2) * 10 = 11 * 10 = 110."
  }
];

const MASTER_EXAM: ExamQuestion[] = [
  {
    id: 'mq-1',
    question: 'f(x) = e^(3x) funksiyasining hosilasini (differensialini) toping.',
    options: ['e^(3x)', '3x * e^(3x-1)', '3 * e^(3x)', '1/3 * e^(3x)'],
    correctAnswer: 2,
    category: 'derivatives',
    categoryLabel: 'Funksiya hosilasi va oliy matematika',
    explanation: "Murakkab funksiyaning hosilasi qoidasiga ko'ra, (e^(u))' = u' * e^u. Shuning uchun (e^(3x))' = 3 * e^(3x)."
  },
  {
    id: 'mq-2',
    question: 'Limitni hisoblang: lim (x -> oo) of (2x + 5) / (3x - 1)',
    options: ['0', '2/3', '5', '5/3'],
    correctAnswer: 1,
    category: 'limits',
    categoryLabel: 'Limitlar va uzluksizlik',
    explanation: "Cheksizlikda eng katta darajali hadlar olinadi: lim (x->oo) 2x/3x = 2/3."
  },
  {
    id: 'mq-3',
    question: 'Aniq integralni hisoblang: ∫ (0 dan 2 gacha) 3x² dx',
    options: ['6', '8', '12', '4'],
    correctAnswer: 1,
    category: 'integrals',
    categoryLabel: 'Aniq va aniqmas integrallar',
    explanation: "Hosilasi 3x² bo'lgan funksiya x³ dir. Nyuton-Leybnits formulasiga ko'ra: F(2) - F(0) = 2³ - 0³ = 8."
  },
  {
    id: 'mq-4',
    question: '"KURS" so\'zidagi barcha harflarni almashtirib necha xil turli so\'z hosil qilish mumkin (ma\'noga ega bo\'lishi shart emas)?',
    options: ['4', '12', '24', '16'],
    correctAnswer: 2,
    category: 'combinatorics',
    categoryLabel: 'Kombinatorika va guruhlash',
    explanation: "4 ta harfli so'z bo'lgani va takrorlanmasligi sababli javob: 4! = 4 * 3 * 2 * 1 = 24 xil usul."
  },
  {
    id: 'mq-5',
    question: "Savatda 3 ta qizil va 5 ta ko'k koptok bor. Savatdan ketma-ket qaytarmasdan 2 ta koptok olinsa, ikkalasi ham ko'k bo'lish ehtimolini toping.",
    options: ['25/64', '5/14', '15/56', '5/8'],
    correctAnswer: 1,
    category: 'probability',
    categoryLabel: 'Ehtimollar nazariyasi',
    explanation: "Birinchisi ko'k bo'lishi: 5/8. Ikkinchisi ko'k bo'lishi: 4/7. Ko'paytma: (5/8) * (4/7) = 20/56 = 5/14."
  }
];

// Quick localized micro-practice for recommendations to "repair" and gain extra points
const QUICK_PRACTICES: Record<string, { question: string, options: string[], answer: number, explanation: string }> = {
  'equations': {
    question: "Mini-Mashq: 2x + 5 = 15 bo'lsa, x nimaga teng?",
    options: ["2", "4", "5", "6"],
    answer: 2,
    explanation: "2x + 5 = 15 => 2x = 10 => x = 5."
  },
  'geometry_pifagor': {
    question: "Mini-Mashq: Katetlari 6 va 8 bo'lgan to'g'ri burchakli uchburchak gipotenuzasini toping.",
    options: ["9", "10", "12", "14"],
    answer: 1,
    explanation: "c² = 6² + 8² = 36 + 64 = 100. Demak, c = 10."
  },
  'fractions': {
    question: "Mini-Mashq: 1/3 + 1/6 ni hisoblang.",
    options: ["2/9", "1/2", "1/9", "3/6"],
    answer: 1,
    explanation: "Umumiy maxraj 6: 2/6 + 1/6 = 3/6 = 1/2."
  },
  'algebra': {
    question: "Mini-Mashq: 3(x - 2) + 6 ifodani soddalashtiring.",
    options: ["3x - 12", "3x", "3x + 12", "3x - 6"],
    answer: 1,
    explanation: "3(x - 2) + 6 = 3x - 6 + 6 = 3x."
  },
  'geometry_circle': {
    question: "Mini-Mashq: Aylana radiusi r=3. Uning uzunligini toping (Formula: L = 2*pi*r, pi = 3 deb oling).",
    options: ["6", "12", "18", "9"],
    answer: 2,
    explanation: "L = 2 * 3 * 3 = 18."
  },
  'logarithms': {
    question: "Mini-Mashq: log_3(x) = 3 bo'lsa, x ning qiymati?",
    options: ["9", "27", "81", "3"],
    answer: 1,
    explanation: "x = 3³ = 27."
  },
  'trigonometry': {
    question: "Mini-Mashq: sin(30°) ning qiymati nechaga teng?",
    options: ["1/2", "sqrt(3)/2", "1", "0"],
    answer: 0,
    explanation: "Trigonometrik jadvalga ko'ra, sin(30°) = 1/2 = 0.5."
  },
  'equations_quadratic': {
    question: "Mini-Mashq: x² - 4 = 0 tenglama ildizlarini toping.",
    options: ["x = 2", "x = -2", "x = ±2", "ildizi yo'q"],
    answer: 2,
    explanation: "x² = 4 => x = 2 yoki x = -2, demak x = ±2."
  },
  'coord_geometry': {
    question: "Mini-Mashq: y = 2x + 1 to'g'ri chiziqning burchak koeffitsiyenti (k) nechaga teng?",
    options: ["1", "2", "3", "-2"],
    answer: 1,
    explanation: "y = kx + b formulada k = 2."
  },
  'progressions': {
    question: "Mini-Mashq: 5, 10, 15, ... arifmetik progressiyaning 4-hadi necha?",
    options: ["18", "20", "25", "30"],
    answer: 1,
    explanation: "Har bir hadga 5 qo'shib boriladi. 15 + 5 = 20."
  },
  'derivatives': {
    question: "Mini-Mashq: f(x) = 5x³ funksiyaning hosilasini toping.",
    options: ["15x²", "5x²", "15x", "15"],
    answer: 0,
    explanation: "(5x³)' = 5 * 3x² = 15x²."
  },
  'limits': {
    question: "Mini-Mashq: lim (x -> 3) (x² - 9) / (x - 3) limitni hisoblang.",
    options: ["3", "6", "0", "cheksiz"],
    answer: 1,
    explanation: "(x²-9)/(x-3) = ((x-3)(x+3))/(x-3) = x+3. x->3 da 3+3 = 6 bo'ladi."
  },
  'integrals': {
    question: "Mini-Mashq: ∫ (0 dan 1 gacha) 2x dx integralni hisoblang.",
    options: ["1", "2", "0.5", "4"],
    answer: 0,
    explanation: "Boshlang'ich funksiya x². F(1) - F(0) = 1² - 0 = 1."
  },
  'combinatorics': {
    question: "Mini-Mashq: 3 ta harfli 'ABC' so'zidan necha xil unikal kombinatsiya tuzish mumkin?",
    options: ["3", "6", "9", "12"],
    answer: 1,
    explanation: "3! = 3 * 2 * 1 = 6."
  },
  'probability': {
    question: "Mini-Mashq: Tanga 1 marta tashlanganda gerb tomoni tushish ehtimoli?",
    options: ["1/4", "1/2", "1", "0"],
    answer: 1,
    explanation: "Faqat 2 ta imkoniyat bor: gerb va raqam. Gerb ehtimoli 1/2 dir."
  }
};

export default function ModuleExams({ user, onUpdateUser, onNavigateToTab }: ModuleExamsProps) {
  const [activeLevel, setActiveLevel] = useState<UserLevel>(user.level);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  // States for recommendations practice
  const [solvedPractices, setSolvedPractices] = useState<Record<string, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number | null>>({});
  const [practiceChecked, setPracticeChecked] = useState<Record<string, boolean>>({});

  const questions = activeLevel === UserLevel.JUNIOR 
    ? JUNIOR_EXAM 
    : activeLevel === UserLevel.SENIOR 
    ? SENIOR_EXAM 
    : MASTER_EXAM;

  useEffect(() => {
    let timer: any;
    if (examStarted && !examFinished) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, answers]);

  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setAnswers({});
    setTimeLeft(600);
    setExamFinished(false);
    setSolvedPractices({});
    setPracticeAnswers({});
    setPracticeChecked({});
  };

  const handleSelectOption = (idx: number) => {
    setSelectedAnswer(idx);
    setAnswers({ ...answers, [currentQuestionIdx]: idx });
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(answers[currentQuestionIdx + 1] !== undefined ? answers[currentQuestionIdx + 1] : null);
    } else {
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setSelectedAnswer(answers[currentQuestionIdx - 1]);
    }
  };

  const finishExam = () => {
    setExamFinished(true);
    setExamStarted(false);

    // Calculate score
    let totalCorrect = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        totalCorrect += 1;
      }
    });
    setScore(totalCorrect);

    // Get wrong categories for recommendations
    const wrongCategories: string[] = [];
    questions.forEach((q, idx) => {
      if (answers[idx] !== q.correctAnswer) {
        wrongCategories.push(q.category);
      }
    });

    // Update user profile
    const key = `exam_${activeLevel}`;
    const wasCompleted = user.completedExams && user.completedExams[key];
    const newXP = wasCompleted ? 0 : totalCorrect * 50; // 50 XP per correct first time

    // Badge unlocking
    let newBadges = [...(user.badges || [])];
    const badgeName = activeLevel === UserLevel.JUNIOR 
      ? 'Junior Matematik' 
      : activeLevel === UserLevel.SENIOR 
      ? 'Senior Matematik' 
      : 'Matematika Masteri';

    if (totalCorrect >= 4 && !newBadges.includes(badgeName)) {
      newBadges.push(badgeName);
    }

    const updatedUser: UserProfile = {
      ...user,
      xp: user.xp + newXP,
      completedExams: {
        ...(user.completedExams || {}),
        [key]: {
          score: totalCorrect,
          total: questions.length,
          date: Date.now(),
          recommendations: wrongCategories
        }
      },
      badges: newBadges
    };

    onUpdateUser(updatedUser);

    if (totalCorrect >= 4) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle recommendation micro-practice interaction
  const handleSolvePractice = (category: string, optionIdx: number) => {
    setPracticeAnswers({ ...practiceAnswers, [category]: optionIdx });
  };

  const handleCheckPractice = (category: string) => {
    const practice = QUICK_PRACTICES[category];
    const selected = practiceAnswers[category];
    if (selected === null || selected === undefined) return;

    setPracticeChecked({ ...practiceChecked, [category]: true });
    if (selected === practice.answer) {
      setSolvedPractices({ ...solvedPractices, [category]: true });
      
      // Award extra 15 XP for correcting understanding
      const updatedUser = {
        ...user,
        xp: user.xp + 15
      };
      onUpdateUser(updatedUser);
      confetti({
        particleCount: 30,
        spread: 40,
        colors: ['#10b981', '#60a5fa']
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back to dashboard */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigateToTab('overview')}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black tracking-widest text-[10px] uppercase transition-colors"
        >
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </button>
        
        <div className="text-sm font-bold text-slate-500">
          Ushbu modul: <span className="text-indigo-600 font-extrabold capitalize">{activeLevel}</span>
        </div>
      </div>

      {!examStarted && !examFinished && (
        <div className="space-y-8">
          {/* Welcome Screen */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8 text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 opacity-30"></div>
            <div className="absolute left-0 bottom-0 w-24 h-24 bg-teal-50 rounded-tr-[80px] -z-10 opacity-30"></div>
            
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-[24px] mx-auto flex items-center justify-center text-indigo-600 shadow-inner">
              <Trophy size={40} />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modul Yakuniy Imtihonlari</h2>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                Kurslarni va darslarni mukammal o'zlashtirganingizni isbotlang! Har bir daraja bo'yicha imtihon 5 ta qiyinlashtirilgan savoldan iborat. Muammolarni toping, shaxsiy tavsiyalar va oliy akademik unvonlarni qo'lga kiriting!
              </p>
            </div>

            {/* Level Selector buttons */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <button 
                onClick={() => setActiveLevel(UserLevel.JUNIOR)}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 font-black text-sm uppercase transition-all tracking-wider flex items-center gap-2",
                  activeLevel === UserLevel.JUNIOR ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-100" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                <span>Junior (Oson)</span>
                {user.completedExams?.[`exam_${UserLevel.JUNIOR}`] && <CheckCircle size={16} />}
              </button>
              <button 
                onClick={() => setActiveLevel(UserLevel.SENIOR)}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 font-black text-sm uppercase transition-all tracking-wider flex items-center gap-2",
                  activeLevel === UserLevel.SENIOR ? "bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-100" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                <span>Senior (O'rta)</span>
                {user.completedExams?.[`exam_${UserLevel.SENIOR}`] && <CheckCircle size={16} />}
              </button>
              <button 
                onClick={() => setActiveLevel(UserLevel.MASTER)}
                className={cn(
                  "px-6 py-4 rounded-2xl border-2 font-black text-sm uppercase transition-all tracking-wider flex items-center gap-2",
                  activeLevel === UserLevel.MASTER ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-100" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                <span>Master (Qiyin)</span>
                {user.completedExams?.[`exam_${UserLevel.MASTER}`] && <CheckCircle size={16} />}
              </button>
            </div>

            {/* Exam info panel */}
            <div className="bg-slate-50 p-6 rounded-3xl max-w-md mx-auto grid grid-cols-2 gap-4 text-left border border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Savollar soni</span>
                <p className="font-extrabold text-slate-800">5 ta murakkab test</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Vaqt limiti</span>
                <p className="font-extrabold text-slate-800">10:00 daqiqa</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Muvaffaqiyat</span>
                <p className="font-extrabold text-slate-800">kamida 4 ta to'g'ri</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Mukofot va ball</span>
                <p className="font-extrabold text-indigo-600">+250 XP & Unvon nishoni</p>
              </div>
            </div>

            {/* Start CTA */}
            <div className="pt-4">
              <button 
                onClick={startExam}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase px-12 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95 space-y-1"
              >
                Imtihonni Boshlash
              </button>
            </div>
          </div>
        </div>
      )}

      {examStarted && !examFinished && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          {/* Header containing timer */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                {activeLevel} Imtihoni
              </span>
              <span className="text-slate-400 text-xs font-semibold">| Muvaffaqiyatli topshiring</span>
            </div>
            
            <div className="flex items-center gap-2 font-black text-rose-400 text-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl">
              <Timer size={20} className="animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Progress breadcrumbs */}
            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  disabled
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all",
                    currentQuestionIdx === i 
                      ? "bg-indigo-600" 
                      : answers[i] !== undefined 
                      ? "bg-indigo-200" 
                      : "bg-slate-100"
                  )}
                />
              ))}
            </div>

            {/* Question title */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Savol {currentQuestionIdx + 1} / {questions.length} • {questions[currentQuestionIdx].categoryLabel}
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {questions[currentQuestionIdx].question}
              </h3>
            </div>

            {/* Options list */}
            <div className="grid gap-3">
              {questions[currentQuestionIdx].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "w-full p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden flex items-center justify-between group",
                    selectedAnswer === idx 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-inner" 
                      : "border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white"
                  )}
                >
                  <span className={cn(
                    "font-bold transition-transform group-hover:translate-x-1 duration-200",
                    selectedAnswer === idx ? "text-indigo-900" : "text-slate-700"
                  )}>
                    {option}
                  </span>
                  
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedAnswer === idx 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : "border-slate-300"
                  )}>
                    {selectedAnswer === idx && <Check size={14} className="stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIdx === 0}
                className="px-6 py-3 border-2 border-slate-100 hover:border-slate-200 rounded-2xl font-bold text-slate-600 hover:text-slate-800 disabled:opacity-30 transition-all text-sm uppercase tracking-wider"
              >
                Ortga
              </button>

              <div className="text-center">
                <button
                  onClick={finishExam}
                  className="px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-2xl text-xs font-extrabold uppercase tracking-wide transition-all"
                >
                  Imtihonni yakunlash
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"
              >
                {currentQuestionIdx === questions.length - 1 ? "Yuborish" : "Keyingisi"} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {examFinished && (
        <div className="space-y-8">
          {/* Results Summary banner */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
            
            <div className={cn(
              "w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 shadow-xl",
              score >= 4 
                ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-emerald-100" 
                : "bg-rose-50 border-rose-500 text-rose-600 shadow-rose-100"
            )}>
              <Trophy size={48} className={cn(score >= 4 ? "animate-bounce" : "")} />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {score >= 4 ? "Imtihondan Muaffaqiyatli O'tdingiz!" : "Qayta tayyorlanish tavsiya etiladi"}
              </h2>
              <p className="text-slate-500 font-semibold text-sm">
                Siz {questions.length} savoldan <span className="text-indigo-600 font-black text-lg">{score} ta</span> to'g'ri javob berdingiz.
                {score >= 4 
                  ? " Tabriklaymiz, siz ushbu modulni mukammal o'zlashtirdingiz va maxsus unvon nishoni bilan taqdirlandingiz!" 
                  : " Modulni muvaffaqiyatli yakunlash uchun kamida 4 ta to'g'ri javob kerak. Quyidagi shaxsiy tavsiyalarni o'rganing."
                }
              </p>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <div className="text-center space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Foiz unumdorligi</span>
                <p className="text-lg font-black text-slate-800">{Math.round((score / questions.length) * 100)}%</p>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Yig'ilgan XP</span>
                <p className="text-lg font-black text-indigo-600">+{score * 50} XP</p>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Sinf darajasi</span>
                <p className="text-lg font-black text-amber-500 capitalize">{activeLevel}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button 
                onClick={startExam}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-8 py-4 rounded-2xl transition-all"
              >
                Imtihonni qayta topshirish
              </button>
              
              <button 
                onClick={() => onNavigateToTab('stats')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100"
              >
                Profil / O'quv Dashboardi (Statistika)
              </button>
            </div>
          </div>

          {/* Detailed recommendations sections based on wrong answers */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Imtihon Natijalari Bo'yicha Shaxsiy Tavsiyalar</h3>
                <p className="text-xs text-slate-400 font-semibold">Yo'l qo'yilgan xatolarni tuzatish va bilimni mustahkamlash darsligi</p>
              </div>
            </div>

            {score === questions.length ? (
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 p-8 rounded-[32px] text-center space-y-3">
                <div className="inline-flex w-12 h-12 bg-emerald-100 rounded-full items-center justify-center text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-lg font-black text-emerald-900">Sizda Mukammal Natija!</h4>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                  Tabriklaymiz! Siz bironta ham xatoga yo'l qo'ymadingiz. Siz ushbu modulning barcha bo'limlari bo'yicha mukammal bilimga egasiz. Keyingi darajaga ishonch bilan o'ting!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q, idx) => {
                  const wasWrong = answers[idx] !== q.correctAnswer;
                  if (!wasWrong) return null;

                  const hasPractice = QUICK_PRACTICES[q.category] !== undefined;
                  const practice = QUICK_PRACTICES[q.category];
                  const solved = solvedPractices[q.category];
                  const checked = practiceChecked[q.category];
                  const selPractice = practiceAnswers[q.category];

                  return (
                    <div key={q.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="absolute right-0 top-0 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                        Xato yechildi
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-rose-500 tracking-widest">{q.categoryLabel}</span>
                          <h4 className="font-extrabold text-slate-900 leading-snug">{q.question}</h4>
                        </div>

                        {/* Recommendation details */}
                        <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-50/80 text-xs text-indigo-900 space-y-2">
                          <p className="font-black flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-indigo-600" />
                            O'qituvchi maslahati:
                          </p>
                          <p className="leading-relaxed text-slate-600 font-medium">
                            {q.explanation} Sizga darslar bo'limidan ushbu mavzuni yanada chuqurroq o'rganishni yoki tegishli videodarslarni va qoidalarni qayta ko'rib chiqishni tavsiya qilamiz.
                          </p>
                        </div>
                      </div>

                      {/* Recommend Quick micro-practice */}
                      {hasPractice && !solved && (
                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-3">
                          <p className="text-xs font-black text-slate-800 flex items-center gap-1">
                            <Sparkles size={14} className="text-amber-500" /> Bilimingizni "Remont" Qiling (+15 XP)
                          </p>
                          <p className="text-xs font-semibold text-slate-600">{practice.question}</p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {practice.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                disabled={checked}
                                onClick={() => handleSolvePractice(q.category, oIdx)}
                                className={cn(
                                  "p-2 text-xs rounded-xl border text-left transition-all",
                                  selPractice === oIdx ? "border-amber-500 bg-amber-50 font-bold" : "border-slate-100 bg-white hover:border-slate-200"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {!checked ? (
                            <button
                              onClick={() => handleCheckPractice(q.category)}
                              disabled={selPractice === undefined || selPractice === null}
                              className="w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-extrabold hover:bg-amber-600 transition-colors disabled:opacity-50"
                            >
                              Tekshirish
                            </button>
                          ) : (
                            <div className="text-center pt-1 text-[11px]">
                              {selPractice === practice.answer ? (
                                <span className="text-emerald-600 font-black flex items-center justify-center gap-1">
                                  <Check size={12} className="stroke-[3]" /> To'g'ri! +15 XP qo'shildi!
                                </span>
                              ) : (
                                <span className="text-rose-600 font-bold">
                                  Noto'g'ri. To'g'ri javob: {practice.options[practice.answer]}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {solved && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs text-emerald-800 font-extrabold flex items-center justify-center gap-1.5">
                          <CheckCircle size={16} className="text-emerald-500" /> Mavzu bo'yicha bilim muvaffaqiyatli tiklandi! (+15 XP)
                        </div>
                      )}

                      {/* Guide links */}
                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
                        <button 
                          onClick={() => onNavigateToTab('rules')}
                          className="hover:text-indigo-600 flex items-center gap-1 transition-all"
                        >
                          <BookMarked size={14} /> Qoidalarga o'tish
                        </button>
                        <button 
                          onClick={() => onNavigateToTab('courses')}
                          className="hover:text-indigo-600 flex items-center gap-1 transition-all"
                        >
                          <BookOpen size={14} /> Darslarga o'tish
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
