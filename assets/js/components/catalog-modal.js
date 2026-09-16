/* ==========================================================================
   CITY ELEGANCE — COMPOSANT MODAL CATALOGUE PRODUITS
   ========================================================================== */

import { state } from '../state.js';

export function initCatalogModal() {
  const modal = document.getElementById('catalog-modal');
  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('catalog-search-input');
  const btnClose = document.getElementById('btn-close-catalog');
  const btnOpenHeader = document.getElementById('btn-open-catalog');

  if (!modal || !catalogGrid) return;

  // Rendu de la grille des articles du catalogue
  function renderGrid(query = '') {
    const catalog = state.catalog;
    const filtered = catalog.filter(p => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:2rem; color:var(--color-text-muted);">Aucun article trouvé dans le catalogue.</p>`;
      return;
    }

    catalogGrid.innerHTML = filtered.map(prod => `
      <div class="catalog-item-card">
        <img src="${prod.image}" alt="${escapeHTML(prod.name)}" class="catalog-item-img">
        <div style="font-weight:700; font-size:0.875rem;">${escapeHTML(prod.name)}</div>
        <div style="font-size:0.8rem; font-weight:800; color:var(--color-primary);">${prod.priceXOF.toLocaleString('fr-FR')} FCFA</div>
        <div style="font-size:0.75rem; color:var(--color-text-muted);">Tailles : ${prod.sizes.join(', ')}</div>
        <button class="btn btn-secondary btn-sm insert-prod-btn" data-prod-id="${prod.id}" style="margin-top:auto; font-size:0.75rem; padding:0.35rem 0.5rem;">
          📋 Insérer dans la réponse
        </button>
      </div>
    `).join('');

    // Insertion directe des détails du produit dans la réponse suggérée
    document.querySelectorAll('.insert-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const product = catalog.find(p => p.id === pId);
        if (product) {
          const responseInput = document.getElementById('ai-response-input');
          if (responseInput) {
            responseInput.value += `\n📌 ${product.name} (Prix: ${product.priceXOF.toLocaleString('fr-FR')} FCFA, Tailles: ${product.sizes.join('/')}).`;
          }
          modal.classList.remove('active');
        }
      });
    });
  }

  // Écouteurs d'ouverture et de fermeture du modal
  if (btnOpenHeader) {
    btnOpenHeader.addEventListener('click', () => {
      modal.classList.add('active');
      renderGrid();
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderGrid(e.target.value);
    });
  }

  renderGrid();
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
