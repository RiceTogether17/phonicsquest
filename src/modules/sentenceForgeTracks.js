export function classifySentenceTrack(entry) {
  const skills = new Set(entry?.sentenceSkills || []);
  const hasAny = (arr) => arr.some((s) => skills.has(s));

  if (hasAny(['word_order', 'subject_action_clue', 'modal_order'])) return 'word-order';
  if (
    hasAny([
      'synthesis_transformation',
      'inversion',
      'relative_clauses',
      'concession',
      'reported_speech',
    ])
  )
    return 'synthesis-transformation';
  if (
    hasAny([
      'connector_clue',
      'comparison_structure',
      'time_order_clue',
      'clause_boundary',
      'punctuation_clue',
    ])
  )
    return 'sentence-combining';

  if ((entry?.level || 1) <= 2) return 'word-order';
  if ((entry?.level || 1) <= 4) return 'sentence-combining';
  return 'synthesis-transformation';
}
