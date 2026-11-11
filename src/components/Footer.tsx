import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-pink-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-pink-500/30">
                AI
              </div>
              <span className="font-display font-bold text-white text-base">
                인공지능 아카데미
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              수식과 원리부터 실전 프롬프트와 풀스택 AI 서비스까지 연결하는 대한민국 대표 인터랙티브 AI 교육 플랫폼입니다.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <div className="font-semibold text-slate-200 text-xs mb-3">교육 과정 바로가기</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('curriculum')}
                  className="hover:text-pink-400 transition-colors"
                >
                  4주 정규 커리큘럼
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulation')}
                  className="hover:text-pink-400 transition-colors"
                >
                  대화형 실습실 (신경망 & 프롬프트)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tutor')}
                  className="hover:text-pink-400 transition-colors"
                >
                  24/7 알파 튜터 (Gemini 연동)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-pink-400 transition-colors"
                >
                  실력 점검 퀴즈 & 평가
                </button>
              </li>
            </ul>
          </div>

          {/* Course Features */}
          <div>
            <div className="font-semibold text-slate-200 text-xs mb-3">학습 지원 센터</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('glossary')}
                  className="hover:text-pink-400 transition-colors"
                >
                  AI 필수 용어 사전 & 코드 치트시트
                </button>
              </li>
              <li className="text-slate-400">교수진 1:1 과제 코드 리뷰</li>
              <li className="text-slate-400">오픈소스 깃허브 실습 리포지토리</li>
              <li className="text-slate-400">공식 디지털 수료증 발급</li>
            </ul>
          </div>

          {/* Instructor & Ethics */}
          <div>
            <div className="font-semibold text-slate-200 text-xs mb-3">책임 있는 AI 교육</div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              본 과정은 유네스코 AI 윤리 권고안 및 공정성 원칙을 준수하며, 안전하고 신뢰할 수 있는 인공지능 개발을 지향합니다.
            </p>
            <div className="flex items-center gap-2 text-pink-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Responsible AI Certified</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 인공지능 아카데미 (AI Campus). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-pink-400 cursor-pointer">개인정보 처리방침</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-pink-400 cursor-pointer">수강 규정</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-pink-400 cursor-pointer">강의 문의 (contact@aicampus.edu)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
