import { WORKER_BASE_URL } from '../config.js';
const DWELL_DELAY_MS = 6000;

async function fetchCurrentTotal() {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/visits`);
    const { visits } = await response.json();
    return visits;
  } catch {
    return null;
  }
}
 
async function registerVisit() {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/visit`, { method: 'POST' });
    const { visits } = await response.json();
    return visits;
  } catch {
    return null;
  }
}

export function initVisitCount() {
  const el = document.getElementById('visitCount');
  if (!el) return;


  fetchCurrentTotal().then((visits) => {
    if (visits !== null) el.textContent = `${visits} visits`;
  });

  setTimeout(async () => {
    const visits = await registerVisit();
    if (visits !== null) el.textContent = `${visits} visits`;
  }, DWELL_DELAY_MS);
}