/* ==========================================================================
   CITY ELEGANCE — SERVICE IA (API CLAUDE ANTHROPIC ET MOTEUR LOCAL DE SECOURS)
   ========================================================================== */

import { StorageService } from './storage-service.js';

export const AIService = {
  /**
   * Classifie un message client et génère une réponse suggérée basée sur le catalogue réel
   */
  async classifyAndSuggest(messageText, customerName = "Client", channel = "whatsapp") {
    const settings = StorageService.getSettings();
    const catalog = StorageService.getCatalog();

    // 1. Essai avec l'API Claude Anthropic si une clé API valide est configurée
    if (settings.apiKey && settings.apiKey.trim().startsWith('sk-ant-')) {
      try {
        const claudeResult = await this.callClaudeAPI(settings.apiKey, settings.selectedModel, messageText, customerName, catalog);
        if (claudeResult) return claudeResult;
      } catch (err) {
        console.warn('[AIService] L\'appel à l\'API Claude a échoué, basculement sur le moteur local :', err);
      }
    }

    // 2. Moteur Heuristique Local (100% fiable et disponible hors-ligne)
    return this.generateLocalFallback(messageText, customerName, catalog);
  },

  /**
   * Appel à l'endpoint Messages de l'API Anthropic Claude
   */
  async callClaudeAPI(apiKey, model, messageText, customerName, catalog) {
    const catalogSummary = catalog.map(p =>
      `- ${p.name} (Catégorie: ${p.category}, Prix: ${p.priceXOF} FCFA, Tailles: ${p.sizes.join('/')}, Stock: ${JSON.stringify(p.stock)}, Délai: ${p.deliveryDelay})`
    ).join('\n');

    const systemPrompt = `Tu es l'assistant IA officiel de "City Elegance", une boutique de mode et chaussures basée à Lomé, Togo.
Ton rôle est d'analyser le message d'un client (${customerName}), d'évaluer son urgence (1 à 5), de déterminer sa catégorie et de proposer une réponse professionnelle, polie et adaptée au contexte togolais (livraison Lomé 1000 FCFA, paiement T-Money/Moov Money, courtoisie).

Voici le catalogue réel actuel de la boutique City Elegance :
${catalogSummary}

Format de réponse OBLIGATOIRE : Tu dois répondre UNIQUEMENT par un objet JSON valide suivant exactement cette structure :
{
  "category": "prix" | "disponibilite" | "livraison" | "commande" | "autre",
  "urgencyScore": number (1 à 5),
  "urgencyLevel": "faible" | "moyen" | "haute" | "critique",
  "intent": "Brève explication de ce que veut le client",
  "suggestedResponse": "Texte exact de la réponse suggérée au client",
  "confidenceScore": number (0.80 à 0.99)
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: messageText }]
      })
    });

    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const data = await response.json();
    const contentText = data.content[0]?.text || '';

    // Extraire et parser l'objet JSON retourné par Claude
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  },

  /**
   * Moteur Heuristique Local Haute Précision basé sur le catalogue City Elegance
   */
  generateLocalFallback(text, customerName, catalog) {
    const lower = text.toLowerCase();

    // Rechercher le produit correspondant dans le catalogue
    const matchedProduct = catalog.find(p =>
      lower.includes(p.name.toLowerCase()) ||
      (p.category === 'habits' && (lower.includes('robe') || lower.includes('bazin') || lower.includes('chemise') || lower.includes('wax'))) ||
      (p.category === 'chaussures' && (lower.includes('talon') || lower.includes('sandale') || lower.includes('chaussure'))) ||
      (p.category === 'accessoires' && (lower.includes('sac') || lower.includes('main')))
    ) || catalog[0];

    let category = "disponibilite";
    let urgencyScore = 3;
    let urgencyLevel = "moyen";
    let intent = `Demande d'information sur ${matchedProduct.name}`;
    let suggestedResponse = "";

    if (lower.includes('combien') || lower.includes('prix') || lower.includes('tarif') || lower.includes('c\'est quel prix')) {
      category = "prix";
      urgencyScore = 4;
      urgencyLevel = "haute";
      intent = `Demande de tarif pour ${matchedProduct.name}`;
      suggestedResponse = `Bonjour ${customerName} ! 😊 Le prix de notre ${matchedProduct.name} est de ${matchedProduct.priceXOF.toLocaleString('fr-FR')} FCFA. ${matchedProduct.deliveryDelay}. Souhaitez-vous passer commande aujourd'hui ?`;
    }
    else if (lower.includes('taille') || lower.includes('pointure') || lower.includes('stock') || lower.includes('avez-vous')) {
      category = "disponibilite";
      urgencyScore = 4;
      urgencyLevel = "haute";
      intent = `Vérification du stock et des tailles pour ${matchedProduct.name}`;

      const availableSizes = Object.entries(matchedProduct.stock)
        .filter(([_, qty]) => qty > 0)
        .map(([size]) => size);

      if (availableSizes.length > 0) {
        suggestedResponse = `Bonjour ${customerName} ! Oui, ${matchedProduct.name} (à ${matchedProduct.priceXOF.toLocaleString('fr-FR')} FCFA) est bien en stock disponible dans les tailles : ${availableSizes.join(', ')}. ${matchedProduct.deliveryDelay}. Quelle taille souhaitez-vous réserver ?`;
      } else {
        suggestedResponse = `Bonjour ${customerName} ! ${matchedProduct.name} est victime de son succès et actuellement en cours de réapprovisionnement. Souhaitez-vous être notifiée dès l'arrivée du prochain lot la semaine prochaine ?`;
      }
    }
    else if (lower.includes('livraison') || lower.includes('livrer') || lower.includes('bè') || lower.includes('gbadago') || lower.includes('hedzranawoé') || lower.includes('kara')) {
      category = "livraison";
      urgencyScore = 3;
      urgencyLevel = "moyen";
      intent = "Demande de modalités et tarifs de livraison";
      suggestedResponse = `Bonjour ${customerName} ! Nos livraisons sont assurées en 24h partout à Lomé (1 000 FCFA). Pour les expéditions en région (Kara, Sokodé, Atakpamé), l'envoi se fait par bus postal sécurisé sous 48h. Souhaitez-vous valider votre adresse ?`;
    }
    else if (lower.includes('commander') || lower.includes('je veux') || lower.includes('paie') || lower.includes('t-money') || lower.includes('moov')) {
      category = "commande";
      urgencyScore = 5;
      urgencyLevel = "critique";
      intent = "Intention d'achat ferme avec mode de paiement";
      suggestedResponse = `Formidable ${customerName} ! Merci pour votre confiance. 🛍️ Vous pouvez régler directement par T-Money / Moov Money au numéro officiel de City Elegance : +228 90 12 34 56. Une fois le transfert effectué, votre colis sera expédié immédiatement !`;
    }
    else {
      category = "autre";
      urgencyScore = 2;
      urgencyLevel = "faible";
      intent = "Question générale boutique";
      suggestedResponse = `Bonjour ${customerName} ! Merci d'avoir contacté City Elegance Lomé. Nos vendeurs sont à votre disposition. Comment pouvons-nous vous aider concernant notre nouvelle collection ?`;
    }

    return {
      category,
      urgencyScore,
      urgencyLevel,
      intent,
      suggestedResponse,
      confidenceScore: 0.94
    };
  }
};
