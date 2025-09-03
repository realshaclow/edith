export const iso1133Protocol = {
  id: 'iso-1133',
  title: 'ISO 1133 - Wskaźnik Płynięcia Stopów (MFR/MVR)',
  description: 'Kompleksowy protokół do określania wskaźnika płynięcia stopów (MFR) i wskaźnika objętości stopów (MVR) termoplastycznych materiałów polimerowych.',
  category: 'Reologiczne',
  estimatedDuration: '30-45 minut na próbkę',
  difficulty: 'Średniozaawansowany',
  
  overview: {
    purpose: 'Określenie wskaźnika płynięcia stopów jako miary lepkości stopu polimeru przy określonej temperaturze i obciążeniu.',
    scope: 'Stosowane do termoplastycznych materiałów polimerowych w formie granulek, proszku lub gotowych wyrobów.',
    principles: 'Polimer jest ogrzewany w cylindrze do określonej temperatury, obciążany standardowym ciężarem i wytłaczany przez standardową dyszę.',
    standards: ['ISO 1133-1:2011', 'ISO 1133-2:2011', 'ASTM D1238']
  },

  equipment: [
    { name: 'Plastometr Ekstruzyjny', specification: 'Zgodny z ISO 1133, kontrola temperatury ±0.5°C' },
    { name: 'Ciężary Standardowe', specification: 'Komplet ciężarów od 0.325 kg do 21.6 kg' },
    { name: 'Dysza Standardowa', specification: 'Średnica 2.095±0.005mm, długość 8.000±0.025mm' },
    { name: 'Tłok', specification: 'Średnica 9.475±0.007mm, masa 484±2g' },
    { name: 'Cylinder', specification: 'Średnica wewnętrzna 9.550±0.025mm' },
    { name: 'Waga Analityczna', specification: 'Dokładność ±0.1mg' },
    { name: 'Stoper', specification: 'Dokładność ±0.1s' },
    { name: 'Narzędzie do Cięcia', specification: 'Ostre ostrze lub nożyczki' }
  ],

  materials: [
    'Próbka polimeru (4-8g)',
    'Gaze lub tkanina do czyszczenia',
    'Rozpuszczalnik do czyszczenia (jeśli wymagany)',
    'Rękawice termoodporne',
    'Pojemnik na ekstrudowany materiał'
  ],

  safetyGuidelines: [
    'Noś rękawice termoodporne przy pracy z gorącym sprzętem',
    'Uważaj na gorące powierzchnie - temperatura może osiągać 300°C',
    'Używaj okularów ochronnych podczas czyszczenia sprzętu',
    'Upewnij się o właściwej wentylacji pomieszczenia',
    'Nie dotykaj bezpośrednio ekstrudowanego materiału'
  ],

  testConditions: {
    temperature: 'Zgodnie z normą dla materiału (np. 190°C dla PE, 230°C dla PP)',
    load: 'Standardowe obciążenia: 2.16kg, 5kg, 10kg, 21.6kg',
    preheating: '5-7 minut przed rozpoczęciem testu',
    testDuration: 'Określone przez normę (zazwyczaj 10 minut)',
    environment: 'Standardowa atmosfera laboratoryjna'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Sprzętu',
      description: 'Przygotuj plastometr i sprawdź kalibrację',
      duration: '10-15 minut',
      instructions: [
        'Ustaw temperaturę zgodnie z normą dla testowanego materiału',
        'Sprawdź czystość cylindra i dyszy',
        'Zainstaluj odpowiednią dyszę w podstawie cylindra',
        'Sprawdź kalibrację temperatury',
        'Upewnij się że tłok porusza się swobodnie w cylindrze',
        'Przygotuj odpowiednie ciężary do obciążenia'
      ],
      tips: [
        'Cylinder musi być całkowicie czysty aby uniknąć zanieczyszczeń',
        'Sprawdź czy dysza nie jest zablokowana',
        'Kalibrację temperatury sprawdzaj regularnie'
      ],
      safety: [
        'Noś rękawice termoodporne',
        'Uważaj na gorące powierzchnie',
        'Sprawdź funkcję awaryjnego wyłączenia'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Próbki',
      description: 'Przygotuj odpowiednią ilość materiału do testu',
      duration: '5 minut',
      instructions: [
        'Odważ 4-8g próbki materiału',
        'Sprawdź czy materiał jest suchy i czysty',
        'Usuń ewentualne zanieczyszczenia lub obce materiały',
        'Granulki powinny być jednorodne pod względem wielkości',
        'Przygotuj dodatkowy materiał na przypadek powtórki testu'
      ],
      tips: [
        'Materiał musi być reprezentatywny dla całej partii',
        'Unikaj rozdrobnionych lub uszkodzonych granulek',
        'Przechowuj próbki w suchym miejscu'
      ],
      safety: [
        'Unikaj wdychania pyłu z materiału',
        'Noś rękawice podczas manipulacji próbką'
      ]
    },
    {
      id: 'setup-1',
      title: 'Ładowanie Materiału',
      description: 'Załaduj próbkę do plastometru',
      duration: '5 minut',
      instructions: [
        'Poczekaj aż plastometr osiągnie temperaturę testową',
        'Wsyp próbkę do cylindra przez górny otwór',
        'Wstaw tłok do cylindra',
        'Nie dociskaj tłoka - powinien opadać pod własnym ciężarem',
        'Odstaw na 5-7 minut dla podgrzania materiału'
      ],
      tips: [
        'Materiał musi się całkowicie stopić przed rozpoczęciem testu',
        'Tłok nie może być dociskany siłą',
        'Obserwuj czy materiał równomiernie się topi'
      ],
      safety: [
        'Nie dotykaj gorących części sprzętu',
        'Uważaj na wycieki stopu z dyszy'
      ]
    },
    {
      id: 'test-1',
      title: 'Przeprowadzenie Testu',
      description: 'Wykonaj pomiar wskaźnika płynięcia stopów',
      duration: '10-15 minut',
      instructions: [
        'Nałóż standardowy ciężar na tłok',
        'Uruchom stoper gdy materiał zacznie wypływać z dyszy',
        'Zbieraj ekstrudowany materiał w regularnych odstępach',
        'Odcinaj próbki co określony czas (np. co 30s)',
        'Kontynuuj przez wymagany czas testowy',
        'Zważ każdy odcinek ekstrudatu',
        'Oblicz średnią masę na jednostkę czasu'
      ],
      tips: [
        'Odcinaj ekstrudat ostro i precyzyjnie',
        'Pierwsze 1-2 minuty mogą być nieregularne - odrzuć te próbki',
        'Zbieraj przynajmniej 3-5 próbek do obliczenia średniej'
      ],
      safety: [
        'Uważaj na gorący ekstrudowany materiał',
        'Używaj odpowiednich narzędzi do cięcia',
        'Nie dotykaj dyszy podczas testu'
      ]
    },
    {
      id: 'calc-1',
      title: 'Obliczenia',
      description: 'Oblicz wskaźnik płynięcia stopów (MFR)',
      duration: '5 minut',
      instructions: [
        'Oblicz średnią masę ekstrudatu: m_śr = Σm_i / n',
        'Oblicz MFR: MFR = (m_śr × 600) / t [g/10min]',
        'gdzie: m_śr - średnia masa [g], t - czas cięcia [s]',
        'Dla MVR: MVR = MFR / ρ [cm³/10min]',
        'gdzie: ρ - gęstość materiału w temperaturze testu',
        'Sprawdź czy wynik mieści się w oczekiwanym zakresie'
      ],
      tips: [
        'Sprawdź obliczenia dwukrotnie',
        'Porównaj z danymi referencyjnymi producenta',
        'Odrzuć wyniki odbiegające znacznie od średniej'
      ],
      safety: []
    }
  ],

  calculations: {
    mfr: 'MFR = (m_śr × 600) / t [g/10min]',
    mvr: 'MVR = MFR / ρ [cm³/10min]',
    where: {
      'm_śr': 'średnia masa ekstrudatu [g]',
      't': 'czas cięcia próbki [s]',
      'ρ': 'gęstość materiału w temp. testu [g/cm³]'
    }
  },

  acceptanceCriteria: {
    repeatability: 'Różnica między pomiarami < 10% dla MFR < 10 g/10min',
    reproducibility: 'Różnica między laboratoriami < 20%',
    minimumSamples: 'Minimum 3 pomiary na próbkę',
    outliers: 'Odrzuć pomiary różniące się > 15% od średniej'
  },

  commonIssues: [
    {
      problem: 'Nieregularny przepływ materiału',
      causes: [
        'Nierównomierna temperatura',
        'Zanieczyszczony cylinder',
        'Niewłaściwa lepkość materiału'
      ],
      solutions: [
        'Sprawdź kalibrację temperatury',
        'Wyczyść dokładnie cylinder',
        'Sprawdź właściwości materiału'
      ]
    },
    {
      problem: 'Brak wypływu materiału',
      causes: [
        'Za niska temperatura',
        'Zablokowana dysza',
        'Za wysoką lepkość materiału'
      ],
      solutions: [
        'Zwiększ temperaturę zgodnie z normą',
        'Wyczyść lub wymień dyszę',
        'Zastosuj większe obciążenie'
      ]
    },
    {
      problem: 'Niereprodukowalne wyniki',
      causes: [
        'Niejednorodność próbki',
        'Niestabilna temperatura',
        'Nieprawidłowa procedura'
      ],
      solutions: [
        'Sprawdź jednorodność materiału',
        'Sprawdź stabilność temperatury',
        'Powtórz kalibrację sprzętu'
      ]
    }
  ],

  typicalValues: [
    {
      id: 'tv1',
      parameter: 'MFR',
      material: 'PE-LD',
      value: '0.1-20',
      unit: 'g/10min',
      range: { min: '0.1', max: '20' },
      conditions: '190°C/2.16kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    },
    {
      id: 'tv2',
      parameter: 'MFR',
      material: 'PE-HD',
      value: '0.1-50',
      unit: 'g/10min',
      range: { min: '0.1', max: '50' },
      conditions: '190°C/2.16kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    },
    {
      id: 'tv3',
      parameter: 'MFR',
      material: 'PP',
      value: '0.1-100',
      unit: 'g/10min',
      range: { min: '0.1', max: '100' },
      conditions: '230°C/2.16kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    },
    {
      id: 'tv4',
      parameter: 'MFR',
      material: 'PS',
      value: '1-30',
      unit: 'g/10min',
      range: { min: '1', max: '30' },
      conditions: '200°C/5kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    },
    {
      id: 'tv5',
      parameter: 'MFR',
      material: 'ABS',
      value: '1-50',
      unit: 'g/10min',
      range: { min: '1', max: '50' },
      conditions: '220°C/10kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    },
    {
      id: 'tv6',
      parameter: 'MFR',
      material: 'PC',
      value: '5-30',
      unit: 'g/10min',
      range: { min: '5', max: '30' },
      conditions: '300°C/1.2kg',
      category: 'thermal',
      source: 'ISO 1133',
      isReference: true
    }
  ],

  references: [
    'ISO 1133-1:2011 - Plastics - Determination of the melt mass-flow rate (MFR) and melt volume-flow rate (MVR) of thermoplastics - Part 1: Standard method',
    'ISO 1133-2:2011 - Part 2: Method for materials sensitive to time-temperature history',
    'ASTM D1238-13 - Standard Test Method for Melt Flow Rates of Thermoplastics by Extrusion Plastometer'
  ]
};

