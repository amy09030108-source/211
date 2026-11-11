import React from 'react';
import { ArrowRight, Cpu, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onOpenLab: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onOpenLab }) => {
  return (
    <section className="relative overflow-hidden bg-white/70 dark:bg-slate-950 bg-tech-grid border-b border-rose-100 dark:border-slate-800 pt-10 pb-16 lg:pt-16 lg:pb-20 transition-colors">
      {/* Background Soft Pink Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[340px] bg-pink-500/15 dark:bg-rose-500/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Metadata Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 tracking-wide uppercase">
              <span>2026 차세대 실전 인공지능 정규 과정</span>
              <span aria-hidden="true">·</span>
              <span className="text-pink-600 dark:text-pink-400 font-bold">초심자부터 실무자까지</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.16] text-balance mb-6">
              개념 이해부터 실전 AI 구축까지,<br className="hidden sm:inline" />
              살아 숨쉬는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 dark:from-pink-400 dark:via-rose-300 dark:to-fuchsia-300">인공지능 수업</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
              수식 암기 위주의 지루한 강의가 아닙니다. 인공신경망의 가중치를 직접 조절하는 
              인터랙티브 2D 시뮬레이터, 프롬프트 엔지니어링 랩, 그리고 24시간 실시간 질문에 
              답해주는 전담 AI 튜터와 함께 실전 AI 역량을 완성하세요.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={onStartLearning}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-xl transition-all shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/35 flex items-center gap-2 whitespace-nowrap"
              >
                <span>커리큘럼 살펴보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenLab}
                className="px-6 py-3 text-sm font-semibold text-slate-800 dark:text-pink-200 bg-pink-50/80 hover:bg-pink-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-pink-200 dark:border-pink-900/60 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Cpu className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>대화형 실습실 바로가기</span>
              </button>
            </div>

            {/* Quick Proof Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                <span>기초 수학부터 생성형 AI(LLM)까지 체계적 4주 로드맵</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                <span>Google Gemini 3.8 연동 1:1 실시간 맞춤 튜터링</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                <span>별도 파이썬 설치 없이 웹 브라우저에서 즉시 실습</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                <span>모든 과제 통과 시 공인 디지털 수료증 즉시 발급</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-pink-200/80 dark:border-slate-800 shadow-xl bg-slate-900 glow-accent">
              <img
                src="/src/assets/images/hero_ai_classroom_1794369381561.jpg"
                alt="인공지능 수업 강의실과 실시간 신경망 실습 모습"
                referrerPolicy="no-referrer"
                className="w-full h-auto aspect-16/10 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-pink-300 mb-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400 inline-block shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                  <span>AI Campus Interactive Classroom</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-100">
                  신경망 노드와 데이터 흐름을 시각화하며 배우는 차세대 수업 환경
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Metrics Strip */}
        <div className="mt-14 pt-8 border-t border-rose-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
              4주 집중 과정
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">16개 핵심 차시 & 실무 프로젝트</div>
          </div>
          <div className="p-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-pink-600 dark:text-pink-400 tabular-nums">
              100% 브라우저 실습
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">신경망 & 프롬프트 시뮬레이터</div>
          </div>
          <div className="p-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
              24/7 AI 전담 튜터
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gemini 기반 실시간 코드 & 개념 질의응답</div>
          </div>
          <div className="p-3">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-rose-500 dark:text-rose-400 tabular-nums">
              실무 수료증
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">과제 및 퀴즈 통과 시 포트폴리오 인증</div>
          </div>
        </div>
      </div>
    </section>
  );
};
