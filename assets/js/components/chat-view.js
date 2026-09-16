/* ==========================================================================
   CITY ELEGANCE — COMPOSANT CHAT (CONVERSATION, LECTEUR AUDIO & IA 1-CLIC)
   ========================================================================== */

import { state } from '../state.js';
import { SpeechService } from '../services/speech-service.js';

export function initChatView() {
  const chatContainer = document.getElementById('chat-container');
  if (!chatContainer) return;

  function renderChat() {
    const selectedReq = state.getSelectedRequest();

    if (!selectedReq) {
      chatContainer.innerHTML = `
        <div class="empty-chat-state">
          <div class="empty-icon">💬</div>
          <h3>Sélectionnez une demande client</h3>
          <p>Cliquez sur un message dans la liste à gauche pour consulter l'historique, la classification automatique IA et valider la réponse suggérée.</p>
        </div>
      `;
      return;
    }

    const channelBadgeClass = `badge-${selectedReq.channel}`;
    const statusOptions = [
      { val: 'nouveau', label: '🆕 Nouveau' },
      { val: 'en_cours', label: '⏳ En cours' },
      { val: 'converti', label: '✅ Converti (Vente)' },
      { val: 'perdu', label: '❌ Perdu' }
    ];

    // Vérifier si la dernière réponse dans l'historique provient de l'agent (Déjà validé)
    const hasAgentResponded = selectedReq.messagesHistory.some(m => m.sender === 'agent');
    const isValidated = hasAgentResponded;

    chatContainer.innerHTML = `
      <!-- En-tête de la conversation -->
      <div class="chat-header">
        <div class="chat-user-info">
          <button id="btn-back-to-inbox" class="btn btn-secondary btn-sm btn-back-inbox" title="Retour aux demandes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span>Demandes</span>
          </button>
          <img src="${selectedReq.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="Avatar" class="user-avatar">
          <div class="user-details">
            <h3>${escapeHTML(selectedReq.customerName)}</h3>
            <span class="user-subtext">
              <span class="channel-icon-badge ${channelBadgeClass}" style="display:inline-flex; width:16px; height:16px; font-size:0.55rem;">
                ${selectedReq.channel === 'whatsapp' ? 'WA' : selectedReq.channel === 'facebook' ? 'FB' : 'IG'}
              </span>
              ${selectedReq.customerPhone} • ${selectedReq.city || 'Lomé, Togo'}
            </span>
          </div>
        </div>

        <div class="pipeline-actions">
          <label for="status-select-header" style="font-size:0.775rem; font-weight:600; color:var(--color-text-muted);">Statut Pipeline :</label>
          <select id="status-select-header" class="status-select">
            ${statusOptions.map(opt => `
              <option value="${opt.val}" ${selectedReq.status === opt.val ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Corps défilant du fil de conversation -->
      <div class="chat-body" id="chat-messages-body">
        ${selectedReq.messagesHistory.map(msg => renderMessageBubble(msg)).join('')}
      </div>

      <!-- Carte de Réponse Suggérée par IA (Devient grisée une fois validée) -->
      <div class="ai-suggestion-card ${isValidated ? 'validated' : ''}">
        <div class="ai-header">
          <div class="ai-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${isValidated ? 'Réponse Envoyée au Client' : 'Réponse Suggérée par IA (Catalogue City Elegance)'}</span>
          </div>
          
          ${isValidated 
            ? `<span class="badge-validated">✅ Réponse Envoyée</span>` 
            : `<span class="ai-confidence">Confiance : ${Math.round((selectedReq.aiAnalysis?.confidenceScore || 0.95) * 100)}%</span>`
          }
        </div>

        <div class="ai-intent-tag">
          💡 <strong>Intention détectée :</strong> ${escapeHTML(selectedReq.aiAnalysis?.intent || 'Demande d\'informations produit')}
        </div>

        <textarea id="ai-response-input" class="suggestion-textarea" rows="3" ${isValidated ? 'disabled' : ''}>${escapeHTML(selectedReq.aiAnalysis?.suggestedResponse || '')}</textarea>

        <div class="ai-actions">
          <button id="btn-quick-catalog" class="btn btn-secondary btn-sm" ${isValidated ? 'disabled style="opacity:0.5; pointer-events:none;"' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>Vérifier le Catalogue</span>
          </button>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${isValidated ? `
              <!-- Bouton de retour en arrière (Annuler la dernière réponse) -->
              <button id="btn-undo-response" class="btn btn-undo btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                <span>↩️ Annuler la réponse (Retour arrière)</span>
              </button>
            ` : `
              <button id="btn-mark-converted" class="btn btn-success btn-sm">
                <span>✅ Valider & Convertir Vente</span>
              </button>
              <button id="btn-send-response" class="btn btn-primary btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                <span>Valider & Envoyer (1-Clic)</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    // Attachement des gestionnaires d'événements
    attachChatViewEvents(selectedReq);
    scrollToBottom();
  }

  function renderMessageBubble(msg) {
    const isCustomer = msg.sender === 'customer';
    const bubbleClass = isCustomer ? 'message-customer' : 'message-agent';
    const formattedTime = new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (msg.isAudio) {
      return `
        <div class="message-bubble ${bubbleClass}">
          <div class="audio-player-box">
            <button class="audio-play-btn" data-audio-id="${msg.timestamp}">▶</button>
            <div style="flex:1;">
              <span style="font-weight:700; font-size:0.8rem; color:#166534;">Note Vocale WhatsApp (${msg.audioDuration || '0:24'})</span>
              <div class="audio-progress-bar" style="height:4px; background:#BBF7D0; border-radius:2px; margin-top:4px;">
                <div class="audio-progress-fill" style="width:0%; height:100%; background:var(--color-wa); border-radius:2px;"></div>
              </div>
            </div>
          </div>
          
          <div class="transcript-box">
            💬 <strong>Transcription IA :</strong> "${escapeHTML(msg.transcript || msg.text)}"
          </div>
          <span class="message-time">${formattedTime}</span>
        </div>
      `;
    }

    return `
      <div class="message-bubble ${bubbleClass}">
        <div>${escapeHTML(msg.text)}</div>
        <span class="message-time">${formattedTime}</span>
      </div>
    `;
  }

  function attachChatViewEvents(selectedReq) {
    // Bouton de Retour à la Liste des Demandes (Navigation 2 Écrans Style WhatsApp)
    const btnBack = document.getElementById('btn-back-to-inbox');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        window.location.hash = '#/inbox';
      });
    }

    // Changement de statut du pipeline depuis le dropdown
    const statusSelect = document.getElementById('status-select-header');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        state.updateRequestStatus(selectedReq.id, e.target.value);
        showToast(`Statut mis à jour : ${e.target.value.toUpperCase()}`);
      });
    }

    // Boutons de lecture audio
    document.querySelectorAll('.audio-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.textContent = '⏸';
        const card = btn.closest('.message-bubble');
        const progressFill = card.querySelector('.audio-progress-fill');

        SpeechService.playAudioNote(
          '',
          (percent) => { if (progressFill) progressFill.style.width = `${percent}%`; },
          () => {
            btn.textContent = '▶';
            if (progressFill) progressFill.style.width = '0%';
          }
        );
      });
    });

    // Validation et envoi de la réponse en 1 clic
    const btnSend = document.getElementById('btn-send-response');
    const responseInput = document.getElementById('ai-response-input');

    if (btnSend && responseInput) {
      btnSend.addEventListener('click', () => {
        const text = responseInput.value.trim();
        if (!text) return;
        state.addAgentResponse(selectedReq.id, text);
        showToast("Réponse envoyée au client ! Option grisée. 🚀");
      });
    }

    // Validation et conversion en vente réalisée
    const btnConverted = document.getElementById('btn-mark-converted');
    if (btnConverted && responseInput) {
      btnConverted.addEventListener('click', () => {
        const text = responseInput.value.trim();
        if (text) {
          state.addAgentResponse(selectedReq.id, text);
        }
        state.updateRequestStatus(selectedReq.id, 'converti');
        showToast("Demande convertie en Vente réalisée ! 🎉");
      });
    }

    // Bouton de Retour en arrière (Annuler la dernière réponse)
    const btnUndo = document.getElementById('btn-undo-response');
    if (btnUndo) {
      btnUndo.addEventListener('click', () => {
        state.removeLastAgentResponse(selectedReq.id);
        showToast("Dernière réponse annulée ! Vous pouvez de nouveau modifier le texte. ↩️");
      });
    }

    // Ouverture du modal de recherche catalogue
    const btnCatalog = document.getElementById('btn-quick-catalog');
    if (btnCatalog) {
      btnCatalog.addEventListener('click', () => {
        document.getElementById('catalog-modal')?.classList.add('active');
      });
    }
  }

  function scrollToBottom() {
    const body = document.getElementById('chat-messages-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  // Abonnement aux événements du store
  state.addEventListener('state-changed', renderChat);
  renderChat();
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
