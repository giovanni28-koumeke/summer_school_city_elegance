/* ==========================================================================
   CITY ELEGANCE — MAIN APPLICATION ENTRY POINT & ROUTER
   ========================================================================== */

import { state } from './state.js';
import { StorageService } from './services/storage-service.js';
import { initInboxView } from './components/inbox-view.js';
import { initChatView } from './components/chat-view.js';
import { initCatalogModal } from './components/catalog-modal.js';
import { initAnalyticsView } from './components/analytics-view.js';
import { initDemoPanel } from './components/demo-panel.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing City Elegance Application...');

  // 1. Initialize Components
  initInboxView();
  initChatView();
  initCatalogModal();
  initAnalyticsView();
  initDemoPanel();

  // 2. Setup App Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewSections = document.querySelectorAll('.view-section');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewName = tab.getAttribute('data-view');
      state.setActiveView(viewName);
    });
  });

  state.addEventListener('view-changed', (e) => {
    const activeView = e.detail.view;
    navTabs.forEach(tab => {
      if (tab.getAttribute('data-view') === activeView) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    viewSections.forEach(section => {
      if (section.id === `view-${activeView}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  });

  // 3. Setup Settings View (Claude API Key)
  const apiKeyInput = document.getElementById('api-key-input');
  const modelSelect = document.getElementById('model-select');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const btnResetData = document.getElementById('btn-reset-demo-data');

  if (apiKeyInput && modelSelect) {
    const currentSettings = StorageService.getSettings();
    apiKeyInput.value = currentSettings.apiKey || '';
    modelSelect.value = currentSettings.selectedModel || 'local-fallback';

    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        StorageService.saveSettings({
          apiKey: apiKeyInput.value.trim(),
          selectedModel: modelSelect.value
        });
        showToast("Paramètres IA enregistrés avec succès !");
      });
    }

    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm("Voulez-vous réinitialiser toutes les données de démo au statut d'origine ?")) {
          StorageService.resetAllData();
          window.location.reload();
        }
      });
    }
  }

  // 4. Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registered successfully', reg.scope))
      .catch(err => console.warn('[PWA] Service Worker registration failed', err));
  }
});

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
