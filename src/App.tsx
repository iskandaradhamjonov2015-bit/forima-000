/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserProfile, UserLevel } from './types.ts';
import { getUser, saveUser } from './lib/utils.ts';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import Dashboard from './components/Dashboard.tsx';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleRegister = (name: string, age: number, level: UserLevel, birthYear: number, birthMonth: string, school: string) => {
    const newUser: UserProfile = {
      name,
      age,
      birthYear,
      birthMonth,
      school,
      level,
      xp: 0,
      completedLessons: [],
      testScores: {},
      createdAt: Date.now(),
    };
    setUser(newUser);
    saveUser(newUser);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen onRegister={handleRegister} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-screen w-full overflow-hidden"
          >
            <Dashboard user={user} onUpdateUser={handleUpdateUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
