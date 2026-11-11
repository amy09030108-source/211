import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';

interface PromptTemplate {
  name: string;
  category: string;
  prompt: string;
  technique: string;
}

export const PromptLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playground' | 'comparison'>('playground');
  const [inputPrompt, setInputPrompt] = useState<string>(
    '인공지능 모델 학습 과정에서 발생하는 과적합(Overfitting)을 방지할 수 있는 대표적인 3가지 방법과 각각의 작동 원리를 컴퓨터공학 학부생 수준에 맞게 설명해줘.'
  );
  const [taskGoal, setTaskGoal] = useState<string>('논리적이고 명확한 학부생 수준의 개념 설명');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const TEMPLATES: PromptTemplate[] = [
    {
      name: '코드 리팩토링 & 보안 리뷰어',
      category: '코딩 실무',
      technique: 'Role-Prompting + 제약조건',
      prompt: `[역할]: 10년 차 시니어 파이썬 및 머신러닝 보안 아키텍트
[임무]: 아래 코드를 검토하고 메모리 누수 방지 및 예외 처리를 강화한 개선 코드를 제시하라.
[제약조건]:
1. 보안상 취약점(SQL 인젝션, 키 노출 위험)을 먼저 지적할 것
2. 개선된 코드는 주석과 함께 완전한 함수 형태로 작성할 것
3. 개선 전후 시간/공간 복잡도 비교표를 첨부할 것`,
    },
    {
      name: '단계별 복합 추론 (CoT)',
      category: '논리 추론',
      technique: 'Chain of Thought (CoT)',
      prompt: `질문: 철수가 10개의 사과를 가지고 있습니다. 매일 2개씩 먹고, 3일마다 친구로부터 1개를 선물받습니다.
지침:
1. "차근차근 단계별로 생각해 봅시다."
2. 1일 차부터 5일 차까지 날짜별 사과 재고 변화를 표(테이블)로 작성하세요.
3. 5일 차 밤에 남은 사과 개수를 굵은 글씨로 최종 결론에 적으세요.`,
    },
    {
      name: 'Few-Shot 감성 및 의도 분류기',
      category: '데이터 분류',
      technique: 'Few-Shot Learning',
      prompt: `다음 고객 리뷰의 감정(긍정/부정/중립)과 주된 불만 카테고리를 분류하세요.

예시 1:
리뷰: "배송이 하루 만에 와서 너무 기쁩니다! 포장도 깔끔했어요."
분류: { "sentiment": "긍정", "category": "배송" }

예시 2:
리뷰: "설명서대로 조립했는데 나사가 헛돌고 부품이 파손되어 있습니다."
분류: { "sentiment": "부정", "category": "품질/하자" }

입력 리뷰: "인터페이스는 깔끔한데 가끔 서버 응답이 10초 이상 걸리네요."
분류:`,
    },
  ];

  const handleAnalyzePrompt = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: inputPrompt, taskGoal }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
      {/* Tab Switcher Header */}
      <div className="p-6 border-b border-rose-100 dark:border-slate-800 bg-rose-50/50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>실습 모듈 02</span>
            <span aria-hidden="true">·</span>
            <span>생성형 AI 잠재력 극대화</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
            프롬프트 엔지니어링 랩 & AI 진단기
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            작성한 프롬프트의 품질을 실시간 AI 채점하고, Zero-Shot vs Few-Shot vs CoT의 차이를 탐구합니다.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-rose-100/70 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'playground'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            프롬프트 작성 & AI 진단
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            기법별 비교 분석
          </button>
        </div>
      </div>

      {activeTab === 'playground' ? (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Prompt Input & Templates */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                프롬프트 작성창
              </label>
              <span className="text-[11px] text-pink-600 dark:text-pink-400 font-mono">
                {inputPrompt.length} 글자
              </span>
            </div>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              rows={6}
              className="w-full text-xs sm:text-sm font-mono p-3.5 bg-rose-50/40 dark:bg-slate-800/60 border border-rose-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 leading-relaxed text-slate-900 dark:text-white"
              placeholder="LLM에 전달할 프롬프트를 입력하세요..."
            />

            {/* Template Presets */}
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                실무 추천 프롬프트 템플릿 불러오기
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputPrompt(tmpl.prompt)}
                    className="p-2.5 text-left border border-rose-100 dark:border-slate-800 rounded-lg hover:border-pink-400 hover:bg-pink-50/40 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 line-clamp-1">
                      {tmpl.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {tmpl.technique}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyzePrompt}
              disabled={isAnalyzing || !inputPrompt.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 text-pink-200" />
              <span>{isAnalyzing ? 'AI가 프롬프트 분석 중...' : '프롬프트 품질 채점 & 전문가 최적화'}</span>
            </button>
          </div>

          {/* Right Column: AI Analysis Result */}
          <div className="lg:col-span-5 bg-rose-50/40 dark:bg-slate-800/40 rounded-xl p-5 border border-rose-100 dark:border-slate-800 flex flex-col justify-between">
            {analysisResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-rose-200 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">종합 품질 점수</span>
                    <div className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                      <span className="text-pink-600 dark:text-pink-400 font-mono tabular-nums">{analysisResult.score}</span>
                      <span className="text-xs text-slate-400 font-normal">/ 100점</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    analysisResult.score >= 80 ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {analysisResult.score >= 85 ? '우수 프롬프트' : '개선 권장'}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">명확성: </span>
                    <span className="text-slate-600 dark:text-slate-300">{analysisResult.clarity}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">구체성: </span>
                    <span className="text-slate-600 dark:text-slate-300">{analysisResult.specificity}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">👍 잘된 점</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {analysisResult.strengths?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">⚡ 개선 권장 사항</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {analysisResult.improvements?.map((imp: string, i: number) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>

                {analysisResult.optimizedPrompt && (
                  <div className="mt-2 pt-3 border-t border-rose-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-400">✨ AI 전문가 권장 최적화본</span>
                      <button
                        onClick={() => handleCopy(analysisResult.optimizedPrompt)}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-pink-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? '복사됨' : '복사하기'}</span>
                      </button>
                    </div>
                    <pre className="text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border border-pink-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      {analysisResult.optimizedPrompt}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Wand2 className="w-8 h-8 text-pink-300 dark:text-pink-600 mb-2 stroke-[1.5]" />
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  프롬프트 AI 평가 준비
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  왼쪽 창에 프롬프트를 입력하고 '품질 채점 & 최적화' 버튼을 누르면 점수와 개선안이 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Comparison Tab */
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-rose-100 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1">Level 1</div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">Zero-Shot (단순 질의)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              사전 예시나 제약 없이 질문만 직접 모델에 던지는 기초 형태입니다.
            </p>
            <div className="bg-rose-50/50 dark:bg-slate-800/80 p-3 rounded-lg border border-rose-100 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 mb-3">
              "양자 컴퓨터의 원리를 설명해줘."
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong>특징:</strong> 빠르지만 모델이 대상 청중, 분량, 출력 형식을 자의적으로 해석하여 만족도가 불규칙합니다.
            </div>
          </div>

          <div className="border border-rose-100 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1">Level 2</div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">Few-Shot (예시 학습)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              원하는 입력과 출력의 쌍(Pair)을 1~3개 예시로 제공하여 규칙을 암묵적으로 습득시킵니다.
            </p>
            <div className="bg-rose-50/50 dark:bg-slate-800/80 p-3 rounded-lg border border-rose-100 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 mb-3">
              입력: 사과 ➔ 영단어: Apple<br />
              입력: 포도 ➔ 영단어: Grape<br />
              입력: 복숭아 ➔ 영단어:
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong>특징:</strong> 특정 JSON 규격, 문체 복제, 뉘앙스 정렬 시 가장 신뢰도가 높습니다.
            </div>
          </div>

          <div className="border border-rose-100 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1">Level 3</div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">Chain-of-Thought (CoT)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              "단계별로 차근차근 생각해 봅시다"라는 사고 사슬을 유도하여 복합 계산과 논리를 해결합니다.
            </p>
            <div className="bg-rose-50/50 dark:bg-slate-800/80 p-3 rounded-lg border border-rose-100 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 mb-3">
              "문제를 단계별 Step으로 쪼개어 각 단계의 계산 근거를 적은 후 최종 정답을 도출하세요."
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong>특징:</strong> 수학, 코딩, 물리, 법률 등 다단계 논리 문제에서 정답률이 비약적으로 상승합니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
