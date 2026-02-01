/**
 * ============================================
 * DREAMFLOW - GÉNÉRATEUR DE SCRIPTS UGC IA
 * ============================================
 * 
 * RÉSUMÉ EXÉCUTIF:
 * Application SaaS de génération de scripts vidéo UGC (User Generated Content)
 * pour TikTok, Instagram, YouTube et autres plateformes sociales.
 * Utilise OpenAI pour générer du contenu optimisé avec vocabulaire 3D,
 * hooks viraux et stratégies de conversion testées.
 * 
 * INTENTION CLAIRE:
 * - Générer des scripts vidéo UGC en 30 secondes
 * - Adapter le contenu au style et à la plateforme
 * - Offrir 10+ styles différents (emotional, aggressive, luxury, etc.)
 * - Supporter 3 langues (FR, EN, ES)
 * - Intégrer OpenAI pour génération IA avancée
 * - Afficher des dashboards avec statistiques
 * 
 * VOCABULAIRE 3D (10 STYLES):
 * 1. EMOTIONAL - Hooks émotionnels et personnels
 * 2. AGGRESSIVE - Hooks directs et impactants
 * 3. LUXURY - Hooks exclusivité et prestige
 * 4. COMPARISON - Avant/Après et transformation
 * 5. SOCIAL-PROOF - Preuve sociale et expert
 * 6. BEFORE-AFTER - Transformation visuelle
 * 7. FUNNY - Humour et relatable
 * 8. STORYTIME - Narratif et histoire
 * 9. POV - Point of view et perspective
 * 10. MOTIVATION - Inspiration et action
 * 11. CHILL - Relaxe et lifestyle
 * 
 * ============================================
 */

// ============================================
// TRADUCTIONS (FR, EN, ES)
// ============================================
const translations = {
  fr: {
    generating: '⏳ Génération en cours...',
    error_prompt: '⚠️ Veuillez entrer une description',
    error_count: '⚠️ Le nombre doit être entre 1 et 1000',
    scripts_generated: 'Scripts Générés',
    duration: 'Durée',
    hook: 'Hook',
    body: 'Corps',
    cta: 'Call-to-Action',
    tips: 'Conseils Pro',
    platform: 'Plateforme',
    niche: 'Niche',
    note: 'Note',
    connect_api: 'Connecte l\'API UGCGrowth pour la génération complète !'
  },
  en: {
    generating: '⏳ Generating...',
    error_prompt: '⚠️ Please enter a description',
    error_count: '⚠️ Count must be between 1 and 1000',
    scripts_generated: 'Generated Scripts',
    duration: 'Duration',
    hook: 'Hook',
    body: 'Body',
    cta: 'Call-to-Action',
    tips: 'Pro Tips',
    platform: 'Platform',
    niche: 'Niche',
    note: 'Note',
    connect_api: 'Connect UGCGrowth API for full generation!'
  },
  es: {
    generating: '⏳ Generando...',
    error_prompt: '⚠️ Por favor ingrese una descripción',
    error_count: '⚠️ El número debe estar entre 1 y 1000',
    scripts_generated: 'Scripts Generados',
    duration: 'Duración',
    hook: 'Gancho',
    body: 'Cuerpo',
    cta: 'Llamada a la Acción',
    tips: 'Consejos Pro',
    platform: 'Plataforma',
    niche: 'Nicho',
    note: 'Nota',
    connect_api: '¡Conecta la API de UGCGrowth!'
  }
};

// ============================================
// TEMPLATES PRÉDÉFINIS
// ============================================
const templates = {
  'ugc-beaute': { contentType: 'ugc', niche: 'beaute', platform: 'instagram-reels', scriptCount: 3, prompt: 'Sérum anti-âge vitamine C' },
  'ugc-tech': { contentType: 'ugc', niche: 'tech', platform: 'tiktok', scriptCount: 5, prompt: 'Écouteurs sans fil à réduction de bruit' },
  'hook-viral': { contentType: 'hook', niche: 'ecommerce', platform: 'tiktok', scriptCount: 10, prompt: 'Produit innovant' },
  'script-pub': { contentType: 'script', niche: 'ecommerce', platform: 'facebook-reels', scriptCount: 3, prompt: 'Campagne pub e-commerce' },
  'agence': { contentType: 'agence', niche: 'agence-marketing', platform: 'tiktok', scriptCount: 50, prompt: 'Agence marketing digital UGC' }
};

