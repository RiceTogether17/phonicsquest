export function renderDrill(drill, index) {
  return `<div class="dash-pattern-item"><strong>Drill ${index + 1}</strong><p>${drill.question}</p>${drill.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="drill-${index}" value="${oi}"/> ${opt}</label>`).join('')}</div>`;
}

export function gradeDrills(drills = [], answers = []) {
  const results = drills.map((drill, idx) => ({
    type: drill.type,
    correct: Number(answers[idx]) === Number(drill.correctIndex),
  }));
  const correctCount = results.filter((r) => r.correct).length;
  return {
    correctCount,
    total: drills.length,
    passed: drills.length === 0 ? true : correctCount >= Math.max(1, Math.ceil(drills.length * 0.6)),
    results,
  };
}

export function collectDrillAnswers(container, drillCount) {
  return Array.from({ length: drillCount }, (_, idx) => container.querySelector(`input[name="drill-${idx}"]:checked`)?.value ?? -1);
}
