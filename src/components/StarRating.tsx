import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type StarRatingProps = {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  size?: number;
};

export function StarRating({ value, max, onChange, size = 24 }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= display;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onMouseEnter={() => onChange && setHover(starValue)}
            onMouseLeave={() => onChange && setHover(null)}
            onClick={() => onChange?.(value === starValue ? 0 : starValue)}
            className={`transition-transform duration-150 ${
              onChange ? "cursor-pointer hover:scale-125" : "cursor-default"
            }`}
            aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                  : "text-slate-600"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({ value, duration = 800, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const startTime = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display}</span>;
}

type ScoreRingProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
};

export function ScoreRing({ score, size = 160, strokeWidth = 12 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const start = animatedScore;
    const diff = score - start;
    const startTime = performance.now();
    const duration = 1000;

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const band = getScoreBandForRing(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={band.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.1s linear",
            filter: `drop-shadow(0 0 6px ${band.color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white tabular-nums">{animatedScore}%</span>
      </div>
    </div>
  );
}

function getScoreBandForRing(score: number) {
  if (score >= 85) return { color: "#10b981" };
  if (score >= 70) return { color: "#14b8a6" };
  if (score >= 50) return { color: "#f59e0b" };
  if (score >= 30) return { color: "#f97316" };
  return { color: "#ef4444" };
}
