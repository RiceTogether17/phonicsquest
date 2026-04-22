import { lowerVocabPassagesExtra } from './lower.js';
import { upperVocabPassagesExtra } from './upper.js';

export const vocabPassagesExtra = Object.fromEntries(
  Object.keys(lowerVocabPassagesExtra).map((category) => [
    category,
    {
      ...(lowerVocabPassagesExtra[category] || {}),
      ...(upperVocabPassagesExtra[category] || {}),
    },
  ]),
);
