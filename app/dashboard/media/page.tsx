"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

type TextItem =
  | string
  | {
      heading?: string;
      title?: string;
      content?: string;
      text?: string;
      description?: string;
    };

type ReportLanguage = "fr" | "en" | "es" | "it" | "ar" | "zh";

type MediaResult = {
  source?: string;
  analysisMode?: string;
  reportLanguage?: string;
  transcript?: string;
  cleanedTranscript?: string;

  coreMessage?: string;
  whyItMatters?: string;
  marketTension?: string;
  problemStatement?: string;
  uniqueBelief?: string;
  whyNow?: string;
  founderNarrative?: string;
  executiveSummary?: string;

  strongIdeas?: TextItem[];
  mediaHeadlines?: TextItem[];
  keyQuotes?: TextItem[];
  prAngles?: TextItem[];
  strategicOpportunities?: TextItem[];
  missingInformation?: TextItem[];

  idealCustomerProfile?: TextItem[];
  painPoints?: TextItem[];
  agencyOpportunities?: TextItem[];
  growthRecommendations?: TextItem[];
  offerClarity?: string;
  positioning?: string;

  editorialStructure?: {
    title?: string;
    subtitle?: string;
    sections?: TextItem[];
  };

  mediaKit?: {
    companyDescription?: string;
    mission?: string;
    vision?: string;
    positioning?: string;
  };

  mediaArticle?: string;
  founderInterview?: string;
  mediaBrochure?: string;
  linkedinPost?: string;
  shortExtracts?: TextItem[];
};

