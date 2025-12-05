interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
}

export function CircularTimer({ timeLeft, totalTime, size = 80 }: CircularTimerProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 60) return "#FC532E";
    if (percentage > 40) return "#facf0a"; 
    return "#a90708";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">
          0:{timeLeft.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}