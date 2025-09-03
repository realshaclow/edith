import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Shield as ShieldIcon,
  Security as SecurityIcon,
  Cookie as CookieIcon,
  Gavel as GavelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface TermsAndConditionsProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
  title?: string;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  open,
  onClose,
  onAccept,
  showAcceptButton = false,
  title = "Regulamin i Polityka Prywatności"
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedPanel, setExpandedPanel] = useState<string | false>('terms');

  const handlePanelChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  const currentDate = new Date().toLocaleDateString('pl-PL');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          width: fullScreen ? '100%' : '95vw',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <IconButton
          aria-label="zamknij"
          onClick={onClose}
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Ostatnia aktualizacja: {currentDate}
            </Typography>
            <Typography variant="body1">
              Niniejszy dokument określa zasady korzystania z platformy EDITH Research Platform 
              oraz politykę ochrony danych osobowych zgodnie z obowiązującymi przepisami prawa.
            </Typography>
          </Stack>

          {/* Regulamin */}
          <Accordion 
            expanded={expandedPanel === 'terms'} 
            onChange={handlePanelChange('terms')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GavelIcon color="primary" />
                <Typography variant="h6">Regulamin Serwisu</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 1. Postanowienia ogólne
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Niniejszy Regulamin określa zasady korzystania z platformy EDITH Research Platform 
                    (dalej: „Platforma"), dostępnej pod adresem internetowym należącym do operatora.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Operatorem Platformy jest [Nazwa Firmy], z siedzibą w [Adres], 
                    wpisana do rejestru przedsiębiorców pod numerem KRS [numer], NIP: [numer].
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Platforma przeznaczona jest do zarządzania protokołami badawczymi, 
                    prowadzenia badań naukowych oraz analizy danych badawczych.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 2. Definicje
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Użytkownik" 
                        secondary="osoba fizyczna korzystająca z Platformy"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Konto" 
                        secondary="zbiór zasobów i uprawnień przypisanych do Użytkownika"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Protokół" 
                        secondary="dokument określający procedury badawcze"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Dane badawcze" 
                        secondary="informacje zebrane w trakcie prowadzenia badań"
                      />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 3. Rejestracja i konto użytkownika
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Rejestracja w Platformie jest dobrowolna i bezpłatna.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Do założenia konta wymagane jest podanie prawidłowego adresu e-mail 
                    oraz innych danych zgodnie z formularzem rejestracji.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Użytkownik zobowiązuje się do podania prawdziwych danych oraz 
                    aktualizowania ich w przypadku zmian.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    4. Hasło do konta musi spełniać wymagania bezpieczeństwa określone w Platformie.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 4. Zasady korzystania z Platformy
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Użytkownik zobowiązuje się korzystać z Platformy zgodnie z prawem 
                    i dobrymi obyczajami.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Zabronione jest:
                  </Typography>
                  <List dense sx={{ ml: 2 }}>
                    <ListItem>
                      <ListItemText primary="• Przekazywanie danych dostępowych osobom trzecim" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Wprowadzanie danych niezgodnych z prawdą" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Próby naruszenia bezpieczeństwa systemu" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Używanie Platformy w sposób szkodliwy" />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 5. Ochrona danych badawczych
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Dane badawcze wprowadzone przez Użytkownika pozostają jego własnością.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Operator zapewnia techniczne zabezpieczenia danych zgodnie z najlepszymi praktykami.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Użytkownik ponosi odpowiedzialność za zgodność przetwarzanych danych 
                    z obowiązującymi przepisami prawa.
                  </Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* RODO */}
          <Accordion 
            expanded={expandedPanel === 'privacy'} 
            onChange={handlePanelChange('privacy')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon color="primary" />
                <Typography variant="h6">Polityka Prywatności (RODO)</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informacja o przetwarzaniu danych osobowych
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Zgodnie z art. 13 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 
                    z dnia 27 kwietnia 2016 r. (RODO) informujemy o zasadach przetwarzania danych osobowych.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 1. Administrator danych
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" paragraph>
                      <strong>Administrator:</strong> [Nazwa Firmy]
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      <strong>Adres:</strong> [Pełny adres siedziby]
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <EmailIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      <strong>E-mail:</strong> privacy@edith-platform.com
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      <strong>Telefon:</strong> +48 [numer telefonu]
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 2. Jakie dane przetwarzamy
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Dane identyfikacyjne" 
                        secondary="imię, nazwisko, adres e-mail"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Dane kontaktowe" 
                        secondary="numer telefonu, adres"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Dane zawodowe" 
                        secondary="stanowisko, afiliacja, tytuł naukowy"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Dane techniczne" 
                        secondary="adres IP, informacje o przeglądarce, logi aktywności"
                      />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 3. Cele i podstawy prawne przetwarzania
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ bgcolor: 'blue.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Świadczenie usług platformy
                      </Typography>
                      <Typography variant="body2">
                        <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. b RODO (wykonanie umowy)
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'green.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Marketing bezpośredni
                      </Typography>
                      <Typography variant="body2">
                        <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'orange.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Wypełnienie obowiązków prawnych
                      </Typography>
                      <Typography variant="body2">
                        <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. c RODO (obowiązek prawny)
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 4. Okres przechowywania danych
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Dane osobowe będą przetwarzane przez okres niezbędny do realizacji celów 
                    przetwarzania, jednak nie dłużej niż:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="• 3 lata od rozwiązania umowy o świadczenie usług" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Do czasu wniesienia sprzeciwu w przypadku marketingu" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Zgodnie z przepisami prawa w przypadku obowiązków prawnych" />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 5. Twoje prawa
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Zgodnie z RODO przysługują Ci następujące prawa:
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      'Prawo dostępu do danych (art. 15 RODO)',
                      'Prawo do sprostowania danych (art. 16 RODO)',
                      'Prawo do usunięcia danych (art. 17 RODO)',
                      'Prawo do ograniczenia przetwarzania (art. 18 RODO)',
                      'Prawo do przenoszenia danych (art. 20 RODO)',
                      'Prawo do sprzeciwu (art. 21 RODO)',
                      'Prawo do cofnięcia zgody (art. 7 RODO)'
                    ].map((right, index) => (
                      <Chip
                        key={index}
                        label={right}
                        variant="outlined"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    § 6. Skarga do organu nadzorczego
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Masz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, 
                    gdy uznasz, że przetwarzanie danych osobowych Cię dotyczących narusza przepisy RODO.
                  </Typography>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Urząd Ochrony Danych Osobowych</strong><br />
                      ul. Stawki 2, 00-193 Warszawa<br />
                      Tel.: +48 22 531 03 00<br />
                      E-mail: kancelaria@uodo.gov.pl
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Cookies */}
          <Accordion 
            expanded={expandedPanel === 'cookies'} 
            onChange={handlePanelChange('cookies')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CookieIcon color="primary" />
                <Typography variant="h6">Polityka Cookies</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Czym są pliki cookies?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Pliki cookies to małe pliki tekstowe zapisywane na Twoim urządzeniu 
                    podczas korzystania z naszej platformy. Umożliwiają one rozpoznanie 
                    Twojego urządzenia i odpowiednie wyświetlenie strony.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Jakie cookies używamy?
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ bgcolor: 'blue.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Cookies niezbędne
                      </Typography>
                      <Typography variant="body2">
                        Wymagane do poprawnego funkcjonowania platformy. 
                        Nie można ich wyłączyć w naszych systemach.
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'green.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Cookies funkcjonalne
                      </Typography>
                      <Typography variant="body2">
                        Umożliwiają zapamiętanie Twoich ustawień i personalizację 
                        interfejsu użytkownika.
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'orange.50', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Cookies analityczne
                      </Typography>
                      <Typography variant="body2">
                        Pomagają nam zrozumieć, jak korzystasz z platformy, 
                        aby móc ją ulepszać.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Zarządzanie cookies
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Możesz kontrolować i zarządzać plikami cookies w ustawieniach 
                    swojej przeglądarki. Pamiętaj, że wyłączenie niektórych cookies 
                    może wpłynąć na funkcjonalność platformy.
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="• Chrome: Ustawienia > Prywatność i bezpieczeństwo > Pliki cookie" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Firefox: Ustawienia > Prywatność i bezpieczeństwo" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Safari: Preferencje > Prywatność" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Edge: Ustawienia > Pliki cookie i uprawnienia witryny" />
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Bezpieczeństwo */}
          <Accordion 
            expanded={expandedPanel === 'security'} 
            onChange={handlePanelChange('security')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6">Bezpieczeństwo</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Środki bezpieczeństwa
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Stosujemy zaawansowane środki techniczne i organizacyjne 
                    w celu ochrony Twoich danych:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="Szyfrowanie danych SSL/TLS" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="Regularne kopie zapasowe" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="Kontrola dostępu i autoryzacja" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="Monitoring bezpieczeństwa 24/7" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText primary="Regularne audyty bezpieczeństwa" />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Twoje bezpieczeństwo
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Rekomendujemy przestrzeganie następujących zasad:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="• Używaj silnego, unikalnego hasła" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Nie udostępniaj danych logowania" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Wylogowuj się po zakończeniu pracy" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Korzystaj z aktualnej przeglądarki" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Zgłaszaj podejrzane aktywności" />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Kontakt w sprawach bezpieczeństwa
                  </Typography>
                  <Box sx={{ bgcolor: 'red.50', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      W przypadku podejrzeń naruszenia bezpieczeństwa, 
                      skontaktuj się z nami natychmiast:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>E-mail:</strong> security@edith-platform.com<br />
                      <strong>Telefon alarmowy:</strong> +48 [numer]
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} color="secondary">
          Zamknij
        </Button>
        {showAcceptButton && (
          <Button 
            onClick={handleAccept} 
            variant="contained" 
            color="primary"
            startIcon={<CheckCircleIcon />}
          >
            Akceptuję Regulamin
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditions;
