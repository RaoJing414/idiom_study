import { getProgress, updateProgress, getAllProgress } from '../db';
import type { Progress } from '../types';

const defaultProgress = (idiomId: number): Progress => ({
  idiomId,
  status: 'new',
  lastReviewed: Date.now(),
  reviewCount: 0,
  studyCount: 0,
  quizCorrectCount: 0,
  quizWrongCount: 0,
  lastQuizResult: null,
  lastSelectedOptionIdx: null,
});

export const progressApi = {
  // Get progress for a specific idiom
  async getById(id: number): Promise<Progress> {
    const p = await getProgress(id);
    return p || defaultProgress(id);
  },

  // Get progress for multiple idioms
  async getBatch(ids: number[]): Promise<Record<number, Progress>> {
    const all = await this.getAll();
    const result: Record<number, Progress> = {};
    ids.forEach(id => {
      const p = all.find(item => item.idiomId === id);
      result[id] = p || defaultProgress(id);
    });
    return result;
  },

  // Record a study action (viewing the definition)
  async recordStudy(id: number) {
    const p = await this.getById(id);
    await updateProgress({
      ...p,
      studyCount: p.studyCount + 1,
      reviewCount: p.reviewCount + 1,
      lastReviewed: Date.now(),
      status: p.status === 'new' ? 'learning' : p.status,
    });
  },

  // Record a quiz result
  async recordQuizResult(id: number, isCorrect: boolean, selectedIdx: number) {
    const p = await this.getById(id);
    await updateProgress({
      ...p,
      quizCorrectCount: p.quizCorrectCount + (isCorrect ? 1 : 0),
      quizWrongCount: p.quizWrongCount + (isCorrect ? 0 : 1),
      lastQuizResult: isCorrect,
      lastSelectedOptionIdx: selectedIdx,
      reviewCount: p.reviewCount + 1,
      lastReviewed: Date.now(),
      status: p.status === 'new' ? 'learning' : p.status,
    });
  },

  // Toggle mastered status
  async toggleMastered(id: number) {
    const p = await this.getById(id);
    const newStatus = p.status === 'mastered' ? 'learning' : 'mastered';
    await updateProgress({
      ...p,
      status: newStatus,
      lastReviewed: Date.now(),
    });
    return newStatus === 'mastered';
  },

  // Get all progress records
  async getAll(): Promise<Progress[]> {
    return getAllProgress();
  }
};
