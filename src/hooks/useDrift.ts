import { useState, useEffect } from 'react';

export function useDrift() {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 12, // -6 to +6
        y: (Math.random() - 0.5) * 12,
      });
    }, 90000); // 90 seconds

    return () => clearInterval(interval);
  }, []);

  return drift;
}

