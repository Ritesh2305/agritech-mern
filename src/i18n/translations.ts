export type Language = 'en' | 'hi' | 'te' | 'ta';

export interface Translations {
  appName: string;
  appTagline: string;
  nav: {
    dashboard: string;
    farms: string;
    soil: string;
    weather: string;
    market: string;
    community: string;
    schemes: string;
    admin: string;
    login: string;
    logout: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    quickStats: string;
    activeFarms: string;
    monitoredCrops: string;
    soilHealthScore: string;
    pendingOrders: string;
    todayWeather: string;
    activeAlerts: string;
    mandiPrices: string;
    recentActivities: string;
    downloadReport: string;
    apiCollection: string;
  };
  farms: {
    title: string;
    subtitle: string;
    addFarm: string;
    farmName: string;
    location: string;
    area: string;
    soilType: string;
    irrigationType: string;
    cropsPlanted: string;
    addNewCrop: string;
    cropName: string;
    variety: string;
    sowingDate: string;
    expectedHarvest: string;
    stage: string;
    healthStatus: string;
  };
  soil: {
    title: string;
    subtitle: string;
    runDiagnostic: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    phLevel: string;
    moisture: string;
    organicCarbon: string;
    idealRange: string;
    status: string;
    recommendations: string;
    organicRemedy: string;
    suitableCrops: string;
  };
  weather: {
    title: string;
    subtitle: string;
    currentTemp: string;
    humidity: string;
    rainfall: string;
    windSpeed: string;
    sprayConditions: string;
    fiveDayForecast: string;
    pestAlerts: string;
    severity: string;
    remedy: string;
  };
  market: {
    title: string;
    subtitle: string;
    allCategories: string;
    seeds: string;
    fertilizers: string;
    pesticides: string;
    tools: string;
    irrigation: string;
    addToCart: string;
    inCart: string;
    cart: string;
    checkout: string;
    orderHistory: string;
    trackOrder: string;
    govtSubsidy: string;
  };
  community: {
    title: string;
    subtitle: string;
    bookConsultation: string;
    selectExpert: string;
    preferredDate: string;
    timeSlot: string;
    cropProblem: string;
    communityForum: string;
    askQuestion: string;
    postQuery: string;
    replies: string;
    likes: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    mandiTitle: string;
    msp: string;
    currentPrice: string;
    trend: string;
    eligibility: string;
    benefit: string;
    applyNow: string;
  };
  admin: {
    title: string;
    subtitle: string;
    systemOverview: string;
    manageOrders: string;
    userRegistry: string;
    broadcastAlert: string;
    auditLogs: string;
    approve: string;
    ship: string;
    deliver: string;
    reject: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    submit: string;
    loading: string;
    success: string;
    error: string;
    search: string;
    filter: string;
    details: string;
    role: string;
    farmer: string;
    adminRole: string;
    demoLogin: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AgriTech',
    appTagline: 'Empowering Farmers Through Digital Technology',
    nav: {
      dashboard: 'Dashboard',
      farms: 'Farms & Crops',
      soil: 'Soil Health',
      weather: 'Weather & Alerts',
      market: 'Resource Store',
      community: 'Consult & Forum',
      schemes: 'Mandi & Schemes',
      admin: 'Admin Console',
      login: 'Sign In',
      logout: 'Sign Out',
    },
    dashboard: {
      title: 'Farmer Operations Hub',
      subtitle: 'Real-time telemetry, crop health, weather forecasting, and automated advisory.',
      quickStats: 'Farm Metrics Overview',
      activeFarms: 'Active Farms',
      monitoredCrops: 'Monitored Crops',
      soilHealthScore: 'Soil Health Index',
      pendingOrders: 'Active Input Orders',
      todayWeather: 'Today\'s Weather Advisory',
      activeAlerts: 'Active Pest Outbreak Warnings',
      mandiPrices: 'Live APMC Mandi Rates',
      recentActivities: 'Recent Farm Activities',
      downloadReport: 'Download Farm PDF/CSV',
      apiCollection: 'Export Postman APIs',
    },
    farms: {
      title: 'Farm Land & Crop Monitoring',
      subtitle: 'Manage land holdings, acreage, irrigation grids, and crop lifecycle milestones.',
      addFarm: 'Register New Farm',
      farmName: 'Farm Name',
      location: 'Location / District',
      area: 'Area (Acres)',
      soilType: 'Soil Type',
      irrigationType: 'Irrigation Type',
      cropsPlanted: 'Crops Planted',
      addNewCrop: 'Register Crop Sowing',
      cropName: 'Crop Name',
      variety: 'Seed Variety',
      sowingDate: 'Sowing Date',
      expectedHarvest: 'Expected Harvest',
      stage: 'Growth Stage',
      healthStatus: 'Health Status',
    },
    soil: {
      title: 'Soil Health & Nutrient Analysis',
      subtitle: 'Calibrated NPK, pH, and moisture diagnostics with scientific fertilizer dosing.',
      runDiagnostic: 'Analyze Soil Sample',
      nitrogen: 'Nitrogen (N)',
      phosphorus: 'Phosphorus (P)',
      potassium: 'Potassium (K)',
      phLevel: 'Soil pH',
      moisture: 'Moisture Level',
      organicCarbon: 'Organic Carbon',
      idealRange: 'Agronomic Benchmark',
      status: 'Soil Nutrient Status',
      recommendations: 'Actionable Fertilizer Prescriptions',
      organicRemedy: 'Bio-Fertilizer Remediation',
      suitableCrops: 'High-Yield Suitable Crops',
    },
    weather: {
      title: 'Agro-Meteorology & Pest Surveillance',
      subtitle: 'Real-time weather parameters, 5-day forecasts, and bio-pest outbreak alerts.',
      currentTemp: 'Temperature',
      humidity: 'Relative Humidity',
      rainfall: 'Rainfall',
      windSpeed: 'Wind Velocity',
      sprayConditions: 'Pesticide Spray Feasibility',
      fiveDayForecast: '5-Day Agricultural Forecast',
      pestAlerts: 'Pest & Disease Outbreak Vigil',
      severity: 'Threat Level',
      remedy: 'Recommended Organic & Chemical Action',
    },
    market: {
      title: 'Agricultural Resource Marketplace',
      subtitle: 'Certified seeds, bio-fertilizers, solar irrigation units, and subsidized tools.',
      allCategories: 'All Categories',
      seeds: 'Certified Seeds',
      fertilizers: 'Bio-Fertilizers',
      pesticides: 'Organic Pesticides',
      tools: 'Machinery & Tools',
      irrigation: 'Drip & Sprinklers',
      addToCart: 'Add to Cart',
      inCart: 'Added to Cart',
      cart: 'Farm Cart',
      checkout: 'Complete Order',
      orderHistory: 'Order Tracking',
      trackOrder: 'Track Order Status',
      govtSubsidy: 'Govt Subsidy Eligible',
    },
    community: {
      title: 'Expert Consultation & Farmer Forum',
      subtitle: 'Connect with ICAR agricultural scientists and share experiences with fellow farmers.',
      bookConsultation: 'Book Agronomist Consultation',
      selectExpert: 'Select Specialist',
      preferredDate: 'Preferred Date',
      timeSlot: 'Time Slot',
      cropProblem: 'Describe Crop Symptom',
      communityForum: 'Farmer Community Forum',
      askQuestion: 'Start New Topic',
      postQuery: 'Post Question',
      replies: 'Farmer Responses',
      likes: 'Helpful Votes',
    },
    schemes: {
      title: 'Government Schemes & Mandi Rates',
      subtitle: 'Direct financial assistance schemes, crop insurance policies, and live market prices.',
      mandiTitle: 'APMC Market Benchmark Rates',
      msp: 'Govt MSP',
      currentPrice: 'Mandi Rate',
      trend: 'Trend',
      eligibility: 'Eligibility Criteria',
      benefit: 'Direct Financial Benefit',
      applyNow: 'Application Steps',
    },
    admin: {
      title: 'System Management & Admin Console',
      subtitle: 'Platform metrics, order fulfillment, resource inventory, and alert broadcasting.',
      systemOverview: 'Platform Overview',
      manageOrders: 'Order Fulfillment Queue',
      userRegistry: 'Farmer Registry',
      broadcastAlert: 'Broadcast Pest Outbreak Alert',
      auditLogs: 'System Security Audit Logs',
      approve: 'Approve Order',
      ship: 'Mark Shipped',
      deliver: 'Mark Delivered',
      reject: 'Reject',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      submit: 'Submit',
      loading: 'Loading...',
      success: 'Operation completed successfully',
      error: 'An error occurred',
      search: 'Search by keyword...',
      filter: 'Filter',
      details: 'View Details',
      role: 'User Role',
      farmer: 'Farmer',
      adminRole: 'Administrator',
      demoLogin: 'Quick Demo Sign In',
    },
  },
  hi: {
    appName: 'एग्रीटेक (AgriTech)',
    appTagline: 'डिजिटल तकनीक से किसानों का सशक्तिकरण',
    nav: {
      dashboard: 'डैशबोर्ड',
      farms: 'खेत और फसलें',
      soil: 'मृदा स्वास्थ्य',
      weather: 'मौसम और कीट चेतावनी',
      market: 'कृषि बाज़ार',
      community: 'विशेषज्ञ सलाह व मंच',
      schemes: 'मंडी भाव व योजनाएं',
      admin: 'प्रशासन कक्ष',
      login: 'लॉग इन करें',
      logout: 'लॉग आउट',
    },
    dashboard: {
      title: 'किसान परिचालन केंद्र',
      subtitle: 'वास्तविक समय मौसम, फसल स्वास्थ्य, मृदा विश्लेषण और कृषि परामर्श।',
      quickStats: 'खेत आँकड़े सारांश',
      activeFarms: 'सक्रिय खेत',
      monitoredCrops: 'निगरानी में फसलें',
      soilHealthScore: 'मृदा स्वास्थ्य सूचकांक',
      pendingOrders: 'सक्रिय इनपुट ऑर्डर',
      todayWeather: 'आज का मौसम परामर्श',
      activeAlerts: 'सक्रिय कीट प्रकोप चेतावनियाँ',
      mandiPrices: 'लाइव एपीएमसी मंडी भाव',
      recentActivities: 'हाल की गतिविधियां',
      downloadReport: 'खेत रिपोर्ट डाउनलोड करें (PDF/CSV)',
      apiCollection: 'पोस्टमैन एपीआई एक्सपोर्ट',
    },
    farms: {
      title: 'खेत भूमि और फसल निगरानी',
      subtitle: 'भूमि जोत, रकबा, सिंचाई प्रणाली और फसल चक्र का प्रबंधन करें।',
      addFarm: 'नया खेत पंजीकृत करें',
      farmName: 'खेत का नाम',
      location: 'स्थान / जिला',
      area: 'क्षेत्रफल (एकड़)',
      soilType: 'मिट्टी का प्रकार',
      irrigationType: 'सिंचाई का साधन',
      cropsPlanted: 'बोई गई फसलें',
      addNewCrop: 'नई फसल बोवाई दर्ज करें',
      cropName: 'फसल का नाम',
      variety: 'बीज किस्म',
      sowingDate: 'बोवाई की तारीख',
      expectedHarvest: 'अनुमानित कटाई',
      stage: 'वृद्धि अवस्था',
      healthStatus: 'स्वास्थ्य स्थिति',
    },
    soil: {
      title: 'मृदा स्वास्थ्य एवं पोषक तत्व विश्लेषण',
      subtitle: 'एनपीके (NPK), पीएच और नमी की वैज्ञानिक जांच व खाद की उचित मात्रा।',
      runDiagnostic: 'मिट्टी के नमूने की जांच करें',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फास्फोरस (P)',
      potassium: 'पोटेशियम (K)',
      phLevel: 'मृदा पीएच (pH)',
      moisture: 'नमी का स्तर',
      organicCarbon: 'जैविक कार्बन',
      idealRange: 'आदर्श कृषि पैमाना',
      status: 'मृदा पोषक स्थिति',
      recommendations: 'उर्वरक एवं खाद की सिफारिशें',
      organicRemedy: 'जैविक उपचार उपाय',
      suitableCrops: 'उपयुक्त उच्च उपज फसलें',
    },
    weather: {
      title: 'कृषि मौसम विज्ञान एवं कीट निगरानी',
      subtitle: 'सटीक तापमान, 5-दिवसीय पूर्वानुमान एवं कीट प्रकोप चेतावनी।',
      currentTemp: 'तापमान',
      humidity: 'सापेक्ष आर्द्रता',
      rainfall: 'वर्षा की संभावना',
      windSpeed: 'हवा की गति',
      sprayConditions: 'कीटनाशक छिड़काव उपयुक्तता',
      fiveDayForecast: '5-दिवसीय कृषि मौसम पूर्वानुमान',
      pestAlerts: 'कीट एवं रोग प्रकोप सतर्कता',
      severity: 'जोखिम स्तर',
      remedy: 'अनुशंसित जैविक एवं रासायनिक उपाय',
    },
    market: {
      title: 'कृषि संसाधन ई-स्टोर',
      subtitle: 'प्रमाणित बीज, जैविक खाद, सौर सिंचाई उपकरण एवं रियायती यंत्र।',
      allCategories: 'सभी श्रेणियां',
      seeds: 'प्रमाणित बीज',
      fertilizers: 'जैविक उर्वरक',
      pesticides: 'जैविक कीटनाशक',
      tools: 'उपकरण एवं मशीनरी',
      irrigation: 'ड्रिप व स्प्रिंकलर',
      addToCart: 'कार्ट में जोड़ें',
      inCart: 'कार्ट में जोड़ा गया',
      cart: 'कृषि कार्ट',
      checkout: 'ऑर्डर पूरा करें',
      orderHistory: 'ऑर्डर ट्रैकिंग',
      trackOrder: 'ऑर्डर स्थिति देखें',
      govtSubsidy: 'सरकारी सब्सिडी योग्य',
    },
    community: {
      title: 'कृषि विशेषज्ञ परामर्श व कृषक मंच',
      subtitle: 'आईसीएआर कृषि वैज्ञानिकों से जुड़ें और साथी किसानों के साथ अनुभव साझा करें।',
      bookConsultation: 'कृषि वैज्ञानिक से परामर्श बुक करें',
      selectExpert: 'विशेषज्ञ चुनें',
      preferredDate: 'पसंदीदा तारीख',
      timeSlot: 'समय स्लॉट',
      cropProblem: 'फसल की समस्या का विवरण',
      communityForum: 'किसान समुदाय चर्चा मंच',
      askQuestion: 'नया प्रश्न पूछें',
      postQuery: 'प्रश्न पोस्ट करें',
      replies: 'किसानों के उत्तर',
      likes: 'उपयोगी वोट',
    },
    schemes: {
      title: 'सरकारी योजनाएं एवं मंडी भाव',
      subtitle: 'पीएम-किसान, फसल बीमा, मृदा स्वास्थ्य कार्ड और लाइव बाज़ार भाव।',
      mandiTitle: 'एपीएमसी बाज़ार न्यूनतम एवं वर्तमान दरें',
      msp: 'सरकारी एमएसपी',
      currentPrice: 'वर्तमान मंडी भाव',
      trend: 'रुझान',
      eligibility: 'पात्रता मानदंड',
      benefit: 'प्रत्यक्ष वित्तीय लाभ',
      applyNow: 'आवेदन प्रक्रिया',
    },
    admin: {
      title: 'प्रशासन एवं प्रबंधन केंद्र',
      subtitle: 'सिस्टम मेट्रिक्स, ऑर्डर स्वीकृति, स्टॉक प्रबंधन और कीट चेतावनी जारी करना।',
      systemOverview: 'सिस्टम सारांश',
      manageOrders: 'ऑर्डर आपूर्ति कतार',
      userRegistry: 'पंजीकृत किसान',
      broadcastAlert: 'कीट प्रकोप चेतावनी प्रसारित करें',
      auditLogs: 'सुरक्षा ऑडिट लॉग',
      approve: 'स्वीकृत करें',
      ship: 'भेज दिया गया (Shipped)',
      deliver: 'डिलीवर किया गया',
      reject: 'अस्वीकार करें',
    },
    common: {
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      submit: 'जमा करें',
      loading: 'लोड हो रहा है...',
      success: 'सफलतापूर्वक पूर्ण हुआ',
      error: 'त्रुटि उत्पन्न हुई',
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      details: 'विवरण देखें',
      role: 'भूमिका',
      farmer: 'किसान',
      adminRole: 'प्रशासक',
      demoLogin: 'त्वरित डेमो लॉग इन',
    },
  },
  te: {
    appName: 'అగ్రిటెక్ (AgriTech)',
    appTagline: 'డిజిటల్ సాంకేతికతతో రైతుల సాధికారత',
    nav: {
      dashboard: 'డాష్‌బోర్డ్',
      farms: 'పొలాలు & పంటలు',
      soil: 'నేల ఆరోగ్యం',
      weather: 'వాతావరణం & తెగుళ్లు',
      market: 'రైతు బజార్',
      community: 'నిపుణుల సలహా & వేదిక',
      schemes: 'మార్కెట్ ధరలు & పథకాలు',
      admin: 'అడ్మిన్ ప్యానెల్',
      login: 'లాగిన్',
      logout: 'లాగౌట్',
    },
    dashboard: {
      title: 'రైతు నిర్వహణ కేంద్రం',
      subtitle: 'రియల్-టైమ్ వాతావరణం, పంటల ఆరోగ్యం, భూసార పరీక్ష మరియు వ్యవసాయ సలహాలు.',
      quickStats: 'వ్యవసాయ గణాంకాలు',
      activeFarms: 'నమోదైన పొలాలు',
      monitoredCrops: 'పర్యవేక్షణలో ఉన్న పంటలు',
      soilHealthScore: 'భూసార సూచిక',
      pendingOrders: 'కొనుగోలు ఆర్డర్లు',
      todayWeather: 'నేటి వాతావరణ సలహా',
      activeAlerts: 'కీటకాలు/తెగుళ్ల హెచ్చరికలు',
      mandiPrices: 'లైవ్ మార్కెట్ యార్డ్ ధరలు',
      recentActivities: 'ఇటీవలి వ్యవసాయ పనులు',
      downloadReport: 'రిపోర్ట్ డౌన్‌లోడ్ (PDF/CSV)',
      apiCollection: 'పోస్ట్‌మ్యాన్ ఏపీఐ డౌన్‌లోడ్',
    },
    farms: {
      title: 'వ్యవసాయ భూమి & పంట పర్యవేక్షణ',
      subtitle: 'భూమి విస్తీర్ణం, నీటి పారుదల మరియు పంట కాలక్రమం నిర్వహణ.',
      addFarm: 'కొత్త పొలాన్ని నమోదు చేయండి',
      farmName: 'పొలం పేరు',
      location: 'ప్రాంతం / జిల్లా',
      area: 'విస్తీర్ణం (ఎకరాలు)',
      soilType: 'నేల రకం',
      irrigationType: 'నీటి పారుదల రకం',
      cropsPlanted: 'సాగు చేస్తున్న పంటలు',
      addNewCrop: 'కొత్త పంట విత్తడం నమోదు',
      cropName: 'పంట పేరు',
      variety: 'విత్తన రకం',
      sowingDate: 'విత్తిన తేదీ',
      expectedHarvest: 'కోత అంచనా తేదీ',
      stage: 'ఎదుగుదల దశ',
      healthStatus: 'ఆరోగ్య స్థితి',
    },
    soil: {
      title: 'భూసార పరీక్ష & పోషకాల విశ్లేషణ',
      subtitle: 'NPK, pH మరియు తేమ విశ్లేషణతో శాస్త్రీయ ఎరువుల మోతాదు సలహాలు.',
      runDiagnostic: 'నేల నమూనా పరీక్షించండి',
      nitrogen: 'నత్రజని (N)',
      phosphorus: 'భాస్వరం (P)',
      potassium: 'పొటాష్ (K)',
      phLevel: 'నేల pH స్థాయి',
      moisture: 'తేమ శాతం',
      organicCarbon: 'సేంద్రీయ కర్బనం',
      idealRange: 'ఆదర్శ వ్యవసాయ పరిమితి',
      status: 'భూసార స్థితి',
      recommendations: 'సిఫార్సు చేసిన ఎరువులు',
      organicRemedy: 'సేంద్రీయ యాజమాన్యం',
      suitableCrops: 'అనువైన అధిక దిగుబడి పంటలు',
    },
    weather: {
      title: 'వాతావరణం & తెగుళ్ల నివారణ హెచ్చరికలు',
      subtitle: 'ఖచ్చితమైన వర్షపాతం, ఉష్ణోగ్రత మరియు పంట రక్షణ హెచ్చరికలు.',
      currentTemp: 'ఉష్ణోగ్రత',
      humidity: 'గాలిలో తేమ',
      rainfall: 'వర్షపాతం అవకాశం',
      windSpeed: 'గాలి వేగం',
      sprayConditions: 'మందుల పిచికారీ అనుకూలత',
      fiveDayForecast: '5 రోజుల వాతావరణ సూచన',
      pestAlerts: 'తెగుళ్ల ముందస్తు హెచ్చరికలు',
      severity: 'తీవ్రత స్థాయి',
      remedy: 'సేంద్రీయ & రసాయన నివారణ చర్యలు',
    },
    market: {
      title: 'వ్యవసాయ సామాగ్రి మార్కెట్',
      subtitle: 'ధృవీకరించబడిన విత్తనాలు, సేంద్రీయ ఎరువులు మరియు రాయితీ పనిముట్లు.',
      allCategories: 'అన్ని రకాలు',
      seeds: 'నాణ్యమైన విత్తనాలు',
      fertilizers: 'సేంద్రీయ ఎరువులు',
      pesticides: 'బయో పురుగుమందులు',
      tools: 'వ్యవసాయ యంత్రాలు',
      irrigation: 'బిందు & తుంపర సేద్యం',
      addToCart: 'కొనుగోలు బుట్టలో వేయి',
      inCart: 'బుట్టలో చేర్చబడింది',
      cart: 'నా ఆర్డర్లు',
      checkout: 'ఆర్డర్ ఖరారు చేయండి',
      orderHistory: 'ఆర్డర్ వివరాలు',
      trackOrder: 'ఆర్డర్ ట్రాకింగ్',
      govtSubsidy: 'ప్రభుత్వ సబ్సిడీ వర్తిస్తుంది',
    },
    community: {
      title: 'వ్యవసాయ నిపుణుల సలహాలు & రైతు వేదిక',
      subtitle: 'శాస్త్రవేత్తలతో మాట్లాడండి మరియు తోటి రైతులతో అనుభవాలు పంచుకోండి.',
      bookConsultation: 'వ్యవసాయ శాస్త్రవేత్తను సంప్రదించండి',
      selectExpert: 'నిపుణుడిని ఎంచుకోండి',
      preferredDate: 'తేదీ',
      timeSlot: 'సమయం',
      cropProblem: 'పంట సమస్యను వివరించండి',
      communityForum: 'రైతు సంభాషణల వేదిక',
      askQuestion: 'కొత్త ప్రశ్న అడగండి',
      postQuery: 'పోస్ట్ చేయండి',
      replies: 'సమాధానాలు',
      likes: 'ఉపయోగకరమైన ఓట్లు',
    },
    schemes: {
      title: 'ప్రభుత్వ పథకాలు & మార్కెట్ ధరలు',
      subtitle: 'రైతు బంధు/పీఎం-కిసాన్, పంటల బీమా మరియు తాజా మార్కెట్ ధరలు.',
      mandiTitle: 'వ్యవసాయ మార్కెట్ యార్డ్ ధరలు',
      msp: 'కనీస మద్దతు ధర (MSP)',
      currentPrice: 'ప్రస్తుత మార్కెట్ ధర',
      trend: 'ధర మార్పు',
      eligibility: 'అర్హతలు',
      benefit: 'ఆర్థిక ప్రయోజనం',
      applyNow: 'దరఖాస్తు విధానం',
    },
    admin: {
      title: 'అడ్మినిస్ట్రేటర్ మేనేజ్‌మెంట్',
      subtitle: 'ఆర్డర్ల ఆమోదం, వనరుల నిర్వహణ, తెగుళ్ల హెచ్చరిక జారీ మరియు లాగ్స్.',
      systemOverview: 'సిస్టమ్ సమీక్ష',
      manageOrders: 'ఆర్డర్ల నిర్వహణ',
      userRegistry: 'రైతుల జాబితా',
      broadcastAlert: 'తెగుళ్ల హెచ్చరికను ప్రసారం చేయండి',
      auditLogs: 'సిస్టమ్ భద్రతా లాగ్స్',
      approve: 'ఆమోదించు',
      ship: 'రవాణా చేయబడింది',
      deliver: 'డెలివరీ పూర్తయింది',
      reject: 'తిరస్కరించు',
    },
    common: {
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు',
      delete: 'తొలగించు',
      submit: 'సమర్పించండి',
      loading: 'లోడ్ అవుతోంది...',
      success: 'విజయవంతంగా పూర్తయింది',
      error: 'లోపం సంభవించింది',
      search: 'వెతకండి...',
      filter: 'ఫిల్టర్',
      details: 'పూర్తి వివరాలు',
      role: 'హోదా',
      farmer: 'రైతు',
      adminRole: 'అడ్మినిస్ట్రేటర్',
      demoLogin: 'డెమో ఖాతా లాగిన్',
    },
  },
  ta: {
    appName: 'அக்ரிடெக் (AgriTech)',
    appTagline: 'டிஜிட்டல் தொழில்நுட்பம் மூலம் உழவர் மேம்பாடு',
    nav: {
      dashboard: 'முகப்பு',
      farms: 'நிலங்கள் & பயிர்கள்',
      soil: 'மண் வளம்',
      weather: 'வானிலை & பூச்சி எச்சரிக்கை',
      market: 'விவசாய அங்காடி',
      community: 'வல்லுநர் ஆலோசனை',
      schemes: 'சந்தை விலை & திட்டங்கள்',
      admin: 'நிர்வாக மையம்',
      login: 'உள்நுழைய',
      logout: 'வெளியேறு',
    },
    dashboard: {
      title: 'உழவர் கட்டுப்பாட்டு மையம்',
      subtitle: 'நிகழ்நேர வானிலை, பயிர் ஆரோக்கியம், மண் பரிசோதனை மற்றும் வழிகாட்டுதல்.',
      quickStats: 'பண்ணை புள்ளிவிவரங்கள்',
      activeFarms: 'பதிவான பண்ணைகள்',
      monitoredCrops: 'கண்காணிக்கப்படும் பயிர்கள்',
      soilHealthScore: 'மண் வள குறியீடு',
      pendingOrders: 'செயலில் உள்ள ஆர்டர்கள்',
      todayWeather: 'இன்றைய வானிலை ஆலோசனை',
      activeAlerts: 'பூச்சித் தாக்குதல் எச்சரிக்கைகள்',
      mandiPrices: 'நேரலை சந்தை விலைகள்',
      recentActivities: 'சமீபத்திய பண்ணை பணிகள்',
      downloadReport: 'அறிக்கை பதிவிறக்கம் (PDF/CSV)',
      apiCollection: 'போஸ்ட்மேன் ஏபிஐ பதிவிறக்கம்',
    },
    farms: {
      title: 'பண்ணை நிலம் & பயிர் கண்காணிப்பு',
      subtitle: 'நிலப்பரப்பு, பாசன வசதி மற்றும் பயிர் கால அட்டவணை மேலாண்மை.',
      addFarm: 'புதிய பண்ணையை பதிவு செய்க',
      farmName: 'பண்ணை பெயர்',
      location: 'இடம் / மாவட்டம்',
      area: 'பரப்பளவு (ஏக்கர்)',
      soilType: 'மண் வகை',
      irrigationType: 'பாசன முறை',
      cropsPlanted: 'பயிரிடப்பட்ட பயிர்கள்',
      addNewCrop: 'புதிய பயிர் விதைப்பு பதிவு',
      cropName: 'பயிர் பெயர்',
      variety: 'விதை ரகம்',
      sowingDate: 'விதைத்த தேதி',
      expectedHarvest: 'அறுவடை தேதி',
      stage: 'வளர்ச்சி நிலை',
      healthStatus: 'ஆரோக்கிய நிலை',
    },
    soil: {
      title: 'மண் வளம் மற்றும் ஊட்டச்சத்து பகுப்பாய்வு',
      subtitle: 'NPK, pH மற்றும் ஈரப்பதம் சோதனையுடன் துல்லிய உர பரிந்துரைகள்.',
      runDiagnostic: 'மண் மாதிரியை சோதிக்கவும்',
      nitrogen: 'நைட்ரஜன் (N)',
      phosphorus: 'பாஸ்பரஸ் (P)',
      potassium: 'பொட்டாசியம் (K)',
      phLevel: 'மண் pH அளவு',
      moisture: 'ஈரப்பதம்',
      organicCarbon: 'கரிம கார்பன்',
      idealRange: 'உகந்த விவசாய வரம்பு',
      status: 'மண் ஊட்டச்சத்து நிலை',
      recommendations: 'பரிந்துரைக்கப்படும் உரங்கள்',
      organicRemedy: 'இயற்கை வேளாண்மை தீர்வுகள்',
      suitableCrops: 'பொருத்தமான அதிக மகசூல் பயிர்கள்',
    },
    weather: {
      title: 'வானிலை & பூச்சி முன்னெச்சரிக்கை',
      subtitle: 'துல்லியமான மழைப்பொழிவு, வெப்பநிலை மற்றும் பயிர் பாதுகாப்பு வழிகாட்டுதல்.',
      currentTemp: 'வெப்பநிலை',
      humidity: 'காற்றின் ஈரப்பதம்',
      rainfall: 'மழை வாய்ப்பு',
      windSpeed: 'காற்றின் வேகம்',
      sprayConditions: 'மருந்து தெளிப்பு சாத்தியக்கூறு',
      fiveDayForecast: '5 நாள் வானிலை முன்னறிவிப்பு',
      pestAlerts: 'பூச்சி மற்றும் நோய் எச்சரிக்கைகள்',
      severity: 'ஆபத்து நிலை',
      remedy: 'பரிந்துரைக்கப்படும் தீர்வுகள்',
    },
    market: {
      title: 'விவசாய இடுபொருட்கள் அங்காடி',
      subtitle: 'தரமான விதைகள், இயற்கை உரங்கள் மற்றும் மானிய விவசாய கருவிகள்.',
      allCategories: 'அனைத்து பிரிவுகள்',
      seeds: 'சான்றளிக்கப்பட்ட விதைகள்',
      fertilizers: 'இயற்கை உரங்கள்',
      pesticides: 'உயிரியல் பூச்சிக்கொல்லிகள்',
      tools: 'பண்ணை கருவிகள்',
      irrigation: 'சொட்டு நீர் பாசனம்',
      addToCart: 'கூடையில் சேர்க்க',
      inCart: 'கூடையில் சேர்க்கப்பட்டது',
      cart: 'என் கூடை',
      checkout: 'ஆர்டரை முடிக்க',
      orderHistory: 'ஆர்டர் கண்காணிப்பு',
      trackOrder: 'ஆர்டர் நிலை',
      govtSubsidy: 'அரசு மானியம் உண்டு',
    },
    community: {
      title: 'வேளாண் வல்லுநர் ஆலோசனை & விவசாய மன்றம்',
      subtitle: 'விஞ்ஞானிகளுடன் உரையாடவும், சக விவசாயிகளுடன் யோசனைகளை பகிர்ந்து கொள்ளவும்.',
      bookConsultation: 'வேளாண் விஞ்ஞானியிடம் ஆலோசனை பெறுக',
      selectExpert: 'வல்லுநரை தேர்வு செய்க',
      preferredDate: 'தேதி',
      timeSlot: 'நேரம்',
      cropProblem: 'பயிர் பிரச்சினையை விவரிக்கவும்',
      communityForum: 'விவசாயிகள் கலந்துரையாடல் மன்றம்',
      askQuestion: 'கேள்வி கேட்க',
      postQuery: 'பதிவு செய்க',
      replies: 'பதில்கள்',
      likes: 'பயனுள்ள வாக்குகள்',
    },
    schemes: {
      title: 'அரசு திட்டங்கள் & சந்தை நிலவரம்',
      subtitle: 'பிஎம்-கிசான், பயிர் காப்பீட்டுத் திட்டம் மற்றும் நேரலை சந்தை விலைகள்.',
      mandiTitle: 'சந்தை விலை விவரங்கள்',
      msp: 'அரசு நிர்ணய விலை (MSP)',
      currentPrice: 'தற்போதைய சந்தை விலை',
      trend: 'விலை மாற்றம்',
      eligibility: 'தகுதி வரம்புகள்',
      benefit: 'நேரடி நிதி பயன்',
      applyNow: 'விண்ணப்பிக்கும் முறை',
    },
    admin: {
      title: 'நிர்வாக கட்டுப்பாட்டு மையம்',
      subtitle: 'ஆர்டர் ஒப்புதல், சரக்கு இருப்பு, பூச்சி எச்சரிக்கை ஒளிபரப்பு மற்றும் பதிவுகள்.',
      systemOverview: 'கணினி கண்ணோட்டம்',
      manageOrders: 'ஆர்டர்கள் மேலாண்மை',
      userRegistry: 'பதிவுசெய்த விவசாயிகள்',
      broadcastAlert: 'பூச்சி எச்சரிக்கை வெளியிடுக',
      auditLogs: 'பாதுகாப்பு தணிக்கை பதிவுகள்',
      approve: 'ஒப்புதல் அளி',
      ship: 'அனுப்பப்பட்டது',
      deliver: 'விநியோகிக்கப்பட்டது',
      reject: 'நிராகரி',
    },
    common: {
      save: 'சேமிக்க',
      cancel: 'ரத்து செய்',
      delete: 'நீக்குக',
      submit: 'சமர்ப்பிக்க',
      loading: 'ஏற்றப்படுகிறது...',
      success: 'வெற்றிகரமாக முடிந்தது',
      error: 'பிழை ஏற்பட்டது',
      search: 'தேடுக...',
      filter: 'வடிகட்டுதல்',
      details: 'முழு விவரங்கள்',
      role: 'பங்கு',
      farmer: 'உழவர்',
      adminRole: 'நிர்வாகி',
      demoLogin: 'விரைவு டெமோ உள்நுழைவு',
    },
  },
};
