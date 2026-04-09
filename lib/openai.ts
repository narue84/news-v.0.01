import OpenAI from 'openai';
import { AnalysisResult, ProcessedNewsItem } from './types';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function analyzeNews(newsItems: ProcessedNewsItem[]): Promise<AnalysisResult> {
  const client = getOpenAIClient();

  const newsText = newsItems
    .slice(0, 10)
    .map((item, i) => `[${i + 1}] ${item.cleanTitle}\n${item.cleanDescription}`)
    .join('\n\n');

  const prompt = `다음은 현재 뉴스 기사들입니다. 아래 JSON 형식으로 분석해주세요.

뉴스 내용:
${newsText}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "keywords": [
    {"word": "키워드명", "score": 8}
  ],
  "sentiment": {
    "label": "긍정 또는 부정 또는 중립",
    "emotion": "희망 또는 분노 또는 불안 또는 기쁨 또는 슬픔 또는 놀라움",
    "score": 0.6,
    "detail": "전체적인 감정 분석 설명 (2-3문장)"
  },
  "mindmap": {
    "center": "핵심 주제",
    "branches": [
      {
        "label": "대분류1",
        "children": ["세부항목1", "세부항목2", "세부항목3"]
      }
    ]
  },
  "category": "정치 또는 경제 또는 IT/과학 또는 스포츠 또는 사회 또는 문화/연예",
  "trend_insight": "현재 이슈의 배경, 맥락, 전망에 대한 심층 분석 (3-5문장)",
  "comment_analysis": "이 뉴스에 대한 예상 여론 반응 및 주요 댓글 패턴 분석 (2-3문장)",
  "interest_score": 75,
  "summary": "전체 뉴스를 한 문단으로 요약 (3-4문장)"
}

규칙:
- keywords는 중요도 순으로 최대 15개 (score: 1-10)
- interest_score는 0-100 사이 숫자 (사회적 관심도)
- sentiment.score는 -1.0 ~ 1.0 사이 (부정이면 음수, 긍정이면 양수)
- mindmap.branches는 3-5개`;

  const response = await client.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      {
        role: 'system',
        content: '당신은 한국 뉴스 분석 전문가입니다. 뉴스를 정확하게 분석하고 JSON 형식으로만 응답합니다.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_completion_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const result = JSON.parse(content) as AnalysisResult;
  return result;
}

export async function generateDailyDigest(newsItems: ProcessedNewsItem[]): Promise<string> {
  const client = getOpenAIClient();

  const newsText = newsItems
    .slice(0, 20)
    .map((item, i) => `[${i + 1}] ${item.cleanTitle}`)
    .join('\n');

  const response = await client.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      {
        role: 'system',
        content: '당신은 한국의 뉴스 에디터입니다. 오늘의 주요 뉴스를 읽기 쉽게 브리핑합니다.',
      },
      {
        role: 'user',
        content: `오늘의 주요 뉴스 목록입니다:\n${newsText}\n\n이 뉴스들을 바탕으로 오늘의 AI 데일리 브리핑을 작성해주세요. 주요 이슈 3-5개를 선정하여 각각 2-3문장으로 설명하고, 마지막에 오늘의 종합 전망을 2문장으로 작성해주세요.`,
      },
    ],
    temperature: 0.5,
    max_completion_tokens: 1500,
  });

  return response.choices[0]?.message?.content || '브리핑을 생성할 수 없습니다.';
}
