/* ==========================================================================
   CITY ELEGANCE — COMPOSANT VUE INBOX (LISTE DES DEMANDES, FILTRES ET SLA)
   ========================================================================== */

import { state } from '../state.js';

export function initInboxView() {
  const requestsListContainer = document.getElementById('requests-list');
  const searchInput = document.getElementById('search-input');
  const filterChips = document.querySelectorAll('.chip');
  const statusTabs = document.querySelectorAll('.status-tab');
  const unreadBadge = document.getElementById('unread-count-badge');
  const slaBanner = document.getElementById('sla-alert-banner');
  const slaCountSpan = document.getElementById('sla-count');

  if (!requestsListContainer) return;

  // Génération et rendu de la liste des demandes clients
  function renderList() {
    const filtered = state.getFilteredRequests();
    const allRequests = state.requests;

    // Mise à jour du compteur de nouveaux messages non lus
    const newCount = allRequests.filter(r => r.status === 'nouveau').length;
    if (unreadBadge) unreadBadge.textContent = newCount;

    // Mise à jour de la bannière d'alerte SLA (> 30 min sans réponse)
    const slaOverdueCount = allRequests.filter(r => r.slaOverdue).length;
    if (slaOverdueCount > 0) {
      slaBanner.classList.remove('hidden');
      slaCountSpan.textContent = slaOverdueCount;
    } else {
      slaBanner.classList.add('hidden');
    }

    if (filtered.length === 0) {
      requestsListContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
          <p>Aucune demande trouvée pour ces critères.</p>
        </div>
      `;
      return;
    }

    requestsListContainer.innerHTML = filtered.map(req => {
      const isActive = req.id === state.selectedRequestId ? 'active' : '';
      const isSLA = req.slaOverdue ? 'sla-overdue' : '';
      const channelClass = `badge-${req.channel}`;

      const formattedTime = formatTime(req.timestamp);
      const urgencyLabel = getUrgencyLabel(req.urgencyLevel);
      const urgencyClass = `urgency-${req.urgencyLevel}`;
      const statusLabel = getStatusLabel(req.status);

      return `
        <div class="request-card ${isActive} ${isSLA}" data-id="${req.id}">
          <div class="card-header-row">
            <div class="customer-meta">
              <span class="channel-icon-badge ${channelClass}">
                ${req.channel === 'whatsapp' ? 'WA' : req.channel === 'facebook' ? 'FB' : 'IG'}
              </span>
              <span class="customer-name">${escapeHTML(req.customerName)}</span>
            </div>
            <span class="request-time">${formattedTime}</span>
          </div>

          <div class="card-preview">
            ${escapeHTML(req.lastMessage)}
          </div>

          <div class="card-footer-row">
            <span class="urgency-badge ${urgencyClass}">${urgencyLabel}</span>
            <span class="status-pill status-${req.status}">${statusLabel}</span>
          </div>
        </div>
      `;
    }).join('');

    // Gestion de la sélection d'une carte au clic
    document.querySelectorAll('.request-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        state.setSelectedRequestId(id);
      });
    });
  }

  // Écouteurs d'événements pour la recherche et les filtres
  searchInput.addEventListener('input', (e) => {
    state.setFilter('searchQuery', e.target.value);
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const channel = chip.getAttribute('data-filter-channel');
      const urgency = chip.getAttribute('data-filter-urgency');

      if (channel) {
        state.setFilter('channel', channel);
        state.setFilter('urgency', 'all');
      } else if (urgency) {
        state.setFilter('urgency', urgency);
        state.setFilter('channel', 'all');
      }
    });
  });

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.getAttribute('data-filter-status');
      state.setFilter('status', status);
    });
  });

  // Abonnement aux changements du store réactif
  state.addEventListener('state-changed', renderList);

  // Rendu initial
  renderList();
}

// Utilitaires de formatage de la date et des étiquettes
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / (1000 * 60));

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function getUrgencyLabel(level) {
  switch (level) {
    case 'critique': return '⚡ CRITIQUE';
    case 'haute': return '🔥 HAUTE';
    case 'moyen': return '⚡ MOYENNE';
    case 'faible': return 'FAIBLE';
    default: return level;
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'nouveau': return 'Nouveau';
    case 'en_cours': return 'En cours';
    case 'converti': return '✅ Converti';
    case 'perdu': return '❌ Perdu';
    default: return status;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
