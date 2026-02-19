export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function weeklyScorePct(params: {
  touchpoints: number; meetings: number; pitches: number; gym: number;
  dateNight: number; familyWalk: number;
}) {
  const a = clamp01(params.touchpoints / 25);
  const b = clamp01(params.meetings / 2);
  const c = clamp01(params.pitches / 1);
  const d = clamp01(params.gym / 4);
  const e = clamp01(params.dateNight);
  const f = clamp01(params.familyWalk);
  const avg = (a + b + c + d + e + f) / 6;
  return Math.round(avg * 100);
}
