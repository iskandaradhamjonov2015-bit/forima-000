/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserLevel {
  JUNIOR = 'junior',
  SENIOR = 'senior',
  MASTER = 'master',
}

export interface UserProfile {
  name: string;
  age?: number;
  birthYear?: number;
  birthMonth?: string;
  school?: string;
  level: UserLevel;
  xp: number;
  completedLessons: string[];
  testScores: Record<string, number>; // levelId -> score
  createdAt: number;
  completedExams?: Record<string, { score: number; total: number; date: number; recommendations: string[] }>;
  badges?: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorLevel: UserLevel;
  authorRole: 'student' | 'teacher';
  category: string;
  createdAt: number;
  likes: number;
  likedByUser?: boolean;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorName: string;
  authorRole: 'student' | 'teacher';
  createdAt: number;
  likes: number;
  likedByUser?: boolean;
}

export interface Rule {
  id: string;
  title: string;
  content: string;
  level: UserLevel;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Embed URL
  level: UserLevel;
  quiz: QuizQuestion[];
  isProblemSolving?: boolean;
}

export interface RankingEntry {
  name: string;
  xp: number;
  level: UserLevel;
}

export interface Statistics {
  totalLessons: number;
  averageScore: number;
  levelProgress: Record<UserLevel, number>;
}
