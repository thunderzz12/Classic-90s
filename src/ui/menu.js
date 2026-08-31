// shell for menu dropdown and its modals

import { onChangelogOpen } from './changelog.js';

function wireModal(modalId, closeBtnId) {
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);
  if (!modal) return { open: () => {}, close: () => {} };

  const close = () => modal.classList.remove('is-open');
  const open = () => modal.classList.add('is-open');

  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  return { open, close };
}

let shortcutsModal;
let changelogModal;

// ? keybind exported
export function openShortcutsModal() {
  shortcutsModal?.open();
}

export function initMenu() {
  const menuBtn = document.getElementById('btnMenu');
  const dropdown = document.getElementById('menuDropdown');
  if (!menuBtn || !dropdown) return;

  shortcutsModal = wireModal('shortcutsModal', 'shortcutsModalClose');
  changelogModal = wireModal('changelogModal', 'changelogModalClose');

  const closeDropdown = () => dropdown.classList.remove('is-open');

  menuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.classList.toggle('is-open');
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && event.target !== menuBtn) {
      closeDropdown();
    }
  });

  document.getElementById('menuShortcuts')?.addEventListener('click', () => {
    closeDropdown();
    shortcutsModal.open();
  });

  document.getElementById('menuChangelog')?.addEventListener('click', (event) => {
    event.preventDefault();
    closeDropdown();
    changelogModal.open();
    onChangelogOpen();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDropdown();
      shortcutsModal.close();
      changelogModal.close();
    }
  });
}