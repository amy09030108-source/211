import React, { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';

interface Point {
  x1: number;
  x2: number;
  label: 0 | 1;
}

export const NeuralSimLab: React.FC = () => {
  const PRESETS: Record<string, { w1: number; w2: number; b: number; name: string; desc: string; points: Point[] }> = {
    AND: {
      w1: 1.5,
      w2: 1.5,
      b: -2.0,
      name: 'AND 게이트',
      desc: '두 입력이 모두 1일 때만 1을 출력합니다. (단일 직선으로 완벽히 선형 분리 가능)',
      points: [
        { x1: 0, x2: 0, label: 0 },
        { x1: 1, x2: 0, label: 0 },
        { x1: 0, x2: 1, label: 0 },
        { x1: 1, x2: 1, label: 1 },
      ],
    },
    OR: {
      w1: 1.5,
      w2: 1.5,
      b: -0.8,
      name: 'OR 게이트',
      desc: '두 입력 중 하나라도 1이면 1을 출력합니다.',
      points: [
        { x1: 0, x2: 0, label: 0 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 1, label: 1 },
      ],
    },
    NAND: {
      w1: -1.5,
      w2: -1.5,
      b: 2.0,
      name: 'NAND 게이트',
      desc: 'AND 게이트의 출력을 반전한 형태입니다.',
      points: [
        { x1: 0, x2: 0, label: 1 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 1, label: 0 },
      ],
    },
    XOR: {
      w1: 1.0,
      w2: 1.0,
      b: -1.0,
      name: 'XOR 게이트 (단층 퍼셉트론의 한계)',
      desc: '입력이 서로 다를 때만 1을 출력합니다. 단 1개의 직선으로는 결코 분리할 수 없어 은닉층(다층 신경망)이 필요함을 보여줍니다.',
      points: [
        { x1: 0, x2: 0, label: 0 },
        { x1: 1, x2: 0, label: 1 },
        { x1: 0, x2: 1, label: 1 },
        { x1: 1, x2: 1, label: 0 },
      ],
    },
  };

  const [selectedPreset, setSelectedPreset] = useState<string>('AND');
  const [w1, setW1] = useState<number>(1.5);
  const [w2, setW2] = useState<number>(1.5);
  const [b, setB] = useState<number>(-2.0);
  const [activation, setActivation] = useState<'step' | 'sigmoid' | 'relu' | 'tanh'>('step');
  const [testInput, setTestInput] = useState<{ x1: number; x2: number }>({ x1: 1, x2: 1 });

  const activePoints = PRESETS[selectedPreset]?.points || PRESETS.AND.points;

  const calculateOutput = (x1Val: number, x2Val: number, w1Val: number, w2Val: number, bVal: number) => {
    const z = x1Val * w1Val + x2Val * w2Val + bVal;
    let act = 0;
    if (activation === 'step') {
      act = z >= 0 ? 1 : 0;
    } else if (activation === 'sigmoid') {
      act = 1 / (1 + Math.exp(-z));
    } else if (activation === 'relu') {
      act = Math.max(0, z);
    } else if (activation === 'tanh') {
      act = Math.tanh(z);
    }
    const predictedClass = act >= 0.5 ? 1 : 0;
    return { z, act, predictedClass };
  };

  const accuracy = useMemo(() => {
    let correct = 0;
    for (const p of activePoints) {
      const res = calculateOutput(p.x1, p.x2, w1, w2, b);
      if (res.predictedClass === p.label) {
        correct++;
      }
    }
    return Math.round((correct / activePoints.length) * 100);
  }, [activePoints, w1, w2, b, activation]);

  const currentCalc = calculateOutput(testInput.x1, testInput.x2, w1, w2, b);

  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    const p = PRESETS[key];
    setW1(p.w1);
    setW2(p.w2);
    setB(p.b);
  };

  const resetWeights = () => {
    applyPreset(selectedPreset);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
      {/* Simulation Header */}
      <div className="p-6 border-b border-rose-100 dark:border-slate-800 bg-rose-50/50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>실습 모듈 01</span>
            <span aria-hidden="true">·</span>
            <span>2D 결정 경계 & 뉴런 연산 실시간 탐색</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
            단층 퍼셉트론 & 인공신경망 가중치 시뮬레이터
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            가중치(w₁, w₂)와 편향(b)을 조절하여 뉴런이 데이터를 어떻게 선형 분류하는지 관찰하세요.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-rose-100/70 dark:bg-slate-800 rounded-xl">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedPreset === key
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-rose-100 dark:divide-slate-800">
        {/* Left Zone: Visual 2D Coordinate & Neuron Stage (7 Cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col gap-6 bg-slate-950 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-slate-300">데이터 좌표계:</span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                <span>클래스 0</span>
              </span>
              <span className="flex items-center gap-1.5 text-pink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block shadow-[0_0_8px_rgba(244,114,182,0.6)]"></span>
                <span>클래스 1</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">분류 정확도:</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                accuracy === 100
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800'
              }`}>
                {accuracy}%
              </span>
            </div>
          </div>

          {/* 2D Plane SVG Visualization */}
          <div className="relative w-full aspect-square max-h-[350px] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-inner">
            <svg viewBox="-0.5 -0.5 2 2" className="w-full h-full transform scale-y-[-1]">
              <defs>
                <pattern id="simGrid" width="0.25" height="0.25" patternUnits="userSpaceOnUse">
                  <path d="M 0.25 0 L 0 0 0 0.25" fill="none" stroke="#2a1622" strokeWidth="0.01" />
                </pattern>
              </defs>
              <rect x="-0.5" y="-0.5" width="2" height="2" fill="url(#simGrid)" />

              {/* Axes */}
              <line x1="-0.5" y1="0" x2="1.5" y2="0" stroke="#5b2d42" strokeWidth="0.02" />
              <line x1="0" y1="-0.5" x2="0" y2="1.5" stroke="#5b2d42" strokeWidth="0.02" />

              {/* Decision Boundary Line in vivid neon pink */}
              {Math.abs(w2) > 0.001 ? (
                (() => {
                  const xStart = -0.5;
                  const yStart = (-w1 * xStart - b) / w2;
                  const xEnd = 1.5;
                  const yEnd = (-w1 * xEnd - b) / w2;
                  return (
                    <line
                      x1={xStart}
                      y1={yStart}
                      x2={xEnd}
                      y2={yEnd}
                      stroke="#f43f5e"
                      strokeWidth="0.04"
                      className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                    />
                  );
                })()
              ) : (
                <line
                  x1={-b / (w1 || 0.001)}
                  y1="-0.5"
                  x2={-b / (w1 || 0.001)}
                  y2="1.5"
                  stroke="#f43f5e"
                  strokeWidth="0.04"
                  className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                />
              )}

              {/* Data Points */}
              {activePoints.map((p, idx) => {
                const isTested = testInput.x1 === p.x1 && testInput.x2 === p.x2;
                return (
                  <g
                    key={idx}
                    onClick={() => setTestInput({ x1: p.x1, x2: p.x2 })}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <circle
                      cx={p.x1}
                      cy={p.x2}
                      r={isTested ? "0.09" : "0.065"}
                      fill={p.label === 1 ? '#f472b6' : '#fb7185'}
                      stroke={isTested ? '#ffffff' : '#0f172a'}
                      strokeWidth="0.025"
                    />
                  </g>
                );
              })}
            </svg>

            {/* In-canvas Formula Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur border border-pink-900/40 rounded-lg px-3 py-1.5 text-[11px] font-mono text-pink-300">
              결정 경계선: {w1.toFixed(1)}·x₁ + {w2.toFixed(1)}·x₂ + ({b.toFixed(1)}) = 0
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-950/70 px-2 py-1 rounded">
              * 데이터 포인트를 클릭하면 테스트 좌표가 지정됩니다.
            </div>
          </div>

          {/* Interactive Neuron Forward Pass Schematic */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
              <span>뉴런 순방향 신호 흐름 (Forward Propagation)</span>
              <span className="text-[11px] text-pink-400 font-mono">z = w₁x₁ + w₂x₂ + b</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-col gap-2">
                <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-pink-300">
                  x₁ = {testInput.x1} <span className="text-slate-400">(w₁={w1.toFixed(1)})</span>
                </div>
                <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-pink-300">
                  x₂ = {testInput.x2} <span className="text-slate-400">(w₂={w2.toFixed(1)})</span>
                </div>
              </div>

              <div className="text-slate-500 font-sans">➔</div>

              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-pink-900/60 text-center">
                <div className="text-[10px] text-slate-400">가중합 (z) + 편향</div>
                <div className="text-pink-300 font-bold text-sm">
                  z = {currentCalc.z.toFixed(2)}
                </div>
              </div>

              <div className="text-slate-500 font-sans">➔</div>

              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-pink-900/60 text-center">
                <div className="text-[10px] text-slate-400">활성화 σ(z)</div>
                <div className="text-emerald-400 font-bold text-sm">
                  {currentCalc.act.toFixed(2)}
                </div>
              </div>

              <div className="text-slate-500 font-sans">➔</div>

              <div className={`px-3 py-2 rounded-xl font-bold text-sm text-center border ${
                currentCalc.predictedClass === 1
                  ? 'bg-pink-950/80 text-pink-300 border-pink-600 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              }`}>
                <div className="text-[10px] opacity-75">예측 클래스</div>
                <div>ŷ = {currentCalc.predictedClass}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Control & Parameter Deck (5 Cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>선택된 프리셋 설명</span>
                <button
                  onClick={resetWeights}
                  className="text-pink-600 dark:text-pink-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>초기화</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-rose-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-rose-100 dark:border-slate-800 leading-relaxed">
                {PRESETS[selectedPreset]?.desc}
              </p>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>가중치 1 (w₁)</span>
                  <span className="font-mono text-pink-600 dark:text-pink-400 font-bold tabular-nums">{w1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={w1}
                  onChange={(e) => setW1(parseFloat(e.target.value))}
                  className="w-full accent-pink-600 dark:accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>가중치 2 (w₂)</span>
                  <span className="font-mono text-pink-600 dark:text-pink-400 font-bold tabular-nums">{w2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={w2}
                  onChange={(e) => setW2(parseFloat(e.target.value))}
                  className="w-full accent-pink-600 dark:accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span>편향 (Bias, b)</span>
                  <span className="font-mono text-pink-600 dark:text-pink-400 font-bold tabular-nums">{b.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full accent-pink-600 dark:accent-pink-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Activation Function Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                활성화 함수 (Activation Function)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['step', 'sigmoid', 'relu', 'tanh'] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => setActivation(act)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-colors ${
                      activation === act
                        ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="capitalize">{act.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {act === 'step' && '계단 함수 (0 또는 1)'}
                      {act === 'sigmoid' && '시그모이드 (0 ~ 1 확률)'}
                      {act === 'relu' && 'ReLU (max(0, z))'}
                      {act === 'tanh' && '하이퍼볼릭 탄젠트 (-1~1)'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Input Coordinates Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                테스트 입력 좌표 ($x_1, x_2$)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { x1: 0, x2: 0 },
                  { x1: 1, x2: 0 },
                  { x1: 0, x2: 1 },
                  { x1: 1, x2: 1 },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setTestInput(item)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                      testInput.x1 === item.x1 && testInput.x2 === item.x2
                        ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    ({item.x1}, {item.x2})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Insight Note */}
          <div className="mt-6 pt-4 border-t border-rose-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">💡 교수자의 핵심 강의 팁</div>
            <p className="leading-relaxed">
              XOR 게이트는 단 1개의 직선으로 파란 점과 빨간 점을 분리할 수 없습니다. 
              이것이 1969년 인공지능의 첫 번째 빙하기를 불렀으나, 여러 뉴런을 층(Layer)으로 쌓는 
              다층 퍼셉트론(MLP)의 등장으로 극복되었습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
