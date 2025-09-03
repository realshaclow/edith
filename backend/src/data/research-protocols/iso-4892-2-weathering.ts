export const iso4892Protocol = {
  id: 'iso-4892-2',
  title: 'ISO 4892-2 - Symulacja Działania Światła Słonecznego',
  description: 'Standardowa procedura badania odporności materiałów plastikowych na działanie sztucznego światła słonecznego przy użyciu lamp ksenonowych.',
  category: 'weathering',
  estimatedDuration: '500-2000 godzin ekspozycji',
  difficulty: 'advanced',
  
  overview: {
    purpose: 'Ocena zmian właściwości materiałów plastikowych pod wpływem kontrolowanego działania promieniowania UV, wilgotności i temperatury.',
    scope: 'Stosowane do prognozowania trwałości plastików w warunkach atmosferycznych i określania odporności na starzenie.',
    principles: 'Próbki są eksponowane na działanie lamp ksenonowych o spektrum zbliżonym do słońca, z kontrolowaną temperaturą, wilgotnością i cyklami mokro-sucho.',
    standards: ['ISO 4892-2:2013', 'ASTM G155', 'IEC 61215', 'ASTM D4459']
  },

  equipment: [
    { name: 'Komora Ksenonowa', specification: 'Lampy ksenonowe o spektrum solarnym' },
    { name: 'System Filtrów', specification: 'Filtry szkła okiennego lub kwarcowe' },
    { name: 'Radiometr', specification: 'Pomiar natężenia 300-400nm lub 280-320nm' },
    { name: 'Termometry', specification: 'BST (Black Standard) i białej tablicy' },
    { name: 'System Wilgotności', specification: 'Kontrola RH 10-95%' },
    { name: 'System Natrysku', specification: 'Woda destylowana dla cykli mokrych' },
    { name: 'Uchwyty Próbek', specification: 'Metalowe, odporne na korozję' },
    { name: 'Kolorometr', specification: 'Do pomiaru zmian kolorystycznych' }
  ],

  materials: [
    'Próbki testowe (wymiary według normy produktu)',
    'Próbki referencyjne (standardy porównawcze)',
    'Woda destylowana (do systemu natrysku)',
    'Papier testowy (do kontroli dawki UV)',
    'Rękawice UV-odporne',
    'Materiały ochrenne',
    'Etykiety odporne na UV'
  ],

  safetyGuidelines: [
    'Noś okulary UV-ochronne przy otwartej komorze',
    'Unikaj bezpośredniego patrzenia na lampy ksenonowe',
    'Sprawdź wentylację komory przed otwarciem',
    'Noś rękawice przy manipulacji lampami',
    'Zachowaj ostrożność z gorącymi powierzchniami',
    'Sprawdź poziom ozonu w pomieszczeniu',
    'Nie dotykaj włączonych lamp bezpośrednio'
  ],

  testConditions: {
    irradiance: '0.35 W/m²/nm przy 340nm lub 0.51 W/m²/nm przy 300-400nm',
    temperature: '65±3°C (BST) lub 38±3°C (temperatura otoczenia)',
    humidity: '50±5% RH (cykl suchy) lub 95±5% RH (cykl mokry)',
    filterType: 'Szkło okiennego typu lub kwarcowe',
    cycleTime: 'Typowo 102 min suchy + 18 min mokry',
    testDuration: '500-2000 godzin w zależności od materiału',
    waterSpray: 'Woda destylowana, 18 min co 120 min'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki zgodnie z wymaganiami badania',
      duration: '60 minut',
      instructions: [
        'Wytnij próbki zgodnie z normą produktu',
        'Skondycjonuj próbki w 23°C/50%RH przez 16h',
        'Zmierz początkowe właściwości (kolor, połysk, itp.)',
        'Oznacz próbki numerami UV-odpornymi',
        'Wykonaj fotografię dokumentacyjną',
        'Przygotuj próbki referencyjne'
      ],
      tips: [
        'Próbki powinny być reprezentatywne dla produktu',
        'Unikaj dotykania powierzchni do ekspozycji',
        'Dokumentuj wszelkie defekty początkowe'
      ],
      safety: [
        'Noś rękawice podczas przygotowania',
        'Unikaj skażenia powierzchni próbek',
        'Sprawdź czy próbki nie zawierają niebezpiecznych substancji'
      ]
    },
    {
      id: 'setup-1',
      title: 'Konfiguracja Komory',
      description: 'Ustaw parametry ekspozycji w komorze',
      duration: '45 minut',
      instructions: [
        'Sprawdź działanie lamp ksenonowych',
        'Zainstaluj odpowiedni typ filtrów',
        'Skalibruj radiometr na wybranej długości fali',
        'Ustaw temperaturę BST na 65±3°C',
        'Zaprogramuj cykle mokro-sucho',
        'Sprawdź system natrysku wodą'
      ],
      tips: [
        'Lampy powinny mieć minimum 200h żywotności',
        'Filtry muszą być czyste i bez uszkodzeń',
        'Kalibracja radiometru jest kluczowa'
      ],
      safety: [
        'Wyłącz lampy przed instalacją filtrów',
        'Sprawdź szczelność komory',
        'Upewnij się o sprawności systemu wentylacji'
      ]
    },
    {
      id: 'mount-1',
      title: 'Montaż Próbek',
      description: 'Umieść próbki w komorze ekspozycyjnej',
      duration: '30 minut',
      instructions: [
        'Umieść próbki w uchwytach ekspozycyjnych',
        'Sprawdź czy próbki są równomiernie rozmieszczone',
        'Ustaw próbki pod kątem zalecanym w normie',
        'Umieść próbki referencyjne w różnych pozycjach',
        'Sprawdź czy nie ma zacienienia między próbkami',
        'Zamknij komorę i sprawdź szczelność'
      ],
      tips: [
        'Próbki powinny być 200-250mm od lamp',
        'Unikaj umieszczania próbek na krawędziach komory',
        'Sprawdź równomierność naświetlenia'
      ],
      safety: [
        'Noś okulary ochronne w komorze',
        'Sprawdź temperaturę uchwytów',
        'Upewnij się że próbki są stabilnie zamocowane'
      ]
    },
    {
      id: 'exposure-1',
      title: 'Ekspozycja Początkowa',
      description: 'Rozpocznij ekspozycję i monitoruj pierwsze 100 godzin',
      duration: '100 godzin',
      instructions: [
        'Uruchom program ekspozycji zgodnie z normą',
        'Monitoruj temperaturę BST co 4 godziny',
        'Sprawdzaj natężenie promieniowania co 8 godzin',
        'Kontroluj wilgotność w komorze',
        'Zapisuj wszelkie anomalie w dzienniku',
        'Sprawdź działanie systemu natrysku'
      ],
      tips: [
        'Pierwsze 100h jest kluczowe dla stabilizacji',
        'Dokumentuj wszelkie odchylenia od norm',
        'Sprawdzaj czy próbki się nie przesuwają'
      ],
      safety: [
        'Nie otwieraj komory podczas pracy lamp',
        'Monitoruj poziom ozonu w pomieszczeniu',
        'Sprawdzaj działanie alarmów'
      ]
    },
    {
      id: 'monitoring-1',
      title: 'Monitoring Długoterminowy',
      description: 'Kontynuuj ekspozycję z regularnym monitoringiem',
      duration: '500-2000 godzin',
      instructions: [
        'Sprawdzaj parametry co 24 godziny',
        'Wykonuj oceny wizualne co 168 godzin (tydzień)',
        'Mierz właściwości próbek co 500 godzin',
        'Wymieniaj filtry według harmonogramu',
        'Dokumentuj zmiany w próbkach referencyjnych',
        'Kontroluj żywotność lamp'
      ],
      tips: [
        'Używaj tego samego oświetlenia do ocen wizualnych',
        'Porównuj próbki z oryginałami spoza komory',
        'Wykonuj zdjęcia w standaryzowanych warunkach'
      ],
      safety: [
        'Zawsze wyłączaj lampy przed otwarciem',
        'Pozwól na ostygnięcie przed manipulacją',
        'Sprawdzaj stan elementów komory'
      ]
    },
    {
      id: 'evaluation-1',
      title: 'Ocena Końcowa',
      description: 'Wykonaj końcową ocenę właściwości materiału',
      duration: '120 minut',
      instructions: [
        'Wyłącz komorę i poczekaj na ostygnięcie',
        'Usuń próbki z komory ostrożnie',
        'Skondycjonuj próbki przez 24h w standardowych warunkach',
        'Zmierz końcowe właściwości (kolor, połysk, wytrzymałość)',
        'Porównaj z wartościami początkowymi',
        'Oblicz zmiany procentowe właściwości'
      ],
      tips: [
        'Kondycjonowanie po ekspozycji jest obowiązkowe',
        'Używaj tych samych metod pomiarowych',
        'Dokumentuj wizualne zmiany fotograficznie'
      ],
      safety: [
        'Sprawdź czy próbki nie są gorące',
        'Noś rękawice przy manipulacji',
        'Sprawdź czy nie powstały szkodliwe produkty'
      ]
    }
  ],

  calculations: {
    colorChange: 'ΔE* = √[(ΔL*)² + (Δa*)² + (Δb*)²]',
    retentionProperty: '% zachowania = (właściwość końcowa / początkowa) × 100%',
    uvDose: 'Dawka UV = natężenie × czas ekspozycji [MJ/m²]',
    yellowingIndex: 'YI = 100 × (Cx × X - Cz × Z) / Y',
    where: {
      'ΔE*': 'całkowita zmiana koloru',
      'ΔL*, Δa*, Δb*': 'zmiany współrzędnych kolorystycznych',
      'Cx, Cz': 'współczynniki dla źródła światła',
      'X, Y, Z': 'współrzędne tristimulus'
    }
  },

  acceptanceCriteria: {
    temperatureStability: 'BST 65±3°C przez >95% czasu ekspozycji',
    irradianceStability: '±10% od wartości nominalnej',
    humidityControl: '±5% RH od wartości zadanej',
    uniformity: 'Różnica naświetlenia <10% w płaszczyźnie próbek',
    calibrationValidity: 'Kalibracja radiometru ważna <12 miesięcy'
  },

  commonIssues: [
    {
      problem: 'Nierównomierne starzenie próbek',
      causes: [
        'Niejednorodne naświetlenie w komorze',
        'Zacienienie między próbkami',
        'Różna odległość od lamp',
        'Zanieczyszczone filtry'
      ],
      solutions: [
        'Sprawdź rozmieszczenie lamp',
        'Zwiększ odstępy między próbkami',
        'Umieść próbki w tej samej odległości',
        'Wyczyść lub wymień filtry'
      ]
    },
    {
      problem: 'Niestabilne parametry ekspozycji',
      causes: [
        'Starzenie się lamp',
        'Niestabilne zasilanie',
        'Problemy z kontrolerem',
        'Zanieczyszczone sensory'
      ],
      solutions: [
        'Wymień lampy według harmonogramu',
        'Sprawdź stabilność zasilania',
        'Skalibruj kontroler',
        'Wyczyść czujniki temperatury i wilgotności'
      ]
    },
    {
      problem: 'Nadmierne pękanie próbek',
      causes: [
        'Za wysoka temperatura',
        'Za duże zmiany wilgotności',
        'Materiał wrażliwy na UV',
        'Naprężenia w próbkach'
      ],
      solutions: [
        'Obniż temperaturę BST',
        'Zwiększ stopniowość zmian wilgotności',
        'Skróć czas ekspozycji',
        'Sprawdź przygotowanie próbek'
      ]
    }
  ],

  typicalValues: {
    'PE (polietylen)': 'Znaczące zmiany po 500-1000h',
    'PP (polipropylen)': 'Degradacja po 1000-1500h',
    'PVC (z UV-stabilizatorami)': 'Stabilny do 2000h+',
    'PC (poliwęglan)': 'Żółknięcie po 500-800h',
    'PMMA': 'Dobra odporność do 1500h',
    'ABS': 'Zmiany koloru po 300-600h',
    'PS (polistyren)': 'Szybka degradacja <300h'
  },

  references: [
    'ISO 4892-2:2013 - Plastics - Methods of exposure to laboratory light sources - Part 2: Xenon-arc lamps',
    'ASTM G155-13 - Standard Practice for Operating Xenon Arc Light Apparatus',
    'IEC 61215-2:2016 - Terrestrial photovoltaic (PV) modules - Design qualification and type approval',
    'ASTM D4459-06 - Standard Practice for Xenon-Arc Exposure of Plastics'
  ]
};
