import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MODULES_FILE = path.join(DATA_DIR, 'modules.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize modules file if it doesn't exist
if (!fs.existsSync(MODULES_FILE)) {
  fs.writeFileSync(MODULES_FILE, JSON.stringify({}, null, 2));
}

export function saveModule(moduleData: any) {
  // Read existing data
  const existingData = JSON.parse(fs.readFileSync(MODULES_FILE, 'utf-8'));
  
  // Merge new module with existing data
  const updatedData = {
    ...existingData,
    ...moduleData
  };
  
  // Save to file
  fs.writeFileSync(MODULES_FILE, JSON.stringify(updatedData, null, 2));
  
  return updatedData;
}

export function getAllModules() {
  if (!fs.existsSync(MODULES_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(MODULES_FILE, 'utf-8'));
}