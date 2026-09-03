import type { ModuleKey, SectorKey } from "@shared/sector/types";

export type BusinessTypeKey =
  | "hotel"
  | "vacation_rental"
  | "furnished_apartment"
  | "guest_house"
  | "resort"
  | "aparthotel"
  | "preschool"
  | "primary_school"
  | "secondary_school"
  | "higher_education"
  | "training_center"
  | "crop_farm"
  | "market_garden"
  | "orchard"
  | "dairy_farm"
  | "poultry_farm"
  | "cattle_farm"
  | "mixed_farm";

export type BusinessTypeDefinition = {
  key: BusinessTypeKey;
  sector: SectorKey;
  label: string;
  description: string;
  capabilities: string[];
  recommendedModules: ModuleKey[];
};

export const businessTypeDefinitions: Record<BusinessTypeKey, BusinessTypeDefinition> = {
  hotel: {
    key: "hotel",
    sector: "hospitality",
    label: "Hotel",
    description: "Chambres, reservations, clients, reception, housekeeping et facturation.",
    capabilities: ["rooms", "reservations", "guests", "front_desk", "housekeeping", "billing", "payments"],
    recommendedModules: ["dashboard", "reservations", "chambres", "clients", "housekeeping", "facturation", "paiements", "rh", "rapports", "assistant"],
  },
  vacation_rental: {
    key: "vacation_rental",
    sector: "hospitality",
    label: "Location courte duree",
    description: "Biens, calendriers, reservations, menage, proprietaires et canaux.",
    capabilities: ["properties", "units", "calendar", "guests", "cleaning", "owners", "channels", "payments"],
    recommendedModules: ["dashboard", "proprietes", "unites", "reservations", "disponibilites", "clients", "nettoyage", "maintenance", "paiements", "rapports", "assistant"],
  },
  furnished_apartment: {
    key: "furnished_apartment",
    sector: "hospitality",
    label: "Appartement meuble",
    description: "Appartements, locataires, contrats, loyers, depots et maintenance.",
    capabilities: ["properties", "apartments", "tenants", "contracts", "rent", "deposits", "expenses", "maintenance"],
    recommendedModules: ["dashboard", "proprietes", "appartements", "locataires", "contrats", "loyers", "depots", "maintenance", "finances", "rapports"],
  },
  guest_house: {
    key: "guest_house",
    sector: "hospitality",
    label: "Maison d'hotes",
    description: "Reservations, sejours, services, paiements et suivi clients.",
    capabilities: ["rooms", "reservations", "guests", "services", "billing", "payments"],
    recommendedModules: ["dashboard", "reservations", "chambres", "clients", "services", "facturation", "paiements", "rapports"],
  },
  resort: {
    key: "resort",
    sector: "hospitality",
    label: "Resort",
    description: "Hebergements, restaurants, activites, maintenance, stock et finance.",
    capabilities: ["rooms", "reservations", "activities", "restaurant", "inventory", "maintenance", "billing"],
    recommendedModules: ["dashboard", "reservations", "chambres", "restaurant-hotel", "activites", "stock", "maintenance", "facturation", "finances", "assistant"],
  },
  aparthotel: {
    key: "aparthotel",
    sector: "hospitality",
    label: "Appart'hotel",
    description: "Unites, disponibilites, check-in, contrats courts et facturation.",
    capabilities: ["units", "availability", "check_in", "contracts", "billing", "payments"],
    recommendedModules: ["dashboard", "unites", "disponibilites", "reservations", "check-in", "contrats", "facturation", "paiements", "rapports"],
  },
  preschool: {
    key: "preschool",
    sector: "education",
    label: "Maternelle",
    description: "Enfants, responsables, presences, classes, planning et frais.",
    capabilities: ["students", "guardians", "attendance", "classes", "schedule", "fees"],
    recommendedModules: ["dashboard", "etudiants", "classes", "presences", "emploi-du-temps", "frais-scolaires", "facturation", "rapports"],
  },
  primary_school: {
    key: "primary_school",
    sector: "education",
    label: "Ecole primaire",
    description: "Eleves, enseignants, classes, cours, absences, examens et frais.",
    capabilities: ["students", "teachers", "classes", "courses", "attendance", "exams", "fees"],
    recommendedModules: ["dashboard", "etudiants", "enseignants", "classes", "cours", "presences", "examens", "frais-scolaires", "assistant"],
  },
  secondary_school: {
    key: "secondary_school",
    sector: "education",
    label: "Secondaire",
    description: "Eleves, matieres, enseignants, examens, presences et frais.",
    capabilities: ["students", "teachers", "subjects", "schedule", "exams", "attendance", "fees"],
    recommendedModules: ["dashboard", "etudiants", "enseignants", "classes", "emploi-du-temps", "examens", "presences", "frais-scolaires", "rapports"],
  },
  higher_education: {
    key: "higher_education",
    sector: "education",
    label: "Enseignement superieur",
    description: "Etudiants, programmes, cours, examens, inscriptions et paiements.",
    capabilities: ["students", "programs", "courses", "enrollments", "exams", "payments", "reports"],
    recommendedModules: ["dashboard", "etudiants", "cours", "examens", "frais-scolaires", "facturation", "paiements", "rapports", "assistant"],
  },
  training_center: {
    key: "training_center",
    sector: "education",
    label: "Centre de formation",
    description: "Sessions, apprenants, formateurs, planning, certificats et facturation.",
    capabilities: ["learners", "trainers", "sessions", "schedule", "certificates", "billing"],
    recommendedModules: ["dashboard", "etudiants", "enseignants", "cours", "emploi-du-temps", "facturation", "rapports", "ai-sales-agent"],
  },
  crop_farm: {
    key: "crop_farm",
    sector: "agriculture",
    label: "Exploitation agricole",
    description: "Parcelles, cultures, intrants, recoltes, stock et ventes.",
    capabilities: ["fields", "crops", "inputs", "harvests", "inventory", "sales"],
    recommendedModules: ["dashboard", "parcelles", "cultures", "intrants", "recoltes", "stock", "ventes", "rapports", "assistant"],
  },
  market_garden: {
    key: "market_garden",
    sector: "agriculture",
    label: "Maraichage",
    description: "Cultures courtes, recoltes, commandes, paniers et livraisons.",
    capabilities: ["crops", "harvests", "orders", "deliveries", "inventory"],
    recommendedModules: ["dashboard", "cultures", "recoltes", "commandes", "stock", "ventes", "expeditions", "rapports"],
  },
  orchard: {
    key: "orchard",
    sector: "agriculture",
    label: "Verger",
    description: "Parcelles, arbres, traitements, recoltes, conditionnement et ventes.",
    capabilities: ["fields", "trees", "treatments", "harvests", "packing", "sales"],
    recommendedModules: ["dashboard", "parcelles", "cultures", "traitements", "recoltes", "production", "ventes", "rapports"],
  },
  dairy_farm: {
    key: "dairy_farm",
    sector: "livestock",
    label: "Elevage laitier",
    description: "Animaux, production lait, alimentation, soins, stock et ventes.",
    capabilities: ["animals", "milk", "feed", "veterinary", "inventory", "sales"],
    recommendedModules: ["dashboard", "animaux", "production-lait", "alimentation", "soins", "stock", "ventes", "rapports"],
  },
  poultry_farm: {
    key: "poultry_farm",
    sector: "livestock",
    label: "Aviculture",
    description: "Lots, alimentation, ponte, mortalite, stock et ventes.",
    capabilities: ["flocks", "feed", "laying", "mortality", "inventory", "sales"],
    recommendedModules: ["dashboard", "lots", "alimentation", "ponte", "soins", "stock", "ventes", "assistant"],
  },
  cattle_farm: {
    key: "cattle_farm",
    sector: "livestock",
    label: "Elevage bovin",
    description: "Troupeaux, poids, soins, alimentation, reproduction et ventes.",
    capabilities: ["animals", "weight", "veterinary", "feed", "breeding", "sales"],
    recommendedModules: ["dashboard", "animaux", "alimentation", "soins", "reproduction", "ventes", "rapports"],
  },
  mixed_farm: {
    key: "mixed_farm",
    sector: "livestock",
    label: "Ferme mixte",
    description: "Cultures, animaux, stock, production, achats, ventes et finance.",
    capabilities: ["crops", "animals", "inventory", "production", "purchases", "sales", "finance"],
    recommendedModules: ["dashboard", "cultures", "animaux", "stock", "production", "achats", "ventes", "finances", "rapports"],
  },
};

export function getBusinessTypesForSector(sector: SectorKey) {
  return Object.values(businessTypeDefinitions).filter((businessType) => businessType.sector === sector);
}

export function getDefaultBusinessTypeForSector(sector: SectorKey): BusinessTypeKey | "" {
  return getBusinessTypesForSector(sector)[0]?.key ?? "";
}

export function getRecommendedModulesForBusinessType(businessType: string | null | undefined) {
  return businessType && businessType in businessTypeDefinitions
    ? businessTypeDefinitions[businessType as BusinessTypeKey].recommendedModules
    : null;
}