// ============================================
// DURÉES PAR PLATEFORME
// ============================================
const platformDurations = {
  'tiktok': '15-60s', 'instagram-reels': '15-90s', 'instagram-stories': '15s',
  'facebook-reels': '15-60s', 'facebook-stories': '15s', 'youtube-shorts': '15-60s',
  'snapchat': '10s', 'linkedin': '30-90s', 'twitter': '30-45s', 'pinterest': '15-30s'
};

// ============================================
// FONCTION: CHARGER TEMPLATE
// ============================================
/**
 * Charge un template prédéfini dans les champs du formulaire
 * @param {string} templateName - Nom du template à charger
 */
function loadTemplate(templateName) {
  const t = templates[templateName];
  if (!t) return;
  document.getElementById('contentType').value = t.contentType;
  document.getElementById('niche').value = t.niche;
  document.getElementById('platform').value = t.platform;
  document.getElementById('scriptCount').value = t.scriptCount;
  document.getElementById('prompt').value = t.prompt;
}

// ============================================
// FONCTION: GÉNÉRER (PRINCIPALE)
// ============================================
/**
 * Fonction principale de génération de contenu
 * Valide les inputs et appelle les générateurs appropriés
 */
async function generate() {
  const language = document.getElementById('language').value;
  const contentType = document.getElementById('contentType').value;
  const niche = document.getElementById('niche').value;
  const platform = document.getElementById('platform').value;
  const scriptCount = parseInt(document.getElementById('scriptCount').value);
  const prompt = document.getElementById('prompt').value;
  const result = document.getElementById('result');
  const t = translations[language];
  
  // Validation du prompt
  if (!prompt) {
    result.innerHTML = '<p style="color:#ff6b6b;">' + t.error_prompt + '</p>';
    result.classList.add('show');
    return;
  }
  
  // Validation du nombre de scripts
  if (scriptCount < 1 || scriptCount > 1000) {
    result.innerHTML = '<p style="color:#ff6b6b;">' + t.error_count + '</p>';
    result.classList.add('show');
    return;
  }
  
  // Sélection du style basé sur le type de contenu
  const funStyle = document.getElementById('funStyle')?.value || 'funny';
  const bizStyle = document.getElementById('bizStyle')?.value || 'emotional';
  const style = contentType === 'fun' ? funStyle : bizStyle;
  
  // Afficher le message de génération
  result.innerHTML = '<p style="color:#667eea;">' + t.generating + '</p>';
  result.classList.add('show');
  
  // Générer le contenu après 1.5 secondes
  setTimeout(async () => {
    let content = '';
    if (contentType === "ugc") {
      content = await generateWithOpenAI(niche, platform, prompt, scriptCount, language, style, "ugc");
    } else if (contentType === "hook") {
      content = await generateWithOpenAI(niche, platform, prompt, scriptCount, language, style, "hook");
    } else if (contentType === "script") {
      content = await generateWithOpenAI(niche, platform, prompt, scriptCount, language, style, "script");
    } else if (contentType === 'agence') {
      content = generateAgencyScripts(niche, platform, prompt, scriptCount, language, style);
    }
    result.innerHTML = content;
  }, 1500);
}

// ============================================
// GÉNÉRATEUR: UGC
// ============================================
/**
 * Génère des scripts UGC avec hook, body et CTA
 * @param {string} niche - Niche du produit
 * @param {string} platform - Plateforme cible
 * @param {string} prompt - Description du produit
 * @param {number} count - Nombre de scripts
 * @param {string} lang - Langue (fr, en, es)
 * @param {string} style - Style de hook (vocabulary 3D)
 */
