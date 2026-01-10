export interface Idiom {
  id: number;
  word: string;
  frequency: number;
  definition: string;
  pinyin?: string;
}

export interface Progress {
  idiomId: number;
  status: 'new' | 'learning' | 'mastered';
  lastReviewed: number;
  reviewCount: number;
  studyCount: number;
  quizCorrectCount: number;
  quizWrongCount: number;
  lastQuizResult: boolean | null;
  lastSelectedOptionIdx: number | null;
}

export type QuizMode = 'idiom' | 'definition';

export interface StudyOptions {
  freq: string;
  day: number;
}
