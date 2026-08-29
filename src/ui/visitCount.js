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
    await fetch(`${WORKER_BASE_URL}/api/visit`, { method: 'POST' });
  } catch {
  }
}

export function initVisitCount() {
  const el = document.getElementById('visitCount');
  if (!el) return;


  fetchCurrentTotal().then((visits) => {
    if (visits !== null) el.textContent = visits;
  });

  setTimeout(() => {
    registerVisit();
  }, DWELL_DELAY_MS);
}