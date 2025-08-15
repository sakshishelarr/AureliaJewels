export default function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden luxury-shadow">
          <div className="aspect-square bg-gray-200 shimmer"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3 shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  )
}