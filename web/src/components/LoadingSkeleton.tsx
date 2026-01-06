export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>

      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        <div className="skeleton h-12" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-16 mt-px" />
        ))}
      </div>
    </div>
  );
}
