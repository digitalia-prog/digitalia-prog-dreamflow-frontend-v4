// Traductions
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

const templates = {
  'ugc-beaute': { contentType: 'ugc', niche: 'beaute', platform: 'instagram-reels', scriptCount: 3, prompt: 'Sérum anti-âge vitamine C' },
  'ugc-tech': { contentType: 'ugc', niche: 'tech', platform: 'tiktok', scriptCount: 5, prompt: 'Écouteurs sans fil à réduction de bruit' },
  'hook-viral': { contentType: 'hook', niche: 'ecommerce', platform: 'tiktok', scriptCount: 10, prompt: 'Produit innovant' },
  'script-pub': { contentType: 'script', niche: 'ecommerce', platform: 'facebook-reels', scriptCount: 3, prompt: 'Campagne pub e-commerce' },
  'agence': { contentType: 'agence', niche: 'agence-marketing', platform: 'tiktok', scriptCount: 50, prompt: 'Agence marketing digital UGC' }
};

const platformDurations = {
  'tiktok': '15-60s', 'instagram-reels': '15-90s', 'instagram-stories': '15s',
  'facebook-reels': '15-60s', 'facebook-stories': '15s', 'youtube-shorts': '15-60s',
  'snapchat': '10s', 'linkedin': '30-90s', 'twitter': '30-45s', 'pinterest': '15-30s'
};

function loadTemplate(templateName) {
  const t = templates[templateName];
  if (!t) return;
  document.getElementById('contentType').value = t.contentType;
  document.getElementById('niche').value = t.niche;
  document.getElementById('platform').value = t.platform;
  document.getElementById('scriptCount').value = t.scriptCount;
  document.getElementById('prompt').value = t.prompt;
}

function generate() {
  const language = document.getElementById('language').value;
  const contentType = document.getElementById('contentType').value;
  const niche = document.getElementById('niche').value;
  const platform = document.getElementById('platform').value;
  const scriptCount = parseInt(document.getElementById('scriptCount').value);
  const prompt = document.getElementById('prompt').value;
  const result = document.getElementById('result');
  const t = translations[language];
  
  if (!prompt) {
    result.innerHTML = '<p style="color:#ff6b6b;">' + t.error_prompt + '</p>';
    result.classList.add('show');
    return;
  }
  
  if (scriptCount < 1 || scriptCount > 1000) {
    result.innerHTML = '<p style="color:#ff6b6b;">' + t.error_count + '</p>';
    result.classList.add('show');
    return;
  }
  
  
  // Récupérer le style sélectionné
  const funStyle = document.getElementById('funStyle')?.value || 'funny';
  const bizStyle = document.getElementById('bizStyle')?.value || 'emotional';
  const style = mode === 'fun' ? funStyle : bizStyle;
  
  result.innerHTML = '<p style="color:#667eea;">' + t.generating + '</p>';
  result.classList.add('show');
  
  setTimeout(() => {
    let content = '';
    if (contentType === 'ugc') content = generateUGC(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'hook') content = generateHooks(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'script') content = generateFullScript(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'agence') content = generateAgencyScripts(niche, platform, prompt, scriptCount, language, style);
    result.innerHTML = content;
  }, 1500);
    let content = '';
    if (contentType === 'ugc') content = generateUGC(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'hook') content = generateHooks(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'script') content = generateFullScript(niche, platform, prompt, scriptCount, language, style);
    else if (contentType === 'agence') content = generateAgencyScripts(niche, platform, prompt, scriptCount, language, style);
    result.innerHTML = content;
  }, 1500);
  }, 1500);
}

