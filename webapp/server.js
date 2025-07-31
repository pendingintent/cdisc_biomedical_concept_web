import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const CSV_PATH = path.resolve('../data/cdisc_biomedical_concepts_latest.csv');

// CSV columns based on the provided file
const csvHeader = [
  'package_date','short_name','bc_id','ncit_code','parent_bc_id','bc_categories','synonyms','result_scales','definition','system','system_name','code','dec_id','ncit_dec_code','dec_label','data_type','example_set'
];

// Append a new row to the CSV file
app.post('/api/entry', async (req, res) => {
  const entry = req.body;
  // Validate required fields
  // Only require fields that are not optional
  const optionalFields = [
    'dec_id', 'ncit_dec_code', 'dec_label', 'data_type', 'example_set',
    'synonyms', 'result_scales', 'system', 'system_name', 'code'
  ];
  for (const col of csvHeader) {
    if (optionalFields.includes(col)) continue;
    if (!(col in entry) || entry[col] === '') {
      return res.status(400).json({ error: `Missing field: ${col}` });
    }
  }
  // Check for duplicates before writing
  try {
    // Read existing CSV data
    let existingRows = [];
    if (fs.existsSync(CSV_PATH)) {
      const csvData = fs.readFileSync(CSV_PATH, 'utf8');
      const lines = csvData.split('\n').filter(line => line.trim() !== '');
      if (lines.length > 1) {
        const headers = lines[0].split(',');
        existingRows = lines.slice(1).map(line => {
          const values = line.split(',');
          const row = {};
          headers.forEach((h, i) => { row[h] = values[i]; });
          return row;
        });
      }
    }
    // Check for duplicate
    const isDuplicate = existingRows.some(row =>
      row['parent_bc_id'] === entry['parent_bc_id'] && row['dec_id'] === entry['dec_id']
    );
    if (isDuplicate) {
      return res.status(409).json({ error: 'Duplicate entry: parent_bc_id and dec_id combination already exists.' });
    }
    // Write to CSV
    const csvWriter = createObjectCsvWriter({
      path: CSV_PATH,
      header: csvHeader.map(h => ({ id: h, title: h })),
      append: true
    });
    await csvWriter.writeRecords([entry]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// API to get all entries in the CSV as JSON
app.get('/api/entries', (req, res) => {
  if (!fs.existsSync(CSV_PATH)) {
    return res.json([]);
  }
  const csvData = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return res.json([]);
  }
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i]; });
    return row;
  });
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
