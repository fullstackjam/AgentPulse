interface DeltaBadgeProps {
  value: number;
  showZero?: boolean;
}

export function DeltaBadge({ value, showZero = false }: DeltaBadgeProps) {
  if (value === 0 && !showZero) {
    return <span className="text-gray-600">-</span>;
  }

  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-sm ${
        isPositive
          ? "text-emerald-400"
          : isNegative
            ? "text-red-400"
            : "text-gray-500"
      }`}
    >
      {isPositive && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {isNegative && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {Math.abs(value).toLocaleString()}
    </span>
  );
}
