import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize GoogleGenAI SDK on server side
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_');
  let ai: GoogleGenAI | null = null;
  if (isKeyValid) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
    }
  }

  // API Route for AI Class Assistant (알파 튜터)
  app.post('/api/ai/tutor', async (req, res) => {
    try {
      const { message, history, currentTopic, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: '메시지를 입력해주세요.' });
      }

      // If Gemini API is available and key is configured
      if (ai && isKeyValid) {
        try {
          const systemInstruction = `당신은 '인공지능 아카데미(AI Campus)'의 수석 AI 전담 교수 및 튜터 '알파 튜터(Alpha Tutor)'입니다.
학생들의 질문에 친절하고 직관적이며 전문적인 한국어로 답변합니다.
학습 주제 맥락: ${currentTopic || '인공지능 전반 (머신러닝, 딥러닝, 생성형 AI, 프롬프트 엔지니어링)'}
추가 맥락 정보: ${context || '기초부터 실전까지 배우는 AI 수업'}

답변 가이드라인:
1. 초보자도 이해하기 쉬운 직관적인 비유(일상 생활 예시)를 곁들여 설명하세요.
2. 수식이나 알고리즘이 필요할 때는 핵심 원리를 명쾌하게 짚어주세요.
3. 파이썬 코드 예시나 프롬프트 예시가 도움이 될 때 간결하고 가독성 높은 예시를 포함하세요.
4. 존댓말과 격려하는 멘토 톤앤매너를 유지하며, 핵심 요점을 가독성 좋은 글머리 기호(Markdown)로 정리해 주세요.
5. 학생이 더 깊이 탐구할 수 있는 '생각해볼 질문' 1가지를 답변 끝에 제안하세요.`;

          // Timeout promise (6 seconds) to prevent infinite pending
          const apiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: message,
            config: { systemInstruction },
          });
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API Timeout')), 6000)
          );

          const response = (await Promise.race([apiPromise, timeoutPromise])) as any;

          return res.json({
            reply: response.text || '답변을 생성하지 못했습니다. 다시 질문해 주세요.',
            source: 'gemini-3.8-flash',
          });
        } catch (apiError: any) {
          console.warn('Gemini API call skipped or timed out, using curriculum fallback:', apiError?.message);
        }
      }

      // Contextual Educational Fallback when API key is pending or network is restricted
      const query = message.toLowerCase();
      let fallbackReply = '';

      if (query.includes('퍼셉트론') || query.includes('신경망') || query.includes('뉴런') || query.includes('가중치')) {
        fallbackReply = `### 🧠 인공신경망과 퍼셉트론의 핵심 원리

퍼셉트론(Perceptron)은 인간의 생물학적 신경세포(뉴런)를 수학적으로 모방한 인공지능의 가장 기초적인 단위입니다.

1. **입력과 가중치 ($x_i, w_i$)**: 여러 정보가 들어올 때 각 정보의 중요도를 곱합니다 ($x_1 w_1 + x_2 w_2 + ...$).
2. **편향 ($b$, Bias)**: 뉴런이 얼마나 쉽게 활성화(발화)될지를 결정하는 임계치 조절값입니다.
3. **가중합 ($z = \sum w_i x_i + b$)**: 입력과 가중치의 곱에 편향을 더한 총 신호입니다.
4. **활성화 함수 ($\sigma(z)$)**: 비선형성을 부여하여 복잡한 패턴을 학습할 수 있게 합니다 (ReLU, Sigmoid 등).

💡 **실습 팁**: 대화형 실습실의 '신경망 시뮬레이터'에서 가중치와 편향 슬라이더를 직접 움직여 결정 경계(선)가 어떻게 데이터를 구분하는지 관찰해 보세요!

🤔 **생각해볼 질문**: 만약 신경망에 비선형 활성화 함수 없이 선형 연산만 쌓는다면 층을 100개 쌓아도 단 1개 층과 같다는 사실을 알고 계셨나요? 왜 그럴까요?`;
      } else if (query.includes('프롬프트') || query.includes('few-shot') || query.includes('생각의 사슬') || query.includes('cot')) {
        fallbackReply = `### ✍️ 효과적인 프롬프트 엔지니어링 3대 원칙

대규모 언어모델(LLM)에게 최적의 답변을 이끌어내는 핵심 테크닉입니다:

1. **페르소나 지정 (Role-Prompting)**:
   - "너는 10년 차 수석 머신러닝 엔지니어다"처럼 명확한 역할을 부여하면 전문적 용어와 통찰력을 발휘합니다.
2. **Few-Shot 예시 제공**:
   - 질문만 던지는 Zero-Shot보다, 원하는 입력-출력 쌍을 1~2개 예시로 제공하면 출력 양식과 톤이 급격히 정확해집니다.
3. **Chain of Thought (CoT, 생각의 사슬)**:
   - "단계별로 차근차근 생각해 보자(Let's think step by step)"라는 문구를 넣으면 복잡한 논리와 수학 문제에서 오답률이 대폭 감소합니다.

💡 **실습 팁**: 상단 메뉴 '대화형 실습실 > 프롬프트 랩'에서 Zero-shot과 CoT의 차이를 직접 테스트해 볼 수 있습니다!

🤔 **생각해볼 질문**: 모델의 Temperature 값을 0에 가깝게 낮출 때와 1에 가깝게 높일 때, 어떤 업무(예: 코드 작성 vs 소설 창작)에 각각 적합할까요?`;
      } else if (query.includes('지도학습') || query.includes('비지도학습') || query.includes('강화학습') || query.includes('차이')) {
        fallbackReply = `### 🎯 머신러닝의 3대 학습 패러다임

인공지능이 데이터를 학습하는 방식은 크게 세 가지로 나뉩니다:

| 구분 | 지도학습 (Supervised) | 비지도학습 (Unsupervised) | 강화학습 (Reinforcement) |
| :--- | :--- | :--- | :--- |
| **데이터 형태** | 문제 + 정답(라벨 $y$) | 정답이 없는 순수 데이터 | 환경(State)과 보상(Reward) |
| **목표** | 새로운 입력의 결과 예측 | 데이터 내부의 숨은 패턴/군집 발견 | 시행착오를 통한 최적 정책 학습 |
| **대표 사례** | 스팸 메일 분류, 주가 예측 | 고객 세분화(Clustering), 이상치 탐지 | 알파고 바둑, 자율주행, 로봇 제어 |

💡 **수업 팁**: 1주차 2강 '머신러닝 패러다임 정복' 강의 노트에서 더 자세한 시각 자료를 확인하실 수 있습니다.

🤔 **생각해볼 질문**: 넷플릭스 영화 추천 시스템은 지도학습일까요, 비지도학습일까요?`;
      } else if (query.includes('할루시네이션') || query.includes('환각') || query.includes('rag')) {
        fallbackReply = `### 🔍 LLM 환각(Hallucination) 현상과 극복 방안

LLM은 사실 여부를 '판단'하기보다 '통계적으로 다음에 올 확률이 가장 높은 단어'를 예측하는 모델이기 때문에 그럴듯한 거짓말을 만들어낼 수 있습니다.

이를 방지하는 대표적인 3가지 솔루션:
1. **RAG (검색 증강 생성)**: 신뢰할 수 있는 외부 문서나 DB를 실시간 검색하여 프롬프트 컨텍스트에 주입 후 답변 생성
2. **엄격한 시스템 지침**: "주어진 문서에 정보가 없으면 '확인할 수 없습니다'라고만 답할 것"
3. **그라운딩(Grounding) & 인용 요구**: "답변에 출처 URL과 근거 문장을 필히 병기할 것"

💡 **수업 팁**: 3주차 실전 생성형 AI 모듈에서 RAG 구조도를 시뮬레이션해 볼 수 있습니다!

🤔 **생각해볼 질문**: RAG를 사용하면 파인튜닝(Fine-tuning)을 하지 않아도 최신 정보나 사내 기밀 문서를 안전하게 질의할 수 있는 이유는 무엇일까요?`;
      } else {
        fallbackReply = `### 🎓 [알파 튜터] 답변

질문해 주신 내용("**${message}**")에 대해 안내해 드립니다:

인공지능 수업에서 매우 핵심적인 개념입니다!
- **개념 요약**: 인공지능은 대량의 데이터로부터 패턴과 통계적 관계를 학습하여 예측, 분류, 생성 작업을 수행하는 소프트웨어 체계입니다.
- **실전 팁**: 코드를 작성하거나 프롬프트를 설계할 때는 항상 데이터의 분포와 모델의 가정(Assumptions)을 먼저 점검하는 것이 실무에서 실패 확률을 줄이는 비결입니다.
- **수업 연계**: 상단 '강의 커리큘럼' 탭을 통해 단계별 강의 자료와 퀴즈를 풀어보시면 더욱 체계적으로 이해하실 수 있습니다.

💡 더 구체적인 질문(예: 손실함수, 역전파, 트랜스포머, 합성곱 신경망, 윤리적 이슈 등)을 입력해 주시면 심층적인 코드와 함께 설명해 드릴게요!`;
      }

      return res.json({
        reply: fallbackReply,
        source: 'curriculum-engine',
      });
    } catch (err: any) {
      console.error('Tutor route error:', err);
      res.status(500).json({ error: '질문 처리 중 오류가 발생했습니다.' });
    }
  });

  // Prompt Analysis API (학생이 작성한 프롬프트 채점 및 개선 제안)
  app.post('/api/ai/analyze-prompt', async (req, res) => {
    try {
      const { promptText, taskGoal } = req.body;
      if (!promptText) {
        return res.status(400).json({ error: '프롬프트를 입력해주세요.' });
      }

      if (ai && isKeyValid) {
        try {
          const analysisPrompt = `학생이 작성한 AI 프롬프트를 평가하고 개선안을 작성해주세요.
목표: ${taskGoal || '정확하고 논리적인 AI 응답 유도'}
학생의 프롬프트: "${promptText}"

다음 JSON 형식으로만 응답하세요:
{
  "score": 85,
  "clarity": "명확성 평가 한줄",
  "specificity": "구체성 평가 한줄",
  "strengths": ["잘된 점 1", "잘된 점 2"],
  "improvements": ["개선할 점 1", "개선할 점 2"],
  "optimizedPrompt": "전문가 수준으로 재작성된 프롬프트 예시"
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: analysisPrompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const json = JSON.parse(response.text || '{}');
          return res.json(json);
        } catch (e) {
          console.error('Prompt analysis API error:', e);
        }
      }

      // Rule-based high-quality heuristic analysis
      const wordCount = promptText.trim().split(/\s+/).length;
      const hasPersona = /너는|역할|전문가|엔지니어|교수/i.test(promptText);
      const hasConstraint = /제약|조건|글자|형식|단락|json|마크다운/i.test(promptText);
      const hasExample = /예시|예를 들어|예:|sample|example/i.test(promptText);

      let score = 65;
      if (hasPersona) score += 12;
      if (hasConstraint) score += 13;
      if (hasExample) score += 10;
      score = Math.min(score, 98);

      return res.json({
        score,
        clarity: wordCount > 5 ? '요구사항이 비교적 명확히 서술되어 있습니다.' : '프롬프트 길이가 다소 짧아 모델이 의도를 추측해야 합니다.',
        specificity: hasConstraint ? '출력 형식에 대한 제약이 포함되어 일관성이 높습니다.' : '출력 분량이나 포맷에 대한 구체적 제약을 추가하면 품질이 급상승합니다.',
        strengths: [
          hasPersona ? '명확한 페르소나 및 역할이 지정되었습니다.' : '전달하고자 하는 핵심 목표가 분명합니다.',
          '직관적인 어휘를 사용하여 모델이 혼란을 겪지 않습니다.',
        ],
        improvements: [
          !hasConstraint ? '출력 형식(예: 글머리 기호 3개 이내, JSON 형식 등)을 명시하세요.' : '예외 상황 처리(모르는 정보는 추측하지 말 것)를 추가하세요.',
          !hasExample ? '원하는 모범 출력 예시(One-shot sample)를 1개 덧붙이면 완성도가 비약적으로 향상됩니다.' : '단계적 사고(CoT) 유도 문구를 추가해보세요.',
        ],
        optimizedPrompt: `[역할]: 해당 분야의 최고 전문가로서 답변해 줘.\n[목표]: ${promptText}\n[제약조건]:\n1. 핵심 요약 3줄을 먼저 제시할 것\n2. 전문 용어는 초보자도 이해할 수 있는 쉬운 비유와 함께 서술할 것\n3. 마크다운 목록 형식으로 정리할 것`,
      });
    } catch (e) {
      res.status(500).json({ error: '프롬프트 분석 실패' });
    }
  });

  // Mount Vite in dev mode or serve static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Class Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
