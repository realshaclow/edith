export const astmD412Protocol = {
  id: 'astm-d412',
  title: 'ASTM D412 - Właściwości Rozciągania Gumy',
  description: 'Kompleksowy protokół do określania właściwości rozciągania wulkanizowanych elastomerów i termoplastycznych elastomerów.',
  category: 'mechanical',
  estimatedDuration: '30-45 minut na próbkę',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Określenie wytrzymałości na rozciąganie, wydłużenia przy zerwaniu i modułów sprężystości materiałów gumowych.',
    scope: 'Stosowane do wulkanizowanej gumy, termoplastycznych elastomerów i podobnych materiałów elastycznych.',
    principles: 'Próbki są rozciągane ze stałą prędkością do zniszczenia podczas pomiaru siły i wydłużenia.',
    standards: ['ASTM D412-16', 'ISO 37', 'DIN 53504']
  },

  equipment: [
    { name: 'Uniwersalna Maszyna Wytrzymałościowa', specification: 'Zdolna do utrzymania stałej prędkości rozciągania' },
    { name: 'Czujnik Siły', specification: 'Dokładność ±1% z możliwością pomiaru do zerwania' },
    { name: 'Uchwyty Próbek', specification: 'Zapobiegające poślizgowi, odpowiednie dla elastomerów' },
    { name: 'Ekstensometr', specification: 'Bezdotykowy lub z małą siłą docisku dla elastomerów' },
    { name: 'Szablon do Cięcia', specification: 'Typ C (pierścień), D (łzka) lub inne zgodnie z ASTM' },
    { name: 'Nóż/Wykrawarka', specification: 'Ostre ostrze do precyzyjnego cięcia próbek' },
    { name: 'Suwmiarka', specification: 'Dokładność ±0.025mm do pomiaru grubości' },
    { name: 'Komora Klimatyczna', specification: 'Kontrola temperatury ±2°C (opcjonalna)' }
  ],

  materials: [
    'Próbki gumy o grubości 2±0.2mm',
    'Szablon do wykrawania (typ C, D lub inne)',
    'Proszek talku (środek antyadhezyjny)',
    'Znaczniki do oznaczania długości pomiarowej',
    'Rękawice nitrylowe'
  ],

  safetyGuidelines: [
    'Noś okulary ochronne podczas testowania',
    'Uważaj na zniszczenie próbki - może nastąpić gwałtownie',
    'Sprawdź mocowanie próbki przed rozpoczęciem testu',
    'Upewnij się że procedury awaryjnego zatrzymania są znane',
    'Używaj odpowiednich narzędzi do manipulacji próbkami'
  ],

  testConditions: {
    temperature: '23±2°C (standardowa) lub inna zgodnie z wymaganiami',
    humidity: '50±5% RH',
    conditioning: 'Minimum 3 godziny w standardowych warunkach',
    testSpeed: '500±50 mm/min (standardowa) lub inna określona',
    preload: 'Minimalne naprężenie do wyrównania próbki'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki testowe zgodnie z ASTM D412',
      duration: '15-20 minut',
      instructions: [
        'Sprawdź grubość materiału (2±0.2mm dla typu C)',
        'Wybierz odpowiedni typ próbki (C, D lub inny)',
        'Wykrój próbki używając ostrego narzędzia',
        'Sprawdź czy krawędzie cięcia są gładkie i prostopadłe',
        'Zmierz grubość próbki w najwęższej części',
        'Sprawdź wizualnie czy nie ma defektów'
      ],
      tips: [
        'Używaj szablonu do zapewnienia prawidłowych wymiarów',
        'Cięcie jednym ruchem zapobiega powstawaniu karb',
        'Próbki typu C są standardowe dla większości zastosowań'
      ],
      safety: [
        'Używaj ostrych narzędzi ostrożnie',
        'Stabilizuj materiał podczas cięcia',
        'Upewnij się że ręce są z dala od ostrza'
      ]
    },
    {
      id: 'setup-1',
      title: 'Konfiguracja Sprzętu',
      description: 'Skonfiguruj maszynę testową dla elastomerów',
      duration: '10-15 minut',
      instructions: [
        'Sprawdź kalibrację czujnika siły',
        'Zainstaluj odpowiednie uchwyty dla gumy',
        'Ustaw prędkość rozciągania (500 mm/min)',
        'Skonfiguruj akwizycję danych (siła vs. przemieszczenie)',
        'Sprawdź zakres pomiaru ekstensometru',
        'Wyzeruj czujnik siły bez próbki'
      ],
      tips: [
        'Uchwyty muszą zapobiegać poślizgowi bez uszkadzania próbki',
        'Sprawdź czy ekstensometr nie wywiera nadmiernej siły',
        'Test kalibracyjny z materiałem referencyjnym'
      ],
      safety: [
        'Sprawdź funkcję awaryjnego zatrzymania',
        'Upewnij się że osłony są na miejscu',
        'Sprawdź czy zakres czujnika siły jest odpowiedni'
      ]
    },
    {
      id: 'test-1',
      title: 'Montaż Próbki',
      description: 'Zamontuj próbkę w uchwyty maszyny',
      duration: '5 minut na próbkę',
      instructions: [
        'Zamocuj próbkę w dolnym uchwycie',
        'Wyrównaj próbkę osiowo z kierunkiem rozciągania',
        'Zamocuj górny uchwyt z minimalnym naprężeniem wstępnym',
        'Sprawdź czy próbka jest prosto zamocowana',
        'Zainstaluj ekstensometr w części pomiarowej',
        'Sprawdź czy długość pomiarowa jest prawidłowa'
      ],
      tips: [
        'Unikaj przekręcania próbki podczas mocowania',
        'Równomierne mocowanie w uchwytach',
        'Minimalne naprężenie wstępne aby usunąć luz'
      ],
      safety: [
        'Sprawdź stabilność mocowania próbki',
        'Uważaj na ostre krawędzie uchwytów',
        'Ekstensometr nie może uszkodzić próbki'
      ]
    },
    {
      id: 'test-2',
      title: 'Wykonanie Testu',
      description: 'Przeprowadź test rozciągania',
      duration: '5-10 minut na próbkę',
      instructions: [
        'Uruchom akwizycję danych',
        'Rozpocznij rozciąganie ze stałą prędkością',
        'Obserwuj próbkę podczas testu',
        'Zapisuj naprężenia przy wydłużeniach 100%, 200%, 300%',
        'Kontynuuj do zerwania próbki',
        'Zapisz siłę maksymalną i wydłużenie przy zerwaniu'
      ],
      tips: [
        'Obserwuj równomierność deformacji próbki',
        'Zwróć uwagę na miejsce zerwania',
        'Zapisuj wszystkie anomalie podczas testu'
      ],
      safety: [
        'Bądź przygotowany na gwałtowne zniszczenie',
        'Nie dotykaj próbki podczas rozciągania',
        'Sprawdź czy ekstensometr nie przeszkadza'
      ]
    },
    {
      id: 'calc-1',
      title: 'Obliczenia i Analiza',
      description: 'Oblicz właściwości mechaniczne',
      duration: '10 minut',
      instructions: [
        'Oblicz naprężenie: σ = F / A₀ [MPa]',
        'Oblicz wydłużenie: ε = (L - L₀) / L₀ × 100% [%]',
        'Określ wytrzymałość na rozciąganie (naprężenie maksymalne)',
        'Określ wydłużenie przy zerwaniu',
        'Oblicz moduły przy 100%, 200%, 300% wydłużenia',
        'Sprawdź czy zerwanie nastąpiło w części pomiarowej'
      ],
      tips: [
        'Użyj początkowego przekroju próbki do obliczeń',
        'Sprawdź linearność w zakresie małych odkształceń',
        'Odrzuć wyniki jeśli zerwanie poza częścią pomiarową'
      ],
      safety: []
    }
  ],

  calculations: {
    stress: 'σ = F / A₀ [MPa]',
    strain: 'ε = (L - L₀) / L₀ × 100 [%]',
    modulus: 'E = Δσ / Δε [MPa]',
    where: {
      'F': 'siła [N]',
      'A₀': 'początkowy przekrój próbki [mm²]',
      'L': 'aktualna długość [mm]',
      'L₀': 'początkowa długość pomiarowa [mm]'
    }
  },

  acceptanceCriteria: {
    sampleGeometry: 'Próbka zgodna z wymiarami ASTM D412',
    failureLocation: 'Zerwanie w części pomiarowej próbki',
    minimumSamples: 'Minimum 5 prawidłowych próbek na test',
    repeatability: 'Współczynnik zmienności < 15% dla wytrzymałości'
  },

  commonIssues: [
    {
      problem: 'Zerwanie przy uchwycie',
      causes: [
        'Za mocne dokręcenie uchwytów',
        'Koncentracja naprężeń przy uchwycie',
        'Niewłaściwy kształt próbki',
        'Uszkodzenie próbki podczas mocowania'
      ],
      solutions: [
        'Zmniejsz siłę dociskania uchwytów',
        'Sprawdź profil próbki w miejscu uchwytu',
        'Użyj próbek z łagodnymi przejściami',
        'Ostrożnie manipuluj próbkami'
      ]
    },
    {
      problem: 'Poślizg próbki w uchwytach',
      causes: [
        'Za słabe mocowanie',
        'Gładka powierzchnia próbki',
        'Niewłaściwe uchwyty',
        'Za wysokie naprężenia'
      ],
      solutions: [
        'Zwiększ siłę dociskania (ostrożnie)',
        'Użyj środka zwiększającego przyczepność',
        'Zamontuj odpowiednie uchwyty teksturowane',
        'Sprawdź geometrię próbki'
      ]
    },
    {
      problem: 'Nieregularne krzywe naprężenie-odkształcenie',
      causes: [
        'Niejednorodność materiału',
        'Defekty w próbce',
        'Nieprawidłowa prędkość testu',
        'Problemy z ekstensometrem'
      ],
      solutions: [
        'Sprawdź jakość materiału',
        'Przygotuj próbki ostrożniej',
        'Sprawdź kalibrację prędkości',
        'Skalibruj ekstensometr'
      ]
    }
  ],

  typicalValues: {
    'Guma naturalna': 'Wytrzymałość: 20-35 MPa, Wydłużenie: 300-800%',
    'SBR': 'Wytrzymałość: 10-25 MPa, Wydłużenie: 200-600%',
    'NBR': 'Wytrzymałość: 15-30 MPa, Wydłużenie: 200-500%',
    'EPDM': 'Wytrzymałość: 10-20 MPa, Wydłużenie: 300-600%',
    'Silikon': 'Wytrzymałość: 5-15 MPa, Wydłużenie: 200-800%',
    'Poliuretan': 'Wytrzymałość: 20-60 MPa, Wydłużenie: 300-1000%'
  },

  references: [
    'ASTM D412-16 - Standard Test Methods for Vulcanized Rubber and Thermoplastic Elastomers—Tension',
    'ISO 37:2017 - Rubber, vulkanized or thermoplastic — Determination of tensile stress-strain properties',
    'DIN 53504 - Testing of rubber - Determination of tensile strength at break, tensile stress at yield, elongation at break'
  ]
};
