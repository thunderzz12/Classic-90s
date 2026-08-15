const VISIT_COUNT_KEY = 'chaiTapri.visitCount';
const HINT_DISABLED_KEY = 'chaiTapri.shuffleHintDisabled';
const SHOW_AFTER_VISIT = 2;

function getVisitCount() {
  const current = Number(localStorage.getItem(VISIT_COUNT_KEY) || 0);
  const next = current + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(next));
  return next;
}

export function initShuffleHint() {
  const hint = document.getElementById('shuffleHint');
  const okBtn = document.getElementById('shuffleHintOk');
  const neverBtn = document.getElementById('shuffleHintNever');
  if (!hint || !okBtn || !neverBtn) return;

  const visitCount = getVisitCount();
  const permanentlyDisabled = localStorage.getItem(HINT_DISABLED_KEY) === '1';

  if (visitCount < SHOW_AFTER_VISIT || permanentlyDisabled) return;

  const dismissForNow = () => {
    hint.classList.remove('is-visible');
  };

  const disableForever = () => {
    hint.classList.remove('is-visible');
    localStorage.setItem(HINT_DISABLED_KEY, '1');
  };

  setTimeout(() => hint.classList.add('is-visible'), 1500);

  okBtn.addEventListener('click', dismissForNow);
  neverBtn.addEventListener('click', disableForever);
}