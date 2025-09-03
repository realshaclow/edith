export const astmD256Protocol = {
  id: 'astm-d256',
  title: 'ASTM D256 - Odporność na Uderzenie Izod',
  description: 'Standardowy protokół do określania odporności na uderzenie plastików metodą wahadła Izod z karbem i bez karbu.',
  category: 'impact',
  estimatedDuration: '20-30 minut na serię próbek',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Określenie odporności na uderzenie materiałów plastikowych przy pomocy wahadła udarowego w kontrolowanych warunkach.',
    scope: 'Stosowane do sztywnych plastików w formie próbek z karbem lub bez karbu w temperaturze pokojowej lub innych określonych temperaturach.',
    principles: 'Próbka jest mocowana pionowo i uderzana przez spadające wahadło o znanej energii kinetycznej.',
    standards: ['ASTM D256-10', 'ISO 180', 'ASTM D4812']
  },

  equipment: [
    { name: 'Młot Udarowy Izod', specification: 'Energia 2.7J, 5.4J lub większa, dokładność ±0.1%' },
    { name: 'Imadło do Próbek', specification: 'Zdolne do utrzymania próbki pod kątem 90°' },
    { name: 'Nóż do Karbowania', specification: 'Promień 0.25±0.05mm, kąt 45°' },
    { name: 'Suwmiarka', specification: 'Dokładność ±0.025mm' },
    { name: 'Micrometer', specification: 'Dokładność ±0.001mm' },
    { name: 'Szablon Kontrolny', specification: 'Do sprawdzania wymiarów próbek' }
  ],

  materials: [
    'Próbki standardowe ASTM D256',
    'Wymiary: 63.5 x 12.7 x 3.2mm (2.5" x 0.5" x 0.125")',
    'Tolerancje wymiarowe: ±0.2mm',
    'Karb typu A: głębokość 2.54±0.05mm'
  ],

  safetyGuidelines: [
    'Zachowaj bezpieczną odległość podczas uderzenia wahadła',
    'Noś okulary ochronne - fragmenty mogą odlatywać',
    'Upewnij się że wahadło jest zabezpieczone przed przypadkowym uwolnieniem',
    'Nie dotykaj wahadła podczas jego ruchu',
    'Sprawdź czy obszar uderzenia jest wolny od przeszkód'
  ],

  testConditions: {
    temperature: '23 ± 2°C',
    humidity: '50 ± 5% RH',
    conditioning: 'Minimum 40 godzin w standardowych warunkach',
    hammerEnergy: '2.7J (standardowa), 5.4J (dla twardych materiałów)',
    notchType: 'Typ A (standardowy), Typ B (dla cienkich próbek)',
    environment: 'Standardowa atmosfera laboratoryjna'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki zgodnie z wymogami ASTM D256',
      duration: '15-20 minut',
      instructions: [
        'Sprawdź wymiary próbek - 63.5 x 12.7 x 3.2mm',
        'Zmierz dokładnie długość, szerokość i grubość (±0.025mm)',
        'Sprawdź próbki pod kątem defektów, pęcherzy lub rys',
        'Przygotuj minimum 5 próbek dla każdego materiału',
        'Oznacz próbki numerami identyfikacyjnymi',
        'Dla testów z karbem - pozostaw próbki bez karbu na razie'
      ],
      tips: [
        'Próbki powinny być wycięte z większych arkuszy jeśli to możliwe',
        'Sprawdź prostopadłość krawędzi z szablonem',
        'Odrzuć próbki z widocznymi defektami'
      ],
      safety: [
        'Obchodź się ostrożnie z próbkami aby uniknąć uszkodzeń',
        'Sprawdź czy krawędzie nie są ostre'
      ]
    },
    {
      id: 'notch-1',
      title: 'Wykonanie Karbu (jeśli wymagane)',
      description: 'Wykonaj karb w próbkach zgodnie ze specyfikacją',
      duration: '10-15 minut',
      instructions: [
        'Ustaw nóż do karbowania na głębokość 2.54±0.05mm',
        'Zamocuj próbkę w przyrządzie do karbowania',
        'Wykonaj karb jednym płynnym ruchem',
        'Sprawdź głębokość karbu mikrometrem',
        'Sprawdź promień dna karbu (0.25±0.05mm)',
        'Oczyść karb z wiórów i zadziorów'
      ],
      tips: [
        'Nóż musi być ostry aby uzyskać gładki karb',
        'Unikaj wielokrotnego przecinania w tym samym miejscu',
        'Sprawdź kalibrację przyrządu do karbowania'
      ],
      safety: [
        'Używaj odpowiednich uchwytów - nóż jest bardzo ostry',
        'Trzymaj palce z dala od linii cięcia',
        'Sprawdź czy nóż jest stabilnie zamocowany'
      ]
    },
    {
      id: 'setup-1',
      title: 'Konfiguracja Młota Udarowego',
      description: 'Przygotuj młot udarowy Izod do testowania',
      duration: '10 minut',
      instructions: [
        'Sprawdź kalibrację młota udarowego (data ostatniej kalibracji)',
        'Wybierz odpowiednią energię wahadła (2.7J lub 5.4J)',
        'Sprawdź czy wahadło swing freely bez tarcia',
        'Wyzeruj wskazania energii',
        'Sprawdź czy imadło jest czyste i w dobry stanie',
        'Sprawdź wyrównanie osi wahadła'
      ],
      tips: [
        'Wykonaj kilka swobodnych swingów aby sprawdzić działanie',
        'Sprawdź czy brak uszkodzeń na powierzchni uderzeniowej',
        'Upewnij się że mechanizm zwalniający działa prawidłowo'
      ],
      safety: [
        'Sprawdź funkcję bezpieczeństwa zatrzymania wahadła',
        'Upewnij się że nikt nie stoi w strefie ruchu wahadła',
        'Sprawdź czy osłony są na miejscu'
      ]
    },
    {
      id: 'test-1',
      title: 'Montaż i Test Próbki',
      description: 'Zamontuj próbkę i wykonaj test uderzenia',
      duration: '2-3 minuty na próbkę',
      instructions: [
        'Zamocuj próbkę w imadle tak aby karb był po stronie uderzenia',
        'Ustaw próbkę aby górna powierzchnia była 22mm nad imadle',
        'Sprawdź czy próbka jest pionowo i stabilnie zamocowana',
        'Ustaw wahadło w pozycji startowej',
        'Upewnij się że strefa jest wolna',
        'Zwolnij wahadło i pozwól na uderzenie',
        'Odczytaj energię pochłoniętą z wskaźnika'
      ],
      tips: [
        'Próbka powinna być zamocowana mocno ale bez nadmiernego napięcia',
        'Sprawdź czy karb jest prawidłowo zorientowany',
        'Odczytuj wynik natychmiast po uderzeniu'
      ],
      safety: [
        'Cofnij się na bezpieczną odległość przed zwolnieniem wahadła',
        'Nie próbuj zatrzymać wahadła ręką',
        'Poczekaj aż wahadło się zatrzyma przed zbliżeniem'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Oblicz odporność na uderzenie i przeanalizuj wyniki',
      duration: '10 minut',
      instructions: [
        'Zapisz energię pochłoniętą dla każdej próbki',
        'Zmierz dokładną grubość próbki pod karbem',
        'Oblicz odporność na uderzenie (J/m lub ft-lb/in)',
        'Sprawdź sposób zniszczenia każdej próbki',
        'Oblicz średnią wartość i odchylenie standardowe',
        'Sprawdź czy wyniki mieszczą się w oczekiwanym zakresie',
        'Zanotuj nietypowe zniszczenia'
      ],
      tips: [
        'Odrzuć wyniki z nietypowym zniszczeniem',
        'Sprawdź czy nie ma wartości odstających',
        'Porównaj z danymi literaturowymi dla materiału'
      ],
      safety: []
    }
  ],

  calculations: [
    {
      parameter: 'Odporność na Uderzenie Izod',
      formula: 'Impact = E / (b × t)',
      units: 'J/m',
      description: 'Energia pochłonięta podzielona przez szerokość próbki pod karbem'
    },
    {
      parameter: 'Odporność na Uderzenie (US)',
      formula: 'Impact = E / t',
      units: 'ft-lb/in',
      description: 'Energia pochłonięta podzielona przez grubość próbki (system US)'
    }
  ],

  acceptanceCriteria: [
    'Próbka musi być złamana w jednym uderzeniu',
    'Zniszczenie powinno przebiegać przez karb',
    'Energia pochłonięta musi być między 10% a 85% energii wahadła',
    'Minimum 5 próbek musi dać zgodne wyniki',
    'Współczynnik zmienności powinien być <15%'
  ],

  commonIssues: [
    {
      issue: 'Próbka nie pęka całkowicie',
      cause: 'Za mała energia wahadła lub materiał zbyt ciągliwy',
      solution: 'Użyj większej energii wahadła lub zmień metodę testowania'
    },
    {
      issue: 'Pęknięcie z dala od karbu',
      cause: 'Nieprawidłowy karb lub defekty materiału',
      solution: 'Sprawdź jakość karbu, przygotuj nowe próbki'
    },
    {
      issue: 'Duży rozrzut wyników',
      cause: 'Niekonsystentne próbki lub warunki testu',
      solution: 'Popraw przygotowanie próbek, kontroluj warunki środowiskowe'
    },
    {
      issue: 'Za niska lub za wysoka energia',
      cause: 'Nieprawidłowy wybór energii wahadła',
      solution: 'Wybierz odpowiednią energię wahadła dla materiału'
    }
  ],

  references: [
    'ASTM D256-10: Standard Test Methods for Determining the Izod Pendulum Impact Resistance of Plastics',
    'ISO 180: Plastics - Determination of Izod impact strength',
    'ASTM D4812: Standard Test Method for Unnotched Cantilever Beam Impact Resistance of Plastics'
  ],

  notes: [
    'Test z karbem jest bardziej powtarzalny niż bez karbu',
    'Temperatura ma znaczący wpływ na wyniki - kontroluj ściśle',
    'Różne energie wahadła mogą dawać różne wyniki dla tego samego materiału',
    'Wyniki Izod nie są bezpośrednio porównywalne z wynikami Charpy',
    'Dla materiałów bardzo twardych może być potrzebna większa energia'
  ]
};
