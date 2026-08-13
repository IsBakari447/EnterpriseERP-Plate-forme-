export type ApiLocale = "fr" | "en" | "sv" | "de" | "es" | "pt" | "it" | "nl";

export const defaultApiLocale: ApiLocale = "fr";

export const apiLocales: ApiLocale[] = ["fr", "en", "sv", "de", "es", "pt", "it", "nl"];

export const apiLocaleLabels: Record<ApiLocale, string> = {
  fr: "FR - Francais",
  en: "EN - English",
  sv: "SV - Svenska",
  de: "DE - Deutsch",
  es: "ES - Espanol",
  pt: "PT - Portugues",
  it: "IT - Italiano",
  nl: "NL - Nederlands",
};

export const apiTranslations: Record<ApiLocale, Record<string, string>> = {
  fr: {
    "api.status.ok": "Service operationnel",
    "api.status.ready": "Service pret",
    "api.error.internal": "Erreur interne du serveur",
    "api.error.unauthorized": "Connexion requise",
    "api.error.forbidden": "Permission insuffisante",
    "auth.login.success": "Connexion reussie",
    "auth.register.success": "Compte cree avec succes",
    "profile.saved": "Profil enregistre",
  },
  en: {
    "api.status.ok": "Service operational",
    "api.status.ready": "Service ready",
    "api.error.internal": "Internal server error",
    "api.error.unauthorized": "Authentication required",
    "api.error.forbidden": "Insufficient permission",
    "auth.login.success": "Login successful",
    "auth.register.success": "Account created successfully",
    "profile.saved": "Profile saved",
  },
  sv: {
    "api.status.ok": "Tjansten ar i drift",
    "api.status.ready": "Tjansten ar redo",
    "api.error.internal": "Internt serverfel",
    "api.error.unauthorized": "Inloggning kravs",
    "api.error.forbidden": "Otillracklig behorighet",
    "auth.login.success": "Inloggningen lyckades",
    "auth.register.success": "Kontot skapades",
    "profile.saved": "Profilen sparades",
  },
  de: {
    "api.status.ok": "Dienst betriebsbereit",
    "api.status.ready": "Dienst bereit",
    "api.error.internal": "Interner Serverfehler",
    "api.error.unauthorized": "Anmeldung erforderlich",
    "api.error.forbidden": "Unzureichende Berechtigung",
    "auth.login.success": "Anmeldung erfolgreich",
    "auth.register.success": "Konto erfolgreich erstellt",
    "profile.saved": "Profil gespeichert",
  },
  es: {
    "api.status.ok": "Servicio operativo",
    "api.status.ready": "Servicio listo",
    "api.error.internal": "Error interno del servidor",
    "api.error.unauthorized": "Autenticacion requerida",
    "api.error.forbidden": "Permiso insuficiente",
    "auth.login.success": "Inicio de sesion correcto",
    "auth.register.success": "Cuenta creada correctamente",
    "profile.saved": "Perfil guardado",
  },
  pt: {
    "api.status.ok": "Servico operacional",
    "api.status.ready": "Servico pronto",
    "api.error.internal": "Erro interno do servidor",
    "api.error.unauthorized": "Autenticacao obrigatoria",
    "api.error.forbidden": "Permissao insuficiente",
    "auth.login.success": "Login realizado com sucesso",
    "auth.register.success": "Conta criada com sucesso",
    "profile.saved": "Perfil guardado",
  },
  it: {
    "api.status.ok": "Servizio operativo",
    "api.status.ready": "Servizio pronto",
    "api.error.internal": "Errore interno del server",
    "api.error.unauthorized": "Autenticazione richiesta",
    "api.error.forbidden": "Permesso insufficiente",
    "auth.login.success": "Accesso riuscito",
    "auth.register.success": "Account creato con successo",
    "profile.saved": "Profilo salvato",
  },
  nl: {
    "api.status.ok": "Service operationeel",
    "api.status.ready": "Service gereed",
    "api.error.internal": "Interne serverfout",
    "api.error.unauthorized": "Aanmelden vereist",
    "api.error.forbidden": "Onvoldoende rechten",
    "auth.login.success": "Succesvol ingelogd",
    "auth.register.success": "Account succesvol aangemaakt",
    "profile.saved": "Profiel opgeslagen",
  },
};
