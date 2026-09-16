/* ==========================================================================
   CITY ELEGANCE — COMPOSANT VUE CONNEXION ET INSCRIPTION MULTI-PME
   ========================================================================== */

import { state } from '../state.js';
import { AuthService } from '../services/auth-service.js';

export function initLoginView() {
  const container = document.getElementById('view-login');
  if (!container) return;

  function renderLogin() {
    container.innerHTML = `
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-brand">
            <div class="login-logo">🏬</div>
            <h2>Bienvenue sur l'Inbox Omnicanale PME</h2>
            <p>Plateforme de centralisation des messages WhatsApp, Facebook & Instagram avec classification IA.</p>
          </div>

          <!-- Encadré d'information avec accès rapide -->
          <div class="demo-credentials-box">
            <div class="demo-badge">🔑 COMPTE DE DÉMONSTRATION</div>
            <p style="font-size:0.8rem; margin:0.35rem 0; color:var(--color-text-main);">
              Connectez-vous directement avec le compte préconfiguré <strong>City Elegance</strong> :
            </p>
            <div style="font-size:0.775rem; font-family:monospace; background:var(--color-surface); border:1px solid var(--color-border); padding:0.4rem 0.6rem; border-radius:4px; margin-bottom:0.6rem;">
              Email: <strong>demo@cityelegance.tg</strong> | Pass: <strong>demo123</strong>
            </div>
            <button id="btn-login-demo" class="btn btn-secondary btn-sm btn-block" style="border-color:var(--color-primary); color:var(--color-primary);">
              ⚡ Connexion Rapide City Elegance (1-Clic)
            </button>
          </div>

          <!-- Onglets Connexion / Inscription -->
          <div class="auth-tabs">
            <button id="tab-login-mode" class="auth-tab active">Connexion PME</button>
            <button id="tab-register-mode" class="auth-tab">Inscription Nouvelle PME</button>
          </div>

          <!-- Formulaire de Connexion -->
          <form id="form-login" class="auth-form active">
            <div class="form-group">
              <label for="login-email">Adresse Email</label>
              <input type="email" id="login-email" class="form-control" placeholder="exemple@entreprise.tg" required value="demo@cityelegance.tg">
            </div>

            <div class="form-group">
              <label for="login-password">Mot de Passe</label>
              <input type="password" id="login-password" class="form-control" placeholder="••••••••" required value="demo123">
            </div>

            <div id="login-error" class="auth-error hidden"></div>

            <button type="submit" id="btn-submit-login" class="btn btn-primary btn-block" style="margin-top:0.75rem; padding:0.75rem;">
              <span>Se Connecter à mon Espace</span>
            </button>
          </form>

          <!-- Formulaire d'Inscription -->
          <form id="form-register" class="auth-form">
            <div class="form-group">
              <label for="reg-company-name">Nom de l'Entreprise / Boutique</label>
              <input type="text" id="reg-company-name" class="form-control" placeholder="Ex: Lomé Tech & Style" required>
            </div>

            <div class="form-group">
              <label for="reg-industry">Secteur d'Activité</label>
              <select id="reg-industry" class="form-control" required>
                <option value="Prêt-à-porter & Chaussures">Prêt-à-porter & Chaussures 👗👠</option>
                <option value="Électronique & High-Tech">Électronique & High-Tech 📱💻</option>
                <option value="Cosmétique & Beauté">Cosmétique & Beauté 💄✨</option>
                <option value="Restauration & Alimentation">Restauration & Alimentation 🍔🍹</option>
                <option value="Services & Artisanat">Services & Artisanat 🛠️🎨</option>
                <option value="Autre Commerce">Autre Commerce 📦</option>
              </select>
            </div>

            <div class="form-group">
              <label for="reg-email">Email Professionnel</label>
              <input type="email" id="reg-email" class="form-control" placeholder="contact@pme.tg" required>
            </div>

            <div class="form-group">
              <label for="reg-password">Mot de Passe</label>
              <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required>
              <small class="form-help">🔒 Simulation prototype : les identifiants sont gérés localement.</small>
            </div>

            <div id="register-error" class="auth-error hidden"></div>

            <button type="submit" id="btn-submit-register" class="btn btn-success btn-block" style="margin-top:0.75rem; padding:0.75rem;">
              <span>Créer mon Compte PME</span>
            </button>
          </form>
        </div>
      </div>
    `;

    attachLoginEvents();
  }

  function attachLoginEvents() {
    const tabLogin = document.getElementById('tab-login-mode');
    const tabRegister = document.getElementById('tab-register-mode');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const btnDemo = document.getElementById('btn-login-demo');

    // Bascule d'onglets
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', (e) => {
        e.preventDefault();
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
      });

      tabRegister.addEventListener('click', (e) => {
        e.preventDefault();
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
      });
    }

    // Connexion Démo 1-Clic
    if (btnDemo) {
      btnDemo.addEventListener('click', (e) => {
        e.preventDefault();
        const res = AuthService.loginDemo();
        if (res.success) {
          state.reloadState();
          state.setActiveView('inbox');
          showToast("Connecté avec succès au compte City Elegance ! 🎉");
        }
      });
    }

    // Soumission du formulaire de Connexion
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errDiv = document.getElementById('login-error');

        const res = AuthService.login(email, password);
        if (res.success) {
          errDiv.classList.add('hidden');
          state.reloadState();
          state.setActiveView('inbox');
          showToast(`Bienvenue sur votre espace ${res.session.companyName} ! 👋`);
        } else {
          errDiv.textContent = res.message;
          errDiv.classList.remove('hidden');
        }
      });
    }

    // Soumission du formulaire d'Inscription
    if (formRegister) {
      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const companyName = document.getElementById('reg-company-name').value.trim();
        const industry = document.getElementById('reg-industry').value;
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const errDiv = document.getElementById('register-error');

        const res = AuthService.register(companyName, industry, email, password);
        if (res.success) {
          errDiv.classList.add('hidden');
          state.reloadState();
          state.setActiveView('inbox');
          showToast(`Compte PME "${companyName}" créé avec succès ! 🎉`);
        } else {
          errDiv.textContent = res.message;
          errDiv.classList.remove('hidden');
        }
      });
    }
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

  state.addEventListener('view-changed', (e) => {
    if (e.detail.view === 'login') {
      renderLogin();
    }
  });

  renderLogin();
}
