interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  if (total === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      <span
        className="mono"
        style={{ fontSize: 13, color: "var(--text-muted)" }}
      >
        {total} task{total === 1 ? "" : "s"} · page {page} of {totalPages}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn btn-secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ← Prev
        </button>
        <button
          className="btn btn-secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
