export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* Precise CSS Dot Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}

