import React from 'react';
import { createRoot } from 'react-dom/client';
import DataEntryForm from './DataEntryForm';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DataEntryForm />);
