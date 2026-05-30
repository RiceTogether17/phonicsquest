export function inferQuestionContextType(question = '') {
  const text = String(question).replace(/___/g, 'blank').trim();
  const sentenceCount = (text.match(/[.!?](?=\s|$)/g) || []).length;
  return sentenceCount >= 2 ? 'multi' : 'single';
}
