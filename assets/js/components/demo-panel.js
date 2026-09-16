/* ==========================================================================
   CITY ELEGANCE — LIVE DEMO PANEL (JURY SIMULATION DRAWER)
   ========================================================================== */

import { state } from '../state.js';
import { AIService } from '../services/ai-service.js';

export function initDemoPanel() {
  const drawer = document.getElementById('demo-drawer');
  const btnOpenHeader = document.getElementById('btn-open-demo');
  const btnClose = document.getElementById('btn-close-demo');
  const form = document.getElementById('demo-message-form');
  const presetButtons = document.querySelectorAll('.preset-btn');

  const inputName = document.getElementById('demo-customer-name');
  const inputPhone = document.getElementById('demo-customer-phone');
  const inputChannel = document.getElementById('demo-channel');
  const inputText = document.getElementById('demo-message-text');
  const checkAudio = document.getElementById('demo-is-audio');

  if (!drawer || !form) return;

  // Open & Close Handlers
  if (btnOpenHeader) {
    btnOpenHeader.addEventListener('click', () => drawer.classList.add('active'));
  }
  if (btnClose) {
    btnClose.addEventListener('click', () => drawer.classList.remove('active'));
  }

  // Presets definition
  const PRESETS = {
    'wax-prix': {
      name: "Akossiwa Dovi",
      phone: "+228 90 99 88 77",
      channel: "whatsapp",
      text: "Bonjour City Elegance, s'il vous plaît la Robe Wax Hollandais bleu est à combien ? Vous livrez à Gbadago aujourd'hui ?",
      isAudio: false
    },
    'talon-taille': {
      name: "Sena Lawson",
      phone: "@sena_lawson_chic",
      channel: "instagram",
      text: "Coucou ! Est-ce que les talons aiguille Gold sont disponibles en pointure 39 ? J'en ai besoin pour un mariage samedi !",
      isAudio: false
    },
    'vocal-livraison': {
      name: "Klassou Kodjo",
      phone: "+228 91 22 33 44",
      channel: "whatsapp",
      text: "Bonjour City Elegance, est-ce que le livreur peut passer à Bè vers 14h ? Et c'est quel numéro T-Money pour payer ?",
      isAudio: true
    },
    'pantalon-homme': {
      name: "M. Mawuli",
      phone: "Mawuli Togo FB",
      channel: "facebook",
      text: "Bonsoir, je voudrais commander l'Ensemble Bazin Riche Blanc taille XL. Est-ce qu'on peut essayer avant de payer ?",
      isAudio: false
    }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const data = PRESETS[presetKey];
      if (data) {
        inputName.value = data.name;
        inputPhone.value = data.phone;
        inputChannel.value = data.channel;
        inputText.value = data.text;
        checkAudio.checked = data.isAudio;
      }
    });
  });

  // Handle Form Submission (Inject live message into inbox pipeline)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = inputName.value.trim();
    const phone = inputPhone.value.trim();
    const channel = inputChannel.value;
    const text = inputText.value.trim();
    const isAudio = checkAudio.checked;

    if (!text) return;

    // Show loading indicator on submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>⚡ IA en cours de classification...</span>`;
    submitBtn.disabled = true;

    try {
      // Run AI Classification (Claude API or Local Heuristic)
      const aiResult = await AIService.classifyAndSuggest(text, name, channel);

      const newReq = {
        id: `req_${Date.now()}`,
        customerId: `cust_${Date.now()}`,
        customerName: name,
        customerPhone: phone,
        channel: channel,
        channelBadge: channel === 'whatsapp' ? 'WA' : channel === 'facebook' ? 'FB' : 'IG',
        timestamp: new Date().toISOString(),
        status: 'nouveau',
        urgencyScore: aiResult.urgencyScore || 4,
        urgencyLevel: aiResult.urgencyLevel || 'haute',
        category: aiResult.category || 'disponibilite',
        productId: 'prod_001',
        isAudio: isAudio,
        audioDuration: isAudio ? '0:22' : '',
        transcript: isAudio ? text : '',
        lastMessage: isAudio ? `🎙️ [Note Vocale 0:22] ${text}` : text,
        aiAnalysis: {
          intent: aiResult.intent,
          suggestedResponse: aiResult.suggestedResponse,
          confidenceScore: aiResult.confidenceScore || 0.95
        },
        slaOverdue: false,
        messagesHistory: [
          {
            sender: 'customer',
            text: isAudio ? `🎙️ [Note Vocale 0:22] ${text}` : text,
            timestamp: new Date().toISOString(),
            isAudio: isAudio,
            audioDuration: isAudio ? '0:22' : '',
            transcript: isAudio ? text : ''
          }
        ]
      };

      // Add to reactive store
      state.addRequest(newReq);
      state.setActiveView('inbox');

      // Close drawer & notify
      drawer.classList.remove('active');
      showToast(`🔥 Nouveau message ${channel.toUpperCase()} injecté et classifié par l'IA !`);
    } catch (err) {
      console.error('Failed to inject demo message', err);
      showToast('Erreur lors de la simulation du message');
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
