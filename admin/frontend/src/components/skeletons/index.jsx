export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[...Array(columns)].map((_, j) => (
            <div
              key={j}
              className="h-6 bg-dark-800 rounded animate-pulse flex-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-dark-800 rounded mb-4 w-1/2"></div>
      <div className="h-8 bg-dark-800 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-dark-800 rounded w-2/3"></div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-dark-800 rounded mb-2 w-3/4"></div>
          <div className="h-8 bg-dark-800 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-8 bg-dark-800 rounded"></div>
      </div>
    </div>
  );
}