const UI = {
  fr: {
    mediaIntelligence: "UGC Growth · Intelligence média",
    title: "Founder & Media Engine",
    subtitle:
      "Transforme des notes, une interview audio ou une vidéo founder en intelligence média et stratégique : message central, tension marché, croyance différenciante, lecture agence, angles RP, article, brochure, post LinkedIn et extraits courts.",
    textMode: "Texte / Notes founder",
    uploadMode: "Audio / Vidéo interview",
    analysisMode: "Mode d’analyse",
    founder: "Founder",
    founderDesc: "Message central, récit founder, vision, tension stratégique.",
    agency: "Agency",
    agencyDesc: "ICP, points de douleur, offre, positionnement, opportunités agence.",
    reportLanguage: "Langue du rapport",
    notesLabel: "Notes texte / Interview brute",
    notesPlaceholder:
      "Colle ici une interview, une idée brute, une note founder ou un brief média...",
    uploadLabel: "Upload audio / vidéo",
    selectedFile: "Fichier sélectionné :",
    optionalNotes: "Notes complémentaires optionnelles",
    optionalNotesPlaceholder:
      "Ajoute le contexte : nom de la société, qui parle, objectif, ton souhaité, angle média...",
    textFlow: "Flux texte : OpenAI direct.",
    uploadFlow:
      "Flux audio/vidéo : Whisper OpenAI → transcript → intelligence founder.",
    generate: "Générer le rapport média",
    generating: "Génération...",
    error: "Erreur pendant la génération média.",
    founderReport: "Rapport d’intelligence founder",
    agencyReport: "Rapport d’intelligence agence",
    strategicSummary: "Synthèse stratégique",
    founderSummaryDesc:
      "Cette section extrait la valeur stratégique de l’interview : message central, narration founder, tension marché et croyance différenciante.",
    agencySummaryDesc:
      "Cette section transforme la matière brute en lecture agence : client idéal, douleurs marché, clarté de l’offre, positionnement et opportunités commerciales.",
    coreMessage: "Message central",
    whyItMatters: "Pourquoi c’est important",
    strategicIntelligence: "Intelligence stratégique",
    deepReading: "Lecture de fond",
    deepReadingDesc:
      "Cette couche détecte la tension réelle, le problème central, la croyance différenciante et pourquoi le sujet compte maintenant.",
    marketTension: "Tension de marché",
    problemStatement: "Problème central",
    uniqueBelief: "Croyance différenciante",
    whyNow: "Pourquoi maintenant",
    founderNarrative: "Narration founder",
    executiveSummary: "Résumé exécutif",
    agencyIntelligence: "Intelligence agence",
    agencyBusinessReading: "Lecture business pour agences",
    agencyBusinessDesc:
      "Cette partie analyse le produit comme une offre destinée aux agences : clients cibles, douleurs, opportunités, clarté de l’offre et recommandations de croissance.",
    icp: "Client idéal",
    painPoints: "Points de douleur",
    offerClarity: "Clarté de l’offre",
    positioning: "Positionnement",
    agencyOpportunities: "Opportunités agence",
    growthRecommendations: "Recommandations de croissance",
    mediaHeadlines: "Titres média",
    keyQuotes: "Citations clés",
    prAngles: "Angles RP",
    strategicOpportunities: "Opportunités stratégiques",
    mediaKit: "Kit média",
    description: "Description",
    mission: "Mission",
    vision: "Vision",
    mediaKitPositioning: "Positionnement",
    editorialStructure: "Structure éditoriale",
    editorialTitle: "Titre",
    subtitleLabel: "Sous-titre",
    sections: "Sections",
    productionContent: "Production de contenus",
    generatedContent: "Contenus générés",
    generatedContentDesc:
      "Ces contenus sont prêts à être retravaillés, validés, publiés ou adaptés en page média.",
    mediaArticle: "Article média",
    founderInterview: "Interview founder",
    mediaBrochure: "Brochure média",
    linkedinPost: "Post LinkedIn",
    strongIdeas: "Idées fortes",
    shortExtracts: "Extraits courts",
    missingInfo: "Informations manquantes",
    source: "Source",
    sourceTranscript: "Transcript source",
    cleanedTranscript: "Transcript nettoyé",
  },
  en: {
    mediaIntelligence: "UGC Growth · Media Intelligence",
    title: "Founder & Media Engine",
    subtitle:
      "Turns founder notes, audio interviews or videos into media and strategic intelligence: core message, market tension, differentiating belief, agency reading, PR angles, article, brochure, LinkedIn post and short extracts.",
    textMode: "Text / Founder Notes",
    uploadMode: "Audio / Video Interview",
    analysisMode: "Analysis Mode",
    founder: "Founder",
    founderDesc: "Core message, founder story, vision, strategic tension.",
    agency: "Agency",
    agencyDesc: "ICP, pain points, offer, positioning, agency opportunities.",
    reportLanguage: "Report Language",
    notesLabel: "Text notes / Raw interview",
    notesPlaceholder:
      "Paste an interview, raw idea, founder note, or media brief here...",
    uploadLabel: "Upload audio / video",
    selectedFile: "Selected file:",
    optionalNotes: "Optional additional notes",
    optionalNotesPlaceholder:
      "Add context: company name, speaker, objective, desired tone, media angle...",
    textFlow: "Text flow: direct OpenAI.",
    uploadFlow:
      "Audio/video flow: OpenAI Whisper → transcript → Founder Intelligence.",
    generate: "Generate media report",
    generating: "Generating...",
    error: "Error during media generation.",
    founderReport: "Founder Intelligence Report",
    agencyReport: "Agency Intelligence Report",
    strategicSummary: "Strategic Summary",
    founderSummaryDesc:
      "This section extracts the strategic value of the interview: core message, founder narrative, market tension and differentiating belief.",
    agencySummaryDesc:
      "This section turns raw material into an agency reading: ideal customer, market pains, offer clarity, positioning and commercial opportunities.",
    coreMessage: "Core Message",
    whyItMatters: "Why It Matters",
    strategicIntelligence: "Strategic Intelligence",
    deepReading: "Deep Reading",
    deepReadingDesc:
      "This layer detects the real tension, central problem, differentiating belief and why the topic matters now.",
    marketTension: "Market Tension",
    problemStatement: "Problem Statement",
    uniqueBelief: "Unique Belief",
    whyNow: "Why Now",
    founderNarrative: "Founder Narrative",
    executiveSummary: "Executive Summary",
    agencyIntelligence: "Agency Intelligence",
    agencyBusinessReading: "Business Reading for Agencies",
    agencyBusinessDesc:
      "This section analyzes the product as an agency offer: target clients, pains, opportunities, offer clarity and growth recommendations.",
    icp: "ICP",
    painPoints: "Pain Points",
    offerClarity: "Offer Clarity",
    positioning: "Positioning",
    agencyOpportunities: "Agency Opportunities",
    growthRecommendations: "Growth Recommendations",
    mediaHeadlines: "Media Headlines",
    keyQuotes: "Key Quotes",
    prAngles: "PR Angles",
    strategicOpportunities: "Strategic Opportunities",
    mediaKit: "Media Kit",
    description: "Description",
    mission: "Mission",
    vision: "Vision",
    mediaKitPositioning: "Positioning",
    editorialStructure: "Editorial Structure",
    editorialTitle: "Title",
    subtitleLabel: "Subtitle",
    sections: "Sections",
    productionContent: "Production Content",
    generatedContent: "Generated Content",
    generatedContentDesc:
      "These assets are ready to be refined, validated, published, or adapted into a media page.",
    mediaArticle: "Media Article",
    founderInterview: "Founder Interview",
    mediaBrochure: "Media Brochure",
    linkedinPost: "LinkedIn Post",
    strongIdeas: "Strong Ideas",
    shortExtracts: "Short Extracts",
    missingInfo: "Missing Information",
    source: "Source",
    sourceTranscript: "Source Transcript",
    cleanedTranscript: "Cleaned Transcript",
  },
  es: {
    mediaIntelligence: "UGC Growth · Inteligencia mediática",
    title: "Founder & Media Engine",
    subtitle:
      "Transforma notas founder, entrevistas de audio o videos en inteligencia mediática y estratégica: mensaje central, tensión de mercado, creencia diferencial, lectura para agencias, ángulos de PR, artículo, brochure, post de LinkedIn y extractos cortos.",
    textMode: "Texto / Notas founder",
    uploadMode: "Audio / Video entrevista",
    analysisMode: "Modo de análisis",
    founder: "Founder",
    founderDesc: "Mensaje central, narrativa founder, visión, tensión estratégica.",
    agency: "Agency",
    agencyDesc: "Cliente ideal, puntos de dolor, oferta, posicionamiento, oportunidades de agencia.",
    reportLanguage: "Idioma del informe",
    notesLabel: "Notas de texto / Entrevista bruta",
    notesPlaceholder:
      "Pega aquí una entrevista, una idea bruta, una nota founder o un brief media...",
    uploadLabel: "Subir audio / video",
    selectedFile: "Archivo seleccionado:",
    optionalNotes: "Notas complementarias opcionales",
    optionalNotesPlaceholder:
      "Añade contexto: nombre de la empresa, quién habla, objetivo, tono deseado, ángulo media...",
    textFlow: "Flujo texto: OpenAI directo.",
    uploadFlow:
      "Flujo audio/video: OpenAI Whisper → transcripción → inteligencia founder.",
    generate: "Generar informe media",
    generating: "Generando...",
    error: "Error durante la generación media.",
    founderReport: "Informe de inteligencia founder",
    agencyReport: "Informe de inteligencia para agencias",
    strategicSummary: "Síntesis estratégica",
    founderSummaryDesc:
      "Esta sección extrae el valor estratégico de la entrevista: mensaje central, narrativa founder, tensión de mercado y creencia diferencial.",
    agencySummaryDesc:
      "Esta sección transforma la materia bruta en lectura para agencia: cliente ideal, dolores de mercado, claridad de oferta, posicionamiento y oportunidades comerciales.",
    coreMessage: "Mensaje central",
    whyItMatters: "Por qué importa",
    strategicIntelligence: "Inteligencia estratégica",
    deepReading: "Lectura profunda",
    deepReadingDesc:
      "Esta capa detecta la tensión real, el problema central, la creencia diferencial y por qué el tema importa ahora.",
    marketTension: "Tensión de mercado",
    problemStatement: "Problema central",
    uniqueBelief: "Creencia diferencial",
    whyNow: "Por qué ahora",
    founderNarrative: "Narrativa founder",
    executiveSummary: "Resumen ejecutivo",
    agencyIntelligence: "Inteligencia para agencias",
    agencyBusinessReading: "Lectura business para agencias",
    agencyBusinessDesc:
      "Esta parte analiza el producto como una oferta para agencias: clientes objetivo, dolores, oportunidades, claridad de oferta y recomendaciones de crecimiento.",
    icp: "Cliente ideal",
    painPoints: "Puntos de dolor",
    offerClarity: "Claridad de oferta",
    positioning: "Posicionamiento",
    agencyOpportunities: "Oportunidades para agencias",
    growthRecommendations: "Recomendaciones de crecimiento",
    mediaHeadlines: "Titulares media",
    keyQuotes: "Citas clave",
    prAngles: "Ángulos PR",
    strategicOpportunities: "Oportunidades estratégicas",
    mediaKit: "Kit media",
    description: "Descripción",
    mission: "Misión",
    vision: "Visión",
    mediaKitPositioning: "Posicionamiento",
    editorialStructure: "Estructura editorial",
    editorialTitle: "Título",
    subtitleLabel: "Subtítulo",
    sections: "Secciones",
    productionContent: "Producción de contenidos",
    generatedContent: "Contenidos generados",
    generatedContentDesc:
      "Estos contenidos están listos para ser refinados, validados, publicados o adaptados a una página media.",
    mediaArticle: "Artículo media",
    founderInterview: "Entrevista founder",
    mediaBrochure: "Brochure media",
    linkedinPost: "Post de LinkedIn",
    strongIdeas: "Ideas fuertes",
    shortExtracts: "Extractos cortos",
    missingInfo: "Información faltante",
    source: "Fuente",
    sourceTranscript: "Transcripción fuente",
    cleanedTranscript: "Transcripción limpia",
  },
  it: {
    mediaIntelligence: "UGC Growth · Intelligenza media",
    title: "Founder & Media Engine",
    subtitle:
      "Trasforma note founder, interviste audio o video in intelligence media e strategica: messaggio centrale, tensione di mercato, convinzione differenziante, lettura agency, angoli PR, articolo, brochure, post LinkedIn ed estratti brevi.",
    textMode: "Testo / Note founder",
    uploadMode: "Audio / Video intervista",
    analysisMode: "Modalità di analisi",
    founder: "Founder",
    founderDesc: "Messaggio centrale, racconto founder, visione, tensione strategica.",
    agency: "Agency",
    agencyDesc: "Cliente ideale, pain point, offerta, posizionamento, opportunità agency.",
    reportLanguage: "Lingua del report",
    notesLabel: "Note testuali / Intervista grezza",
    notesPlaceholder:
      "Incolla qui un’intervista, un’idea grezza, una nota founder o un brief media...",
    uploadLabel: "Carica audio / video",
    selectedFile: "File selezionato:",
    optionalNotes: "Note aggiuntive opzionali",
    optionalNotesPlaceholder:
      "Aggiungi contesto: nome azienda, chi parla, obiettivo, tono desiderato, angolo media...",
    textFlow: "Flusso testo: OpenAI diretto.",
    uploadFlow:
      "Flusso audio/video: OpenAI Whisper → trascrizione → intelligence founder.",
    generate: "Genera report media",
    generating: "Generazione...",
    error: "Errore durante la generazione media.",
    founderReport: "Report di intelligence founder",
    agencyReport: "Report di intelligence per agenzie",
    strategicSummary: "Sintesi strategica",
    founderSummaryDesc:
      "Questa sezione estrae il valore strategico dell’intervista: messaggio centrale, narrativa founder, tensione di mercato e convinzione differenziante.",
    agencySummaryDesc:
      "Questa sezione trasforma il materiale grezzo in lettura agency: cliente ideale, problemi di mercato, chiarezza dell’offerta, posizionamento e opportunità commerciali.",
    coreMessage: "Messaggio centrale",
    whyItMatters: "Perché è importante",
    strategicIntelligence: "Intelligenza strategica",
    deepReading: "Lettura di fondo",
    deepReadingDesc:
      "Questo livello rileva la tensione reale, il problema centrale, la convinzione differenziante e perché il tema conta ora.",
    marketTension: "Tensione di mercato",
    problemStatement: "Problema centrale",
    uniqueBelief: "Convinzione differenziante",
    whyNow: "Perché ora",
    founderNarrative: "Narrativa founder",
    executiveSummary: "Sintesi esecutiva",
    agencyIntelligence: "Intelligence per agenzie",
    agencyBusinessReading: "Lettura business per agenzie",
    agencyBusinessDesc:
      "Questa parte analizza il prodotto come offerta per agenzie: clienti target, problemi, opportunità, chiarezza dell’offerta e raccomandazioni di crescita.",
    icp: "Cliente ideale",
    painPoints: "Problemi principali",
    offerClarity: "Chiarezza dell’offerta",
    positioning: "Posizionamento",
    agencyOpportunities: "Opportunità agency",
    growthRecommendations: "Raccomandazioni di crescita",
    mediaHeadlines: "Titoli media",
    keyQuotes: "Citazioni chiave",
    prAngles: "Angoli PR",
    strategicOpportunities: "Opportunità strategiche",
    mediaKit: "Kit media",
    description: "Descrizione",
    mission: "Missione",
    vision: "Visione",
    mediaKitPositioning: "Posizionamento",
    editorialStructure: "Struttura editoriale",
    editorialTitle: "Titolo",
    subtitleLabel: "Sottotitolo",
    sections: "Sezioni",
    productionContent: "Produzione contenuti",
    generatedContent: "Contenuti generati",
    generatedContentDesc:
      "Questi contenuti sono pronti per essere rifiniti, validati, pubblicati o adattati in pagina media.",
    mediaArticle: "Articolo media",
    founderInterview: "Intervista founder",
    mediaBrochure: "Brochure media",
    linkedinPost: "Post LinkedIn",
    strongIdeas: "Idee forti",
    shortExtracts: "Estratti brevi",
    missingInfo: "Informazioni mancanti",
    source: "Fonte",
    sourceTranscript: "Trascrizione fonte",
    cleanedTranscript: "Trascrizione pulita",
  },
  ar: {
    mediaIntelligence: "UGC Growth · ذكاء إعلامي",
    title: "Founder & Media Engine",
    subtitle:
      "يحوّل الملاحظات أو المقابلات الصوتية أو الفيديوهات إلى ذكاء إعلامي واستراتيجي: الرسالة الأساسية، توتر السوق، القناعة المميزة، قراءة الوكالة، زوايا العلاقات العامة، المقال، الكتيّب، منشور LinkedIn والمقاطع القصيرة.",
    textMode: "نص / ملاحظات المؤسس",
    uploadMode: "مقابلة صوتية / فيديو",
    analysisMode: "وضع التحليل",
    founder: "Founder",
    founderDesc: "الرسالة الأساسية، قصة المؤسس، الرؤية، التوتر الاستراتيجي.",
    agency: "Agency",
    agencyDesc: "العميل المثالي، نقاط الألم، العرض، التموضع، فرص الوكالات.",
    reportLanguage: "لغة التقرير",
    notesLabel: "ملاحظات نصية / مقابلة خام",
    notesPlaceholder:
      "الصقي هنا مقابلة، فكرة خام، ملاحظة مؤسس أو موجز إعلامي...",
    uploadLabel: "رفع صوت / فيديو",
    selectedFile: "الملف المحدد:",
    optionalNotes: "ملاحظات إضافية اختيارية",
    optionalNotesPlaceholder:
      "أضيفي السياق: اسم الشركة، المتحدث، الهدف، النبرة المطلوبة، الزاوية الإعلامية...",
    textFlow: "مسار النص: OpenAI مباشر.",
    uploadFlow:
      "مسار الصوت/الفيديو: OpenAI Whisper → تفريغ → ذكاء المؤسس.",
    generate: "إنشاء التقرير الإعلامي",
    generating: "جارٍ الإنشاء...",
    error: "حدث خطأ أثناء إنشاء التقرير.",
    founderReport: "تقرير ذكاء المؤسس",
    agencyReport: "تقرير ذكاء الوكالة",
    strategicSummary: "الملخص الاستراتيجي",
    founderSummaryDesc:
      "يستخرج هذا القسم القيمة الاستراتيجية من المقابلة: الرسالة الأساسية، سرد المؤسس، توتر السوق والقناعة المميزة.",
    agencySummaryDesc:
      "يحوّل هذا القسم المادة الخام إلى قراءة موجهة للوكالات: العميل المثالي، آلام السوق، وضوح العرض، التموضع والفرص التجارية.",
    coreMessage: "الرسالة الأساسية",
    whyItMatters: "لماذا هذا مهم",
    strategicIntelligence: "الذكاء الاستراتيجي",
    deepReading: "قراءة معمقة",
    deepReadingDesc:
      "تكتشف هذه الطبقة التوتر الحقيقي، المشكلة المركزية، القناعة المميزة ولماذا أصبح الموضوع مهمًا الآن.",
    marketTension: "توتر السوق",
    problemStatement: "صياغة المشكلة",
    uniqueBelief: "القناعة المميزة",
    whyNow: "لماذا الآن",
    founderNarrative: "سرد المؤسس",
    executiveSummary: "الملخص التنفيذي",
    agencyIntelligence: "ذكاء الوكالة",
    agencyBusinessReading: "قراءة تجارية للوكالات",
    agencyBusinessDesc:
      "يحلل هذا القسم المنتج كعرض موجه للوكالات: العملاء المستهدفون، الآلام، الفرص، وضوح العرض وتوصيات النمو.",
    icp: "العميل المثالي",
    painPoints: "نقاط الألم",
    offerClarity: "وضوح العرض",
    positioning: "التموضع",
    agencyOpportunities: "فرص الوكالات",
    growthRecommendations: "توصيات النمو",
    mediaHeadlines: "عناوين إعلامية",
    keyQuotes: "اقتباسات أساسية",
    prAngles: "زوايا العلاقات العامة",
    strategicOpportunities: "فرص استراتيجية",
    mediaKit: "ملف إعلامي",
    description: "الوصف",
    mission: "المهمة",
    vision: "الرؤية",
    mediaKitPositioning: "التموضع",
    editorialStructure: "الهيكل التحريري",
    editorialTitle: "العنوان",
    subtitleLabel: "العنوان الفرعي",
    sections: "الأقسام",
    productionContent: "إنتاج المحتوى",
    generatedContent: "المحتويات المنشأة",
    generatedContentDesc:
      "هذه المحتويات جاهزة للمراجعة أو الاعتماد أو النشر أو التكييف كصفحة إعلامية.",
    mediaArticle: "مقال إعلامي",
    founderInterview: "مقابلة المؤسس",
    mediaBrochure: "كتيّب إعلامي",
    linkedinPost: "منشور LinkedIn",
    strongIdeas: "أفكار قوية",
    shortExtracts: "مقاطع قصيرة",
    missingInfo: "معلومات ناقصة",
    source: "المصدر",
    sourceTranscript: "النص الأصلي",
    cleanedTranscript: "النص المنقح",
  },
  zh: {
    mediaIntelligence: "UGC Growth · 媒体智能",
    title: "Founder & Media Engine",
    subtitle:
      "将创始人笔记、音频采访或视频转化为媒体与战略智能：核心信息、市场张力、差异化信念、机构视角、公关角度、文章、手册、LinkedIn 内容和短摘录。",
    textMode: "文本 / 创始人笔记",
    uploadMode: "音频 / 视频采访",
    analysisMode: "分析模式",
    founder: "Founder",
    founderDesc: "核心信息、创始人叙事、愿景、战略张力。",
    agency: "Agency",
    agencyDesc: "理想客户、痛点、报价清晰度、定位、机构机会。",
    reportLanguage: "报告语言",
    notesLabel: "文本笔记 / 原始采访",
    notesPlaceholder: "在这里粘贴采访、原始想法、创始人笔记或媒体简报...",
    uploadLabel: "上传音频 / 视频",
    selectedFile: "已选择文件：",
    optionalNotes: "可选补充说明",
    optionalNotesPlaceholder:
      "添加背景：公司名称、发言人、目标、期望语气、媒体角度...",
    textFlow: "文本流程：直接调用 OpenAI。",
    uploadFlow: "音频/视频流程：OpenAI Whisper → 转录 → 创始人智能。",
    generate: "生成媒体报告",
    generating: "生成中...",
    error: "媒体生成过程中出错。",
    founderReport: "创始人智能报告",
    agencyReport: "机构智能报告",
    strategicSummary: "战略摘要",
    founderSummaryDesc:
      "本部分提取采访的战略价值：核心信息、创始人叙事、市场张力和差异化信念。",
    agencySummaryDesc:
      "本部分将原始材料转化为机构视角：理想客户、市场痛点、报价清晰度、定位和商业机会。",
    coreMessage: "核心信息",
    whyItMatters: "为什么重要",
    strategicIntelligence: "战略智能",
    deepReading: "深度解读",
    deepReadingDesc:
      "该层识别真实张力、核心问题、差异化信念，以及为什么这个主题现在重要。",
    marketTension: "市场张力",
    problemStatement: "问题陈述",
    uniqueBelief: "差异化信念",
    whyNow: "为什么是现在",
    founderNarrative: "创始人叙事",
    executiveSummary: "执行摘要",
    agencyIntelligence: "机构智能",
    agencyBusinessReading: "面向机构的商业解读",
    agencyBusinessDesc:
      "本部分将产品作为机构服务进行分析：目标客户、痛点、机会、报价清晰度和增长建议。",
    icp: "理想客户画像",
    painPoints: "痛点",
    offerClarity: "报价清晰度",
    positioning: "定位",
    agencyOpportunities: "机构机会",
    growthRecommendations: "增长建议",
    mediaHeadlines: "媒体标题",
    keyQuotes: "关键引用",
    prAngles: "公关角度",
    strategicOpportunities: "战略机会",
    mediaKit: "媒体资料包",
    description: "描述",
    mission: "使命",
    vision: "愿景",
    mediaKitPositioning: "定位",
    editorialStructure: "编辑结构",
    editorialTitle: "标题",
    subtitleLabel: "副标题",
    sections: "章节",
    productionContent: "内容生产",
    generatedContent: "已生成内容",
    generatedContentDesc:
      "这些内容可用于进一步修改、验证、发布或改编为媒体页面。",
    mediaArticle: "媒体文章",
    founderInterview: "创始人采访",
    mediaBrochure: "媒体手册",
    linkedinPost: "LinkedIn 帖子",
    strongIdeas: "核心想法",
    shortExtracts: "短摘录",
    missingInfo: "缺失信息",
    source: "来源",
    sourceTranscript: "来源转录",
    cleanedTranscript: "清理后的转录",
  },
};

