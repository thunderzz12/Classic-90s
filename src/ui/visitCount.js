import { WORKER_BASE_URL } from '../config.js';
const DWELL_DELAY_MS = 6000;

export function initVisitCount() {
  const el = document.getElementById('visitCount');

  setTimeout(async () => {
    try {
      const response = await fetch(`${WORKER_BASE_URL}/api/visit`, { method: 'POST' });
      const { visits } = await response.json();
      if (el) el.textContent = `${visits} visits`;
    } catch {
    }
  }, DWELL_DELAY_MS);
}