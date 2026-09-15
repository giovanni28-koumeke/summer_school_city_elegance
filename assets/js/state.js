/* ==========================================================================
   CITY ELEGANCE — CENTRAL REACTIVE STATE STORE
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

  loadState() {
    this.requests = StorageService.getRequests();
    this.catalog = StorageService.getCatalog();
    this.customers = StorageService.getCustomers();
    this.settings = StorageService.getSettings();

    // Auto calculate SLA overdue status (> 30 mins unanswered nouveau)
    this.updateSLAStatus();

    if (this.requests.length > 0 && !this.selectedRequestId) {
      this.selectedRequestId = this.requests[0].id;
    }
  }

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

  notifyChange() {
    this.updateSLAStatus();
    StorageService.saveRequests(this.requests);
    this.dispatchEvent(new CustomEvent('state-changed', { detail: this }));
  }

  // State Mutators
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
    this.requests.unshift(newRequest); // Add to top of list
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

  getFilteredRequests() {
    return this.requests.filter(req => {
      // Channel Filter
      if (this.filters.channel !== 'all' && req.channel !== this.filters.channel) {
        return false;
      }
      // Status Filter
      if (this.filters.status !== 'all' && req.status !== this.filters.status) {
        return false;
      }
      // Urgency Filter
      if (this.filters.urgency === 'high' && (req.urgencyLevel !== 'haute' && req.urgencyLevel !== 'critique')) {
        return false;
      }
      // Search Query
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
