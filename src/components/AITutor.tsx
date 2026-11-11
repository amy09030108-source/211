import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: `안녕하세요! **인공지능 아카데미** 전담 AI 튜터 **알파 튜터(Alpha Tutor)**입니다. 🎓\n\n머신러닝 알고리즘, 신경망 역전파 수학, 파이썬/PyTorch 실습 코드, 프롬프트 작성법, 과제 힌트 등 수업과 관련된 어떤 질문이든 편하게 물어보세요!`,
      timestamp: '방금 전',
      source: 'gemini-3.8-flash',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = [
    '지도학습과 비지도학습의 차이는?',
    '퍼셉트론과 활성화 함수의 관계는?',
    'RAG가 LLM 환각(Hallucination)을 어떻게 줄이나요?',
    '오버피팅(과적합)을 방지하는 실무 기법은?',
    '트랜스포머의 어텐션 메커니즘이란?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || inputText).trim();
    if (!question || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          currentTopic: '인공지능 정규 교육 과정',
        }),
      });

      const data = await res.json();
      const tutorMsg: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || '답변을 생성하지 못했습니다. 잠시 후 다시 질문해 주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: '네트워크 연결 상태를 확인하고 잠시 후 다시 시도해 주세요.',
        timestamp: '오류',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'tutor',
        text: `대화 내용이 초기화되었습니다. 수업 내용 중 궁금한 점을 질문해 주세요! 💡`,
        timestamp: '방금 전',
      },
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-[650px] transition-colors">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-slate-800 bg-slate-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center font-bold shadow-md shadow-pink-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-white">
                알파 튜터 (Alpha Tutor)
              </h2>
              <span className="text-[10px] font-mono bg-pink-950/80 text-pink-300 border border-pink-700/80 px-2.5 py-0.5 rounded-full">
                Gemini 3.8 Flash 연동
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              24시간 실시간 AI 수업 전담 조교 및 학습 멘토
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
          title="대화 초기화"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">대화 비우기</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-rose-50/40 dark:bg-slate-950/60 border-b border-rose-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">추천 질문:</span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-slate-700 dark:hover:text-pink-300 border border-rose-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-rose-50/20 dark:bg-slate-950/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-xs'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-pink-400" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-none shadow-md shadow-pink-500/15'
                  : 'bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>
              <div
                className={`mt-2 text-[10px] flex items-center justify-between ${
                  msg.sender === 'user' ? 'text-pink-200' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.source && <span>출처: {msg.source}</span>}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-pink-400" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-600 dark:text-slate-300 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-600 animate-ping"></span>
              <span>알파 튜터가 최적의 교육 답변을 생각하고 있습니다...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-rose-100 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="수업 내용, 코드 구현, 시험 대비 질문을 자유롭게 입력하세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-rose-50/40 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40 whitespace-nowrap shadow-sm shadow-pink-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">질문하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};