function generateUGC(niche, platform, prompt, count, lang, style) {
  const t = translations[lang];
  const duration = platformDurations[platform] || '30s';
  
  const hooks = {
    fr: ["Personne ne m'avait dit que ça ferait ÇA !", "POV: Tu découvres LE produit qui change tout", "J'ai testé 30 jours et..."],
    en: ["Nobody told me this would do THAT!", "POV: You discover THE game-changing product", "I tested for 30 days and..."],
    es: ["¡Nadie me dijo que haría ESO!", "POV: Descubres EL producto que lo cambia todo", "Lo probé 30 días y..."]
  };
  
  return `
<h2 style="color:#667eea;margin-bottom:20px;">✨ ${count} ${t.scripts_generated} UGC</h2>

<div style="background:rgba(30,15,50,0.8);padding:20px;border-radius:10px;margin-bottom:20px;">
  <p><strong>${t.platform}:</strong> ${platform}</p>
  <p><strong>${t.duration}:</strong> ${duration}</p>
  <p><strong>${t.niche}:</strong> ${niche}</p>
  <p><strong>Style:</strong> ${style}</p>
</div>

<div style="background:rgba(20,10,40,0.8);padding:20px;border-radius:10px;margin-bottom:20px;">
  <h3>🎬 Script UGC #1</h3>
  <p><strong>🎯 ${t.hook} (0-3s):</strong><br>"${hooks[lang][0]}"</p>
  <p><strong>💬 ${t.body} (3-20s):</strong><br>
  ${lang==='fr'?'- Montrer le produit en action':'- Show product in action'}<br>
  ${lang==='fr'?'- Partager ton expérience':'- Share your experience'}<br>
  ${lang==='fr'?'- Être authentique':'- Be authentic'}</p>
  <p><strong>🚀 ${t.cta}:</strong><br>"${lang==='fr'?'Lien en bio pour -20% !':lang==='en'?'Link in bio for -20%!':'¡Enlace en bio para -20%!'}"</p>
</div>

<div style="background:rgba(168,85,247,0.1);padding:20px;border-radius:10px;margin-bottom:20px;">
  <h3>🎬 Script UGC #2</h3>
  <p><strong>🎯 ${t.hook}:</strong><br>"${hooks[lang][1]}"</p>
  <p><strong>💬 ${t.body}:</strong><br>
  ${lang==='fr'?'- Avant/Après visuel':'- Before/After visual'}<br>
  ${lang==='fr'?'- Témoignage sincère':'- Honest testimonial'}</p>
</div>

${count > 2 ? `
<div style="background:rgba(168,85,247,0.12);padding:20px;border-radius:10px;margin-bottom:20px;">
  <h3>🎬 Script UGC #3</h3>
  <p><strong>🎯 ${t.hook}:</strong><br>"${hooks[lang][2]}"</p>
  <p><strong>💬 ${t.body}:</strong><br>
  ${lang==='fr'?'- Story-telling personnel':'- Personal storytelling'}</p>
</div>
` : ''}

<div style="background:rgba(40,20,60,0.8);padding:20px;border-radius:10px;">
  <h3>💡 ${t.tips}</h3>
  <ul style="line-height:2;">
    <li>✅ ${lang==='fr'?'Sois naturel':'Be natural'}</li>
    <li>✅ ${lang==='fr'?'Éclairage naturel':'Natural lighting'}</li>
    <li>✅ ${lang==='fr'?'Ajoute des sous-titres':'Add subtitles'}</li>
  </ul>
</div>

<p style="margin-top:20px;padding:15px;background:rgba(20,10,40,0.8);border-radius:10px;">
  <strong>${t.note}:</strong> ${t.connect_api}
</p>
`;
}

// ============================================
// GÉNÉRATEUR: HOOKS AVEC VOCABULAIRE 3D
// ============================================
/**
 * Génère des hooks viraux avec 11 styles différents (Vocabulaire 3D)
 * Styles: emotional, aggressive, luxury, comparison, social-proof, 
 *         before-after, funny, storytime, pov, motivation, chill
 * @param {string} niche - Niche du produit
 * @param {string} platform - Plateforme cible
 * @param {string} prompt - Description du produit
 * @param {number} count - Nombre de hooks
 * @param {string} lang - Langue (fr, en, es)
 * @param {string} style - Style de hook (vocabulary 3D)
 */
