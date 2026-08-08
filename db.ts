import fs from 'fs';
import path from 'path';
import { ALL_SERVICES } from './src/data/servicesData.js';

const DB_PATH = path.join(process.cwd(), 'db.json');

export function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      services: ALL_SERVICES,
      websiteLive: true
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function saveDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
