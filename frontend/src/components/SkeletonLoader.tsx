export default function SkeletonLoader({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14
      }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: 16 }}>
          <div
            className="skeleton"
            style={{ height: 14, width: '70%', marginBottom: 12 }}
          />
          <div
            className="skeleton"
            style={{ height: 10, width: '100%', marginBottom: 8 }}
          />
          <div
            className="skeleton"
            style={{ height: 10, width: '85%', marginBottom: 16 }}
          />
          <div
            className="skeleton"
            style={{ height: 22, width: '40%' }}
          />
        </div>
      ))}
    </div>
  )
}
