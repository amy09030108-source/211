import React, { useState } from 'react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  context: string;
  dilemma: string;
  options: {
    id: string;
    action: string;
    impact: string;
    tradeoff: string;
    ethicalVerdict: string;
  }[];
}

export const EthicsLab: React.FC = () => {
  const SCENARIOS: Scenario[] = [
    {
      id: 'hiring',
      title: 'AI 채용 서류 심사 모델의 성별 편향 사태',
      category: '데이터 편향 & 공정성',
      context: '글로벌 테크 기업 A사는 지난 10년간 합격한 개발자 이력서 수만 건을 AI에 학습시켜 신입 지원자 서류를 자동 필터링했습니다. 그러나 과거 합격자의 85%가 남성이었기 때문에, AI는 이력서에 "여성 동아리", "여대" 등의 단어가 들어간 지원자에게 체계적으로 감점을 부여하는 편향을 보였습니다.',
      dilemma: '당신이 이 회사의 수석 AI 윤리 책임자라면 어떻게 조치하시겠습니까?',
      options: [
        {
          id: 'opt1',
          action: '성별 및 학교 등 민감 속성 단어를 훈련 데이터에서 단순 삭제(마스킹)한다.',
          impact: '표면적 식별자는 제거되지만, 다른 간접 변수(단어 선택, 특정 어휘 패턴 등 프록시 변수)를 통해 모델이 여전히 편향을 유지할 위험이 높습니다.',
          tradeoff: '구현은 빠르나 근본적 해결이 불가능함.',
          ethicalVerdict: '불완전한 접근 (Proxy Bias 잔존)',
        },
        {
          id: 'opt2',
          action: '데이터셋 재수집 및 공정성 가중치(Reweighting) 적용과 사후 공정성 감사를 의무화한다.',
          impact: '과거 데이터의 불균형을 통계적으로 보정하고, 성별 간 동일한 합격률(Demographic Parity) 또는 동등한 기회(Equal Opportunity) 지표를 모델 손실함수에 결합합니다.',
          tradeoff: '모델 재학습 및 지속적인 모니터링 비용 발생.',
          ethicalVerdict: '가장 권장되는 모범 실무 해결책',
        },
        {
          id: 'opt3',
          action: 'AI 서류 전형을 전면 폐기하고 100% 인간 면접관 검토로 회귀한다.',
          impact: '알고리즘적 편향은 중단되지만, 인간 심사관 개인의 무의식적 편향과 천문학적인 검토 시간 및 비용이 발생합니다.',
          tradeoff: '채용 효율성 급감 및 인간 주관 개입.',
          ethicalVerdict: '기술 회피적 선택 (차선의 응급조치)',
        },
      ],
    },
    {
      id: 'rag_privacy',
      title: '기업 사내 생성형 AI 도입과 민감 개인정보(PII) 유출',
      category: '보안 & 개인정보 보호',
      context: 'B 금융기관은 직원들의 생산성 향상을 위해 사내 규정과 고객 상담 로그를 LLM(거대언어모델)에 연동했습니다. 직원이 "VIP 고객 환불 규정"을 질의하자, 모델이 실제 특정 고객의 이름과 계좌번호 일부를 답변에 그대로 노출하는 사고가 발생했습니다.',
      dilemma: '데이터 유출을 원천 방지하면서도 AI 도우미의 효용을 유지하는 방법은?',
      options: [
        {
          id: 'opt1',
          action: '수신/발신 단계에 정규식 및 NER 기반 PII(개인식별정보) 자동 마스킹 파이프라인 구축',
          impact: '이름, 주민번호, 계좌번호 등 민감 정보가 [고객명], [계좌번호_암호화]로 자동 치환되어 모델에 전달되므로 유출 위험이 99% 차단됩니다.',
          tradeoff: '마스킹 처리로 인한 약간의 레이턴시(50ms) 증가.',
          ethicalVerdict: '국제 표준(GDPR/개인정보보호법) 부합 모범 사례',
        },
        {
          id: 'opt2',
          action: '직원들에게 "민감 정보를 질문하지 말라"는 보안 서약서만 받고 운영 지속',
          impact: '사용자의 실수나 고의로 인해 언제든지 2차, 3차 정보 유출이 발생할 수 있습니다.',
          tradeoff: '보안 관리 책임 전가 및 법적 리스크 극대화.',
          ethicalVerdict: '절대 지양해야 할 위험한 운영 방식',
        },
      ],
    },
  ];

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const scenario = SCENARIOS[selectedScenarioIndex];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
      <div className="p-6 border-b border-rose-100 dark:border-slate-800 bg-rose-50/50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>실습 모듈 03</span>
            <span aria-hidden="true">·</span>
            <span>책임 있는 인공지능 (Responsible AI)</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
            AI 윤리 & 편향성 탐색 시뮬레이터
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            실제 산업계에서 발생한 인공지능의 편향, 보안, 프라이버시 딜레마를 체험하고 최선의 의사결정을 내려보세요.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-rose-100/70 dark:bg-slate-800 rounded-xl">
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setSelectedOption(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedScenarioIndex === idx
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              사례 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scenario Card */}
        <div className="border border-rose-100 dark:border-slate-800 rounded-xl p-5 bg-rose-50/30 dark:bg-slate-800/40">
          <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1">
            {scenario.category}
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">
            {scenario.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {scenario.context}
          </p>
          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-3 rounded-lg border border-rose-100 dark:border-slate-800">
            ❓ {scenario.dilemma}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">선택 가능한 조치 방안</div>
          {scenario.options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedOption === opt.id
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 shadow-sm ring-1 ring-pink-500'
                  : 'border-rose-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-pink-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {opt.action}
                </div>
                <div className="shrink-0 mt-0.5">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === opt.id ? 'border-pink-600 bg-pink-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedOption === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </span>
                </div>
              </div>

              {selectedOption === opt.id && (
                <div className="mt-4 pt-3 border-t border-pink-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">예상 영향: </span>
                    <span className="text-slate-600 dark:text-slate-300">{opt.impact}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">트레이드오프: </span>
                    <span className="text-slate-600 dark:text-slate-300">{opt.tradeoff}</span>
                  </div>
                  <div className="md:col-span-2 mt-1">
                    <span className="font-bold text-pink-600 dark:text-pink-400">윤리 위원회 평가: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{opt.ethicalVerdict}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
