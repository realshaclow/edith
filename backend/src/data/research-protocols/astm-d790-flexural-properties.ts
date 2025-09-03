export const astmD790Protocol = {
  id: 'astm-d790',
  title: 'ASTM D790 - Właściwości przy Zginaniu Plastików',
  description: 'Standardowy protokół testowy do określania właściwości przy zginaniu niewnzmocnionych i wzmocnionych plastików metodą 3-punktowego zginania.',
  category: 'mechanical',
  estimatedDuration: '30-45 minut na próbkę',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Określenie wytrzymałości na zginanie, modułu przy zginaniu i odkształcenia przy maksymalnym naprężeniu plastików w kontrolowanych warunkach.',
    scope: 'Stosowane do sztywnych i półsztywnych materiałów plastikowych w formie próbek prostokątnych.',
    principles: 'Próbki są poddawane zginaniu 3-punktowemu ze stałą prędkością do zniszczenia lub określonego odkształcenia.',
    standards: ['ASTM D790-17', 'ISO 178', 'EN ISO 178']
  },

  equipment: [
    { name: 'Uniwersalna Maszyna Wytrzymałościowa', specification: 'Zdolna do testów zginania z dokładnością ±1%' },
    { name: 'Przyrząd do Zginania 3-punktowego', specification: 'Promień punktów podparcia 5mm, promień obciążacza 5mm' },
    { name: 'Czujnik Siły', specification: 'Dokładność ±1% zakresu pomiarowego' },
    { name: 'Czujnik Ugięcia', specification: 'Dokładność ±0.01mm' },
    { name: 'Suwmiarka', specification: 'Dokładność ±0.025mm' },
    { name: 'Micrometer', specification: 'Dokładność ±0.001mm dla grubości' }
  ],

  materials: [
    'Próbki prostokątne wymiary zgodne z ASTM D790',
    'Długość: minimum 16 x grubość',
    'Szerokość: minimum 3.0mm, maksimum 25.4mm',
    'Grubość: 1.6-25.4mm'
  ],

  safetyGuidelines: [
    'Noś okulary ochronne podczas testowania',
    'Upewnij się że próbka jest stabilnie zamocowana',
    'Uważaj na nagłe pęknięcie próbki',
    'Sprawdź czy przyrząd do zginania jest poprawnie zainstalowany',
    'Trzymaj ręce z dala od punktów obciążenia'
  ],

  testConditions: {
    temperature: '23 ± 2°C',
    humidity: '50 ± 5% RH',
    conditioning: 'Minimum 40 godzin w standardowych warunkach',
    testSpeed: '2.0 mm/min (dla próbek o grubości 3.2mm)',
    supportSpan: 'L = 16 x grubość próbki',
    environment: 'Standardowa atmosfera laboratoryjna'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki prostokątne zgodnie z wymogami ASTM D790',
      duration: '15-20 minut',
      instructions: [
        'Sprawdź wymiary próbek - długość min. 16x grubość',
        'Zmierz dokładnie szerokość próbki w 3 punktach (±0.025mm)',
        'Zmierz grubość próbki w 3 punktach (±0.001mm)',
        'Oblicz średnie wymiary i zapisz w arkuszu danych',
        'Sprawdź próbki pod kątem defektów, rys lub nieregularności',
        'Oznacz środek długości próbki dla prawidłowego pozycjonowania'
      ],
      tips: [
        'Używaj mikrometru do pomiaru grubości dla lepszej dokładności',
        'Próbki powinny mieć gładkie krawędzie bez zadrapań',
        'Odrzuć próbki z widocznymi defektami lub pęcherzami'
      ],
      safety: [
        'Obchodź się ostrożnie z próbkami aby uniknąć uszkodzeń',
        'Sprawdź czy krawędzie są gładkie i nie ostre'
      ]
    },
    {
      id: 'setup-1',
      title: 'Konfiguracja Przyrządu',
      description: 'Skonfiguruj przyrząd do 3-punktowego zginania',
      duration: '10-15 minut',
      instructions: [
        'Zainstaluj przyrząd do zginania w maszynie testowej',
        'Ustaw rozstaw podpór na L = 16 x grubość próbki',
        'Sprawdź wyrównanie obciążacza z punktami podparcia',
        'Wyzeruj czujnik siły i przemieszczenia',
        'Ustaw prędkość traversy na 2.0 mm/min',
        'Sprawdź że promienie punktów styku wynoszą 5mm'
      ],
      tips: [
        'Użyj szablonu do sprawdzenia rozstawu podpór',
        'Upewnij się że obciążacz jest centralnie położony',
        'Sprawdź gładkość ruchu traversy'
      ],
      safety: [
        'Upewnij się że przyrząd jest stabilnie zamocowany',
        'Sprawdź funkcję awaryjnego zatrzymania',
        'Zweryfikuj że obciążacz nie ma ostrych krawędzi'
      ]
    },
    {
      id: 'test-1',
      title: 'Pozycjonowanie Próbki',
      description: 'Umieść próbkę w przyrządzie do zginania',
      duration: '2-3 minuty na próbkę',
      instructions: [
        'Umieść próbkę na podporach płaską stroną do dołu',
        'Wycentruj próbkę tak aby obciążacz był w środku rozpiętości',
        'Sprawdź że próbka leży płasko na podporach',
        'Upewnij się że obciążacz jest tuż nad próbką (bez dotykania)',
        'Sprawdź czy próbka jest prosta i nie skręcona'
      ],
      tips: [
        'Użyj znaczników na próbce do szybkiego centrowania',
        'Sprawdź że próbka nie wystaje poza podpory',
        'Upewnij się że powierzchnia próbki jest czysta'
      ],
      safety: [
        'Trzymaj palce z dala od strefy obciążenia',
        'Nie uruchamiaj testu jeśli próbka nie jest właściwie pozycjonowana'
      ]
    },
    {
      id: 'test-2',
      title: 'Test Zginania',
      description: 'Wykonaj test zginania zgodnie z procedurą',
      duration: '5-15 minut na próbkę',
      instructions: [
        'Wyzeruj odczyty siły i ugięcia',
        'Uruchom system akwizycji danych',
        'Rozpocznij test ze stałą prędkością 2.0 mm/min',
        'Monitoruj krzywą siła-ugięcie w czasie rzeczywistym',
        'Zatrzymaj test gdy próbka ulegnie zniszczeniu LUB',
        'Zatrzymaj przy ugięciu 5% rozpiętości dla elastycznych materiałów',
        'Zapisz dane i zanotuj sposób zniszczenia'
      ],
      tips: [
        'Obserwuj czy zniszczenie następuje w środku rozpiętości',
        'Notuj nietypowe zachowania (trzask, rozwarstwianie)',
        'Dla materiałów elastycznych zatrzymaj przy 5% ugięciu'
      ],
      safety: [
        'Stój z boku podczas testowania',
        'Bądź przygotowany na nagłe pęknięcie próbki',
        'Zatrzymaj test jeśli próbka ześliznie się z podpór'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Oblicz właściwości przy zginaniu z danych testowych',
      duration: '10-15 minut',
      instructions: [
        'Przejrzyj krzywą siła-ugięcie pod kątem poprawności',
        'Określ maksymalną siłę przed zniszczeniem',
        'Oblicz wytrzymałość na zginanie ze wzoru',
        'Oblicz moduł przy zginaniu z nachylenia krzywej',
        'Określ ugięcie przy maksymalnej sile',
        'Sprawdź czy zniszczenie nastąpiło w odpowiednim miejscu',
        'Zapisz wszystkie obliczone wartości'
      ],
      tips: [
        'Użyj obszaru liniowego krzywej do obliczenia modułu',
        'Sprawdź czy zniszczenie było w środku rozpiętości',
        'Odrzuć testy z nieprawidłowym zniszczeniem'
      ],
      safety: []
    }
  ],

  calculations: [
    {
      parameter: 'Wytrzymałość na Zginanie',
      formula: 'σ_f = 3FL / (2bh²)',
      units: 'MPa',
      description: 'Maksymalne naprężenie na powierzchni próbki w momencie zniszczenia'
    },
    {
      parameter: 'Moduł przy Zginaniu', 
      formula: 'E_f = (F₁L³) / (4bh³δ)',
      units: 'GPa',
      description: 'Stosunek naprężenia do odkształcenia w obszarze liniowym'
    },
    {
      parameter: 'Odkształcenie przy Maksymalnej Sile',
      formula: 'ε_f = 6δh / L²',
      units: '%',
      description: 'Odkształcenie powierzchni próbki przy maksymalnej sile'
    }
  ],

  acceptanceCriteria: [
    'Zniszczenie musi nastąpić w środkowej 1/3 rozpiętości',
    'Nie wolno aby próbka ześlizgnęła się z podpór',
    'Krzywa siła-ugięcie powinna być gładka',
    'Prędkość testu musi być stała (±10%)',
    'Minimum 5 próbek dla statystycznej ważności'
  ],

  commonIssues: [
    {
      issue: 'Zniszczenie przy podporach',
      cause: 'Za duży promień podpór lub koncentracja naprężeń',
      solution: 'Zmniejsz promień podpór, sprawdź gładkość powierzchni'
    },
    {
      issue: 'Poślizg próbki',
      cause: 'Nieodpowiednia powierzchnia podpór lub za mała siła',
      solution: 'Zwiększ chropowatość podpór, sprawdź wyrównanie'
    },
    {
      issue: 'Nieliniowa krzywa',
      cause: 'Luzy w przyrządzie lub nieprawidłowe pozycjonowanie',
      solution: 'Sprawdź sztywność przyrządu, popraw pozycjonowanie'
    },
    {
      issue: 'Duży rozrzut wyników',
      cause: 'Zmienne wymiary próbek lub warunki testu',
      solution: 'Popraw przygotowanie próbek, kontroluj środowisko'
    }
  ],

  references: [
    'ASTM D790-17: Standard Test Methods for Flexural Properties of Unreinforced and Reinforced Plastics',
    'ISO 178: Plastics - Determination of flexural properties',
    'EN ISO 178: Plastics - Determination of flexural properties'
  ],

  notes: [
    'Rozpiętość L = 16h zapewnia optymalne warunki testu dla większości materiałów',
    'Dla materiałów bardzo elastycznych można stosować rozpiętość L = 32h',
    'Prędkość 2mm/min jest standardowa, ale może być dostosowana do materiału',
    'Test należy zatrzymać przy 5% ugięciu dla materiałów bez wyraźnego pęknięcia',
    'Temperatura i wilgotność znacząco wpływają na wyniki'
  ]
};
