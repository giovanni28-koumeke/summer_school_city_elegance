/* ==========================================================================
   CITY ELEGANCE — STORAGE SERVICE (LOCAL STORAGE ABSTRACTED LAYER)
   ========================================================================== */

import { INITIAL_CATALOG, INITIAL_CUSTOMERS, INITIAL_REQUESTS } from '../mock-data.js';

const STORAGE_KEYS = {
  REQUESTS: 'city_elegance_requests_v1',
  CATALOG: 'city_elegance_catalog_v1',
  CUSTOMERS: 'city_elegance_customers_v1',
  SETTINGS: 'city_elegance_settings_v1'
};

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATALOG)) {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        apiKey: '',
        selectedModel: 'local-fallback'
      }));
    }
  },

  getRequests() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS)) || [];
    } catch (e) {
      console.error('Failed to parse requests from storage', e);
      return INITIAL_REQUESTS;
    }
  },

  saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  },

  getCatalog() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATALOG)) || [];
    } catch (e) {
      return INITIAL_CATALOG;
    }
  },

  getCustomers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || [];
    } catch (e) {
      return INITIAL_CUSTOMERS;
    }
  },

  getSettings() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || { apiKey: '', selectedModel: 'local-fallback' };
    } catch (e) {
      return { apiKey: '', selectedModel: 'local-fallback' };
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
};
