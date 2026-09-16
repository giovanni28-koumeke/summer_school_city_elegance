/* ==========================================================================
   CITY ELEGANCE — STORE DE DONNÉES CENTRALISÉ ET RÉACTIF
   ========================================================================== */

import { StorageService } from './services/storage-service.js';

class StateStore extends EventTarget {
  constructor() {
    super();
    this.requests = [];
    this.catalog = [];
    this.customers = [];
    this.settings = {};
    this.selectedRequestId = null;
    this.activeView = 'inbox';
    this.filters = {
      channel: 'all',
      status: 'all',
      urgency: 'all',
      searchQuery: ''
    };
    this.loadState();
  }

  // Chargement de l'état initial depuis le localStorage
  loadState() {
    this.requests = StorageService.getRequests();
    this.catalog = StorageService.getCatalog();
    this.customers = StorageService.getCustomers();
    this.settings = StorageService.getSettings();

    // Calcul automatique du dépasser de délai SLA (> 30 min sans réponse pour un nouveau message)
    this.updateSLAStatus();

    if (this.requests.length > 0 && !this.selectedRequestId) {
      this.selectedRequestId = this.requests[0].id;
    }
  }

  // Recalcul des alertes SLA en fonction de l'horodatage actuel
  updateSLAStatus() {
    const now = new Date().getTime();
    this.requests.forEach(req => {
      if (req.status === 'nouveau') {
        const reqTime = new Date(req.timestamp).getTime();
        const diffMins = (now - reqTime) / (1000 * 60);
        req.slaOverdue = diffMins > 30;
      } else {
        req.slaOverdue = false;
      }
    });
  }

  // Notification des composants suite à un changement d'état
  notifyChange() {
    this.updateSLAStatus();
    StorageService.saveRequests(this.requests);
    this.dispatchEvent(new CustomEvent('state-changed', { detail: this }));
  }

  // Mutateurs d'état
  setSelectedRequestId(id) {
    this.selectedRequestId = id;
    this.notifyChange();
  }

  setActiveView(viewName) {
    this.activeView = viewName;
    this.dispatchEvent(new CustomEvent('view-changed', { detail: { view: viewName } }));
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.notifyChange();
  }

  addRequest(newRequest) {
    this.requests.unshift(newRequest); // Ajouter en tête de liste
    this.selectedRequestId = newRequest.id;
    this.notifyChange();
  }

  updateRequestStatus(requestId, newStatus) {
    const req = this.requests.find(r => r.id === requestId);
    if (req) {
      req.status = newStatus;
      this.notifyChange();
    }
  }

  // Ajouter une réponse de l'agent dans l'historique
  addAgentResponse(requestId, responseText) {
    const req = this.requests.find(r => r.id === requestId);
    if (req) {
      req.messagesHistory.push({
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toISOString(),
        isAudio: false
      });
      req.status = 'en_cours';
      req.lastMessage = responseText;
      this.notifyChange();
    }
  }

  // Annuler et supprimer la dernière réponse envoyée par l'agent (Retour en arrière)
  removeLastAgentResponse(requestId) {
    const req = this.requests.find(r => r.id === requestId);
    if (req && req.messagesHistory.length > 0) {
      // Trouver l'indice du dernier message agent
      const lastAgentIdx = req.messagesHistory.map(m => m.sender).lastIndexOf('agent');
      if (lastAgentIdx !== -1) {
        req.messagesHistory.splice(lastAgentIdx, 1);
        
        // Mettre à jour le dernier message affiché
        const remainingMsgs = req.messagesHistory;
        req.lastMessage = remainingMsgs.length > 0 ? remainingMsgs[remainingMsgs.length - 1].text : '';
        
        // Si aucun message agent n'est présent, repasser le statut à "nouveau"
        const hasAgentMsg = remainingMsgs.some(m => m.sender === 'agent');
        if (!hasAgentMsg) {
          req.status = 'nouveau';
        }
        
        this.notifyChange();
      }
    }
  }

  // Filtrage dynamique des demandes clients
  getFilteredRequests() {
    return this.requests.filter(req => {
      // Filtre par canal
      if (this.filters.channel !== 'all' && req.channel !== this.filters.channel) {
        return false;
      }
      // Filtre par statut pipeline
      if (this.filters.status !== 'all' && req.status !== this.filters.status) {
        return false;
      }
      // Filtre par urgence
      if (this.filters.urgency === 'high' && (req.urgencyLevel !== 'haute' && req.urgencyLevel !== 'critique')) {
        return false;
      }
      // Recherche textuelle
      if (this.filters.searchQuery.trim() !== '') {
        const query = this.filters.searchQuery.toLowerCase();
        const matchName = req.customerName.toLowerCase().includes(query);
        const matchPhone = (req.customerPhone || '').toLowerCase().includes(query);
        const matchMsg = req.lastMessage.toLowerCase().includes(query);
        const matchTranscript = (req.transcript || '').toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchMsg && !matchTranscript) {
          return false;
        }
      }
      return true;
    });
  }

  getSelectedRequest() {
    return this.requests.find(r => r.id === this.selectedRequestId) || null;
  }
}

export const state = new StateStore();
