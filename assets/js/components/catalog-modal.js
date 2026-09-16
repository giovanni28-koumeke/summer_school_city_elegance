/* ==========================================================================
   CITY ELEGANCE — COMPOSANT MODAL CATALOGUE PRODUITS & GESTION PME
   ========================================================================== */

import { state } from '../state.js';

export function initCatalogModal() {
  const modal = document.getElementById('catalog-modal');
  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('catalog-search-input');
  const btnClose = document.getElementById('btn-close-catalog');
  const btnOpenHeader = document.getElementById('btn-open-catalog');
  const btnToggleAdd = document.getElementById('btn-toggle-add-product');
  const formContainer = document.getElementById('product-form-container');
  const productForm = document.getElementById('product-form');
  const formTitle = document.getElementById('product-form-title');
  const btnCancelForm = document.getElementById('btn-cancel-product-form');

  if (!modal || !catalogGrid) return;

  function showForm(prod = null) {
    if (!formContainer) return;
    formContainer.classList.remove('hidden');

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;

    if (prod) {
      if (formTitle) formTitle.textContent = `✏️ Éditer le produit "${prod.name}"`;
      document.getElementById('prod-edit-id').value = prod.id;
      document.getElementById('prod-name').value = prod.name || '';
      document.getElementById('prod-category').value = prod.category || 'habits';
      document.getElementById('prod-price').value = prod.priceXOF || '';
      document.getElementById('prod-sizes').value = prod.sizes ? prod.sizes.join(', ') : '';
      document.getElementById('prod-delivery').value = prod.deliveryDelay || '24h à Lomé (1000 FCFA)';
      document.getElementById('prod-image').value = prod.image || '';
    } else {
      if (formTitle) formTitle.textContent = '➕ Ajouter un nouveau produit au catalogue';
      if (productForm) productForm.reset();
      document.getElementById('prod-edit-id').value = '';
      document.getElementById('prod-delivery').value = '24h à Lomé (1000 FCFA)';
    }
  }

  function hideForm() {
    if (formContainer) formContainer.classList.add('hidden');
    if (productForm) productForm.reset();
    document.getElementById('prod-edit-id').value = '';
  }

  // Rendu de la grille des articles du catalogue
  function renderGrid(query = '') {
    const catalog = state.catalog;
    const filtered = catalog.filter(p => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || 
             (p.category || '').toLowerCase().includes(q) || 
             (p.description || '').toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:2rem; color:var(--color-text-muted);">
          <p>Aucun article trouvé dans le catalogue.</p>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = filtered.map(prod => `
      <div class="catalog-item-card" data-id="${prod.id}">
        <img src="${prod.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300'}" alt="${escapeHTML(prod.name)}" class="catalog-item-img">
        
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-top:0.2rem;">
          <div style="font-weight:700; font-size:0.875rem; line-height:1.2;">${escapeHTML(prod.name)}</div>
          <span class="badge" style="font-size:0.65rem; background:var(--color-primary-light); color:var(--color-primary); padding:0.1rem 0.4rem; border-radius:4px; font-weight:700;">
            ${escapeHTML(prod.category)}
          </span>
        </div>

        <div style="font-size:0.875rem; font-weight:800; color:var(--color-primary); margin:0.2rem 0;">
          ${(prod.priceXOF || 0).toLocaleString('fr-FR')} FCFA
        </div>

        <div style="font-size:0.75rem; color:var(--color-text-muted);">
          Tailles : ${prod.sizes ? prod.sizes.join(', ') : 'Unique'}
        </div>

        <div style="display:flex; gap:0.35rem; margin-top:auto; padding-top:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm insert-prod-btn" data-prod-id="${prod.id}" style="flex:1; font-size:0.725rem; padding:0.3rem 0.4rem;" title="Insérer dans la réponse">
            📋 Réponse
          </button>
          <button class="btn btn-secondary btn-sm edit-prod-btn" data-prod-id="${prod.id}" style="font-size:0.725rem; padding:0.3rem 0.4rem;" title="Éditer le produit">
            ✏️
          </button>
          <button class="btn btn-danger btn-sm delete-prod-btn" data-prod-id="${prod.id}" style="font-size:0.725rem; padding:0.3rem 0.4rem;" title="Supprimer le produit">
            🗑️
          </button>
        </div>
      </div>
    `).join('');

    // Attachement des gestionnaires d'événements
    attachGridEvents();
  }

  function attachGridEvents() {
    // 1. Insertion directe des détails du produit dans la réponse suggérée
    document.querySelectorAll('.insert-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const product = state.catalog.find(p => p.id === pId);
        if (product) {
          const responseInput = document.getElementById('ai-response-input');
          if (responseInput) {
            responseInput.value += `\n📌 ${product.name} (Prix: ${product.priceXOF.toLocaleString('fr-FR')} FCFA, Tailles: ${product.sizes.join('/')}).`;
          }
          modal.classList.remove('active');
          showToast(`Produit "${product.name}" inséré dans la réponse !`);
        }
      });
    });

    // 2. Édition d'un produit
    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const product = state.catalog.find(p => p.id === pId);
        if (product) {
          showForm(product);
        }
      });
    });

    // 3. Suppression d'un produit
    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const product = state.catalog.find(p => p.id === pId);
        if (product && confirm(`Voulez-vous vraiment supprimer le produit "${product.name}" du catalogue ?`)) {
          state.deleteProduct(pId);
          showToast(`Produit "${product.name}" supprimé avec succès.`);
        }
      });
    });
  }

  // Écouteur pour la soumission du formulaire d'ajout / modification produit
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('prod-edit-id').value;
      const name = document.getElementById('prod-name').value.trim();
      const category = document.getElementById('prod-category').value;
      const priceXOF = document.getElementById('prod-price').value;
      const sizes = document.getElementById('prod-sizes').value.trim();
      const deliveryDelay = document.getElementById('prod-delivery').value.trim();
      const image = document.getElementById('prod-image').value.trim();

      if (editId) {
        state.updateProduct(editId, { name, category, priceXOF, sizes, deliveryDelay, image });
        showToast(`Produit "${name}" mis à jour avec succès !`);
      } else {
        state.addProduct({ name, category, priceXOF, sizes, deliveryDelay, image });
        showToast(`Nouveau produit "${name}" ajouté au catalogue !`);
      }

      if (searchInput) searchInput.value = '';
      hideForm();
      renderGrid('');
    });
  }

  if (btnToggleAdd) {
    btnToggleAdd.addEventListener('click', () => {
      if (formContainer && formContainer.classList.contains('hidden')) {
        showForm();
      } else {
        hideForm();
      }
    });
  }

  if (btnCancelForm) {
    btnCancelForm.addEventListener('click', hideForm);
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
      hideForm();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderGrid(e.target.value);
    });
  }

  state.addEventListener('state-changed', () => {
    if (modal.classList.contains('active')) {
      renderGrid(searchInput ? searchInput.value : '');
    }
  });

  renderGrid();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
