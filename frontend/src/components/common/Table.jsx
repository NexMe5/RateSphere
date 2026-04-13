const Table = ({ columns, data, onSort, sortKey, sortOrder }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={col.sortable ? 'sortable' : ''}
              onClick={() => col.sortable && onSort?.(col.key)}
            >
              {col.label}
              {col.sortable && sortKey === col.key && (
                <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} className="table-empty">No records found</td></tr>
        ) : (
          data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
