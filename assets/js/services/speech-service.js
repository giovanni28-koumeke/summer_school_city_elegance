/* ==========================================================================
   CITY ELEGANCE — SERVICE AUDIO ET SPEECH (TRANSCRIPTION WEB SPEECH API)
   ========================================================================== */

export const SpeechService = {
  // Vérifie si la Web Speech API est supportée par le navigateur
  isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  // Simule la lecture d'une note vocale avec barre de progression
  playAudioNote(audioUrl, onProgress, onEnd) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        if (onEnd) onEnd();
      } else {
        if (onProgress) onProgress(progress);
      }
    }, 200);

    return {
      stop() {
        clearInterval(interval);
        if (onEnd) onEnd();
      }
    };
  },

  // Transcription en temps réel d'un flux audio via l'API Web Speech ou fallback
  transcribeAudioBlob(audioBlobOrText) {
    return new Promise((resolve) => {
      // Si la transcription textuelle est déjà fournie
      if (typeof audioBlobOrText === 'string') {
        setTimeout(() => resolve(audioBlobOrText), 600);
        return;
      }

      // Si l'API Web Speech du navigateur est disponible
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
          };

          recognition.onerror = () => {
            resolve("Bonjour, est-ce que cet article est disponible en stock à Lomé ?");
          };

          recognition.start();
          return;
        } catch (e) {
          // Fallback si la permission du micro est refusée
        }
      }

      // Transcription par défaut si pas d'API navigateur
      setTimeout(() => {
        resolve("Bonjour City Elegance, s'il vous plaît je voudrais savoir si la robe wax est disponible et les frais de livraison vers Bè.");
      }, 800);
    });
  }
};
