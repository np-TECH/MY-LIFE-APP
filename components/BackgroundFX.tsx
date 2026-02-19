export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 app-shell">
      {/* grid */}
      <div className="absolute inset-0 grid-overlay" />

      {/* floating glow orbs */}
      <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-sage-500/20 blur-3xl animate-floatSlow mix-blend-screen" />
      <div className="absolute top-24 -right-24 h-[520px] w-[520px] rounded-full bg-neon-teal/15 blur-3xl animate-floatMed mix-blend-screen" />
      <div className="absolute bottom-[-140px] left-[30%] h-[640px] w-[640px] rounded-full bg-neon-green/10 blur-3xl animate-drift mix-blend-screen" />

      {/* vignette to keep edges dark */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
    </div>
  );
}
