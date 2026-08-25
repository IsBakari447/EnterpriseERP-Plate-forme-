export type Locale = "fr" | "en" | "sv";

export const locales: { key: Locale; label: string }[] = [
  { key: "fr", label: "FR - Francais" },
  { key: "en", label: "EN - English" },
  { key: "sv", label: "SV - Svenska" },
];

type TranslationKey =
  | "app.tagline"
  | "common.loading"
  | "common.retry"
  | "common.search"
  | "common.save"
  | "common.cancel"
  | "common.logout"
  | "common.available"
  | "common.beta"
  | "common.planned"
  | "common.connected"
  | "common.toConnect"
  | "common.empty"
  | "common.error.api"
  | "common.error.credentials"
  | "common.error.requiredLogin"
  | "common.error.noToken"
  | "login.title"
  | "login.subtitle"
  | "login.email"
  | "login.password"
  | "login.passwordPlaceholder"
  | "login.submit"
  | "login.required"
  | "login.createAccount"
  | "register.title"
  | "register.subtitle"
  | "register.companyName"
  | "register.fullName"
  | "register.submit"
  | "register.haveAccount"
  | "dashboard.hello"
  | "dashboard.activeSector"
  | "dashboard.overview"
  | "dashboard.modules"
  | "dashboard.activeModules"
  | "dashboard.priorityActions"
  | "dashboard.recentActivity"
  | "dashboard.apiStatus"
  | "dashboard.changeSector"
  | "sectors.title"
  | "sectors.help"
  | "sectors.modulesConfigured"
  | "module.ready"
  | "module.readyText"
  | "module.actions"
  | "module.openApi"
  | "module.mobileFirst"
  | "module.offlineReady"
  | "crm.title"
  | "crm.subtitle"
  | "crm.add"
  | "crm.search"
  | "crm.emptyTitle"
  | "crm.emptyText"
  | "crm.noEmail"
  | "crm.noCountry"
  | "sector.general"
  | "sector.retail"
  | "sector.restaurant"
  | "sector.construction"
  | "sector.health"
  | "sector.education"
  | "sector.transport"
  | "sector.industry"
  | "sector.hotel"
  | "sector.agriculture"
  | "sector.services"
  | "module.crm"
  | "module.sales"
  | "module.stock"
  | "module.invoicing"
  | "module.accounting"
  | "module.hr"
  | "module.appointments"
  | "module.production"
  | "module.projects"
  | "module.ai"
  | "module.users"
  | "module.reports"
  | "module.settings";

