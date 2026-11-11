import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Circle, Save, Printer } from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculumData';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedLessons: Record<string, boolean>;
  quizScore: { correct: number; total: number };
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  completedLessons,
  quizScore,
}) => {
  const [studentName, setStudentName] = useState<string>('김인공');
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'certificate' | 'notes'>('progress');

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai_campus_student_notes');
    if (saved) setPersonalNotes(saved);
    const savedName = localStorage.getItem('ai_campus_student_name');
    if (savedName) setStudentName(savedName);
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem('ai_campus_student_notes', personalNotes);
    localStorage.setItem('ai_campus_student_name', studentName);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const totalLessons = CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-rose-100 dark:border-slate-800 shadow-2xl flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="p-5 border-b border-rose-100 dark:border-slate-800 bg-rose-50/60 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-pink-500/30">
              AI
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                내 학습 대시보드 & 수료 센터
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                수강 진도 현황, 디지털 수료증, 나만의 학습 메모장
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-rose-100/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-rose-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-pink-600 text-pink-600 dark:border-pink-400 dark:text-pink-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            진도 현황 ({progressPercent}%)
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'certificate'
                ? 'border-pink-600 text-pink-600 dark:border-pink-400 dark:text-pink-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>수료증 미리보기</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-pink-600 text-pink-600 dark:border-pink-400 dark:text-pink-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            학습 메모장
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Progress Summary Card */}
              <div className="bg-slate-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-pink-950/40">
                <div>
                  <div className="text-xs text-pink-300 font-semibold mb-1">총 수강 진도율</div>
                  <div className="text-3xl font-display font-extrabold font-mono tabular-nums text-pink-400">
                    {progressPercent}%
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    총 {totalLessons}개 차시 중 {completedCount}개 차시 완료
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                  <div className="text-xs text-slate-400 mb-1">실전 퀴즈 성취도</div>
                  <div className="text-2xl font-display font-bold text-pink-300 font-mono tabular-nums">
                    {quizScore.total > 0 ? `${Math.round((quizScore.correct / quizScore.total) * 100)}%` : '0%'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {quizScore.correct} / {quizScore.total || 5} 문항 정답
                  </div>
                </div>
              </div>

              {/* Progress Bar with pink gradient */}
              <div className="w-full bg-rose-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-600 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Modules breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">주차별 세부 차시 현황</h4>
                {CURRICULUM_MODULES.map((mod) => (
                  <div key={mod.id} className="p-3.5 rounded-xl border border-rose-100 dark:border-slate-800 bg-rose-50/30 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{mod.week}: {mod.title}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {mod.lessons.filter((l) => completedLessons[l.id]).length}/{mod.lessons.length} 완료
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {mod.lessons.map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-rose-100 dark:border-slate-700"
                        >
                          {completedLessons[l.id] ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{l.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-6">
              {/* Certificate Configuration */}
              <div className="flex items-center gap-3 bg-rose-50/40 dark:bg-slate-800/40 p-4 rounded-xl border border-rose-100 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  수료자 성명:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white"
                  placeholder="이름을 입력하세요"
                />
                <button
                  onClick={() => window.print()}
                  className="ml-auto px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-xs font-semibold hover:from-pink-700 hover:to-rose-700 flex items-center gap-1.5 shadow-sm shadow-pink-500/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄 / PDF 저장</span>
                </button>
              </div>

              {/* Printable Certificate Canvas */}
              <div className="border-8 border-double border-pink-900/60 p-8 rounded-2xl bg-gradient-to-b from-rose-50/50 via-white to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-center shadow-lg relative">
                <div className="text-xs font-mono font-bold tracking-widest text-pink-600 dark:text-pink-400 uppercase mb-2">
                  CERTIFICATE OF COMPLETION
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-6">
                  인공지능 정규 교육 과정 수료증
                </h2>

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">성명</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-display border-b-2 border-pink-300 dark:border-pink-800 pb-2 inline-block min-w-[200px] mb-6">
                  {studentName || '수강생'}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg mx-auto mb-8">
                  위 사람은 인공지능 아카데미(AI Campus)에서 주관하는 
                  <strong> [차세대 실전 인공지능 마스터 트랙]</strong>의 머신러닝, 
                  인공신경망 딥러닝, 생성형 AI 및 프롬프트 엔지니어링 과정을 성실히 
                  이수하고 과제 및 퀴즈 평가를 우수한 성적으로 수료하였으므로 본 증서를 수여합니다.
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-rose-100 dark:border-slate-800 pt-6 max-w-md mx-auto">
                  <div className="text-left">
                    <div>발급일: {new Date().toLocaleDateString('ko-KR')}</div>
                    <div>인증 코드: AIC-PINK-{Math.floor(100000 + Math.random() * 900000)}</div>
                  </div>
                  <div className="text-right font-display font-bold text-slate-900 dark:text-white">
                    인공지능 아카데미 원장
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">나만의 수업 메모장</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">작성한 메모는 브라우저 로컬 저장소에 안전하게 자동 보관됩니다.</p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-pink-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{noteSaved ? '저장 완료!' : '메모 저장'}</span>
                </button>
              </div>

              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                rows={12}
                className="w-full text-xs sm:text-sm p-4 bg-rose-50/40 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 font-sans leading-relaxed text-slate-900 dark:text-white"
                placeholder="오늘 수업에서 배운 내용, 신경망 역전파 공식 정리, 과제 아이디어, 질문할 내용 등을 자유롭게 적어두세요..."
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 rounded-xl transition-colors shadow-sm shadow-pink-500/20"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