function generateHooks(niche, platform, prompt, count, lang, style = 'emotional') {
  // BASE DE DONNÉES DES STYLES - VOCABULAIRE 3D
  const styleHooksDB = {
    // STYLE 1: EMOTIONAL - Hooks émotionnels et personnels
    emotional: {
      fr: ["J'avais honte de ça...", "Personne ne comprend ce que je vis", "J'ai pleuré pendant 3 jours", "Je pensais que j'étais seul(e)", "Mon plus grand regret"],
      en: ["I was ashamed of this...", "Nobody understands what I'm going through", "I cried for 3 days", "I thought I was alone", "My biggest regret"],
      es: ["Me avergonzaba de esto...", "Nadie entiende lo que vivo", "Lloré durante 3 días", "Pensé que estaba solo/a", "Mi mayor arrepentimiento"]
    },
    // STYLE 2: AGGRESSIVE - Hooks directs et impactants
    aggressive: {
      fr: ["ARRÊTE de faire ça !", "Tu te trompes complètement", "C'est une GROSSE erreur", "Personne ne te dit la vérité", "STOP maintenant"],
      en: ["STOP doing this!", "You're completely wrong", "This is a BIG mistake", "Nobody tells you the truth", "STOP now"],
      es: ["¡PARA de hacer eso!", "Estás completamente equivocado", "Es un GRAN error", "Nadie te dice la verdad", "PARA ahora"]
    },
    // STYLE 3: LUXURY - Hooks exclusivité et prestige
    luxury: {
      fr: ["Le secret des riches", "Ce que l'élite ne veut pas que tu saches", "Accès VIP exclusif", "Réservé aux initiés", "Luxe discret"],
      en: ["The secret of the rich", "What the elite don't want you to know", "Exclusive VIP access", "Reserved for insiders", "Discreet luxury"],
      es: ["El secreto de los ricos", "Lo que la élite no quiere que sepas", "Acceso VIP exclusivo", "Reservado para iniciados", "Lujo discreto"]
    },
    // STYLE 4: COMPARISON - Avant/Après et transformation
    comparison: {
      fr: ["Avant vs Après", "J'étais comme toi avant", "La différence est choquante", "Tu ne vas pas croire la transformation", "Regarde ce changement"],
      en: ["Before vs After", "I used to be like you", "The difference is shocking", "You won't believe the transformation", "Look at this change"],
      es: ["Antes vs Después", "Antes era como tú", "La diferencia es impactante", "No creerás la transformación", "Mira este cambio"]
    },
    // STYLE 5: SOCIAL-PROOF - Preuve sociale et expert
    'social-proof': {
      fr: ["10 000 personnes approuvent", "Résultats prouvés", "Client satisfait témoigne", "Note 5/5 étoiles", "Recommandé par des experts"],
      en: ["10,000 people approve", "Proven results", "Satisfied customer testifies", "5/5 star rating", "Recommended by experts"],
      es: ["10,000 personas aprueban", "Resultados probados", "Cliente satisfecho testifica", "Calificación 5/5 estrellas", "Recomendado por expertos"]
    },
    // STYLE 6: BEFORE-AFTER - Transformation visuelle
    'before-after': {
      fr: ["Ma vie avant/après", "J'ai tout changé en 30 jours", "Transformation totale", "De 0 à résultat", "Le glow up"],
      en: ["My life before/after", "I changed everything in 30 days", "Total transformation", "From 0 to results", "The glow up"],
      es: ["Mi vida antes/después", "Cambié todo en 30 días", "Transformación total", "De 0 a resultados", "El glow up"]
    },
    // STYLE 7: FUNNY - Humour et relatable
    funny: {
      fr: ["Personne : ... Moi :", "Le truc qui m'énerve", "Quand ta mère dit non", "Moi vs la réalité", "C'est relatable ou pas ?"],
      en: ["Nobody: ... Me:", "The thing that annoys me", "When your mom says no", "Me vs reality", "Is this relatable or not?"],
      es: ["Nadie: ... Yo:", "Lo que me molesta", "Cuando tu mamá dice no", "Yo vs la realidad", "¿Es relatable o no?"]
    },
    // STYLE 8: STORYTIME - Narratif et histoire
    storytime: {
      fr: ["Il y a 3 mois...", "Je vais vous raconter", "Histoire vraie", "Vous n'allez pas croire ce qui s'est passé", "Flashback"],
      en: ["3 months ago...", "I'm going to tell you", "True story", "You won't believe what happened", "Flashback"],
      es: ["Hace 3 meses...", "Les voy a contar", "Historia real", "No creerás lo que pasó", "Flashback"]
    },
    // STYLE 9: POV - Point of view et perspective
    pov: {
      fr: ["POV: Tu découvres la vérité", "POV: Quand...", "Imagine que...", "Tu es en train de...", "Ce moment où..."],
      en: ["POV: You discover the truth", "POV: When...", "Imagine that...", "You're about to...", "That moment when..."],
      es: ["POV: Descubres la verdad", "POV: Cuando...", "Imagina que...", "Estás a punto de...", "Ese momento cuando..."]
    },
    // STYLE 10: MOTIVATION - Inspiration et action
    motivation: {
      fr: ["C'est MAINTENANT ou jamais", "Tu mérites mieux", "Arrête de te limiter", "Crois en toi", "Le moment est venu"],
      en: ["It's NOW or never", "You deserve better", "Stop limiting yourself", "Believe in yourself", "The time has come"],
      es: ["Es AHORA o nunca", "Mereces más", "Deja de limitarte", "Cree en ti", "Ha llegado el momento"]
    },
    // STYLE 11: CHILL - Relaxe et lifestyle
    chill: {
      fr: ["Petit vlog du jour", "Ma routine", "Get ready with me", "Chill vibes only", "Journée tranquille"],
      en: ["Little vlog of the day", "My routine", "Get ready with me", "Chill vibes only", "Peaceful day"],
      es: ["Pequeño vlog del día", "Mi rutina", "Prepárate conmigo", "Solo buenas vibras", "Día tranquilo"]
    }
  };
  
  // Sélectionner les hooks du style choisi
  const hooks = styleHooksDB[style]?.[lang] || styleHooksDB.emotional[lang];
  
  let hookList = '';
  const displayCount = Math.min(count, 10);
  for (let i = 0; i < displayCount; i++) {
    hookList += `<div style="background:rgba(30,15,50,0.8);padding:15px;margin-bottom:10px;border-radius:10px;border-left:4px solid #667eea;">
      <strong>Hook #${i+1} (${style}):</strong> ${hooks[i] || 'Hook générique'}
    </div>`;
  }
  
  return `
<h2 style="color:#667eea;margin-bottom:20px;">🔥 ${count} Hooks ${lang==='fr'?'Viraux':lang==='en'?'Viral':'Virales'}</h2>
<div style="background:rgba(30,15,50,0.8);padding:20px;border-radius:10px;margin-bottom:20px;">
  <p><strong>${translations[lang].platform}:</strong> ${platform}</p>
  <p><strong>Style Vocabulary 3D:</strong> ${style}</p>
</div>
${hookList}
<p style="padding:15px;background:rgba(20,10,40,0.8);border-radius:10px;margin-top:20px;">
  <strong>${translations[lang].note}:</strong> ${translations[lang].connect_api}
</p>
`;
}

