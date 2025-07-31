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
  // Write to CSV
  const csvWriter = createObjectCsvWriter({
    path: CSV_PATH,
    header: csvHeader.map(h => ({ id: h, title: h })),
    append: true
  });
  try {
    await csvWriter.writeRecords([entry]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
