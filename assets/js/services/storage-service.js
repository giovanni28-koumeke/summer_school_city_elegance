/* ==========================================================================
   CITY ELEGANCE — SERVICE DE STOCKAGE LOCAL MULTI-ENTREPRISE (RECHARGEMENT GARANTI)
   ========================================================================== */

import { INITIAL_CATALOG, INITIAL_CUSTOMERS, INITIAL_REQUESTS } from '../mock-data.js';
import { AuthService } from './auth-service.js';

export const StorageService = {
  getKey(resourceName) {
    const companyId = AuthService.getCurrentCompanyId();
    return `city_elegance_${companyId}_${resourceName}_v2`;
  },

  init() {
    const companyId = AuthService.getCurrentCompanyId();
    const catalogKey = this.getKey('catalog');
    const customersKey = this.getKey('customers');
    const requestsKey = this.getKey('requests');
    const settingsKey = this.getKey('settings');

    // Pour le compte démo "City Elegance", charger les 8 demandes de démarrage
    if (companyId === 'comp_city_elegance') {
      const existingReqs = localStorage.getItem(requestsKey);
      if (!existingReqs || existingReqs === '[]') {
        localStorage.setItem(requestsKey, JSON.stringify(INITIAL_REQUESTS));
      }
      const existingCat = localStorage.getItem(catalogKey);
      if (!existingCat || existingCat === '[]') {
        localStorage.setItem(catalogKey, JSON.stringify(INITIAL_CATALOG));
      }
      const existingCust = localStorage.getItem(customersKey);
      if (!existingCust || existingCust === '[]') {
        localStorage.setItem(customersKey, JSON.stringify(INITIAL_CUSTOMERS));
      }
    }

    if (!localStorage.getItem(settingsKey)) {
      localStorage.setItem(settingsKey, JSON.stringify({
        apiKey: '',
        selectedModel: 'local-fallback'
      }));
    }
  },

  getRequests() {
    this.init();
    const key = this.getKey('requests');
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if ((!data || data.length === 0) && AuthService.getCurrentCompanyId() === 'comp_city_elegance') {
        localStorage.setItem(key, JSON.stringify(INITIAL_REQUESTS));
        return INITIAL_REQUESTS;
      }
      return data || [];
    } catch (e) {
      return INITIAL_REQUESTS;
    }
  },

  saveRequests(requests) {
    const key = this.getKey('requests');
    localStorage.setItem(key, JSON.stringify(requests));
  },

  getCatalog() {
    this.init();
    const key = this.getKey('catalog');
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if ((!data || data.length === 0) && AuthService.getCurrentCompanyId() === 'comp_city_elegance') {
        localStorage.setItem(key, JSON.stringify(INITIAL_CATALOG));
        return INITIAL_CATALOG;
      }
      return data || [];
    } catch (e) {
      return INITIAL_CATALOG;
    }
  },

  saveCatalog(catalog) {
    const key = this.getKey('catalog');
    localStorage.setItem(key, JSON.stringify(catalog));
  },

  getCustomers() {
    this.init();
    const key = this.getKey('customers');
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if ((!data || data.length === 0) && AuthService.getCurrentCompanyId() === 'comp_city_elegance') {
        localStorage.setItem(key, JSON.stringify(INITIAL_CUSTOMERS));
        return INITIAL_CUSTOMERS;
      }
      return data || [];
    } catch (e) {
      return INITIAL_CUSTOMERS;
    }
  },

  getSettings() {
    this.init();
    const key = this.getKey('settings');
    try {
      return JSON.parse(localStorage.getItem(key)) || { apiKey: '', selectedModel: 'local-fallback' };
    } catch (e) {
      return { apiKey: '', selectedModel: 'local-fallback' };
    }
  },

  saveSettings(settings) {
    const key = this.getKey('settings');
    localStorage.setItem(key, JSON.stringify(settings));
  },

  resetAllData() {
    const companyId = AuthService.getCurrentCompanyId();
    if (companyId === 'comp_city_elegance') {
      localStorage.setItem(this.getKey('catalog'), JSON.stringify(INITIAL_CATALOG));
      localStorage.setItem(this.getKey('customers'), JSON.stringify(INITIAL_CUSTOMERS));
      localStorage.setItem(this.getKey('requests'), JSON.stringify(INITIAL_REQUESTS));
    } else {
      localStorage.setItem(this.getKey('catalog'), JSON.stringify([]));
      localStorage.setItem(this.getKey('customers'), JSON.stringify([]));
      localStorage.setItem(this.getKey('requests'), JSON.stringify([]));
    }
  }
};
