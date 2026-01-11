import type { Idiom } from '../types';
import idiomsData from './idioms.json';

export const idioms: Idiom[] = idiomsData as Idiom[];

export function getFrequencyLabel(freq: number): string {
  if (freq >= 18) return '重点';
  if (freq >= 12) return '重点';
  if (freq >= 6) return '常见';
  return '一般';
}
