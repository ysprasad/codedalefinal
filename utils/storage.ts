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
  console.log("insavemodule");
  let existingData = getAllModules();
  console.log("baby3")
  if(Object.keys(existingData).length === 0){
    existingData={};
     console.log("upadahkdjchn")
  }
  // Merge new module with existing data
  const updatedData = {
    ...existingData,
    ...moduleData
  };
  console.log(updatedData);
  // Save to file
  fs.writeFileSync(MODULES_FILE, JSON.stringify(updatedData, null, 2));
  
  return updatedData;
}

export function getAllModules() {
  if (!fs.existsSync(MODULES_FILE)) {
    console.log("baby2")
    return {};
  }
  console.log("baby")
  const fileContent=fs.readFileSync(MODULES_FILE, 'utf-8');
  if(fileContent.trim()==="") return {}
  return JSON.parse(fileContent);
}