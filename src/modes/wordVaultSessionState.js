export function resetWordVaultSessionState() {
  return {
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionClueScore: 0,
    sessionHintsUsed: 0,
    sessionBlankCorrect: 0,
    sessionBlankTotal: 0,
    sessionReviewRows: [],
  };
}