// ============================================
// GÉNÉRATEUR: SCRIPT COMPLET
// ============================================
/**
 * Génère un script complet avec hook, body et CTA
 */
function generateFullScript(niche, platform, prompt, count, lang, style) {
  const t = translations[lang];
  return `
<h2 style="color:#667eea;margin-bottom:20px;">🎬 ${count} Script${count>1?'s':''} Complet${count>1?'s':''}</h2>
<div style="background:rgba(20,10,40,0.8);border:2px solid #667eea;padding:25px;border-radius:15px;">
  <h3 style="color:#667eea;">📹 Script Vidéo - ${platform.toUpperCase()}</h3>
  <p><strong>${t.duration}:</strong> ${platformDurations[platform]}</p>
  <p><strong>Style Vocabulary 3D:</strong> ${style}</p>
  <hr style="margin:20px 0;">
  
  <div style="background:rgba(30,15,50,0.8);padding:15px;border-radius:10px;margin:15px 0;">
    <h4 style="color:#667eea;">🎯 ${t.hook} (0-3s)</h4>
    <p>"${lang==='fr'?'Tu perds de l\'argent si tu ne sais pas ça':lang==='en'?'You\'re losing money if you don\'t know this':'Pierdes dinero si no sabes esto'}"</p>
  </div>
  
  <div style="background:rgba(20,10,40,0.8);padding:15px;border-radius:10px;margin:15px 0;">
    <h4>💬 ${t.body} (3-20s)</h4>
    <p>${lang==='fr'?'Présentation problème + solution':'Problem + solution presentation'}</p>
    <ul style="margin-left:20px;">
      <li>${lang==='fr'?'Bénéfice #1':'Benefit #1'}</li>
      <li>${lang==='fr'?'Bénéfice #2':'Benefit #2'}</li>
      <li>${lang==='fr'?'Preuve sociale':'Social proof'}</li>
    </ul>
  </div>
  
  <div style="background:#667eea;color:white;padding:15px;border-radius:10px;">
    <h4>🚀 ${t.cta} (20-30s)</h4>
    <p>"${lang==='fr'?'Lien en bio MAINTENANT':lang==='en'?'Link in bio NOW':'Enlace en bio AHORA'}"</p>
  </div>
</div>
<p style="margin-top:20px;padding:15px;background:rgba(20,10,40,0.8);border-radius:10px;">
  <strong>${t.note}:</strong> ${t.connect_api}
</p>
`;
}

