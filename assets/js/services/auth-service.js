/* ==========================================================================
   CITY ELEGANCE — SERVICE D'AUTHENTIFICATION ET GESTION DES COMPTES PME
   ========================================================================== */

const STORAGE_USERS_KEY = 'city_elegance_users_v1';
const STORAGE_SESSION_KEY = 'city_elegance_session_v1';

// Compte de démonstration pré-configuré
const DEMO_COMPANY = {
  companyId: 'comp_city_elegance',
  companyName: 'City Elegance',
  industry: 'Prêt-à-porter & Chaussures',
  email: 'demo@cityelegance.tg',
  password: 'demo123',
  phone: '+228 90 12 34 56',
  city: 'Lomé, Togo',
  primaryColor: '#C85A32'
};

export const AuthService = {
  // Initialisation de la base des utilisateurs avec le compte "City Elegance"
  init() {
    let users = this.getUsers();
    const hasDemo = users.some(u => u.companyId === DEMO_COMPANY.companyId || u.email === DEMO_COMPANY.email);
    if (!hasDemo) {
      users.push(DEMO_COMPANY);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }

    // Si aucune session n'est active, connecter automatiquement le compte démo par défaut
    if (!sessionStorage.getItem(STORAGE_SESSION_KEY)) {
      this.loginDemo();
    }
  },

  // Récupérer la liste des comptes PME enregistrés
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  // Récupérer la session active
  getCurrentSession() {
    try {
      let session = JSON.parse(sessionStorage.getItem(STORAGE_SESSION_KEY));
      if (!session) {
        this.init();
        session = JSON.parse(sessionStorage.getItem(STORAGE_SESSION_KEY));
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  // ID de l'entreprise actuellement connectée
  getCurrentCompanyId() {
    const session = this.getCurrentSession();
    return session ? session.companyId : 'comp_city_elegance';
  },

  // Connexion avec Email et Mot de passe
  login(email, password) {
    this.init();
    const users = this.getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (foundUser) {
      const session = {
        companyId: foundUser.companyId,
        companyName: foundUser.companyName,
        industry: foundUser.industry,
        email: foundUser.email,
        phone: foundUser.phone || '',
        city: foundUser.city || 'Lomé, Togo',
        primaryColor: foundUser.primaryColor || '#C85A32',
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, message: 'Email ou mot de passe incorrect.' };
  },

  // Connexion rapide avec le compte Démo City Elegance (1-Clic)
  loginDemo() {
    const session = {
      companyId: DEMO_COMPANY.companyId,
      companyName: DEMO_COMPANY.companyName,
      industry: DEMO_COMPANY.industry,
      email: DEMO_COMPANY.email,
      phone: DEMO_COMPANY.phone,
      city: DEMO_COMPANY.city,
      primaryColor: DEMO_COMPANY.primaryColor,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  },

  // Inscription d'une nouvelle PME
  register(companyName, industry, email, password) {
    this.init();
    const users = this.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return { success: false, message: 'Un compte existe déjà avec cette adresse email.' };
    }

    const newCompanyId = `comp_${Date.now()}`;
    const newCompany = {
      companyId: newCompanyId,
      companyName,
      industry,
      email,
      password,
      phone: '+228 90 00 00 00',
      city: 'Lomé, Togo',
      primaryColor: '#C85A32'
    };

    users.push(newCompany);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    return this.login(email, password);
  },

  // Mise à jour des informations du profil de l'entreprise connectée
  updateProfile(companyId, updatedData) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.companyId === companyId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      const currentSession = this.getCurrentSession();
      if (currentSession && currentSession.companyId === companyId) {
        const newSession = { ...currentSession, ...updatedData };
        sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
      }
      return { success: true, user: users[idx] };
    }
    return { success: false, message: 'Entreprise introuvable.' };
  },

  // Déconnexion de l'entreprise
  logout() {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  }
};
