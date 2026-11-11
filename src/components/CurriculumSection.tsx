import React, { useState } from 'react';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { Lesson } from '../types';
import { CheckCircle2, Circle, Clock, X, Copy, Check, ExternalLink } from 'lucide-react';

interface CurriculumSectionProps {
  completedLessons: Record<string, boolean>;
  onToggleLesson: (lessonId: string) => void;
  onOpenLab: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  completedLessons,
  onToggleLesson,
  onOpenLab,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeModule = CURRICULUM_MODULES.find((m) => m.id === activeModuleId) || CURRICULUM_MODULES[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="curriculum" className="py-16 bg-rose-50/30 dark:bg-slate-950 border-b border-rose-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>정규 커리큘럼</span>
            <span aria-hidden="true">·</span>
            <span>4주 완성 마스터 트랙</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            기초 수학부터 생성형 AI 배포까지 단계별 학습
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            체계적으로 설계된 16개 차시 강의와 실전 캡스톤 프로젝트를 통해 현업에서 바로 쓰이는 AI 역량을 기릅니다.
          </p>
        </div>

        {/* 4-Module Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {CURRICULUM_MODULES.map((module) => {
            const moduleCompletedCount = module.lessons.filter((l) => completedLessons[l.id]).length;
            const isSelected = activeModuleId === module.id;

            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-pink-500 shadow-sm ring-1 ring-pink-500'
                    : 'bg-white/80 dark:bg-slate-900/60 border-rose-100 dark:border-slate-800 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-mono font-bold ${isSelected ? 'text-pink-600 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {module.week}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {moduleCompletedCount}/{module.lessons.length} 완료
                  </span>
                </div>
                <div className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {module.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0 transition-colors">
          {/* Module Banner Visual & Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden border border-pink-900/40 mb-6 bg-slate-950 aspect-4/3 shadow-md">
                <img
                  src={activeModule.image}
                  alt={activeModule.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs font-mono text-pink-400 mb-1">
                {activeModule.week} Core Overview
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                {activeModule.title}
              </h3>
              <p className="text-xs text-pink-200 font-medium mb-3">
                {activeModule.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeModule.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">주차별 실전 프로젝트:</span>
              <span className="font-semibold text-pink-300 text-right">{activeModule.projectTitle}</span>
            </div>
          </div>

          {/* Lessons List (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-display font-bold text-slate-900 dark:text-white">
                  세부 차시 강의 구성 (Click하여 강의 노트 열람)
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">총 4개 차시</span>
              </div>

              <div className="space-y-3">
                {activeModule.lessons.map((lesson) => {
                  const isDone = !!completedLessons[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                        isDone
                          ? 'bg-rose-50/40 dark:bg-slate-800/40 border-rose-100 dark:border-slate-800 hover:border-pink-300'
                          : 'bg-white dark:bg-slate-900 border-rose-100 dark:border-slate-800 hover:border-pink-400 hover:shadow-xs'
                      }`}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLesson(lesson.id);
                          }}
                          className="mt-0.5 text-slate-400 hover:text-pink-600 transition-colors focus:outline-none"
                          title={isDone ? '완료 취소' : '학습 완료 체크'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                              {lesson.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              lesson.type === 'project'
                                ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                                : lesson.type === 'practice'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}>
                              {lesson.type === 'project' ? '실전 프로젝트' : lesson.type === 'practice' ? '실습' : '개념 이론'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {lesson.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom prompt to open Lab */}
            <div className="mt-6 pt-4 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">배운 이론을 직접 조작해보고 싶다면?</span>
              <button
                onClick={onOpenLab}
                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 font-bold flex items-center gap-1"
              >
                <span>대화형 실습실에서 확인하기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-rose-100 dark:border-slate-800 shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase">
                  강의 상세 노트
                </span>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">📖 차시 학습 개요</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-rose-50/40 dark:bg-slate-800/40 p-3.5 rounded-xl border border-rose-100 dark:border-slate-800">
                  {selectedLesson.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">🎯 핵심 학습 포인트 (Takeaways)</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {selectedLesson.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-600 dark:bg-pink-400 mt-2 shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedLesson.codeSnippet && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">💻 실습 예제 코드</h4>
                    <button
                      onClick={() => handleCopyCode(selectedLesson.codeSnippet!)}
                      className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 font-semibold flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-pink-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? '복사 완료' : '코드 복사'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                    {selectedLesson.codeSnippet}
                  </pre>
                </div>
              )}

              <div className="pt-4 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    onToggleLesson(selectedLesson.id);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    completedLessons[selectedLesson.id]
                      ? 'bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons[selectedLesson.id] ? '학습 완료됨 (클릭하여 취소)' : '이 차시 학습 완료로 표시'}</span>
                </button>

                <button
                  onClick={() => setSelectedLesson(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
