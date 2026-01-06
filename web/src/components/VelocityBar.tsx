interface VelocityBarProps {
  value: number;
  maxValue: number;
}

export function VelocityBar({ value, maxValue }: VelocityBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}
