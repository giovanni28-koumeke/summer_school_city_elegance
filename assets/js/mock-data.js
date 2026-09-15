/* ==========================================================================
   CITY ELEGANCE — MOCK DATA SEED (CATALOGUE & MESSAGES CLIENTS TOGOLAIS)
   ========================================================================== */

export const INITIAL_CATALOG = [
  {
    id: "prod_001",
    name: "Robe Wax Hollandais City Elegance",
    category: "habits",
    priceXOF: 18500,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bazin Bleu/Or", "Fleur de Mariage Rouge"],
    stock: { "S": 2, "M": 5, "L": 0, "XL": 3 },
    deliveryDelay: "Livraison 24h à Lomé (1 000 FCFA), expédition région possible",
    image: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400",
    description: "Robe cintrée en authentique wax imprimé hollandais, finition haut de gamme."
  },
  {
    id: "prod_002",
    name: "Ensemble Bazin Riche Homme (3 Pièces)",
    category: "habits",
    priceXOF: 35000,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blanc Pur", "Bleu Nuit Brodé"],
    stock: { "M": 3, "L": 4, "XL": 2, "XXL": 1 },
    deliveryDelay: "Livraison 24h à Lomé (1 000 FCFA)",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400",
    description: "Grand boubou et pantalon assorti en bazin brodé à la main."
  },
  {
    id: "prod_003",
    name: "Chaussures à Talon Aiguille Chic Gold",
    category: "chaussures",
    priceXOF: 22000,
    sizes: ["37", "38", "39", "40"],
    colors: ["Or Métallisé", "Noir Satin"],
    stock: { "37": 1, "38": 3, "39": 0, "40": 2 },
    deliveryDelay: "Livraison 24h à Lomé (1 000 FCFA)",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    description: "Talons de soirée confortables avec semelle matelassée 8 cm."
  },
  {
    id: "prod_004",
    name: "Sandales Artisanal Cuir Marron",
    category: "chaussures",
    priceXOF: 12500,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Cuir Naturel", "Cuir Noir"],
    stock: { "39": 4, "40": 6, "41": 5, "42": 2, "43": 1 },
    deliveryDelay: "Livraison immédiate ou retrait boutique à Lomé",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400",
    description: "Sandales hommes 100% cuir de bovin cousu main à Lomé."
  },
  {
    id: "prod_005",
    name: "Chemise Kente Imprimé Moderne",
    category: "habits",
    priceXOF: 14000,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Motif Kente Jaune/Bleu"],
    stock: { "S": 3, "M": 6, "L": 4, "XL": 2 },
    deliveryDelay: "Livraison 24h à Lomé (1 000 FCFA)",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    description: "Chemise manches courtes en coton souple imprimé Kente."
  },
  {
    id: "prod_006",
    name: "Sac à Main Wax & Cuir Elegance",
    category: "accessoires",
    priceXOF: 16000,
    sizes: ["Taille Unique"],
    colors: ["Bordeaux/Wax", "Noir/Wax"],
    stock: { "Taille Unique": 4 },
    deliveryDelay: "Livraison 24h à Lomé (1 000 FCFA)",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    description: "Sac à main rigide avec fermeture dorée et doublure wax."
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "cust_101",
    name: "Abla Mensah",
    phone: "+228 90 12 34 56",
    channel: "whatsapp",
    handle: "@abla_m",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    city: "Lomé (Gbadago)",
    totalOrders: 3,
    notes: "Fidèle cliente, préfère les tailles M, paiement T-Money"
  },
  {
    id: "cust_102",
    name: "Koffi Amegantse",
    phone: "+228 92 88 44 11",
    channel: "whatsapp",
    handle: "@koffi_a",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    city: "Lomé (Hedzranawoé)",
    totalOrders: 1,
    notes: "Client régulier prêt-à-porter homme"
  },
  {
    id: "cust_103",
    name: "Sena Lawson",
    phone: "+228 91 55 66 77",
    channel: "instagram",
    handle: "@sena_lawson_chic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    city: "Lomé (Tokoin N'kafu)",
    totalOrders: 0,
    notes: "Nouvelle cliente attirée par la pub Instagram"
  },
  {
    id: "cust_104",
    name: "Fafa Adzoh",
    phone: "+228 93 40 11 22",
    channel: "facebook",
    handle: "Fafa Adzoh Togo",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    city: "Lomé (Bè)",
    totalOrders: 2,
    notes: "Préfère la livraison à domicile avec paiement cash à la livraison"
  },
  {
    id: "cust_105",
    name: "Yawovi Agbota",
    phone: "+228 98 77 66 55",
    channel: "whatsapp",
    handle: "@agbota_y",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    city: "Kara",
    totalOrders: 4,
    notes: "Expédition fréquente par bus postal vers Kara"
  }
];

// Helper to generate ISO timestamps relative to now
const now = new Date();
const minutesAgo = (mins) => new Date(now.getTime() - mins * 60 * 1000).toISOString();

export const INITIAL_REQUESTS = [
  {
    id: "req_501",
    customerId: "cust_101",
    customerName: "Abla Mensah",
    customerPhone: "+228 90 12 34 56",
    channel: "whatsapp",
    channelBadge: "WA",
    timestamp: minutesAgo(5),
    status: "nouveau",
    urgencyScore: 4,
    urgencyLevel: "haute",
    category: "disponibilite",
    productId: "prod_001",
    isAudio: true,
    audioDuration: "0:24",
    audioUrl: "",
    transcript: "Bonjour City Elegance ! Est-ce que vous avez encore la robe en wax bleu en Taille L ? Et c'est combien la livraison vers Gbadago ?",
    lastMessage: "🎙️ [Note Vocale 0:24] Est-ce que vous avez la robe wax bleu en Taille L...",
    aiAnalysis: {
      intent: "Vérification de stock (Robe Wax Taille L) + Tarif de livraison Gbadago",
      urgencyReason: "Cliente fidèle prête à commander immédiatement",
      suggestedResponse: "Bonjour Abla ! Merci pour votre message. 😊 La Robe Wax Bleu est actuellement épuisée en Taille L (disponible en M et XL à 18 500 FCFA). La livraison vers Gbadago est à 1 000 FCFA. Souhaitez-vous essayer la taille XL ou réserver le réapprovisionnement de la semaine prochaine ?",
      confidenceScore: 0.96
    },
    slaOverdue: false,
    messagesHistory: [
      {
        sender: "customer",
        text: "🎙️ [Note Vocale 0:24] Bonjour City Elegance ! Est-ce que vous avez encore la robe en wax bleu en Taille L ? Et c'est combien la livraison vers Gbadago ?",
        timestamp: minutesAgo(5),
        isAudio: true,
        audioDuration: "0:24",
        transcript: "Bonjour City Elegance ! Est-ce que vous avez encore la robe en wax bleu en Taille L ? Et c'est combien la livraison vers Gbadago ?"
      }
    ]
  },
  {
    id: "req_502",
    customerId: "cust_103",
    customerName: "Sena Lawson",
    customerPhone: "@sena_lawson_chic",
    channel: "instagram",
    channelBadge: "IG",
    timestamp: minutesAgo(12),
    status: "nouveau",
    urgencyScore: 5,
    urgencyLevel: "critique",
    category: "prix",
    productId: "prod_003",
    isAudio: false,
    transcript: "",
    lastMessage: "Coucou ! Les talons à aiguilles Gold sont à combien svp ? Vous avez le 39 ?",
    aiAnalysis: {
      intent: "Demande de prix + disponibilité pointure 39 (Talons Gold)",
      urgencyReason: "Demande de prix directe sur Instagram avec intention d'achat très forte pour une soirée ce weekend",
      suggestedResponse: "Bonsoir Sena ! ✨ Nos magnifiques Chaussures à Talon Gold sont à 22 000 FCFA. Malheureusement la pointure 39 est temporairement en rupture, mais nous avons le 38 et le 40 en stock immédiat ! Souhaitez-vous qu'on vous les apporte à Tokoin pour essayage ?",
      confidenceScore: 0.98
    },
    slaOverdue: false,
    messagesHistory: [
      {
        sender: "customer",
        text: "Coucou ! Les talons à aiguilles Gold sont à combien svp ? Vous avez le 39 ?",
        timestamp: minutesAgo(12),
        isAudio: false
      }
    ]
  },
  {
    id: "req_503",
    customerId: "cust_102",
    customerName: "Koffi Amegantse",
    customerPhone: "+228 92 88 44 11",
    channel: "whatsapp",
    channelBadge: "WA",
    timestamp: minutesAgo(42), // > 30 mins = SLA Overdue!
    status: "nouveau",
    urgencyScore: 4,
    urgencyLevel: "haute",
    category: "commande",
    productId: "prod_002",
    isAudio: false,
    transcript: "",
    lastMessage: "Bonsoir, je veux commander l'ensemble Bazin Bleu Nuit taille XL. Je paie par T-Money ?",
    aiAnalysis: {
      intent: "Intention d'achat ferme (Ensemble Bazin XL) + Modalités de paiement T-Money",
      urgencyReason: "Commande ferme en attente de validation depuis plus de 40 minutes !",
      suggestedResponse: "Bonsoir M. Koffi ! Oui, l'Ensemble Bazin Bleu Nuit en XL (35 000 FCFA) est bien disponible ! Vous pouvez effectuer le paiement T-Money au +228 90 12 34 56 (City Elegance). Dès réception, nous expédions vers Hedzranawoé !",
      confidenceScore: 0.99
    },
    slaOverdue: true,
    messagesHistory: [
      {
        sender: "customer",
        text: "Bonsoir, je veux commander l'ensemble Bazin Bleu Nuit taille XL. Je paie par T-Money ?",
        timestamp: minutesAgo(42),
        isAudio: false
      }
    ]
  },
  {
    id: "req_504",
    customerId: "cust_104",
    customerName: "Fafa Adzoh",
    customerPhone: "Fafa Adzoh Togo",
    channel: "facebook",
    channelBadge: "FB",
    timestamp: minutesAgo(85),
    status: "en_cours",
    urgencyScore: 3,
    urgencyLevel: "moyen",
    category: "livraison",
    productId: "prod_006",
    isAudio: false,
    transcript: "",
    lastMessage: "Est-ce que le sac à main bordeaux est livré aujourd'hui à Bè ?",
    aiAnalysis: {
      intent: "Confirmation d'horaire de livraison (Sac Wax Bordeaux à Bè)",
      urgencyReason: "Demande de suivi en cours",
      suggestedResponse: "Bonjour Mme Fafa ! Oui, notre livreur est actuellement en tournée dans le secteur de Bè. Il vous contactera au numéro renseigné dans 30 minutes. Merci de votre confiance !",
      confidenceScore: 0.92
    },
    slaOverdue: false,
    messagesHistory: [
      {
        sender: "customer",
        text: "Est-ce que le sac à main bordeaux est livré aujourd'hui à Bè ?",
        timestamp: minutesAgo(85),
        isAudio: false
      },
      {
        sender: "agent",
        text: "Bonjour Fafa ! Notre livreur passe cet après-midi vers 15h.",
        timestamp: minutesAgo(60),
        isAudio: false
      }
    ]
  },
  {
    id: "req_505",
    customerId: "cust_105",
    customerName: "Yawovi Agbota",
    customerPhone: "+228 98 77 66 55",
    channel: "whatsapp",
    channelBadge: "WA",
    timestamp: minutesAgo(150),
    status: "converti",
    urgencyScore: 2,
    urgencyLevel: "faible",
    category: "commande",
    productId: "prod_004",
    isAudio: true,
    audioDuration: "0:18",
    transcript: "J'ai bien reçu les sandales en cuir marron pointure 42 à Kara ! C'est parfait, merci City Elegance !",
    lastMessage: "🎙️ [Note Vocale 0:18] J'ai bien reçu les sandales en cuir marron pointure 42 à Kara...",
    aiAnalysis: {
      intent: "Confirmation de réception & satisfaction client",
      urgencyReason: "Commande finalisée avec succès",
      suggestedResponse: "Merci infiniment M. Yawovi ! Nous sommes ravis que les sandales vous plaisent. À très bientôt pour vos prochains achats chez City Elegance ! 🌟",
      confidenceScore: 0.99
    },
    slaOverdue: false,
    messagesHistory: [
      {
        sender: "customer",
        text: "🎙️ [Note Vocale 0:18] J'ai bien reçu les sandales en cuir marron pointure 42 à Kara ! C'est parfait, merci City Elegance !",
        timestamp: minutesAgo(150),
        isAudio: true,
        audioDuration: "0:18"
      }
    ]
  }
];
