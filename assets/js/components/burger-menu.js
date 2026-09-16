/* ==========================================================================
   CITY ELEGANCE — COMPOSANT MENU BURGER (NAVIGATION LATÉRALE PME)
   ========================================================================== */

import { state } from '../state.js';

export function initBurgerMenu() {
  const drawer = document.getElementById('burger-drawer');
  const btnOpenHeader = document.getElementById('btn-open-burger-menu');
  const btnClose = document.getElementById('btn-close-burger');
  const overlay = document.getElementById('burger-drawer-overlay');
  const menuNavLinks = document.querySelectorAll('.burger-nav-item');

  if (!drawer || !btnOpenHeader) return;

  // Ouvrir le menu burger
  function openMenu() {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le défilement d'arrière-plan
  }

  // Fermer le menu burger
  function closeMenu() {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Écouteurs d'événements d'ouverture / fermeture
  btnOpenHeader.addEventListener('click', openMenu);

  if (btnClose) {
    btnClose.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Touche Échap pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });

  // Navigation lors du clic sur un élément du menu
  menuNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const viewTarget = link.getAttribute('data-view');
      const isAction = link.getAttribute('data-action');

      if (viewTarget) {
        state.setActiveView(viewTarget);
        closeMenu();
      } else if (isAction === 'logout') {
        closeMenu();
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
          state.logout();
        }
      } else if (isAction === 'catalog-modal') {
        closeMenu();
        document.getElementById('catalog-modal')?.classList.add('active');
      }
    });
  });

  // Mise à jour de l'élément actif et des badges dans le menu burger
  function updateBurgerMenuUI() {
    const activeView = state.activeView;
    const session = state.currentSession;

    // Mise à jour de l'en-tête du menu burger avec le nom et le secteur de la PME
    const companyTitleEl = document.getElementById('burger-company-name');
    const companySubtitleEl = document.getElementById('burger-company-sub');

    if (session) {
      if (companyTitleEl) companyTitleEl.textContent = session.companyName || 'Mon Entreprise';
      if (companySubtitleEl) companySubtitleEl.textContent = `${session.industry || 'PME'} • ${session.city || 'Lomé, Togo'}`;
    }

    // Mise à jour du lien actif
    menuNavLinks.forEach(link => {
      const view = link.getAttribute('data-view');
      if (view === activeView) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mise à jour du compteur de nouveaux messages dans le menu burger
    const newCount = state.requests.filter(r => r.status === 'nouveau').length;
    const badgeEl = document.getElementById('burger-unread-count');
    if (badgeEl) {
      badgeEl.textContent = newCount;
      if (newCount > 0) {
        badgeEl.style.display = 'inline-flex';
      } else {
        badgeEl.style.display = 'none';
      }
    }
  }

  // Abonnement aux événements d'état
  state.addEventListener('state-changed', updateBurgerMenuUI);
  state.addEventListener('view-changed', updateBurgerMenuUI);

  updateBurgerMenuUI();
}
