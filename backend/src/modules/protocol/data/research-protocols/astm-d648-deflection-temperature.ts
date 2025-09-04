export const astmD648Protocol = {
  id: 'astm-d648',
  title: 'ASTM D648 - Temperatura Ugięcia Pod Obciążeniem (HDT)',
  description: 'Standardowy protokół do określania temperatury przy której materiały plastikowe uginają się o określoną wartość pod standardowym obciążeniem.',
  category: 'THERMAL',
  estimatedDuration: '2-4 godziny na próbkę',
  difficulty: 'ADVANCED',
  
  overview: {
    purpose: 'Określenie temperatury przy której próbka plastiku ugina się o 0.25mm (lub 0.33mm) pod obciążeniem zginającym w kontrolowanych warunkach.',
    scope: 'Stosowane do plastików w formie prostokątnych próbek do oceny zachowania termomechanicznego.',
    principles: 'Próbka jest poddawana stałemu obciążeniu zginającemu podczas równomiernego podgrzewania aż osiągnie określone ugięcie.',
    standards: ['ASTM D648-18', 'ISO 75-1', 'ISO 75-2']
  },

  equipment: [
    { name: 'Aparatura HDT', specification: 'Z kontrolowanym podgrzewaniem 2±0.2°C/min' },
    { name: 'Łaźnia Ogrzewająca', specification: 'Olej silikonowy lub glikol etylenowy' },
    { name: 'Czujnik Temperatury', specification: 'Dokładność ±1°C' },
    { name: 'Czujnik Ugięcia', specification: 'Dokładność ±0.01mm' },
    { name: 'System Obciążenia', specification: '0.45 MPa lub 1.80 MPa na powierzchnię' },
    { name: 'Mieszadło', specification: 'Do równomiernego rozkładu temperatury' }
  ],

  materials: [
    'Próbki prostokątne 127 x 12.7 x 3.2mm (nominal)',
    'Tolerancje: długość ±2mm, szerokość ±0.2mm, grubość ±0.2mm',
    'Powierzchnia gładka, bez rys i defektów',
    'Krawędzie równoległe i prostopadłe'
  ],

  safetyGuidelines: [
    'Używaj środków ochrony osobistej przy pracy z gorącymi cieczami',
    'Zapewnij odpowiednią wentylację przy podgrzewaniu olejów',
    'Uważaj na gorące powierzchnie aparatury',
    'Nie dotykaj próbek podczas testu - są gorące',
    'Sprawdź systemy bezpieczeństwa przed uruchomieniem'
  ],

  testConditions: {
    temperature: 'Początkowa: 23 ± 2°C',
    heatingRate: '2.0 ± 0.2°C/min',
    stress: '0.45 MPa (Method A) lub 1.80 MPa (Method B)',
    deflection: '0.25mm (standard) lub 0.33mm (alternatywny)',
    medium: 'Olej silikonowy lub apropriate heat transfer fluid',
    environment: 'Kontrolowana temperatura otoczenia'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki zgodnie z wymogami ASTM D648',
      duration: '20-30 minut',
      instructions: [
        'Sprawdź wymiary próbek - 127 x 12.7 x 3.2mm (±tolerancje)',
        'Zmierz dokładnie wszystkie wymiary próbek',
        'Sprawdź płaskość i prostoliniowość próbek',
        'Sprawdź próbki pod kątem defektów, pęcherzy lub rys',
        'Oczyść próbki z kurzu i zanieczyszczeń',
        'Kondycjonuj próbki w 23°C przez minimum 40 godzin'
      ],
      tips: [
        'Używaj mikrometru do precyzyjnego pomiaru grubości',
        'Próbki powinny być wycięte z jednolitego materiału',
        'Sprawdź prostopadłość krawędzi'
      ],
      safety: [
        'Obchodź się ostrożnie z próbkami aby uniknąć uszkodzeń',
        'Sprawdź czy krawędzie nie są ostre'
      ]
    },
    {
      id: 'setup-1',
      title: 'Przygotowanie Aparatury',
      description: 'Skonfiguruj aparaturę HDT i sprawdź wszystkie systemy',
      duration: '30-45 minut',
      instructions: [
        'Napełnij łaźnię odpowiednim medium grzewczym',
        'Sprawdź poziom cieczy - powinna pokrywać próbki',
        'Zainstaluj i skalibruj czujniki temperatury',
        'Sprawdź system pomiaru ugięcia',
        'Skonfiguruj system obciążenia (0.45 lub 1.80 MPa)',
        'Sprawdź działanie mieszadła i równomierność temperatury',
        'Przeprowadź test kalibracyjny systemu'
      ],
      tips: [
        'Użyj oleju silikonowego o odpowiedniej lepkości',
        'Sprawdź równomierność rozkładu temperatury w łaźni',
        'Upewnij się że czujniki są właściwie umieszczone'
      ],
      safety: [
        'Sprawdź wentylację laboratorium',
        'Upewnij się że systemy awaryjne działają',
        'Sprawdź czy nie ma wycieków'
      ]
    },
    {
      id: 'test-1',
      title: 'Montaż Próbki',
      description: 'Zamontuj próbkę w aparacie i zastosuj obciążenie',
      duration: '10-15 minut',
      instructions: [
        'Ustaw próbkę na podporach z rozstawem 100mm',
        'Wycentruj próbkę względem punktu obciążenia',
        'Sprawdź że próbka leży płasko na podporach',
        'Zastosuj obciążenie zgodnie z wybraną metodą',
        'Wyzeruj czujnik ugięcia',
        'Sprawdź że temperatura początkowa to 23±2°C',
        'Uruchom system rejestracji danych'
      ],
      tips: [
        'Próbka musi być idealnie wycentrowana',
        'Obciążenie powinno być zastosowane powoli i równomiernie',
        'Sprawdź że nie ma wstępnego ugięcia'
      ],
      safety: [
        'Trzymaj ręce z dala od punktów obciążenia',
        'Upewnij się że próbka jest stabilnie zamocowana'
      ]
    },
    {
      id: 'test-2',
      title: 'Test Termiczny',
      description: 'Przeprowadź test z kontrolowanym podgrzewaniem',
      duration: '2-4 godziny',
      instructions: [
        'Uruchom podgrzewanie z prędkością 2.0±0.2°C/min',
        'Monitoruj temperaturę i ugięcie w czasie rzeczywistym',
        'Sprawdzaj równomierność temperatury w łaźni',
        'Rejestruj ugięcie co najmniej co 1°C wzrostu temperatury',
        'Kontynuuj aż ugięcie osiągnie 0.25mm (lub 0.33mm)',
        'Zanotuj temperaturę przy osiągnięciu docelowego ugięcia',
        'Zatrzymaj podgrzewanie i zapisz dane'
      ],
      tips: [
        'Sprawdzaj czy prędkość podgrzewania jest stała',
        'Obserwuj czy ugięcie przebiega równomiernie',
        'Notuj wszelkie nietypowe zachowania'
      ],
      safety: [
        'Nie dotykaj gorących części aparatury',
        'Monitoruj temperaturę otoczenia',
        'Bądź przygotowany na awaryjne zatrzymanie'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Przeanalizuj dane i oblicz HDT',
      duration: '15-20 minut',
      instructions: [
        'Przejrzyj krzywą temperatura-ugięcie',
        'Określ temperaturę przy ugięciu 0.25mm',
        'Sprawdź liniowość krzywej w obszarze przejścia',
        'Oblicz średnią z minimum 3 próbek',
        'Sprawdź powtarzalność wyników',
        'Porównaj z danymi literaturowymi dla materiału',
        'Przygotuj raport z wynikami'
      ],
      tips: [
        'HDT jest definiowane precyzyjnie przy określonym ugięciu',
        'Sprawdź czy krzywa nie ma nietypowych skoków',
        'Uwzględnij niepewność pomiarową'
      ],
      safety: []
    }
  ],

  calculations: [
    {
      parameter: 'Temperatura Ugięcia Pod Obciążeniem (HDT)',
      formula: 'HDT = T przy ugięciu 0.25mm',
      units: '°C',
      description: 'Temperatura przy której próbka ugina się o 0.25mm pod obciążeniem'
    },
    {
      parameter: 'Naprężenie Zginające',
      formula: 'σ = 3FL / (2bh²)',
      units: 'MPa',
      description: 'Naprężenie na powierzchni próbki pod obciążeniem'
    }
  ],

  acceptanceCriteria: [
    'Prędkość podgrzewania musi być 2.0±0.2°C/min',
    'Ugięcie musi być mierzone z dokładnością ±0.01mm',
    'Temperatura musi być równomierna w całej łaźni (±1°C)',
    'Minimum 3 próbki dla każdego materiału',
    'Powtarzalność ±3°C między próbkami'
  ],

  commonIssues: [
    {
      issue: 'Nierównomierne ugięcie',
      cause: 'Niejednorodny rozkład temperatury lub defekty próbki',
      solution: 'Popraw mieszanie łaźni, sprawdź jakość próbek'
    },
    {
      issue: 'Za szybki wzrost ugięcia',
      cause: 'Za wysoka prędkość podgrzewania lub za wysokie obciążenie',
      solution: 'Kontroluj prędkość podgrzewania, sprawdź kalibrację obciążenia'
    },
    {
      issue: 'Duży rozrzut wyników',
      cause: 'Zmienne właściwości materiału lub warunki testu',
      solution: 'Zwiększ liczbę próbek, kontroluj warunki środowiskowe'
    },
    {
      issue: 'Brak wyraźnego przegięcia',
      cause: 'Materiał zbyt sztywny lub za niskie obciążenie',
      solution: 'Zwiększ obciążenie lub przedłuż test'
    }
  ],

  references: [
    'ASTM D648-18: Standard Test Method for Deflection Temperature of Plastics Under Flexural Load',
    'ISO 75-1: Plastics - Determination of temperature of deflection under load - Part 1: General test method',
    'ISO 75-2: Plastics - Determination of temperature of deflection under load - Part 2: Plastics and ebonite'
  ],

  notes: [
    'HDT Method A (0.45 MPa) jest standardowy dla większości zastosowań',
    'HDT Method B (1.80 MPa) daje niższe temperatury - używany do porównań',
    'Wyniki silnie zależą od prędkości podgrzewania i równomierności temperatury',
    'HDT nie jest temperaturą maksymalnego użytkowania materiału',
    'Test jest szczególnie ważny dla zastosowań konstrukcyjnych plastików'
  ]
};
