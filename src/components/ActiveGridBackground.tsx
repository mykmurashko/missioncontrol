import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Dot {
  x: number;
  y: number;
  clusterId: number | null; // ID of the cluster this dot belongs to, or null if not in a cluster
}

interface Cluster {
  centerX: number;
  centerY: number;
  radius: number; // Radius of influence for this cluster
  activationOffset: number; // Random time offset for when this cluster first activates (ms)
  cycleDuration: number; // Duration of one full activation cycle (ms)
}

export function ActiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const clustersRef = useRef<Cluster[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const { theme } = useTheme();

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Constants
    const GRID_SPACING = 25;
    const BASE_RADIUS = 1; // Tiny grey dots
    const MAX_RADIUS = 3; // Slightly bigger when in an active cluster
    const BASE_COLOR = theme === 'dark' ? '#404040' : '#E5E5E5';
    const CLUSTER_RADIUS = 200; // Radius of influence for each cluster
    const CLUSTER_COUNT = 8; // Number of clusters on screen
    const CYCLE_DURATION_MIN = 5000; // Minimum cycle duration in ms
    const CYCLE_DURATION_MAX = 8000; // Maximum cycle duration in ms
    const ACTIVATION_OFFSET_MAX = 12000; // Max random offset before first activation

    // Initialize clusters
    const initializeClusters = (width: number, height: number): Cluster[] => {
      const clusters: Cluster[] = [];
      for (let i = 0; i < CLUSTER_COUNT; i++) {
        clusters.push({
          centerX: Math.random() * width,
          centerY: Math.random() * height,
          radius: CLUSTER_RADIUS,
          activationOffset: Math.random() * ACTIVATION_OFFSET_MAX,
          cycleDuration: CYCLE_DURATION_MIN + Math.random() * (CYCLE_DURATION_MAX - CYCLE_DURATION_MIN),
        });
      }
      return clusters;
    };

    // Initialize dots grid and assign them to clusters
    const initializeDots = (width: number, height: number, clusters: Cluster[]): Dot[] => {
      const dots: Dot[] = [];
      const cols = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * GRID_SPACING;
          const y = row * GRID_SPACING;
          
          // Find which cluster (if any) this dot belongs to
          let clusterId: number | null = null;
          for (let i = 0; i < clusters.length; i++) {
            const cluster = clusters[i];
            const dx = x - cluster.centerX;
            const dy = y - cluster.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= cluster.radius) {
              clusterId = i;
              break; // Dot can only belong to one cluster
            }
          }

          dots.push({
            x,
            y,
            clusterId,
          });
        }
      }

      return dots;
    };

    // Draw a single dot
    const drawDot = (
      ctx: CanvasRenderingContext2D,
      dot: Dot,
      elapsedTime: number,
      clusters: Cluster[]
    ) => {
      // Default: small grey dot
      let radius = BASE_RADIUS;
      let colorProgress = 0; // 0 = grey, 1 = orange
      
      // Base grey color
      const r1 = parseInt(BASE_COLOR.slice(1, 3), 16);
      const g1 = parseInt(BASE_COLOR.slice(3, 5), 16);
      const b1 = parseInt(BASE_COLOR.slice(5, 7), 16);
      
      // Orange color
      const r2 = 255;
      const g2 = 77;
      const b2 = 0;
      
      let r = r1;
      let g = g1;
      let b = b1;
      let a = 0.4; // Base opacity

      // If dot belongs to a cluster, check if cluster is active
      if (dot.clusterId !== null) {
        const cluster = clusters[dot.clusterId];
        const timeSinceStart = elapsedTime - cluster.activationOffset;
        
        if (timeSinceStart >= 0) {
          // Calculate position in current cycle (0 to 1)
          const cyclePosition = (timeSinceStart % cluster.cycleDuration) / cluster.cycleDuration;
          
          // Smooth pulse: grow and shrink using sine wave
          // This creates a smooth in-and-out breathing effect
          const pulse = Math.sin(cyclePosition * Math.PI * 2);
          const sizeProgress = (pulse + 1) / 2; // Normalize from [-1, 1] to [0, 1]
          
          // Calculate distance from cluster center for falloff effect
          const dx = dot.x - cluster.centerX;
          const dy = dot.y - cluster.centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const distanceRatio = Math.min(1, distance / cluster.radius);
          
          // Apply size increase with distance falloff (dots closer to center pulse more)
          const falloff = 1 - distanceRatio; // 1 at center, 0 at edge
          radius = BASE_RADIUS + sizeProgress * (MAX_RADIUS - BASE_RADIUS) * falloff;
          
          // Color progress follows the same pulse pattern
          colorProgress = sizeProgress * falloff;
          
          // Interpolate color from grey to orange
          r = Math.round(r1 + (r2 - r1) * colorProgress);
          g = Math.round(g1 + (g2 - g1) * colorProgress);
          b = Math.round(b1 + (b2 - b1) * colorProgress);
          
          // Opacity: quite transparent orange (lower opacity)
          a = 0.4 + (0.25 - 0.4) * colorProgress; // Fade to more transparent as it turns orange
        }
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

      // Draw the dot
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Main animation loop
    const animate = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Don't animate if no dots are initialized
      if (dotsRef.current.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Initialize start time on first frame
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      // Calculate elapsed time in milliseconds
      const elapsedTime = timestamp - startTimeRef.current;

      // Clear canvas (transparent)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all dots
      dotsRef.current.forEach((dot) => {
        drawDot(ctx, dot, elapsedTime, clustersRef.current);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set canvas size (both attributes and CSS)
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Reinitialize clusters and dots for new size
      clustersRef.current = initializeClusters(width, height);
      dotsRef.current = initializeDots(width, height, clustersRef.current);
    };

    // Initialize on mount
    resizeCanvas();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Start animation loop after initialization
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

