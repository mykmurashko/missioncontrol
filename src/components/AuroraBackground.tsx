import { useTheme } from '../hooks/useTheme';

export function AuroraBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Orb 1: Maestro Side (Teal) - Top Left/Center */}
      <div
        className={`absolute rounded-full blur-[120px] ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
        style={{
          width: '700px',
          height: '700px',
          backgroundColor: isDark ? 'rgb(14, 165, 166)' : 'rgb(96, 165, 250)', // teal-500 in dark, blue-400 in light
          opacity: isDark ? 0.2 : 0.18,
          top: '8%',
          left: '8%',
          animation: 'aurora-float-1 24s ease-in-out infinite',
        }}
      />

      {/* Orb 2: Opcode Side (Orange) - Bottom Right/Center */}
      <div
        className={`absolute rounded-full blur-[120px] ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
        style={{
          width: '650px',
          height: '650px',
          backgroundColor: isDark ? 'rgb(234, 88, 12)' : 'rgb(251, 146, 60)', // orange-600 in dark, orange-400 in light
          opacity: isDark ? 0.2 : 0.16,
          bottom: '12%',
          right: '12%',
          animation: 'aurora-float-2 26s ease-in-out infinite',
        }}
      />

      {/* Orb 3: Soft Neutral - Drifting (only in light mode) */}
      {!isDark && (
        <div
          className="absolute rounded-full blur-[120px] mix-blend-multiply"
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: 'rgb(212, 212, 216)', // zinc-300 - soft neutral
            opacity: 0.15,
            top: '45%',
            left: '40%',
            animation: 'aurora-float-3 28s ease-in-out infinite',
          }}
        />
      )}

      <style>{`
        @keyframes aurora-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(180px, -150px) scale(1.12) rotate(8deg);
          }
          50% {
            transform: translate(-120px, 200px) scale(0.92) rotate(-10deg);
          }
          75% {
            transform: translate(150px, 100px) scale(1.08) rotate(5deg);
          }
        }

        @keyframes aurora-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          30% {
            transform: translate(-200px, 180px) scale(1.15) rotate(-12deg);
          }
          60% {
            transform: translate(150px, -180px) scale(0.88) rotate(15deg);
          }
        }

        @keyframes aurora-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(220px, 180px) scale(1.1) rotate(10deg);
          }
          66% {
            transform: translate(-180px, -200px) scale(0.9) rotate(-12deg);
          }
        }
      `}</style>
    </div>
  );
}

