/* ==========================================================================
   CITY ELEGANCE — COMPOSANT PROFIL ENTREPRISE MULTI-PME (PALETTE D'ORIGINE)
   ========================================================================== */

import { state } from '../state.js';

export function initProfileView() {
  const container = document.getElementById('view-profile');
  if (!container) return;

  function renderProfile() {
    const session = state.currentSession;
    if (!session) {
      container.innerHTML = `<p style="padding:2rem; text-align:center; color:var(--color-text-muted);">Veuillez vous connecter pour accéder au profil entreprise.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="settings-wrapper">
        <div class="settings-header">
          <h2>🏢 Profil de l'Entreprise</h2>
          <p class="settings-intro">Gérez les coordonnées et les informations de votre PME tout en conservant la charte graphique d'origine.</p>
        </div>

        <div class="card settings-card">
          <form id="form-company-profile">
            <div class="form-group">
              <label for="prof-company-name">Nom de l'Entreprise</label>
              <input type="text" id="prof-company-name" class="form-control" value="${escapeHTML(session.companyName || '')}" required>
            </div>

            <div class="form-group">
              <label for="prof-industry">Secteur d'Activité</label>
              <select id="prof-industry" class="form-control" required>
                <option value="Prêt-à-porter & Chaussures" ${session.industry === 'Prêt-à-porter & Chaussures' ? 'selected' : ''}>Prêt-à-porter & Chaussures 👗👠</option>
                <option value="Électronique & High-Tech" ${session.industry === 'Électronique & High-Tech' ? 'selected' : ''}>Électronique & High-Tech 📱💻</option>
                <option value="Cosmétique & Beauté" ${session.industry === 'Cosmétique & Beauté' ? 'selected' : ''}>Cosmétique & Beauté 💄✨</option>
                <option value="Restauration & Alimentation" ${session.industry === 'Restauration & Alimentation' ? 'selected' : ''}>Restauration & Alimentation 🍔🍹</option>
                <option value="Services & Artisanat" ${session.industry === 'Services & Artisanat' ? 'selected' : ''}>Services & Artisanat 🛠️🎨</option>
                <option value="Autre Commerce" ${session.industry === 'Autre Commerce' ? 'selected' : ''}>Autre Commerce 📦</option>
              </select>
            </div>

            <div class="form-group">
              <label for="prof-phone">Numéro de Téléphone / WhatsApp</label>
              <input type="text" id="prof-phone" class="form-control" value="${escapeHTML(session.phone || '+228 90 00 00 00')}">
            </div>

            <div class="form-group">
              <label for="prof-city">Ville et Quartier</label>
              <input type="text" id="prof-city" class="form-control" value="${escapeHTML(session.city || 'Lomé, Togo')}">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    attachProfileEvents();
  }

  function attachProfileEvents() {
    const form = document.getElementById('form-company-profile');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const companyName = document.getElementById('prof-company-name').value.trim();
      const industry = document.getElementById('prof-industry').value;
      const phone = document.getElementById('prof-phone').value.trim();
      const city = document.getElementById('prof-city').value.trim();

      const res = state.updateCompanyProfile({
        companyName,
        industry,
        phone,
        city
      });

      if (res && res.success) {
        showToast("Profil entreprise mis à jour avec succès ! 🎯");
      }
    });
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

  state.addEventListener('state-changed', renderProfile);
  state.addEventListener('view-changed', (e) => {
    if (e.detail.view === 'profile') {
      renderProfile();
    }
  });

  renderProfile();
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