// ============================================
// GÉNÉRATEUR: AGENCY SCRIPTS
// ============================================
/**
 * Génère un package agence avec multiple scripts
 */
function generateAgencyScripts(niche, platform, prompt, count, lang, style) {
  const t = translations[lang];
  return `
<h2 style="color:#667eea;margin-bottom:20px;">🏢 Package Agence: ${count} Scripts</h2>
<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:15px;margin-bottom:20px;">
  <h3>${lang==='fr'?'OFFRE AGENCE PREMIUM':lang==='en'?'PREMIUM AGENCY OFFER':'OFERTA AGENCIA PREMIUM'}</h3>
  <p style="font-size:18px;"><strong>${count} scripts ${lang==='fr'?'optimisés':'optimized'}</strong></p>
  <p>${t.platform}: ${platform.toUpperCase()}</p>
  <p><strong>Vocabulary 3D Style:</strong> ${style}</p>
</div>

<div style="background:rgba(20,10,40,0.8);border:2px solid #667eea;padding:25px;border-radius:15px;">
  <h3 style="color:#667eea;">📦 ${lang==='fr'?'Contenu':'Content'}</h3>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin:20px 0;">
    <div style="background:rgba(30,15,50,0.8);padding:15px;border-radius:10px;text-align:center;">
      <h4 style="color:#667eea;font-size:32px;">${Math.floor(count*0.4)}</h4>
      <p>Scripts UGC</p>
    </div>
    <div style="background:rgba(30,15,50,0.8);padding:15px;border-radius:10px;text-align:center;">
      <h4 style="color:#667eea;font-size:32px;">${Math.floor(count*0.3)}</h4>
      <p>Hooks</p>
    </div>
    <div style="background:rgba(30,15,50,0.8);padding:15px;border-radius:10px;text-align:center;">
      <h4 style="color:#667eea;font-size:32px;">${Math.floor(count*0.3)}</h4>
      <p>Scripts Pub</p>
    </div>
  </div>
  
  <ul style="line-height:2.5;">
    <li>✅ ${count} scripts professionnels</li>
    <li>✅ Hooks ${lang==='fr'?'testés':'tested'}</li>
    <li>✅ Timings ${lang==='fr'?'précis':'precise'}</li>
    <li>✅ ${lang==='fr'?'Variations A/B':'A/B variations'}</li>
  </ul>
</div>
<p style="margin-top:20px;padding:15px;background:#667eea;color:white;border-radius:10px;text-align:center;">
  <strong>${lang==='fr'?'Prêt à scaler ?':lang==='en'?'Ready to scale?':'¿Listo para escalar?'}</strong><br>
  ${t.connect_api}
</p>
`;
}

// ============================================
// UI: AFFICHAGE DES SECTIONS
// ============================================
/**
 * Affiche/cache les sections du dashboard
 */
