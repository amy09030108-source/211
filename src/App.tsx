/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurriculumSection } from './components/CurriculumSection';
import { NeuralSimLab } from './components/NeuralSimLab';
import { PromptLab } from './components/PromptLab';
import { EthicsLab } from './components/EthicsLab';
import { AITutor } from './components/AITutor';
import { QuizSection } from './components/QuizSection';
import { GlossarySection } from './components/GlossarySection';
import { DashboardModal } from './components/DashboardModal';
import { Footer } from './components/Footer';
import { CURRICULUM_MODULES } from './data/curriculumData';
import { Cpu, Wand2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [activeLabTab, setActiveLabTab] = useState<'neural' | 'prompt' | 'ethics'>('neural');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ai_campus_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ai_campus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ai_campus_theme', 'light');
    }
  }, [isDark]);

  // Completed lessons stored in localStorage
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ai_campus_completed_lessons');
      return saved ? JSON.parse(saved) : { '1-1': true, '1-2': true };
    } catch {
      return { '1-1': true, '1-2': true };
    }
  });

  // Quiz score stored in localStorage
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>(() => {
    try {
      const saved = localStorage.getItem('ai_campus_quiz_score');
      return saved ? JSON.parse(saved) : { correct: 0, total: 5 };
    } catch {
      return { correct: 0, total: 5 };
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ai_campus_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('ai_campus_quiz_score', JSON.stringify(quizScore));
  }, [quizScore]);

  const handleToggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const handleScoreUpdate = (correct: number, total: number) => {
    setQuizScore({ correct, total });
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const totalLessons = CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/30 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-pink-500 selection:text-white transition-colors">
      {/* Top Bar Navigation */}
      <Header
        onOpenDashboard={() => setIsDashboardOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        completedLessonsCount={completedCount}
        totalLessonsCount={totalLessons}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartLearning={() => handleNavigate('curriculum')}
          onOpenLab={() => handleNavigate('simulation')}
        />

        {/* 4-Week Curriculum Section */}
        <CurriculumSection
          completedLessons={completedLessons}
          onToggleLesson={handleToggleLesson}
          onOpenLab={() => handleNavigate('simulation')}
        />

        {/* Interactive Simulation Sandbox Section */}
        <section id="simulation" className="py-16 bg-white dark:bg-slate-900 border-b border-rose-100 dark:border-slate-800 scroll-mt-16 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
                  <span>인터랙티브 학습 샌드박스</span>
                  <span aria-hidden="true">·</span>
                  <span>체험형 AI 실습</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  대화형 인공지능 실습실 (AI Interactive Lab)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  코드를 몰라도 직관적으로 이해하는 가중치 시뮬레이터, 프롬프트 엔지니어링 랩, AI 윤리 탐색기
                </p>
              </div>

              {/* Lab Sub-tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-rose-50 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 rounded-xl shrink-0">
                <button
                  onClick={() => setActiveLabTab('neural')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'neural'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>신경망 시뮬레이터</span>
                </button>
                <button
                  onClick={() => setActiveLabTab('prompt')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'prompt'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>프롬프트 랩</span>
                </button>
                <button
                  onClick={() => setActiveLabTab('ethics')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeLabTab === 'ethics'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>AI 윤리 탐색기</span>
                </button>
              </div>
            </div>

            {/* Active Lab Component */}
            <div>
              {activeLabTab === 'neural' && <NeuralSimLab />}
              {activeLabTab === 'prompt' && <PromptLab />}
              {activeLabTab === 'ethics' && <EthicsLab />}
            </div>
          </div>
        </section>

        {/* 24/7 Real-Time AI Tutor (Alpha Tutor) */}
        <section id="tutor" className="py-16 bg-rose-50/40 dark:bg-slate-950 border-b border-rose-100 dark:border-slate-800 scroll-mt-16 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
                <span>실시간 전담 교육 조교</span>
                <span aria-hidden="true">·</span>
                <span>Google Gemini 3.8 연동</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                24시간 1:1 맞춤형 알파 튜터 (AI Assistant)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                수업 중 막히는 수식, 파이썬/PyTorch 에러, 프롬프트 작성법, 퀴즈 힌트까지 실시간으로 막힘없이 질문하세요.
              </p>
            </div>

            <AITutor />
          </div>
        </section>

        {/* Quiz & Assessment Section */}
        <QuizSection onScoreUpdate={handleScoreUpdate} />

        {/* AI Glossary & Cheat Sheets */}
        <GlossarySection />
      </main>

      {/* Student Dashboard & Certificate Modal */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        completedLessons={completedLessons}
        quizScore={quizScore}
      />

      {/* Site Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
