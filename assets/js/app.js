/* ==========================================================================
   CITY ELEGANCE & PME — POINT D'ENTRÉE ET ROUTEUR MULTI-ENTREPRISES
   ========================================================================== */

import { state } from './state.js';
import { StorageService } from './services/storage-service.js';
import { AuthService } from './services/auth-service.js';
import { initLoginView } from './components/login-view.js';
import { initProfileView } from './components/profile-view.js';
import { initBurgerMenu } from './components/burger-menu.js';
import { initInboxView } from './components/inbox-view.js';
import { initChatView } from './components/chat-view.js';
import { initCatalogModal } from './components/catalog-modal.js';
import { initAnalyticsView } from './components/analytics-view.js';
import { initDemoPanel } from './components/demo-panel.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initialisation de l\'application PME Omnicanale...');

  // 1. Initialisation de l'authentification et de la session active
  AuthService.init();
  state.loadState();

  // 2. Initialisation de tous les composants UI et écouteurs d'événements
  initLoginView();
  initProfileView();
  initBurgerMenu();
  initInboxView();
  initChatView();
  initCatalogModal();
  initAnalyticsView();
  initDemoPanel();

  // 3. Mise à jour de l'interface selon le statut d'authentification
  function updateAuthUI() {
    const session = state.currentSession;
    const authElements = document.querySelectorAll('.auth-required');
    const headerTitle = document.getElementById('header-company-title');
    const headerSubtitle = document.getElementById('header-company-subtitle');

    if (!session) {
      // Utilisateur non connecté -> afficher la vue login
      authElements.forEach(el => el.classList.add('hidden'));
      if (headerTitle) headerTitle.textContent = 'Inbox Omnicanale PME';
      if (headerSubtitle) headerSubtitle.textContent = 'Connexion & Accès Entreprise';
      state.setActiveView('login');
    } else {
      // Utilisateur connecté -> afficher les boutons et le menu burger
      authElements.forEach(el => el.classList.remove('hidden'));
      if (headerTitle) headerTitle.textContent = session.companyName || 'Mon Entreprise';
      if (headerSubtitle) headerSubtitle.textContent = `${session.industry || 'PME'} • ${session.city || 'Lomé, Togo'}`;

      // Si l'utilisateur est sur login mais possède une session, le diriger sur inbox
      if (state.activeView === 'login') {
        state.setActiveView('inbox');
      }
    }
  }

  // 4. Gestion de la déconnexion
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment vous déconnecter de votre espace entreprise ?')) {
        state.logout();
        showToast('Vous avez été déconnecté avec succès.');
      }
    });
  }

  // 5. Bascule dynamique des vues selon state.activeView
  const viewSections = document.querySelectorAll('.view-section');
  state.addEventListener('view-changed', (e) => {
    const activeView = e.detail.view;
    viewSections.forEach(section => {
      if (section.id === `view-${activeView}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  });

  // Écouter les changements d'état global
  state.addEventListener('state-changed', updateAuthUI);
  
  // Forcer la notification initiale pour remplir l'inbox et activer les réactivités des boutons
  state.notifyChange();
  updateAuthUI();

  // 6. Configuration de l'API IA
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

  // 7. Enregistrement du Service Worker PWA
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
