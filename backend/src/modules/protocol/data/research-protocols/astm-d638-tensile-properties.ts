
export const astmD638Protocol = {
  id: 'astm-d638',
  title: 'ASTM D638 - Właściwości Rozciągowe Plastików',
  description: 'Kompleksowy protokół do określania właściwości rozciągowych niewnzmocnionych i wzmocnionych plastików w formie standardowych próbek kształtu kości.',
  category: 'MECHANICAL',
  estimatedDuration: '45-60 minut na próbkę',
  difficulty: 'INTERMEDIATE',
  
  overview: {
    purpose: 'Określenie wytrzymałości na rozciąganie, granicy plastyczności, wydłużenia i modułu sprężystości materiałów plastikowych w kontrolowanych warunkach.',
    scope: 'Stosowane do sztywnych i półsztywnych plastików w formie arkuszy, płyt lub elementów formowanych o grubości od 1mm do 14mm.',
    principles: 'Próbki są rozciągane ze stałą prędkością do zniszczenia podczas pomiaru siły i wydłużenia w celu obliczenia właściwości naprężenie-odkształcenie.',
    standards: ['ASTM D638-14', 'ISO 527-1', 'ISO 527-2']
  },

  equipment: [
    { name: 'Uniwersalna Maszyna Wytrzymałościowa', specification: 'Zdolna do utrzymania stałej prędkości traversy ±25%' },
    { name: 'Czujnik Siły', specification: 'Dokładność ±1% wskazanego obciążenia' },
    { name: 'Ekstensometr', specification: 'Klasa B2 lub lepsza, długość pomiarowa 50mm' },
    { name: 'Suwmiarka', specification: 'Dokładność ±0.025mm do pomiaru grubości' },
    { name: 'Uchwyty Próbek', specification: 'Samocentrujące, zapobiegające poślizgowi i koncentracji naprężeń' },
    { name: 'Komora Klimatyczna', specification: 'Kontrola temperatury ±2°C' }
  ],

  materials: [
    'Próbki ASTM D638 Typ I (preferowane)',
    'Próbki ASTM D638 Typ IV (dla cienkich materiałów)',
    'Narzędzia do przygotowania próbek',
    'Pisak lub znaczniki do oznaczania'
  ],

  safetyGuidelines: [
    'Noś okulary ochronne podczas testowania',
    'Upewnij się, że osłony maszyny są na miejscu',
    'Uważaj na zniszczenie próbki - fragmenty mogą odlatywać',
    'Sprawdź procedury awaryjnego zatrzymania',
    'Sprawdź zakres czujnika siły przed testowaniem'
  ],

  testConditions: {
    temperature: '23 ± 2°C',
    humidity: '50 ± 5% RH',
    conditioning: 'Minimum 40 godzin w standardowych warunkach',
    testSpeed: '5 mm/min (Typ I), 1 lub 5 mm/min (Typ IV)',
    environment: 'Standardowa atmosfera laboratoryjna'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki testowe zgodnie ze specyfikacją ASTM D638',
      duration: '15-20 minut',
      instructions: [
        'Sprawdź czy wymiary próbki spełniają wymagania ASTM D638',
        'Zmierz grubość i szerokość w najwęższej części (±0.025mm)',
        'Zapisz wymiary próbki w arkuszu danych',
        'Oznacz długość pomiarową na próbce jeśli używasz ekstensometru',
        'Sprawdź wizualnie czy nie ma defektów, pęcherzy lub nieregularności'
      ],
      tips: [
        'Użyj suwmiarki do dokładnego pomiaru wymiarów',
        'Wykonaj pomiary w 3 punktach i uśrednij',
        'Odrzuć próbki z widocznymi defektami'
      ],
      safety: [
        'Obchodź się ostrożnie z próbkami aby nie uszkodzić',
        'Upewnij się, że krawędzie cięcia są gładkie i prostopadłe'
      ]
    },
    {
      id: 'setup-1',
      title: 'Konfiguracja Sprzętu',
      description: 'Skonfiguruj maszynę testową i sprawdź kalibrację',
      duration: '10-15 minut',
      instructions: [
        'Sprawdź czy kalibracja czujnika siły jest aktualna',
        'Zainstaluj odpowiednie uchwyty dla typu próbki',
        'Ustaw prędkość traversy na określoną wartość',
        'Wyzeruj czujnik siły z zainstalowanymi uchwytami',
        'Ustaw parametry akwizycji danych (siła, przemieszczenie, czas)',
        'Sprawdź kalibrację ekstensometru jeśli używany'
      ],
      tips: [
        'Upewnij się, że uchwyty są właściwie wyrównane',
        'Sprawdź czy zakres czujnika siły jest odpowiedni',
        'Użyj uchwytów samocentrujących aby zapobiec momentom zginającym'
      ],
      safety: [
        'Sprawdź funkcję awaryjnego zatrzymania',
        'Upewnij się, że bariery ochronne są na miejscu',
        'Sprawdź czy czujnik siły nie jest przeciążony'
      ]
    },
    {
      id: 'test-1',
      title: 'Montaż Próbki',
      description: 'Zamontuj próbkę w maszynie testowej',
      duration: '3-5 minut na próbkę',
      instructions: [
        'Włóż próbkę najpierw do dolnego uchwytu',
        'Wyrównaj oś próbki z osią obciążenia',
        'Zamknij dolny uchwyt z określoną siłą zaciskania',
        'Zainstaluj górny uchwyt upewniając się, że nie ma wstępnego obciążenia',
        'Załóż ekstensometr jeśli używany (długość pomiarowa 50mm)',
        'Sprawdź wyrównanie próbki i pewność mocowania'
      ],
      tips: [
        'Unikaj przesadnego dociskania uchwytów co może powodować koncentrację naprężeń',
        'Upewnij się, że próbka jest prosta i nie skręcona',
        'Używaj stałego nacisku uchwytów między testami'
      ],
      safety: [
        'Trzymaj ręce z dala od ruchomych części',
        'Upewnij się, że próbka jest pewnie zamocowana przed testowaniem'
      ]
    },
    {
      id: 'test-2',
      title: 'Test Rozciągania',
      description: 'Wykonaj test rozciągania do zniszczenia',
      duration: '5-10 minut na próbkę',
      instructions: [
        'Wyzeruj odczyty siły i przemieszczenia',
        'Uruchom system akwizycji danych',
        'Rozpocznij test z określoną prędkością traversy',
        'Monitoruj krzywą siła-przemieszczenie w czasie rzeczywistym',
        'Zanotuj punkt płynięcia jeśli materiał wykazuje plastyczność',
        'Kontynuuj test do zniszczenia próbki',
        'Zatrzymaj test i zapisz dane'
      ],
      tips: [
        'Obserwuj czy nie ma przedwczesnego zniszczenia w uchwytach',
        'Notuj wszelkie nietypowe zachowania podczas testowania',
        'Zapisz rzeczywistą prędkość testu jeśli różni się od docelowej'
      ],
      safety: [
        'Stój z boku próbki podczas testowania',
        'Bądź przygotowany na nagłe zniszczenie i ruch próbki',
        'Zatrzymaj test jeśli obciążenie spadnie nieoczekiwanie'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Danych',
      description: 'Oblicz właściwości rozciągowe z danych testowych',
      duration: '10-15 minut',
      instructions: [
        'Przejrzyj krzywą siła-przemieszczenie pod kątem poprawności',
        'Oblicz pole przekroju poprzecznego z wymiarów',
        'Określ wytrzymałość na rozciąganie (maksymalne naprężenie)',
        'Oblicz granicę plastyczności (metoda 0.2% offsetu jeśli stosowna)',
        'Oblicz moduł sprężystości (nachylenie obszaru liniowego)',
        'Określ wydłużenie przy zerwaniu (%)',
        'Zapisz wszystkie obliczone wartości'
      ],
      tips: [
        'Użyj regresji liniowej do obliczenia modułu',
        'Sprawdź obliczenia z oprogramowaniem jeśli dostępne',
        'Sprawdź dane pod kątem wartości odstających lub błędów'
      ],
      safety: []
    }
  ],

  calculations: [
    {
      parameter: 'Wytrzymałość na Rozciąganie',
      formula: 'σ = F_max / A₀',
      units: 'MPa',
      description: 'Maksymalne naprężenie wytrzymane przez próbkę'
    },
    {
      parameter: 'Granica Plastyczności',
      formula: 'σ_y = F_y / A₀',
      units: 'MPa', 
      description: 'Naprężenie w punkcie płynięcia (metoda 0.2% offsetu)'
    },
    {
      parameter: 'Moduł Sprężystości',
      formula: 'E = Δσ / Δε',
      units: 'GPa',
      description: 'Nachylenie krzywej naprężenie-odkształcenie w obszarze liniowym'
    },
    {
      parameter: 'Wydłużenie przy Zerwaniu',
      formula: 'ε = (L_f - L₀) / L₀ × 100%',
      units: '%',
      description: 'Procentowy wzrost długości pomiarowej przy zniszczeniu'
    }
  ],

  acceptanceCriteria: [
    'Zniszczenie próbki musi nastąpić w części pomiarowej, nie w uchwytach',
    'Krzywa siła-przemieszczenie powinna być gładka bez nieregularności',
    'Prędkość testu musi być w granicach ±25% określonej wartości',
    'Minimum 5 próbek wymagane dla ważności statystycznej',
    'Współczynnik zmienności powinien być ≤15% dla wytrzymałości na rozciąganie'
  ],

  commonIssues: [
    {
      issue: 'Zniszczenie w uchwytach',
      cause: 'Niewystarczająca siła zaciskania lub koncentracja naprężeń',
      solution: 'Zwiększ nacisk uchwytów, użyj nakładek lub zmniejsz długość pomiarową'
    },
    {
      issue: 'Przedwczesne zniszczenie',
      cause: 'Defekty próbki lub nieprawidłowe przygotowanie',
      solution: 'Dokładnie sprawdź próbki, popraw jakość obróbki'
    },
    {
      issue: 'Zachowanie nieliniowe',
      cause: 'Poślizg próbki lub podatność maszyny',
      solution: 'Sprawdź pewność mocowania, zweryfikuj sztywność maszyny'
    },
    {
      issue: 'Niespójne wyniki',
      cause: 'Zmienne przygotowanie próbek lub warunki testu',
      solution: 'Standaryzuj przygotowanie próbek, kontroluj środowisko'
    }
  ],

  references: [
    'ASTM D638-14: Standard Test Method for Tensile Properties of Plastics',
    'ISO 527-1: Plastics - Determination of tensile properties - Part 1: General principles',
    'ISO 527-2: Plastics - Determination of tensile properties - Part 2: Test conditions for moulding and extrusion plastics'
  ],

  notes: [
    'Próbki Typ I są preferowane dla większości zastosowań',
    'Próbki Typ IV są używane dla materiałów <7mm grubości',
    'Ekstensometr daje dokładniejsze pomiary odkształcenia niż przemieszczenie traversy',
    'Kondycjonowanie środowiskowe jest krytyczne dla dokładnych wyników',
    'Wyniki mogą znacznie różnić się w zależności od prędkości testu i temperatury'
  ]
};
