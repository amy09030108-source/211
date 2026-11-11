import React from 'react';
import { UserCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenDashboard: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDashboard,
  activeSection,
  onNavigate,
  completedLessonsCount,
  totalLessonsCount,
  isDark,
  onToggleTheme,
}) => {
  const percent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm shadow-pink-500/20 group-hover:scale-105 transition-transform">
              AI
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                인공지능 아카데미
              </span>
            </div>
          </button>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('curriculum')}
              className={`hover:text-pink-600 dark:hover:text-pink-400 transition-colors whitespace-nowrap pb-1 ${
                activeSection === 'curriculum'
                  ? 'text-pink-600 dark:text-pink-400 font-semibold border-b-2 border-pink-600 dark:border-pink-400'
                  : ''
              }`}
            >
              강의 커리큘럼
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className={`hover:text-pink-600 dark:hover:text-pink-400 transition-colors whitespace-nowrap pb-1 ${
                activeSection === 'simulation'
                  ? 'text-pink-600 dark:text-pink-400 font-semibold border-b-2 border-pink-600 dark:border-pink-400'
                  : ''
              }`}
            >
              대화형 실습실
            </button>
            <button
              onClick={() => onNavigate('tutor')}
              className={`hover:text-pink-600 dark:hover:text-pink-400 transition-colors whitespace-nowrap pb-1 ${
                activeSection === 'tutor'
                  ? 'text-pink-600 dark:text-pink-400 font-semibold border-b-2 border-pink-600 dark:border-pink-400'
                  : ''
              }`}
            >
              실시간 AI 튜터
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className={`hover:text-pink-600 dark:hover:text-pink-400 transition-colors whitespace-nowrap pb-1 ${
                activeSection === 'quiz'
                  ? 'text-pink-600 dark:text-pink-400 font-semibold border-b-2 border-pink-600 dark:border-pink-400'
                  : ''
              }`}
            >
              실전 퀴즈 & 평가
            </button>
            <button
              onClick={() => onNavigate('glossary')}
              className={`hover:text-pink-600 dark:hover:text-pink-400 transition-colors whitespace-nowrap pb-1 ${
                activeSection === 'glossary'
                  ? 'text-pink-600 dark:text-pink-400 font-semibold border-b-2 border-pink-600 dark:border-pink-400'
                  : ''
              }`}
            >
              학습 자료실
            </button>
          </nav>

          {/* Zone 3: Primary Action & Theme Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 bg-rose-50/80 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 transition-colors focus:outline-none"
              title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Dashboard CTA */}
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 border border-pink-200 dark:border-pink-800 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>내 학습 현황</span>
              <span className="text-pink-600 dark:text-pink-400 font-mono font-bold tabular-nums">
                {percent}%
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
