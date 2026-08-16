import { WORKER_BASE_URL } from '../config.js';

const HEARTBEAT_INTERVAL_MS = 8000;
const FAST_RETRY_MS = 2000;
const SESSION_KEY = 'chaiTapri.sessionId';



function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function sendHeartbeat(sessionId) {
  try {
    const response = await fetch(`${WORKER_BASE_URL}/api/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const { count } = await response.json();
    return count;
  } catch {
    return null;
  }
}

export function initListenerCount() {
  const el = document.getElementById('listenerNumber');
  if (!el) return;

  const sessionId = getSessionId();
  let hasSucceededOnce = false;

  const update = async () => {
    const count = await sendHeartbeat(sessionId);
    if (count !== null) {
      el.textContent = count;
      hasSucceededOnce = true;
    }

    if (!hasSucceededOnce) {
      setTimeout(update, FAST_RETRY_MS);
    }
  };

  update();
  setInterval(update, HEARTBEAT_INTERVAL_MS);
}