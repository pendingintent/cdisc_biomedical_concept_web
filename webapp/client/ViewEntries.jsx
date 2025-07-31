
import React, { useEffect, useState } from 'react';


export default function ViewEntries() {
  const [rows, setRows] = useState([]);
  const [header, setHeader] = useState([]);
  const [error, setError] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000'}/api/entries`)
      .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
      .then(data => {
        if (data.length > 0) {
          setHeader(Object.keys(data[0]));
          setRows(data);
        } else {
          setHeader([]);
          setRows([]);
        }
      })
      .catch(e => setError('Failed to load entries: ' + e.message));
  }, []);

  // Filter and sort rows
  const filteredRows = React.useMemo(() => {
    if (!search) return rows;
    const lower = search.toLowerCase();
    return rows.filter(row =>
      header.some(h => String(row[h] || '').toLowerCase().includes(lower))
    );
  }, [rows, header, search]);

  const sortedRows = React.useMemo(() => {
    if (!sortCol) return filteredRows;
    const sorted = [...filteredRows].sort((a, b) => {
      if (a[sortCol] === b[sortCol]) return 0;
      if (a[sortCol] === undefined) return 1;
      if (b[sortCol] === undefined) return -1;
      // Special case: date sort for package_date
      if (sortCol === 'package_date') {
        const aDate = Date.parse(a[sortCol]);
        const bDate = Date.parse(b[sortCol]);
        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sortDir === 'asc' ? aDate - bDate : bDate - aDate;
        }
      }
      // Try numeric sort if possible
      const aNum = parseFloat(a[sortCol]);
      const bNum = parseFloat(b[sortCol]);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
      }
      // Fallback to string sort
      return sortDir === 'asc'
        ? String(a[sortCol]).localeCompare(String(b[sortCol]))
        : String(b[sortCol]).localeCompare(String(a[sortCol]));
    });
    return sorted;
  }, [filteredRows, sortCol, sortDir]);

  const handleSort = col => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return (
    <div style={{ maxWidth: '98vw', overflowX: 'auto', margin: '0 auto' }}>
      <h2>All Biomedical Concept Entries</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search entries..."
        style={{ marginBottom: 20, padding: 8, width: 320, maxWidth: '90%', border: '1px solid #bbb', borderRadius: 4 }}
      />
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            {header.map(h => (
              <th
                key={h}
                onClick={() => handleSort(h)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSort(h); }}
                style={{
                  border: '1px solid #ccc',
                  padding: 8,
                  background: '#f4f6fa',
                  fontWeight: 600,
                  cursor: 'pointer',
                  userSelect: 'none',
                  outline: 'none',
                  transition: 'background 0.2s',
                  maxWidth: h === 'example_set' ? 120 : undefined,
                  whiteSpace: h === 'example_set' ? 'nowrap' : undefined,
                  overflow: h === 'example_set' ? 'hidden' : undefined,
                  textOverflow: h === 'example_set' ? 'ellipsis' : undefined,
                }}
                className="sortable-header"
              >
                <span style={{ display: 'inline-block', width: '100%' }}>
                  {h.replace(/_/g, ' ')}
                  {sortCol === h && (
                    <span style={{ marginLeft: 6 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.id}>
              {header.map(h => (
                <td
                  key={h}
                  style={{
                    border: '1px solid #ccc',
                    padding: 8,
                    maxWidth: h === 'example_set' ? 120 : undefined,
                    whiteSpace: h === 'example_set' ? 'nowrap' : undefined,
                    overflow: h === 'example_set' ? 'hidden' : undefined,
                    textOverflow: h === 'example_set' ? 'ellipsis' : undefined,
                  }}
                  title={h === 'example_set' ? row[h] : undefined}
                >
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && !error && <div style={{ marginTop: 24 }}>No entries found.</div>}
      <style>{`
        .sortable-header:hover, .sortable-header:focus {
          background: #e3e8f0 !important;
        }
      `}</style>
    </div>
  );
}
