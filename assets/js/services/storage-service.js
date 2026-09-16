/* ==========================================================================
   CITY ELEGANCE — SERVICE DE STOCKAGE (COUCHE ABSTRAITE LOCALSTORAGE)
   ========================================================================== */

import { INITIAL_CATALOG, INITIAL_CUSTOMERS, INITIAL_REQUESTS } from '../mock-data.js';

// Clés d'accès au stockage local
const STORAGE_KEYS = {
  REQUESTS: 'city_elegance_requests_v1',
  CATALOG: 'city_elegance_catalog_v1',
  CUSTOMERS: 'city_elegance_customers_v1',
  SETTINGS: 'city_elegance_settings_v1'
};

export const StorageService = {
  // Initialisation par défaut du stockage s'il est vide
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

  // Récupérer la liste des demandes clients
  getRequests() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS)) || [];
    } catch (e) {
      console.error('Échec de la lecture des demandes depuis le localStorage', e);
      return INITIAL_REQUESTS;
    }
  },

  // Sauvegarder la liste des demandes
  saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  },

  // Récupérer le catalogue des produits
  getCatalog() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATALOG)) || [];
    } catch (e) {
      return INITIAL_CATALOG;
    }
  },

  // Récupérer la liste des clients
  getCustomers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) || [];
    } catch (e) {
      return INITIAL_CUSTOMERS;
    }
  },

  // Récupérer la configuration de l'application (Clé API et modèle)
  getSettings() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || { apiKey: '', selectedModel: 'local-fallback' };
    } catch (e) {
      return { apiKey: '', selectedModel: 'local-fallback' };
    }
  },

  // Sauvegarder la configuration de l'application
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Réinitialiser les données au statut de démo initial
  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(INITIAL_CATALOG));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
};
