import React, { useState } from 'react';
import { GLOSSARY_ITEMS } from '../data/curriculumData';
import { Search, Copy, Check, Terminal } from 'lucide-react';

export const GlossarySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const CATEGORIES = ['전체', '기초 개념', '머신러닝', '딥러닝', '생성형 AI', '윤리/보안'];

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.koreanTerm.includes(searchTerm) ||
      item.definition.includes(searchTerm);
    const matchesCat = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const CHEAT_SHEETS = [
    {
      title: 'Scikit-Learn 핵심 ML 파이프라인',
      desc: '데이터 분할, 스케일링, 모델 피팅, 메트릭 평가 표준 패턴',
      code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train_scaled, y_train)
preds = model.predict(X_test_scaled)
print(f"정확도: {accuracy_score(y_test, preds):.4f}")`,
    },
    {
      title: 'PyTorch 신경망 기본 훈련 루프',
      desc: '신경망 forward 및 역전파(Backprop) 가중치 갱신 3종 세트',
      code: `import torch
import torch.nn as nn
import torch.optim as optim

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(num_epochs):
    model.train()
    optimizer.zero_grad()      # 1. 기울기 초기화
    outputs = model(inputs)    # 2. 순방향 전파
    loss = criterion(outputs, labels)
    loss.backward()            # 3. 역방향 전파 (기울기 계산)
    optimizer.step()           # 4. 가중치 업데이트`,
    },
    {
      title: 'Google GenAI SDK 최신 호출 패턴',
      desc: '@google/genai SDK를 활용한 안전한 서버 사이드 Gemini 호출',
      code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: "머신러닝과 딥러닝의 핵심 차이를 요약해줘.",
  config: {
    systemInstruction: "너는 친절하고 명쾌한 AI 교수다."
  }
});
console.log(response.text);`,
    },
  ];

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <section id="glossary" className="py-16 bg-rose-50/30 dark:bg-slate-950 border-b border-rose-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">
            <span>레퍼런스 & 치트시트</span>
            <span aria-hidden="true">·</span>
            <span>언제든 찾아보는 지식 저장소</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            AI 핵심 용어 사전 & 코드 치트시트
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            수업 중 등장하는 낯선 수학/머신러닝 용어를 검색하고, 실무 파이썬 코드를 한 번의 클릭으로 복사해 가세요.
          </p>
        </div>

        {/* Section 1: Searchable Glossary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 p-6 sm:p-8 mb-12 shadow-xs transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="용어 검색 (예: Epoch, 과적합, Transformer)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-rose-50/40 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-rose-50/80 dark:bg-slate-800 rounded-xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-pink-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-rose-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-pink-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-pink-600 dark:text-pink-400">{item.category}</span>
                    <span className="font-mono text-slate-400">{item.term}</span>
                  </div>
                  <h4 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-2">
                    {item.koreanTerm}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {item.definition}
                  </p>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-rose-50/40 dark:bg-slate-800/60 p-2 rounded-lg border border-rose-100/60 dark:border-slate-700">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">예시: </span>
                  <span>{item.example}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-400">
              일치하는 용어를 찾을 수 없습니다. 다른 검색어를 입력해 보세요.
            </div>
          )}
        </div>

        {/* Section 2: Code Cheat Sheets */}
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span>실무 필수 파이썬 & API 치트시트</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CHEAT_SHEETS.map((sheet, i) => (
              <div
                key={i}
                className="bg-slate-950 rounded-2xl border border-pink-950/40 p-5 text-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-display font-bold text-white">
                      {sheet.title}
                    </h4>
                    <button
                      onClick={() => handleCopy(`sheet-${i}`, sheet.code)}
                      className="text-xs text-pink-300 hover:text-white flex items-center gap-1 p-1 hover:bg-slate-800 rounded transition-colors"
                      title="코드 복사"
                    >
                      {copiedSnippet === `sheet-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-pink-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[11px]">{copiedSnippet === `sheet-${i}` ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{sheet.desc}</p>
                  <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto leading-relaxed max-h-56">
                    {sheet.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