function formatItem(item: TextItem) {
  if (typeof item === "string") return item;

  const title = item.heading || item.title || "";
  const body = item.content || item.text || item.description || "";

  if (title && body) return `${title}\n${body}`;
  if (title) return title;
  if (body) return body;

  return JSON.stringify(item, null, 2);
}

export default function MediaPage() {
  const [mode, setMode] = useState<"text" | "upload">("text");
  const [analysisMode, setAnalysisMode] = useState<"founder" | "agency">(
    "founder"
  );
  const [reportLanguage, setReportLanguage] =
    useState<ReportLanguage>("fr");

  const t = UI[reportLanguage];

  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [loading, setLoading] = useState(false);


  function downloadFounderBrochure() {
    if (!result) return;

    const doc = new jsPDF();
    const margin = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = 24;

    const addPageIfNeeded = (height = 20) => {
      if (y + height > pageHeight - 20) {
        doc.addPage();
        y = 24;
      }
    };

    const addTitle = (text: string) => {
      addPageIfNeeded(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(text, margin, y);
      y += 10;
    };

    const addParagraph = (text?: string) => {
      if (!text) return;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(text, maxWidth);
      addPageIfNeeded(lines.length * 6 + 10);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 8;
    };

    const addSection = (title: string, content?: string) => {
      if (!content) return;
      addTitle(title);
      addParagraph(content);
    };

    const addList = (title: string, items?: TextItem[]) => {
      if (!items?.length) return;
      addTitle(title);
      items.forEach((item) => {
        addParagraph("• " + formatItem(item));
      });
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("UGC Growth", margin, y);
    y += 10;

    doc.setFontSize(15);
    doc.text(
      analysisMode === "agency" ? t.agencyReport : t.founderReport,
      margin,
      y
    );
    y += 14;

    doc.setDrawColor(124, 58, 237);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    addSection(t.coreMessage, result.coreMessage);
    addSection(t.whyItMatters, result.whyItMatters);
    addSection(t.marketTension, result.marketTension);
    addSection(t.problemStatement, result.problemStatement);
    addSection(t.uniqueBelief, result.uniqueBelief);
    addSection(t.whyNow, result.whyNow);
    addSection(t.founderNarrative, result.founderNarrative);
    addSection(t.executiveSummary, result.executiveSummary);

    if (analysisMode === "agency") {
      addList(t.icp, result.idealCustomerProfile);
      addList(t.painPoints, result.painPoints);
      addSection(t.offerClarity, result.offerClarity);
      addSection(t.positioning, result.positioning);
      addList(t.agencyOpportunities, result.agencyOpportunities);
      addList(t.growthRecommendations, result.growthRecommendations);
    }

    addList(t.mediaHeadlines, result.mediaHeadlines);
    addList(t.keyQuotes, result.keyQuotes);
    addList(t.prAngles, result.prAngles);
    addList(t.strategicOpportunities, result.strategicOpportunities);

    if (result.mediaKit) {
      addTitle(t.mediaKit);
      addSection(t.description, result.mediaKit.companyDescription);
      addSection(t.mission, result.mediaKit.mission);
      addSection(t.vision, result.mediaKit.vision);
      addSection(t.mediaKitPositioning, result.mediaKit.positioning);
    }

    addSection(t.mediaArticle, result.mediaArticle);
    addSection(t.founderInterview, result.founderInterview);
    addSection(t.mediaBrochure, result.mediaBrochure);
    addSection(t.linkedinPost, result.linkedinPost);
    addList(t.strongIdeas, result.strongIdeas);
    addList(t.shortExtracts, result.shortExtracts);

    doc.save(`ugc-growth-${analysisMode}-brochure.pdf`);
  }

  async function handleGenerate() {
    if (!notes.trim() && !file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("notes", notes);
    formData.append("analysisMode", analysisMode);
    formData.append("reportLanguage", reportLanguage);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.details || data?.error || "Erreur API Media Engine"
        );
      }

      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || t.error);
    } finally {
      setLoading(false);
    }
  }

  const languages: { value: ReportLanguage; label: string }[] = [
    { value: "fr", label: "🇫🇷 Français" },
    { value: "en", label: "🇺🇸 English" },
    { value: "es", label: "🇪🇸 Español" },
    { value: "it", label: "🇮🇹 Italiano" },
    { value: "ar", label: "🇸🇦 العربية" },
    { value: "zh", label: "🇨🇳 中文" },
  ];

  return (
    <main className="text-white">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="rounded-[28px] border border-white/[0.07] bg-[#101018] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/70">
            {t.mediaIntelligence}
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-white md:text-4xl">{t.title}</h1>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-white/42 md:text-[15px]">{t.subtitle}</p>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-2 md:grid-cols-2">
          <button
            onClick={() => setMode("text")}
            className={`rounded-[18px] border px-4 py-4 text-left text-sm font-semibold transition ${
              mode === "text"
                ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-100"
                : "border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.025] hover:text-white/70"
            }`}
          >
            {t.textMode}
          </button>

          <button
            onClick={() => setMode("upload")}
            className={`rounded-[18px] border px-4 py-4 text-left text-sm font-semibold transition ${
              mode === "upload"
                ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-100"
                : "border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.025] hover:text-white/70"
            }`}
          >
            {t.uploadMode}
          </button>
        </div>

        <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
            {t.analysisMode}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={() => setAnalysisMode("founder")}
              className={`rounded-[18px] border px-4 py-4 text-left text-sm font-semibold transition ${
                analysisMode === "founder"
                  ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-100"
                  : "border-white/[0.055] bg-black/[0.12] text-white/45 hover:border-white/[0.10] hover:bg-white/[0.025]"
              }`}
            >
              <span className="block">{t.founder}</span>
              <span className="mt-1 block text-xs font-normal opacity-70">
                {t.founderDesc}
              </span>
            </button>

            <button
              onClick={() => setAnalysisMode("agency")}
              className={`rounded-[18px] border px-4 py-4 text-left text-sm font-semibold transition ${
                analysisMode === "agency"
                  ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-100"
                  : "border-white/[0.055] bg-black/[0.12] text-white/45 hover:border-white/[0.10] hover:bg-white/[0.025]"
              }`}
            >
              <span className="block">{t.agency}</span>
              <span className="mt-1 block text-xs font-normal opacity-70">
                {t.agencyDesc}
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
            {t.reportLanguage}
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {languages.map((language) => (
              <button
                key={language.value}
                onClick={() => {
                  setReportLanguage(language.value);
                  setResult(null);
                }}
                className={`rounded-[16px] border px-3 py-3 text-left text-xs font-semibold transition ${
                  reportLanguage === language.value
                    ? "border-violet-400/20 bg-violet-500/[0.12] text-violet-100"
                    : "border-white/[0.055] bg-black/[0.12] text-white/40 hover:border-white/[0.10] hover:bg-white/[0.025]"
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>

        <section className="rounded-[28px] border border-white/[0.07] bg-[#101018] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-6">
          {mode === "text" ? (
            <>
              <label className="text-sm font-medium text-white/80">
                {t.notesLabel}
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="mt-3 min-h-[260px] w-full rounded-[20px] border border-white/[0.07] bg-black/[0.16] p-4 text-sm leading-6 text-white/80 outline-none placeholder:text-white/25 focus:border-violet-400/40"
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-white/80">
                {t.uploadLabel}
              </label>

              <div className="mt-3 rounded-[22px] border border-dashed border-violet-400/20 bg-black/[0.14] p-6">
                <input
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.webm,.ogg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400"
                />

                {file && (
                  <p className="mt-3 text-xs text-violet-200">
                    {t.selectedFile} {file.name}
                  </p>
                )}
              </div>

              <label className="mt-5 block text-sm font-medium text-white/80">
                {t.optionalNotes}
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.optionalNotesPlaceholder}
                className="mt-3 min-h-[150px] w-full rounded-[20px] border border-white/[0.07] bg-black/[0.16] p-4 text-sm leading-6 text-white/80 outline-none placeholder:text-white/25 focus:border-violet-400/40"
              />
            </>
          )}

          <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-white/40">
              {mode === "text" ? t.textFlow : t.uploadFlow}
            </p>

            <button
              onClick={handleGenerate}
              disabled={loading || (!notes.trim() && !file)}
              className="min-h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(109,40,217,0.20)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {loading ? t.generating : t.generate}
            </button>
          </div>
        </section>

        {result && (
          <section className="grid gap-4 pt-2">
            <div className="rounded-[24px] border border-violet-400/12 bg-violet-500/[0.07] p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-violet-200">
                    Founder Brochure Export
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Brochure PDF prête à télécharger
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Transforme ce rapport en brochure PDF exploitable pour un client, une agence ou un partenaire.
                  </p>
                </div>

                <button
                  onClick={downloadFounderBrochure}
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-violet-100"
                >
                  Télécharger la brochure PDF
                </button>
              </div>
            </div>
            <HeaderBlock
              label={
                analysisMode === "agency" ? t.agencyReport : t.founderReport
              }
              title={t.strategicSummary}
              description={
                analysisMode === "agency"
                  ? t.agencySummaryDesc
                  : t.founderSummaryDesc
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultBlock
                title={t.coreMessage}
                content={result.coreMessage}
                highlight
              />

              <ResultBlock
                title={t.whyItMatters}
                content={result.whyItMatters}
                highlight
              />
            </div>

            <HeaderBlock
              label={t.strategicIntelligence}
              title={t.deepReading}
              description={t.deepReadingDesc}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultBlock
                title={t.marketTension}
                content={result.marketTension}
                highlight
              />
              <ResultBlock
                title={t.problemStatement}
                content={result.problemStatement}
                highlight
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ResultBlock
                title={t.uniqueBelief}
                content={result.uniqueBelief}
                highlight
              />
              <ResultBlock title={t.whyNow} content={result.whyNow} highlight />
            </div>

            <ResultBlock
              title={t.founderNarrative}
              content={result.founderNarrative}
              highlight
            />

            <ResultBlock
              title={t.executiveSummary}
              content={result.executiveSummary}
              highlight
            />

            {analysisMode === "agency" && (
              <>
                <HeaderBlock
                  label={t.agencyIntelligence}
                  title={t.agencyBusinessReading}
                  description={t.agencyBusinessDesc}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <ResultList title={t.icp} items={result.idealCustomerProfile} />
                  <ResultList title={t.painPoints} items={result.painPoints} />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <ResultBlock
                    title={t.offerClarity}
                    content={result.offerClarity}
                  />
                  <ResultBlock
                    title={t.positioning}
                    content={result.positioning}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <ResultList
                    title={t.agencyOpportunities}
                    items={result.agencyOpportunities}
                  />
                  <ResultList
                    title={t.growthRecommendations}
                    items={result.growthRecommendations}
                  />
                </div>
              </>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title={t.mediaHeadlines} items={result.mediaHeadlines} />
              <ResultList title={t.keyQuotes} items={result.keyQuotes} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title={t.prAngles} items={result.prAngles} />
              <ResultList
                title={t.strategicOpportunities}
                items={result.strategicOpportunities}
              />
            </div>

            <MediaKitBlock mediaKit={result.mediaKit} t={t} />

            <EditorialStructureBlock
              editorialStructure={result.editorialStructure}
              t={t}
            />

            <HeaderBlock
              label={t.productionContent}
              title={t.generatedContent}
              description={t.generatedContentDesc}
              muted
            />

            <ResultBlock title={t.mediaArticle} content={result.mediaArticle} />
            <ResultBlock
              title={t.founderInterview}
              content={result.founderInterview}
            />
            <ResultBlock title={t.mediaBrochure} content={result.mediaBrochure} />
            <ResultBlock title={t.linkedinPost} content={result.linkedinPost} />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultList title={t.strongIdeas} items={result.strongIdeas} />
              <ResultList title={t.shortExtracts} items={result.shortExtracts} />
            </div>

            <ResultList title={t.missingInfo} items={result.missingInformation} />

            <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                {t.source}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <ResultBlock
                  title={t.sourceTranscript}
                  content={result.transcript}
                />
                <ResultBlock
                  title={t.cleanedTranscript}
                  content={result.cleanedTranscript}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function HeaderBlock({
  label,
  title,
  description,
  muted = false,
}: {
  label: string;
  title: string;
  description: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 md:p-6 ${
        muted
          ? "border-white/[0.07] bg-white/[0.02]"
          : "border-violet-400/12 bg-violet-500/[0.07]"
      }`}
    >
      <p
        className={`text-xs uppercase tracking-[0.25em] ${
          muted ? "text-white/40" : "text-violet-200"
        }`}
      >
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
    </div>
  );
}

function ResultBlock({
  title,
  content,
  highlight = false,
}: {
  title: string;
  content?: string;
  highlight?: boolean;
}) {
  if (!content) return null;

  return (
    <div
      className={`rounded-[22px] border p-5 md:p-6 ${
        highlight
          ? "border-violet-400/12 bg-violet-500/[0.07]"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      <h2 className="mb-3 text-sm font-semibold tracking-[-0.015em] text-violet-200/90">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-6 text-white/62">
        {content}
      </p>
    </div>
  );
}

function ResultList({ title, items }: { title: string; items?: TextItem[] }) {
  if (!items?.length) return null;

  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5">
      <h2 className="mb-3 text-sm font-semibold tracking-[-0.015em] text-violet-200/90">{title}</h2>
      <ul className="space-y-3 text-sm text-white/70">
        {items.map((item, index) => (
          <li
            key={index}
            className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-3 leading-6"
          >
            {formatItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MediaKitBlock({
  mediaKit,
  t,
}: {
  mediaKit?: MediaResult["mediaKit"];
  t: (typeof UI)[ReportLanguage];
}) {
  if (
    !mediaKit?.companyDescription &&
    !mediaKit?.mission &&
    !mediaKit?.vision &&
    !mediaKit?.positioning
  ) {
    return null;
  }

  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5">
      <h2 className="mb-5 text-sm font-semibold tracking-[-0.015em] text-violet-200/90">
        {t.mediaKit}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniBlock title={t.description} content={mediaKit.companyDescription} />
        <MiniBlock title={t.mission} content={mediaKit.mission} />
        <MiniBlock title={t.vision} content={mediaKit.vision} />
        <MiniBlock title={t.mediaKitPositioning} content={mediaKit.positioning} />
      </div>
    </div>
  );
}

function EditorialStructureBlock({
  editorialStructure,
  t,
}: {
  editorialStructure?: MediaResult["editorialStructure"];
  t: (typeof UI)[ReportLanguage];
}) {
  if (
    !editorialStructure?.title &&
    !editorialStructure?.subtitle &&
    !editorialStructure?.sections?.length
  ) {
    return null;
  }

  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.02] p-5">
      <h2 className="mb-5 text-sm font-semibold tracking-[-0.015em] text-violet-200/90">
        {t.editorialStructure}
      </h2>

      <div className="space-y-4">
        <MiniBlock title={t.editorialTitle} content={editorialStructure.title} />
        <MiniBlock title={t.subtitleLabel} content={editorialStructure.subtitle} />

        {!!editorialStructure.sections?.length && (
          <div>
            <p className="mb-2 text-sm font-semibold text-white/80">
              {t.sections}
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              {editorialStructure.sections.map((section, index) => (
                <li
                  key={index}
                  className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-3 leading-6"
                >
                  {formatItem(section)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBlock({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/70">
        {content}
      </p>
    </div>
  );
}
