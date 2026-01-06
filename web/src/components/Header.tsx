interface HeaderProps {
  timestamp: string | null;
}

export function Header({ timestamp }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AgentPulse</h1>
          <p className="text-sm text-gray-500">
            AI Agent Adoption Tracker
          </p>
        </div>
      </div>

      {timestamp && (
        <p className="text-xs text-gray-600 mt-4">
          Last updated: {new Date(timestamp).toLocaleString()}
        </p>
      )}
    </header>
  );
}
