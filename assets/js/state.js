/* ==========================================================================
   CITY ELEGANCE — STORE DE DONNÉES CENTRALISÉ ET RÉACTIF MULTI-PME
   ========================================================================== */

import { StorageService } from './services/storage-service.js';
import { AuthService } from './services/auth-service.js';
import { INITIAL_REQUESTS } from './mock-data.js';

class StateStore extends EventTarget {
  constructor() {
    super();
    this.currentSession = null;
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

  // Chargement de la session active et des données d'entreprise
  loadState() {
    this.currentSession = AuthService.getCurrentSession();
    if (this.currentSession) {
      this.requests = StorageService.getRequests();
      this.catalog = StorageService.getCatalog();
      this.customers = StorageService.getCustomers();
      this.settings = StorageService.getSettings();

      // Sécurité si requests est vide pour City Elegance
      if (this.requests.length === 0 && this.currentSession.companyId === 'comp_city_elegance') {
        this.requests = [...INITIAL_REQUESTS];
        StorageService.saveRequests(this.requests);
      }

      this.updateSLAStatus();

      if (this.requests.length > 0 && !this.selectedRequestId) {
        this.selectedRequestId = this.requests[0].id;
      }
    } else {
      this.requests = [];
      this.catalog = [];
      this.customers = [];
      this.settings = {};
      this.selectedRequestId = null;
    }
  }

  // Mettre à jour l'état lors de la connexion ou déconnexion
  reloadState() {
    this.selectedRequestId = null;
    this.loadState();
    this.notifyChange();
  }

  // Déconnexion de l'utilisateur
  logout() {
    AuthService.logout();
    this.currentSession = null;
    this.reloadState();
    this.setActiveView('login');
  }

  // Mise à jour du profil de l'entreprise connectée
  updateCompanyProfile(profileData) {
    if (!this.currentSession) return;
    const res = AuthService.updateProfile(this.currentSession.companyId, profileData);
    if (res.success) {
      this.currentSession = AuthService.getCurrentSession();
      this.notifyChange();
    }
    return res;
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
    if (this.currentSession) {
      StorageService.saveRequests(this.requests);
      StorageService.saveCatalog(this.catalog);
    }
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
    this.requests.unshift(newRequest);
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

  removeLastAgentResponse(requestId) {
    const req = this.requests.find(r => r.id === requestId);
    if (req && req.messagesHistory.length > 0) {
      const lastAgentIdx = req.messagesHistory.map(m => m.sender).lastIndexOf('agent');
      if (lastAgentIdx !== -1) {
        req.messagesHistory.splice(lastAgentIdx, 1);
        const remainingMsgs = req.messagesHistory;
        req.lastMessage = remainingMsgs.length > 0 ? remainingMsgs[remainingMsgs.length - 1].text : '';
        const hasAgentMsg = remainingMsgs.some(m => m.sender === 'agent');
        if (!hasAgentMsg) {
          req.status = 'nouveau';
        }
        this.notifyChange();
      }
    }
  }

  getFilteredRequests() {
    return this.requests.filter(req => {
      if (this.filters.channel !== 'all' && req.channel !== this.filters.channel) {
        return false;
      }
      if (this.filters.status !== 'all' && req.status !== this.filters.status) {
        return false;
      }
      if (this.filters.urgency === 'high' && (req.urgencyLevel !== 'haute' && req.urgencyLevel !== 'critique')) {
        return false;
      }
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
