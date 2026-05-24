/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Lesson, UserProfile, UserLevel } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Trophy,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import confetti from 'canvas-confetti';
import Certificate from './Certificate.tsx';

interface LessonViewProps {
  lesson: Lesson;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onBack: () => void;
}

export default function LessonView({ lesson, user, onUpdateUser, onBack }: LessonViewProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const currentQuestion = lesson.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === lesson.quiz.length - 1;

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    const passScore = Math.ceil(lesson.quiz.length * 0.7);
    if (score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0) >= passScore) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      const isFirstTime = !user.completedLessons.includes(lesson.id);
      const updatedUser = { ...user };
      
      if (isFirstTime) {
        updatedUser.completedLessons = [...user.completedLessons, lesson.id];
        updatedUser.xp += 100;
        
        // Check if level finished
        const totalLevelLessons = 2; // In this mock, each level has 2 lessons
        const completedLevelLessons = updatedUser.completedLessons.filter(id => id.startsWith(user.level.substring(0, 2))).length;
        if (completedLevelLessons === totalLevelLessons) {
           // Flag for certificate
        }
      }
      onUpdateUser(updatedUser);
    }
  };

  const handleFinishLesson = () => {
     const totalLevelLessons = 2; 
     const completedLevelLessons = user.completedLessons.filter(id => id.startsWith(user.level.substring(0, 2))).length;
     if (completedLevelLessons === totalLevelLessons) {
       setShowCertificate(true);
     } else {
       onBack();
     }
  };

  if (showCertificate) {
    return <Certificate user={user} onBack={onBack} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black tracking-widest text-[10px] uppercase transition-colors"
      >
        <ArrowLeft size={16} /> Dashboardga qaytish
      </button>

      {!showQuiz ? (
        <div className="space-y-8">
          <div className="bg-slate-900 p-2 rounded-[32px] shadow-2xl overflow-hidden aspect-video relative group border-4 border-white">
            <iframe 
              src={lesson.videoUrl} 
              className="w-full h-full rounded-[24px]"
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{lesson.title}</h2>
              <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {lesson.level}
              </span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">{lesson.description}</p>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <HelpCircle size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">{lesson.quiz.length} ta test savoli</span>
              </div>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                Testni boshlash
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          {!quizFinished ? (
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Savol {currentQuestionIndex + 1} / {lesson.quiz.length}</div>
                  <h3 className="text-xl font-bold text-slate-900">{currentQuestion.question}</h3>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400">
                    {Math.round(((currentQuestionIndex + 1) / lesson.quiz.length) * 100)}%
                </div>
              </div>

              <div className="grid gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                      selectedAnswer === idx ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-slate-200 bg-slate-50",
                      isAnswered && idx === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-50",
                      isAnswered && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && "border-rose-500 bg-rose-50"
                    )}
                  >
                    <span className="relative z-10 font-medium">{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswer && (
                      <CheckCircle2 size={20} className="text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                    {isAnswered && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && (
                      <XCircle size={20} className="text-rose-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-2xl flex items-start gap-4",
                    selectedAnswer === currentQuestion.correctAnswer ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                  )}
                >
                  <AlertCircle className="shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-bold mb-1">
                      {selectedAnswer === currentQuestion.correctAnswer ? "To'g'ri!" : "Xato!"}
                    </div>
                    <p className="text-sm opacity-80">{currentQuestion.explanation}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                {!isAnswered ? (
                  <button
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                  >
                    Tekshirish
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    Keyingisi <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-8">
              <div className={cn(
                "w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4",
                score >= Math.ceil(lesson.quiz.length * 0.7) ? "bg-emerald-100 border-emerald-500 text-emerald-600" : "bg-rose-100 border-rose-500 text-rose-600"
              )}>
                <Trophy size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">
                  {score >= Math.ceil(lesson.quiz.length * 0.7) ? "Tabriklaymiz!" : "Darsni qayta o'qing"}
                </h2>
                <p className="text-slate-500 text-lg">
                  Siz {lesson.quiz.length} tadan {score} ta to'g'ri javob berdingiz.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                {score >= Math.ceil(lesson.quiz.length * 0.7) ? (
                  <button
                    onClick={handleFinishLesson}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Darsni tugatish
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setQuizFinished(false);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswer(null);
                        setIsAnswered(false);
                        setScore(0);
                      }}
                      className="w-full sm:w-auto bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Testni qayta topshirish
                    </button>
                    <button
                      onClick={onBack}
                      className="w-full sm:w-auto text-slate-500 font-bold hover:text-indigo-600"
                    >
                      Ortga qaytish
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