function generateUGC(niche, platform, prompt, count, lang) {
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
</div>

<div style="background:rgba(20,10,40,0.8)3cd;padding:20px;border-radius:10px;margin-bottom:20px;">
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

<p style="margin-top:20px;padding:15px;background:rgba(20,10,40,0.8)3cd;border-radius:10px;">
  <strong>${t.note}:</strong> ${t.connect_api}
</p>
`;
}

function generateHooks(niche, platform, prompt, count, lang) {
  const hooksDB = {
    fr: ["Personne n'en parle mais...", "J'ai découvert le secret", "Arrête de faire ça en 2026", "POV: Tu découvres la vérité", "Attendez... QUOI ?!", "Je pensais pas que c'était possible", "Tout le monde se trompe", "C'est révolutionnaire", "Avant vs Après", "Le truc qu'on te cache"],
    en: ["Nobody talks about this but...", "I discovered the secret", "Stop doing this in 2026", "POV: You discover the truth", "Wait... WHAT?!", "I didn't think it was possible", "Everyone's wrong", "It's revolutionary", "Before vs After", "The thing they hide"],
    es: ["Nadie habla de esto pero...", "Descubrí el secreto", "Para de hacer esto en 2026", "POV: Descubres la verdad", "Espera... ¿QUÉ?!", "No pensé que fuera posible", "Todos están equivocados", "Es revolucionario", "Antes vs Después", "Lo que te ocultan"]
  };
  
  let hookList = '';
  const displayCount = Math.min(count, 10);
  for (let i = 0; i < displayCount; i++) {
    hookList += `<div style="background:rgba(30,15,50,0.8);padding:15px;margin-bottom:10px;border-radius:10px;border-left:4px solid #667eea;">
      <strong>Hook #${i+1}:</strong> ${hooksDB[lang][i]}
    </div>`;
function generateFullScript(niche, platform, prompt, count, lang, style = 'emotional') {
  const t = translations[lang];
  const styleHooks = {
    emotional: { fr: "J'avais honte de ça...", en: "I was ashamed...", es: "Me avergonzaba..." },
    aggressive: { fr: "ARRÊTE cette erreur !", en: "STOP this mistake!", es: "¡PARA este error!" },
    luxury: { fr: "Le secret des riches", en: "The secret of the rich", es: "El secreto de los ricos" }
  };
  const hook = styleHooks[style]?.[lang] || styleHooks.emotional[lang];
  return '<h2 style="color:#667eea;">Script STYLE: ' + style + '</h2><p style="padding:20px;background:rgba(30,15,50,0.8);border-radius:10px;"><strong>Hook:</strong> "' + hook + '"</p>';
}
function generateAgencyScripts(niche, platform, prompt, count, lang) {
  const t = translations[lang];
  return `
<h2 style="color:#667eea;margin-bottom:20px;">🏢 Package Agence: ${count} Scripts</h2>
<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:15px;margin-bottom:20px;">
  <h3>${lang==='fr'?'OFFRE AGENCE PREMIUM':lang==='en'?'PREMIUM AGENCY OFFER':'OFERTA AGENCIA PREMIUM'}</h3>
  <p style="font-size:18px;"><strong>${count} scripts ${lang==='fr'?'optimisés':'optimized'}</strong></p>
  <p>${t.platform}: ${platform.toUpperCase()}</p>
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

// Fonction pour changer de section
function showSection(sectionName) {
  // Masquer toutes les sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  // Afficher la section demandée
  if (sectionName === 'generator') {
    document.getElementById('generator-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
  } else if (sectionName === 'dashboard') {
    document.getElementById('dashboard-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    initCharts();
  }
}

// Initialiser les graphiques
function initCharts() {
  // Graphique d'évolution
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

  // Graphique plateformes
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

  // Graphique niches
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

  // Graphique types de contenu
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

// Fonction pour changer de section
function showSection(sectionName) {
  // Masquer toutes les sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  // Afficher la section demandée
  if (sectionName === 'generator') {
    document.getElementById('generator-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
  } else if (sectionName === 'dashboard') {
    document.getElementById('dashboard-section').classList.add('active');
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    initCharts();
  }
}

// Initialiser les graphiques
function initCharts() {
  // Graphique d'évolution
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

  // Graphique plateformes
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

  // Graphique niches
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

  // Graphique types de contenu
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
