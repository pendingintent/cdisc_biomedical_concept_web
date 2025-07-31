import React, { useState } from 'react';

const csvHeader = [
  'package_date','short_name','bc_id','ncit_code','parent_bc_id','bc_categories','synonyms','result_scales','definition','system','system_name','code','dec_id','ncit_dec_code','dec_label','data_type','example_set'
];

const initialState = Object.fromEntries(csvHeader.map(h => [h, '']));

export default function DataEntryForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    const res = await fetch('http://localhost:4000/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setStatus('Entry saved!');
      setForm(initialState);
    } else {
      const err = await res.json();
      setStatus('Error: ' + err.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#fafbfc' }}>
      <h2>CDISC Biomedical Concepts Data Entry</h2>
      {csvHeader.map(col => {
        const optionalFields = [
          'dec_id', 'ncit_dec_code', 'dec_label', 'data_type', 'example_set',
          'synonyms', 'result_scales', 'system', 'system_name', 'code'
        ];
        return (
          <div key={col} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: 500 }}>
              {col.replace(/_/g, ' ')}
              <input
                name={col}
                value={form[col]}
                onChange={handleChange}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
                required={!optionalFields.includes(col)}
              />
              {optionalFields.includes(col) && (
                <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>(optional)</span>
              )}
            </label>
          </div>
        );
      })}
      <button type="submit" style={{ padding: '8px 20px', fontWeight: 600, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Submit</button>
      <div style={{ marginTop: 16, color: status.startsWith('Error') ? 'red' : 'green' }}>{status}</div>
    </form>
  );
}