const dictionary: Record<Locale, Record<TranslationKey, string>> = {
  fr: {
    "app.tagline": "Cloud - Mobile - IA",
    "common.loading": "Chargement...",
    "common.retry": "Reessayer",
    "common.search": "Rechercher",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.logout": "Se deconnecter",
    "common.available": "Disponible",
    "common.beta": "Beta",
    "common.planned": "Prevu",
    "common.connected": "Connecte",
    "common.toConnect": "A connecter",
    "common.empty": "Aucun resultat.",
    "common.error.api": "Impossible de charger les donnees. Verifiez votre connexion ou l'API.",
    "common.error.credentials": "Email ou mot de passe incorrect.",
    "common.error.requiredLogin": "Veuillez saisir votre email et votre mot de passe.",
    "common.error.noToken": "Le serveur n'a retourne aucun jeton d'acces.",
    "login.title": "Connexion",
    "login.subtitle": "Accedez a votre entreprise depuis votre mobile.",
    "login.email": "Adresse email",
    "login.password": "Mot de passe",
    "login.passwordPlaceholder": "Votre mot de passe",
    "login.submit": "Se connecter",
    "login.required": "Veuillez saisir votre email et votre mot de passe.",
    "login.createAccount": "Creer un compte",
    "register.title": "Creer un compte",
    "register.subtitle": "Demarrez un espace SaaS securise pour votre entreprise.",
    "register.companyName": "Nom de l'entreprise",
    "register.fullName": "Nom complet",
    "register.submit": "Creer mon espace",
    "register.haveAccount": "J'ai deja un compte",
    "dashboard.hello": "Bonjour",
    "dashboard.activeSector": "Secteur actif",
    "dashboard.overview": "Vue d'ensemble",
    "dashboard.modules": "Modules",
    "dashboard.activeModules": "modules actifs",
    "dashboard.priorityActions": "Actions prioritaires",
    "dashboard.recentActivity": "Activite recente",
    "dashboard.apiStatus": "Etat API",
    "dashboard.changeSector": "Changer de secteur",
    "sectors.title": "Choisir votre secteur",
    "sectors.help": "Le tableau de bord et les modules s'adaptent automatiquement a votre activite.",
    "sectors.modulesConfigured": "modules configures",
    "module.ready": "Pret pour l'API",
    "module.readyText": "Cet ecran utilise les routes EnterpriseERP et respecte l'entreprise, le role et les permissions de l'utilisateur connecte.",
    "module.actions": "Actions rapides",
    "module.openApi": "Donnees API",
    "module.mobileFirst": "Action mobile",
    "module.offlineReady": "Mode hors ligne prepare",
    "crm.title": "Clients",
    "crm.subtitle": "clients",
    "crm.add": "Ajouter un client",
    "crm.search": "Rechercher un client",
    "crm.emptyTitle": "Aucun client trouve",
    "crm.emptyText": "Ajoutez votre premier client ou modifiez la recherche.",
    "crm.noEmail": "Email non renseigne",
    "crm.noCountry": "Pays non renseigne",
    "sector.general": "Entreprise generale",
    "sector.retail": "Commerce",
    "sector.restaurant": "Restauration",
    "sector.construction": "Construction",
    "sector.health": "Sante",
    "sector.education": "Education",
    "sector.transport": "Transport",
    "sector.industry": "Industrie",
    "sector.hotel": "Hotellerie",
    "sector.agriculture": "Agriculture",
    "sector.services": "Services",
    "module.crm": "Clients",
    "module.sales": "Ventes",
    "module.stock": "Stock",
    "module.invoicing": "Facturation",
    "module.accounting": "Finances",
    "module.hr": "Ressources humaines",
    "module.appointments": "Rendez-vous",
    "module.production": "Production",
    "module.projects": "Projets",
    "module.ai": "Assistant IA",
    "module.users": "Utilisateurs",
    "module.reports": "Rapports",
    "module.settings": "Parametres",
  },
  en: {
    "app.tagline": "Cloud - Mobile - AI",
    "common.loading": "Loading...",
    "common.retry": "Retry",
    "common.search": "Search",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.logout": "Sign out",
    "common.available": "Available",
    "common.beta": "Beta",
    "common.planned": "Planned",
    "common.connected": "Connected",
    "common.toConnect": "To connect",
    "common.empty": "No result.",
    "common.error.api": "Unable to load data. Check your connection or the API.",
    "common.error.credentials": "Incorrect email or password.",
    "common.error.requiredLogin": "Enter your email and password.",
    "common.error.noToken": "The server did not return an access token.",
    "login.title": "Sign in",
    "login.subtitle": "Access your company from your mobile.",
    "login.email": "Email address",
    "login.password": "Password",
    "login.passwordPlaceholder": "Your password",
    "login.submit": "Sign in",
    "login.required": "Enter your email and password.",
    "login.createAccount": "Create account",
    "register.title": "Create account",
    "register.subtitle": "Start a secure SaaS workspace for your company.",
    "register.companyName": "Company name",
    "register.fullName": "Full name",
    "register.submit": "Create workspace",
    "register.haveAccount": "I already have an account",
    "dashboard.hello": "Hello",
    "dashboard.activeSector": "Active sector",
    "dashboard.overview": "Overview",
    "dashboard.modules": "Modules",
    "dashboard.activeModules": "active modules",
    "dashboard.priorityActions": "Priority actions",
    "dashboard.recentActivity": "Recent activity",
    "dashboard.apiStatus": "API status",
    "dashboard.changeSector": "Change sector",
    "sectors.title": "Choose your sector",
    "sectors.help": "The dashboard and modules automatically adapt to your activity.",
    "sectors.modulesConfigured": "configured modules",
    "module.ready": "API ready",
    "module.readyText": "This screen uses EnterpriseERP routes and respects the connected user's company, role and permissions.",
    "module.actions": "Quick actions",
    "module.openApi": "API data",
    "module.mobileFirst": "Mobile action",
    "module.offlineReady": "Offline mode prepared",
    "crm.title": "Customers",
    "crm.subtitle": "customers",
    "crm.add": "Add customer",
    "crm.search": "Search customer",
    "crm.emptyTitle": "No customer found",
    "crm.emptyText": "Add your first customer or change the search.",
    "crm.noEmail": "No email provided",
    "crm.noCountry": "No country provided",
    "sector.general": "General business",
    "sector.retail": "Retail",
    "sector.restaurant": "Restaurant",
    "sector.construction": "Construction",
    "sector.health": "Healthcare",
    "sector.education": "Education",
    "sector.transport": "Transport",
    "sector.industry": "Industry",
    "sector.hotel": "Hospitality",
    "sector.agriculture": "Agriculture",
    "sector.services": "Services",
    "module.crm": "Customers",
    "module.sales": "Sales",
    "module.stock": "Inventory",
    "module.invoicing": "Billing",
    "module.accounting": "Finance",
    "module.hr": "Human resources",
    "module.appointments": "Appointments",
    "module.production": "Production",
    "module.projects": "Projects",
    "module.ai": "AI Assistant",
    "module.users": "Users",
    "module.reports": "Reports",
    "module.settings": "Settings",
  },
  sv: {
    "app.tagline": "Cloud - Mobil - AI",
    "common.loading": "Laddar...",
    "common.retry": "Forsok igen",
    "common.search": "Sok",
    "common.save": "Spara",
    "common.cancel": "Avbryt",
    "common.logout": "Logga ut",
    "common.available": "Tillganglig",
    "common.beta": "Beta",
    "common.planned": "Planerad",
    "common.connected": "Ansluten",
    "common.toConnect": "Att ansluta",
    "common.empty": "Inga resultat.",
    "common.error.api": "Det gick inte att ladda data. Kontrollera anslutningen eller API:t.",
    "common.error.credentials": "Fel e-postadress eller losenord.",
    "common.error.requiredLogin": "Ange e-postadress och losenord.",
    "common.error.noToken": "Servern returnerade ingen atkomsttoken.",
    "login.title": "Logga in",
    "login.subtitle": "Oppna ditt foretag fran mobilen.",
    "login.email": "E-postadress",
    "login.password": "Losenord",
    "login.passwordPlaceholder": "Ditt losenord",
    "login.submit": "Logga in",
    "login.required": "Ange e-postadress och losenord.",
    "login.createAccount": "Skapa konto",
    "register.title": "Skapa konto",
    "register.subtitle": "Starta en saker SaaS-arbetsyta for ditt foretag.",
    "register.companyName": "Foretagsnamn",
    "register.fullName": "Fullstandigt namn",
    "register.submit": "Skapa arbetsyta",
    "register.haveAccount": "Jag har redan ett konto",
    "dashboard.hello": "Hej",
    "dashboard.activeSector": "Aktiv sektor",
    "dashboard.overview": "Oversikt",
    "dashboard.modules": "Moduler",
    "dashboard.activeModules": "aktiva moduler",
    "dashboard.priorityActions": "Prioriterade atgarder",
    "dashboard.recentActivity": "Senaste aktivitet",
    "dashboard.apiStatus": "API-status",
    "dashboard.changeSector": "Byt sektor",
    "sectors.title": "Valj sektor",
    "sectors.help": "Dashboarden och modulerna anpassas automatiskt till din verksamhet.",
    "sectors.modulesConfigured": "konfigurerade moduler",
    "module.ready": "API redo",
    "module.readyText": "Den har skarmen anvander EnterpriseERP-rutter och respekterar den inloggade anvandarens foretag, roll och behorigheter.",
    "module.actions": "Snabbatgarder",
    "module.openApi": "API-data",
    "module.mobileFirst": "Mobil atgard",
    "module.offlineReady": "Offline-lage forberett",
    "crm.title": "Kunder",
    "crm.subtitle": "kunder",
    "crm.add": "Lagg till kund",
    "crm.search": "Sok kund",
    "crm.emptyTitle": "Ingen kund hittades",
    "crm.emptyText": "Lagg till din forsta kund eller andra sokningen.",
    "crm.noEmail": "Ingen e-post angiven",
    "crm.noCountry": "Inget land angivet",
    "sector.general": "Allmant foretag",
    "sector.retail": "Handel",
    "sector.restaurant": "Restaurang",
    "sector.construction": "Bygg",
    "sector.health": "Halsa",
    "sector.education": "Utbildning",
    "sector.transport": "Transport",
    "sector.industry": "Industri",
    "sector.hotel": "Hotell",
    "sector.agriculture": "Jordbruk",
    "sector.services": "Tjanster",
    "module.crm": "Kunder",
    "module.sales": "Forsaljning",
    "module.stock": "Lager",
    "module.invoicing": "Fakturering",
    "module.accounting": "Ekonomi",
    "module.hr": "Personal",
    "module.appointments": "Bokningar",
    "module.production": "Produktion",
    "module.projects": "Projekt",
    "module.ai": "AI-assistent",
    "module.users": "Anvandare",
    "module.reports": "Rapporter",
    "module.settings": "Installningar",
  },
};

export function translate(locale: Locale, key: TranslationKey) {
  return dictionary[locale][key] ?? dictionary.fr[key] ?? key;
}

export type { TranslationKey };
