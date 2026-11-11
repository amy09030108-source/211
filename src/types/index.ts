export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'theory' | 'practice' | 'project';
  summary: string;
  keyPoints: string[];
  codeSnippet?: string;
  completed?: boolean;
}

export interface CurriculumModule {
  id: number;
  week: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  lessons: Lesson[];
  projectTitle: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface GlossaryItem {
  term: string;
  koreanTerm: string;
  category: '기초 개념' | '머신러닝' | '딥러닝' | '생성형 AI' | '윤리/보안';
  definition: string;
  example: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  source?: string;
}
