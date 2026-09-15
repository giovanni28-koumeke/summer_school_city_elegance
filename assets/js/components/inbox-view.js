/* ==========================================================================
   CITY ELEGANCE — INBOX VIEW COMPONENT (REQUESTS LIST, FILTERS & SLA)
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

  // Render Requests List
  function renderList() {
    const filtered = state.getFilteredRequests();
    const allRequests = state.requests;

    // Update unread / new count
    const newCount = allRequests.filter(r => r.status === 'nouveau').length;
    unreadBadge.textContent = newCount;

    // Update SLA Overdue Banner
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

    // Attach card click handlers
    document.querySelectorAll('.request-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        state.setSelectedRequestId(id);
      });
    });
  }

  // Event Listeners for Filters
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

  // Listen to state changes
  state.addEventListener('state-changed', renderList);

  // Initial render
  renderList();
}

// Helpers
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
