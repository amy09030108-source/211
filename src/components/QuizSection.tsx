import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/curriculumData';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

interface QuizSectionProps {
  onScoreUpdate: (score: number, total: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const total = QUIZ_QUESTIONS.length;

  const handleSelect = (optionIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return;
    const nextAnswers = { ...selectedAnswers, [currentIdx]: optionIdx };
    setSelectedAnswers(nextAnswers);

    let correctCount = 0;
    Object.keys(nextAnswers).forEach((qKey) => {
      const qIndex = parseInt(qKey);
      if (nextAnswers[qIndex] === QUIZ_QUESTIONS[qIndex].correctIndex) {
        correctCount++;
      }
    });
    onScoreUpdate(correctCount, total);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
    onScoreUpdate(0, total);
  };

  let correctTotal = 0;
  Object.keys(selectedAnswers).forEach((k) => {
    const idx = parseInt(k);
    if (selectedAnswers[idx] === QUIZ_QUESTIONS[idx].correctIndex) {
      correctTotal++;
    }
  });

  const percentage = Math.round((correctTotal / total) * 100);

  return (
    <section id="quiz" className="py-16 bg-white dark:bg-slate-900 border-b border-rose-100 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>실력 점검 & 성취도 평가</span>
            <span aria-hidden="true">·</span>
            <span>즉시 피드백 퀴즈</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            실전 AI 개념 검증 퀴즈
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            수업에서 배운 핵심 원리 5문항을 풀고, 상세한 해설과 함께 자신의 이해도를 측정해 보세요.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-rose-50/30 dark:bg-slate-800/50 border border-rose-100 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 border-b border-rose-100 dark:border-slate-700 pb-3">
              <span className="font-semibold text-pink-600 dark:text-pink-400 uppercase">
                {currentQ.category}
              </span>
              <span className="font-mono">
                문항 {currentIdx + 1} / {total}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white mb-6 leading-snug">
              Q{currentIdx + 1}. {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, optIdx) => {
                const isChosen = selectedAnswers[currentIdx] === optIdx;
                const isAnswered = selectedAnswers[currentIdx] !== undefined;
                const isCorrect = optIdx === currentQ.correctIndex;

                let btnStyle = 'bg-white dark:bg-slate-900 border-rose-100 dark:border-slate-700 hover:border-pink-300 text-slate-800 dark:text-slate-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-medium';
                  } else if (isChosen && !isCorrect) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-300';
                  } else {
                    btnStyle = 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-xs mt-0.5 opacity-60">
                        {optIdx + 1}.
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {selectedAnswers[currentIdx] !== undefined && (
              <div className="bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 rounded-xl p-4 mb-6 text-xs text-slate-800 dark:text-slate-200">
                <div className="font-bold text-pink-900 dark:text-pink-300 mb-1 flex items-center gap-1.5">
                  <span>💡 정답 및 교수자 해설:</span>
                </div>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-rose-100 dark:border-slate-700">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                이전 문항
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIdx] === undefined}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 shadow-sm shadow-pink-500/20"
              >
                <span>{currentIdx === total - 1 ? '최종 결과 확인' : '다음 문항'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="bg-rose-50/30 dark:bg-slate-800/50 border border-rose-100 dark:border-slate-700 rounded-2xl p-8 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-pink-500/30">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">
              퀴즈 평가 결과 보고서
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              총 {total}문항 중 <strong className="text-pink-600 dark:text-pink-400 font-mono">{correctTotal}문항</strong>을 맞히셨습니다.
            </p>

            <div className="max-w-xs mx-auto bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-100 dark:border-slate-700 mb-6">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">최종 성취도</div>
              <div className="text-4xl font-display font-extrabold text-pink-600 dark:text-pink-400 font-mono tabular-nums">
                {percentage}%
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {percentage >= 80 ? '🎉 수료 기준 충족 (Pass)' : '💪 추가 복습 권장'}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-pink-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>퀴즈 다시 풀기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