function showSection(sectionName) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  if (sectionName === 'generator') {
    document.getElementById('generator-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
  } else if (sectionName === 'dashboard') {
    document.getElementById('dashboard-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    initCharts();
  }
}

// ============================================
// CHARTS: INITIALISER LES GRAPHIQUES
// ============================================
/**
 * Initialise 4 graphiques Chart.js
 */
function initCharts() {
  const ctx1 = document.getElementById('generationsChart');
  if (ctx1 && !ctx1.chart) {
    ctx1.chart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [{
          label: 'Scripts générés',
          data: [65, 89, 120, 151, 182, 205, 247],
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#c084fc' } }
        },
        scales: {
          y: { 
            ticks: { color: '#c084fc' },
            grid: { color: 'rgba(138, 43, 226, 0.1)' }
          },
          x: { 
            ticks: { color: '#c084fc' },
            grid: { color: 'rgba(138, 43, 226, 0.1)' }
          }
        }
      }
    });
  }

  const ctx2 = document.getElementById('platformsChart');
  if (ctx2 && !ctx2.chart) {
    ctx2.chart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Autres'],
        datasets: [{
          data: [35, 28, 18, 12, 7],
          backgroundColor: ['#a855f7', '#ec4899', '#8b5cf6', '#c084fc', '#e9d5ff']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#c084fc' } }
        }
      }
    });
  }

  const ctx3 = document.getElementById('nichesChart');
  if (ctx3 && !ctx3.chart) {
    ctx3.chart = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Beauté', 'Tech', 'Fitness', 'E-commerce', 'Food'],
        datasets: [{
          label: 'Générations',
          data: [245, 198, 167, 143, 128],
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: '#a855f7',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#c084fc' } }
        },
        scales: {
          y: { 
            ticks: { color: '#c084fc' },
            grid: { color: 'rgba(138, 43, 226, 0.1)' }
          },
          x: { 
            ticks: { color: '#c084fc' },
            grid: { color: 'rgba(138, 43, 226, 0.1)' }
          }
        }
      }
    });
  }

  const ctx4 = document.getElementById('contentTypesChart');
  if (ctx4 && !ctx4.chart) {
    ctx4.chart = new Chart(ctx4, {
      type: 'pie',
      data: {
        labels: ['UGC', 'Hooks', 'Scripts', 'Agence'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#a855f7', '#ec4899', '#8b5cf6', '#c084fc']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#c084fc' } }
        }
      }
    });
  }
}

// ============================================
// OPENAI: APPELS API
// ============================================
/**
 * Appel générique à l'API OpenAI
 */
async function callOpenAIAPI(prompt) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return null;
  }
}

/**
 * Génération avec OpenAI et style vocabulary 3D
 */
async function generateWithOpenAI(niche, platform, prompt, count, lang, style, contentType) {
  const openaiPrompt = `Tu es expert UGC. Crée du contenu ${contentType} unique pour: ${niche} sur ${platform}. Produit: ${prompt}. Style: ${style}. Format: HTML avec styling.`;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: openaiPrompt })
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return `<h2 style="color:#667eea;">🤖 OpenAI Generated (${style})</h2><div style="background:rgba(30,15,50,0.8);padding:20px;border-radius:10px;"><p>${data.content}</p></div>`;
  } catch (error) {
    return `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}

/**
 * Génération UGC spécifique avec OpenAI
 */
async function generateUGCWithOpenAI(niche, platform, prompt, count, lang) {
  const t = translations[lang];
  const duration = platformDurations[platform] || '30s';
  
  const openaiPrompt = `Tu es expert UGC. Crée ${count} scripts vidéo pour ${niche} sur ${platform}. Produit: ${prompt}. Format JSON avec: hook, body, cta, tips.`;

  try {
    const content = await callOpenAIAPI(openaiPrompt);
    if (!content) throw new Error('No content generated');
    
    return `<h2 style="color:#667eea;">✨ ${count} ${t.scripts_generated}</h2><div style="background:rgba(30,15,50,0.8);padding:20px;border-radius:10px;"><p>${content}</p></div>`;
  } catch (error) {
    return `<p style="color:red;">❌ Error: ${error.message}</p>`;
  }
}
