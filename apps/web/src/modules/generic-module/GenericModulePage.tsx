"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ERPLayout from "@shared/components/layout/ERPLayout";
import AIRecommendation from "@shared/components/ui/AIRecommendation";
import ActivityTimeline from "@shared/components/ui/ActivityTimeline";
import AlertPanel from "@shared/components/ui/AlertPanel";
import AttachmentManager from "@shared/components/ui/AttachmentManager";
import DataGrid from "@shared/components/ui/DataGrid";
import FilterBar from "@shared/components/ui/FilterBar";
import FormModal from "@shared/components/ui/FormModal";
import Kanban from "@shared/components/ui/Kanban";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { useSector } from "@shared/sector/SectorProvider";
import type { ModuleKey, SectorKey } from "@shared/sector/types";

type ModuleView = {
  key: ModuleKey;
  name: string;
  icon: string;
};

type BusinessTemplate = "admin" | "analytics" | "crm" | "commerce" | "finance" | "project" | "operations" | "security";

type CreateField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "time" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type CreateFormDefinition = {
  title: string;
  fields: CreateField[];
};

const createForms: Partial<Record<ModuleKey, CreateFormDefinition>> = {
  etudiants: {
    title: "Ajouter un etudiant",
    fields: [
      { key: "firstName", label: "Prenom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "studentNumber", label: "Matricule" },
      { key: "birthDate", label: "Date de naissance", type: "date" },
      { key: "class", label: "Classe" },
      { key: "guardian", label: "Parent / tuteur" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "email", label: "Email", type: "email" },
    ],
  },
  enseignants: {
    title: "Ajouter un enseignant",
    fields: [
      { key: "firstName", label: "Prenom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "speciality", label: "Specialite" },
      { key: "subjects", label: "Matieres" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "contractType", label: "Type de contrat", type: "select", options: ["Temps plein", "Temps partiel", "Vacataire"] },
    ],
  },
  classes: {
    title: "Creer une classe",
    fields: [
      { key: "name", label: "Nom de la classe", required: true },
      { key: "level", label: "Niveau" },
      { key: "room", label: "Salle" },
      { key: "capacity", label: "Capacite", type: "number" },
      { key: "mainTeacher", label: "Enseignant principal" },
    ],
  },
  "emploi-du-temps": {
    title: "Ajouter un cours au planning",
    fields: [
      { key: "course", label: "Cours", required: true },
      { key: "class", label: "Classe", required: true },
      { key: "teacher", label: "Enseignant" },
      { key: "room", label: "Salle" },
      { key: "date", label: "Date", type: "date" },
      { key: "startTime", label: "Heure debut", type: "time" },
      { key: "endTime", label: "Heure fin", type: "time" },
    ],
  },
  examens: {
    title: "Creer un examen",
    fields: [
      { key: "name", label: "Nom de l'examen", required: true },
      { key: "subject", label: "Matiere", required: true },
      { key: "class", label: "Classe", required: true },
      { key: "date", label: "Date", type: "date" },
      { key: "teacher", label: "Enseignant" },
      { key: "maximumScore", label: "Note maximale", type: "number" },
    ],
  },
  cours: {
    title: "Creer un cours",
    fields: [
      { key: "name", label: "Nom du cours", required: true },
      { key: "code", label: "Code" },
      { key: "subject", label: "Matiere" },
      { key: "level", label: "Niveau" },
      { key: "teacher", label: "Enseignant" },
      { key: "hours", label: "Heures / semaine", type: "number" },
      { key: "description", label: "Programme", type: "textarea" },
    ],
  },
  reservations: {
    title: "Creer une reservation",
    fields: [
      { key: "customer", label: "Client", required: true },
      { key: "arrival", label: "Arrivee", type: "date", required: true },
      { key: "departure", label: "Depart", type: "date", required: true },
      { key: "room", label: "Chambre" },
      { key: "adults", label: "Adultes", type: "number" },
      { key: "children", label: "Enfants", type: "number" },
      { key: "price", label: "Tarif", type: "number" },
    ],
  },
  chambres: {
    title: "Ajouter une chambre",
    fields: [
      { key: "number", label: "Numero", required: true },
      { key: "type", label: "Type", type: "select", options: ["Simple", "Double", "Suite", "Familiale"] },
      { key: "capacity", label: "Capacite", type: "number" },
      { key: "price", label: "Prix / nuit", type: "number" },
      { key: "status", label: "Statut", type: "select", options: ["Disponible", "Maintenance", "Hors service"] },
    ],
  },
  housekeeping: {
    title: "Creer une tache housekeeping",
    fields: [
      { key: "room", label: "Chambre", required: true },
      { key: "employee", label: "Employe" },
      { key: "task", label: "Tache", type: "select", options: ["Nettoyage", "Inspection", "Linge", "Mini-bar"] },
      { key: "date", label: "Date", type: "date" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  commandes: {
    title: "Creer une commande",
    fields: [
      { key: "table", label: "Table" },
      { key: "customer", label: "Client" },
      { key: "type", label: "Type", type: "select", options: ["Sur place", "A emporter", "Livraison"] },
      { key: "items", label: "Articles / plats", type: "textarea", required: true },
      { key: "notes", label: "Instructions cuisine", type: "textarea" },
    ],
  },
  cuisine: {
    title: "Creer une tache cuisine",
    fields: [
      { key: "order", label: "Commande", required: true },
      { key: "station", label: "Poste cuisine" },
      { key: "responsible", label: "Responsable" },
      { key: "notes", label: "Instructions", type: "textarea" },
    ],
  },
  menus: {
    title: "Ajouter un article au menu",
    fields: [
      { key: "name", label: "Nom", required: true },
      { key: "category", label: "Categorie" },
      { key: "price", label: "Prix", type: "number", required: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  patients: {
    title: "Ajouter un patient",
    fields: [
      { key: "firstName", label: "Prenom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "birthDate", label: "Date de naissance", type: "date" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Adresse" },
      { key: "emergencyContact", label: "Contact d'urgence" },
    ],
  },
  medecins: {
    title: "Ajouter un professionnel",
    fields: [
      { key: "firstName", label: "Prenom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "speciality", label: "Specialite" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "email", label: "Email", type: "email" },
    ],
  },
  "rendez-vous": {
    title: "Creer un rendez-vous",
    fields: [
      { key: "patient", label: "Patient", required: true },
      { key: "doctor", label: "Professionnel", required: true },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Heure", type: "time" },
      { key: "reason", label: "Motif", type: "textarea" },
    ],
  },
  consultations: {
    title: "Creer une consultation",
    fields: [
      { key: "patient", label: "Patient", required: true },
      { key: "doctor", label: "Professionnel", required: true },
      { key: "reason", label: "Motif", type: "textarea" },
      { key: "notes", label: "Observations", type: "textarea" },
    ],
  },
  chantiers: {
    title: "Creer un chantier",
    fields: [
      { key: "name", label: "Nom du chantier", required: true },
      { key: "customer", label: "Client", required: true },
      { key: "address", label: "Adresse" },
      { key: "manager", label: "Chef de projet" },
      { key: "startDate", label: "Date debut", type: "date" },
      { key: "endDate", label: "Date prevue fin", type: "date" },
      { key: "budget", label: "Budget", type: "number" },
    ],
  },
  contrats: {
    title: "Creer un contrat",
    fields: [
      { key: "reference", label: "Reference", required: true },
      { key: "customer", label: "Client" },
      { key: "project", label: "Projet / chantier" },
      { key: "amount", label: "Montant", type: "number" },
      { key: "startDate", label: "Debut", type: "date" },
      { key: "endDate", label: "Fin", type: "date" },
    ],
  },
  materiaux: {
    title: "Ajouter un materiau",
    fields: [
      { key: "name", label: "Materiau", required: true },
      { key: "quantity", label: "Quantite", type: "number" },
      { key: "unit", label: "Unite" },
      { key: "supplier", label: "Fournisseur" },
      { key: "project", label: "Chantier" },
      { key: "cost", label: "Cout", type: "number" },
    ],
  },
  production: {
    title: "Creer un ordre de production",
    fields: [
      { key: "product", label: "Produit", required: true },
      { key: "quantity", label: "Quantite", type: "number", required: true },
      { key: "line", label: "Ligne de production" },
      { key: "plannedDate", label: "Date prevue", type: "date" },
      { key: "responsible", label: "Responsable" },
    ],
  },
  machines: {
    title: "Ajouter une machine",
    fields: [
      { key: "name", label: "Machine", required: true },
      { key: "reference", label: "Reference" },
      { key: "location", label: "Emplacement" },
      { key: "commissionDate", label: "Mise en service", type: "date" },
      { key: "maintenanceDate", label: "Prochaine maintenance", type: "date" },
    ],
  },
  "ordres-fabrication": {
    title: "Creer un ordre de fabrication",
    fields: [
      { key: "reference", label: "Reference OF", required: true },
      { key: "product", label: "Produit", required: true },
      { key: "quantity", label: "Quantite", type: "number" },
      { key: "startDate", label: "Date debut", type: "date" },
      { key: "endDate", label: "Date prevue fin", type: "date" },
    ],
  },
  expeditions: {
    title: "Creer une expedition",
    fields: [
      { key: "customer", label: "Client", required: true },
      { key: "origin", label: "Origine", required: true },
      { key: "destination", label: "Destination", required: true },
      { key: "goods", label: "Marchandise" },
      { key: "weight", label: "Poids", type: "number" },
      { key: "vehicle", label: "Vehicule" },
      { key: "driver", label: "Conducteur" },
      { key: "departure", label: "Depart", type: "date" },
    ],
  },
  flotte: {
    title: "Ajouter un vehicule",
    fields: [
      { key: "registration", label: "Immatriculation", required: true },
      { key: "brand", label: "Marque" },
      { key: "model", label: "Modele" },
      { key: "mileage", label: "Kilometrage", type: "number" },
      { key: "driver", label: "Conducteur" },
      { key: "maintenance", label: "Prochaine maintenance", type: "date" },
    ],
  },
  conducteurs: {
    title: "Ajouter un conducteur",
    fields: [
      { key: "firstName", label: "Prenom", required: true },
      { key: "lastName", label: "Nom", required: true },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "license", label: "Permis" },
      { key: "licenseExpiry", label: "Expiration permis", type: "date" },
    ],
  },
  clients: {
    title: "Ajouter un client",
    fields: [
      { key: "name", label: "Nom", required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "address", label: "Adresse" },
      { key: "country", label: "Pays" },
    ],
  },
  fournisseurs: {
    title: "Ajouter un fournisseur",
    fields: [
      { key: "name", label: "Entreprise", required: true },
      { key: "contact", label: "Contact" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Telephone", type: "tel" },
      { key: "address", label: "Adresse" },
    ],
  },
  produits: {
    title: "Ajouter un produit",
    fields: [
      { key: "sku", label: "SKU", required: true },
      { key: "name", label: "Produit", required: true },
      { key: "category", label: "Categorie" },
      { key: "purchasePrice", label: "Prix achat", type: "number" },
      { key: "salePrice", label: "Prix vente", type: "number" },
      { key: "stock", label: "Stock initial", type: "number" },
      { key: "barcode", label: "Code-barres" },
    ],
  },
  facturation: {
    title: "Creer une facture",
    fields: [
      { key: "customer", label: "Client", required: true },
      { key: "reference", label: "Reference facture" },
      { key: "date", label: "Date", type: "date" },
      { key: "dueDate", label: "Echeance", type: "date" },
      { key: "amount", label: "Montant", type: "number" },
    ],
  },
  paiements: {
    title: "Enregistrer un paiement",
    fields: [
      { key: "customer", label: "Client" },
      { key: "invoice", label: "Facture" },
      { key: "amount", label: "Montant", type: "number", required: true },
      { key: "method", label: "Mode de paiement", type: "select", options: ["Carte", "Especes", "Virement", "Mobile"] },
      { key: "date", label: "Date", type: "date" },
    ],
  },
};

const crmModules: ModuleKey[] = ["clients", "crm", "fournisseurs"];
const commerceModules: ModuleKey[] = ["produits", "stock", "achats", "menus", "recettes", "pharmacie", "matieres-premieres"];
const financeModules: ModuleKey[] = ["devis", "facturation", "paiements", "finances", "comptabilite", "budgets", "frais-scolaires"];
const projectModules: ModuleKey[] = ["chantiers", "contrats", "materiels", "materiaux", "production", "machines", "ordres-fabrication"];
const operationsModules: ModuleKey[] = [
  "commandes",
  "reservations",
  "rendez-vous",
  "consultations",
  "expeditions",
  "itineraires",
  "flotte",
  "conducteurs",
  "maintenance",
  "patients",
  "medecins",
  "etudiants",
  "enseignants",
  "classes",
  "emploi-du-temps",
  "examens",
  "cours",
  "presences",
  "chambres",
  "housekeeping",
  "restaurant-hotel",
  "cuisine",
  "rh",
];

function getTemplate(module: ModuleKey): BusinessTemplate {
  if (module === "statistiques") return "analytics";
  if (module === "roles-permissions") return "security";
  if (crmModules.includes(module)) return "crm";
  if (commerceModules.includes(module)) return "commerce";
  if (financeModules.includes(module)) return "finance";
  if (projectModules.includes(module)) return "project";
  if (operationsModules.includes(module)) return "operations";
  return "admin";
}

const permissionMatrix = [
  { role: "Owner", crm: "Total", finance: "Total", stock: "Total", rh: "Total", security: "Total", risk: "Controle" },
  { role: "Manager", crm: "Modifier", finance: "Lire", stock: "Modifier", rh: "Lire", security: "Aucun", risk: "Normal" },
  { role: "Comptable", crm: "Lire", finance: "Total", stock: "Lire", rh: "Aucun", security: "Aucun", risk: "Normal" },
  { role: "RH", crm: "Aucun", finance: "Lire", stock: "Aucun", rh: "Total", security: "Aucun", risk: "A verifier" },
  { role: "Employe", crm: "Lire", finance: "Aucun", stock: "Lire", rh: "Lire", security: "Aucun", risk: "Limite" },
];

const accessRequests = [
  { reference: "REQ-014", name: "Acces facturation", owner: "Manager", amount: "Finance", status: "En attente" },
  { reference: "REQ-015", name: "Invitation RH", owner: "Admin", amount: "RH", status: "Actif" },
  { reference: "REQ-016", name: "Permission export", owner: "Comptable", amount: "Comptabilite", status: "Critique" },
];

function Widget({
  title,
  eyebrow,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <section className={`rounded-2xl bg-white p-5 shadow ring-1 ring-slate-200 ${className}`}>
      {eyebrow && <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00A693]">{tx(eyebrow)}</p>}
      <h2 className="mt-1 text-xl font-black text-night">{tx(title)}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricGrid({ items }: { items: { label: string; value: string; change?: string }[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </section>
  );
}

function MiniTimeline() {
  return (
    <ActivityTimeline
      items={[
        { title: "Note ajoutee", description: "Le responsable a mis a jour le contexte.", date: "Aujourd'hui" },
        { title: "Document joint", description: "Une piece justificative a ete ajoutee.", date: "Hier" },
        { title: "Action IA", description: "L'assistant recommande une relance ou une verification.", date: "A planifier" },
      ]}
    />
  );
}

function NotesWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title="Notes & emails" eyebrow="Collaboration">
      <div className="space-y-3">
        {["Email de suivi prepare", "Note interne ajoutee", "Appel a planifier"].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            {tx(item)}
          </div>
        ))}
      </div>
    </Widget>
  );
}

function Client360Widget({ module }: { module: ModuleView }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title={`${module.name} 360`} eyebrow="Vue metier">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Coordonnees", "Email, telephone, pays, responsable"],
          ["CA", "42 800 EUR sur 12 mois"],
          ["Factures", "8 payees, 2 en attente"],
          ["Commandes", "14 historiques"],
          ["Produits achetes", "6 references principales"],
          ["Tickets", "2 demandes ouvertes"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">{tx(label)}</p>
            <p className="mt-2 font-bold text-night">{tx(value)}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function CatalogWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title="Fiche produit enrichie" eyebrow="Catalogue">
      <div className="grid gap-4 lg:grid-cols-[.6fr_1fr]">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-cyan-50 text-5xl font-black text-[#00A693]">
          PR
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Stock", "128 unites"],
            ["Prix", "49 EUR"],
            ["Marge", "34%"],
            ["Variantes", "3 couleurs"],
            ["Fournisseur", "Central Supply"],
            ["Code-barres", "EAN-734001"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">{tx(label)}</p>
              <p className="mt-2 font-bold text-night">{tx(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}

function FinanceDocumentWidget({ module }: { module: ModuleView }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const titleByModule: Record<string, string> = {
    facturation: "Facturation operationnelle",
    paiements: "Paiements operationnels",
    finances: "Finances operationnelles",
    comptabilite: "Comptabilite operationnelle",
  };

  return (
    <Widget title={titleByModule[module.key] ?? "Finance operationnelle"} eyebrow="Finance">
      <div className="grid gap-4 md:grid-cols-3">
        {["Statut", "Paiement", "PDF", "Historique", "TVA", "Signature", "Export", "Relances", "Lettrage"].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-black text-slate-700">
            {tx(item)}
          </div>
        ))}
      </div>
    </Widget>
  );
}

function PlanningWidget({ title = "Planning" }: { title?: string }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title={title} eyebrow="Temps reel">
      <div className="grid gap-3 md:grid-cols-7">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
          <div key={day} className="min-h-28 rounded-xl bg-slate-50 p-3">
            <p className="font-black text-night">{tx(day)}</p>
            <div className="mt-3 rounded-lg bg-white p-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              {tx(index % 2 === 0 ? "Equipe terrain" : "Controle")}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function GanttWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title="Planning Gantt" eyebrow="Projet">
      <div className="space-y-4">
        {[
          ["Preparation", "w-5/12"],
          ["Execution", "w-8/12"],
          ["Controle", "w-4/12"],
          ["Facturation", "w-6/12"],
        ].map(([label, width]) => (
          <div key={label}>
            <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
              <span>{tx(label)}</span>
              <span>{tx("En cours")}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className={`h-3 rounded-full bg-[#00C2A9] ${width}`} />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function ReplenishmentWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title="Reapprovisionnement IA" eyebrow="Stock">
      <div className="space-y-3">
        {[
          ["SKU-001", "Commander 80 unites avant vendredi"],
          ["SKU-014", "Risque rupture sous 5 jours"],
          ["SKU-032", "Marge haute, priorite promotion"],
        ].map(([sku, text]) => (
          <div key={sku} className="rounded-xl bg-cyan-50 p-4">
            <p className="font-black text-night">{sku}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{tx(text)}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function MapWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <Widget title="Carte operationnelle" eyebrow="Terrain">
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-50">
        <div className="absolute left-8 top-8 rounded-full bg-[#1E2A38] px-3 py-2 text-xs font-black text-white">{tx("Site A")}</div>
        <div className="absolute right-12 top-20 rounded-full bg-[#00A693] px-3 py-2 text-xs font-black text-white">{tx("Equipe")}</div>
        <div className="absolute bottom-10 left-1/2 rounded-full bg-[#FF7A00] px-3 py-2 text-xs font-black text-white">{tx("Livraison")}</div>
        <div className="absolute left-16 top-32 h-1 w-72 rotate-12 rounded-full bg-[#00C2A9]/40" />
      </div>
    </Widget>
  );
}

function PosWidget() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const [selected, setSelected] = useState("Ticket #128");

  return (
    <Widget title="POS / Tickets" eyebrow="Encaissement">
      <div className="grid gap-3 sm:grid-cols-3">
        {["Table 4", "Ticket #128", "Paiement CB", "Livraison", "Click & Collect", "Addition"].map((item) => (
          <button key={item} type="button" onClick={() => setSelected(item)} className="rounded-2xl bg-[#1E2A38] p-4 text-left font-black text-white transition hover:bg-[#00A693]">
            {selected === item ? `${tx(item)} - ${tx("actif")}` : tx(item)}
          </button>
        ))}
      </div>
    </Widget>
  );
}

const tableRows = [
  { reference: "CFG-001", name: "Configuration active", owner: "Administrateur", amount: "Systeme", status: "Actif" },
  { reference: "VAL-002", name: "Validation ouverte", owner: "Manager", amount: "Workflow", status: "En attente" },
  { reference: "RPT-003", name: "Rapport planifie", owner: "Assistant IA", amount: "Reporting", status: "Valide" },
];

const analyticsBySector: Record<string, {
  title: string;
  kpis: { label: string; value: string; change: string }[];
  rows: { project: string; budget: string; actual: string; variance: string; margin: string; status: string }[];
  insights: string[];
}> = {
  construction: {
    title: "Analytics construction",
    kpis: [
      { label: "Projets actifs", value: "18", change: "+3 vs periode precedente" },
      { label: "CA", value: "1 240 000 EUR", change: "82% de l'objectif" },
      { label: "Budget consomme", value: "74%", change: "-6% vs budget" },
      { label: "Marge", value: "18%", change: "+2 pts vs objectif" },
      { label: "Retards", value: "4", change: "2 critiques" },
      { label: "Couts", value: "918 000 EUR", change: "+12% materiaux" },
    ],
    rows: [
      { project: "Residence A", budget: "500 000 EUR", actual: "462 000 EUR", variance: "-7.6%", margin: "18%", status: "Bon" },
      { project: "Centre B", budget: "240 000 EUR", actual: "278 000 EUR", variance: "+15.8%", margin: "7%", status: "Risque" },
      { project: "Entrepot C", budget: "180 000 EUR", actual: "172 000 EUR", variance: "-4.4%", margin: "21%", status: "Bon" },
    ],
    insights: [
      "3 projets depassent leur budget.",
      "Le cout materiaux a augmente de 12%.",
      "2 clients representent 41% du CA.",
    ],
  },
  retail: {
    title: "Analytics retail",
    kpis: [
      { label: "Ventes", value: "482 300 EUR", change: "+14% vs periode precedente" },
      { label: "Transactions", value: "1 842", change: "+9%" },
      { label: "Panier moyen", value: "62 EUR", change: "+4 EUR" },
      { label: "Stock critique", value: "17", change: "A reapprovisionner" },
      { label: "Retours", value: "6", change: "-2%" },
      { label: "Marge", value: "34%", change: "+3 pts" },
    ],
    rows: [
      { project: "Magasin Centre", budget: "210 000 EUR", actual: "238 000 EUR", variance: "+13.3%", margin: "36%", status: "Bon" },
      { project: "Magasin Nord", budget: "160 000 EUR", actual: "151 000 EUR", variance: "-5.6%", margin: "29%", status: "A suivre" },
      { project: "E-commerce", budget: "80 000 EUR", actual: "93 000 EUR", variance: "+16.2%", margin: "41%", status: "Bon" },
    ],
    insights: [
      "17 SKU sont sous le seuil critique.",
      "Le panier moyen progresse de 4 EUR.",
      "Les ventes e-commerce depassent l'objectif de 16%.",
    ],
  },
  restaurant: {
    title: "Analytics restaurant",
    kpis: [
      { label: "Ventes du jour", value: "18 600 EUR", change: "+11%" },
      { label: "Commandes", value: "286", change: "+18%" },
      { label: "Reservations", value: "74", change: "11 a confirmer" },
      { label: "Food cost", value: "31%", change: "Limite proche" },
      { label: "Pertes", value: "1 240 EUR", change: "-5%" },
      { label: "Temps attente", value: "14 min", change: "Stable" },
    ],
    rows: [
      { project: "Service midi", budget: "8 500 EUR", actual: "9 200 EUR", variance: "+8.2%", margin: "32%", status: "Bon" },
      { project: "Service soir", budget: "10 000 EUR", actual: "9 400 EUR", variance: "-6.0%", margin: "26%", status: "A suivre" },
      { project: "Traiteur", budget: "4 000 EUR", actual: "4 800 EUR", variance: "+20%", margin: "38%", status: "Bon" },
    ],
    insights: [
      "11 reservations doivent etre confirmees.",
      "Le food cost approche la limite fixee.",
      "Le service soir baisse de 6% vs objectif.",
    ],
  },
  sante: {
    title: "Analytics sante",
    kpis: [
      { label: "Patients", value: "642", change: "+8% vs periode precedente" },
      { label: "Rendez-vous", value: "186", change: "24 a confirmer" },
      { label: "Consultations", value: "154", change: "+9%" },
      { label: "Taux occupation", value: "82%", change: "+5 pts" },
      { label: "Facturation", value: "68 400 EUR", change: "+10%" },
      { label: "Dossiers incomplets", value: "9", change: "A completer" },
    ],
    rows: [
      { project: "Medecine generale", budget: "28 000 EUR", actual: "31 400 EUR", variance: "+12.1%", margin: "26%", status: "Bon" },
      { project: "Pediatrie", budget: "18 000 EUR", actual: "16 700 EUR", variance: "-7.2%", margin: "21%", status: "A suivre" },
      { project: "Laboratoire", budget: "14 000 EUR", actual: "15 900 EUR", variance: "+13.5%", margin: "18%", status: "Risque" },
    ],
    insights: [
      "9 dossiers patients doivent etre completes.",
      "24 rendez-vous attendent une confirmation.",
      "Le laboratoire depasse son budget de 13.5%.",
    ],
  },
  education: {
    title: "Analytics education",
    kpis: [
      { label: "Etudiants", value: "1 280", change: "+6%" },
      { label: "Frais encaisses", value: "214 000 EUR", change: "76% de l'objectif" },
      { label: "Presences", value: "91%", change: "+3 pts" },
      { label: "Examens", value: "42", change: "8 a valider" },
      { label: "Classes actives", value: "38", change: "Stable" },
      { label: "Retards paiement", value: "27", change: "A relancer" },
    ],
    rows: [
      { project: "Secondaire A", budget: "120 000 EUR", actual: "116 000 EUR", variance: "-3.3%", margin: "19%", status: "Bon" },
      { project: "Formation pro", budget: "88 000 EUR", actual: "79 000 EUR", variance: "-10.2%", margin: "14%", status: "A suivre" },
      { project: "Cours soir", budget: "46 000 EUR", actual: "51 000 EUR", variance: "+10.8%", margin: "22%", status: "Bon" },
    ],
    insights: [
      "27 paiements scolaires doivent etre relances.",
      "8 examens attendent une validation.",
      "Les presences progressent de 3 points.",
    ],
  },
  transport: {
    title: "Analytics transport",
    kpis: [
      { label: "Expeditions", value: "418", change: "+13%" },
      { label: "Vehicules actifs", value: "36", change: "4 en maintenance" },
      { label: "Retards", value: "12", change: "-3 vs periode precedente" },
      { label: "Carburant", value: "42 800 EUR", change: "+7%" },
      { label: "Livraisons reussies", value: "96%", change: "+2 pts" },
      { label: "Facturation", value: "132 000 EUR", change: "+15%" },
    ],
    rows: [
      { project: "Route Nord", budget: "64 000 EUR", actual: "61 000 EUR", variance: "-4.7%", margin: "23%", status: "Bon" },
      { project: "Route Sud", budget: "52 000 EUR", actual: "59 000 EUR", variance: "+13.4%", margin: "12%", status: "Risque" },
      { project: "Livraison express", budget: "38 000 EUR", actual: "41 500 EUR", variance: "+9.2%", margin: "17%", status: "A suivre" },
    ],
    insights: [
      "4 vehicules sont en maintenance.",
      "La route Sud depasse le budget carburant.",
      "12 expeditions sont en retard.",
    ],
  },
  industrie: {
    title: "Analytics industrie",
    kpis: [
      { label: "Production", value: "8 420", change: "+11%" },
      { label: "OEE", value: "78%", change: "+4 pts" },
      { label: "Machines actives", value: "24", change: "2 arrets" },
      { label: "Matiere premiere", value: "312 000 EUR", change: "+9%" },
      { label: "Ordres ouverts", value: "31", change: "6 critiques" },
      { label: "Marge", value: "22%", change: "+1 pt" },
    ],
    rows: [
      { project: "Ligne A", budget: "220 000 EUR", actual: "214 000 EUR", variance: "-2.7%", margin: "24%", status: "Bon" },
      { project: "Ligne B", budget: "180 000 EUR", actual: "196 000 EUR", variance: "+8.8%", margin: "17%", status: "A suivre" },
      { project: "Maintenance usine", budget: "74 000 EUR", actual: "91 000 EUR", variance: "+22.9%", margin: "8%", status: "Risque" },
    ],
    insights: [
      "2 machines provoquent 61% des arrets.",
      "6 ordres de fabrication sont critiques.",
      "La maintenance usine depasse le budget de 22.9%.",
    ],
  },
  hotel: {
    title: "Analytics hotellerie",
    kpis: [
      { label: "Taux occupation", value: "84%", change: "+6 pts" },
      { label: "RevPAR", value: "96 EUR", change: "+12%" },
      { label: "Reservations", value: "312", change: "+18%" },
      { label: "Chambres disponibles", value: "42", change: "Nettoyage en cours" },
      { label: "Paiements encaisses", value: "148 000 EUR", change: "+14%" },
      { label: "Avis clients", value: "4.6/5", change: "+0.2" },
    ],
    rows: [
      { project: "Chambres standard", budget: "90 000 EUR", actual: "98 000 EUR", variance: "+8.8%", margin: "34%", status: "Bon" },
      { project: "Suites", budget: "62 000 EUR", actual: "58 000 EUR", variance: "-6.4%", margin: "41%", status: "A suivre" },
      { project: "Restaurant hotel", budget: "38 000 EUR", actual: "44 000 EUR", variance: "+15.7%", margin: "24%", status: "Bon" },
    ],
    insights: [
      "Le taux d'occupation progresse de 6 points.",
      "42 chambres attendent une action housekeeping.",
      "Le restaurant hotel depasse l'objectif de 15.7%.",
    ],
  },
  general: {
    title: "Analytics entreprise",
    kpis: [
      { label: "CA", value: "482 300 EUR", change: "+18% vs periode precedente" },
      { label: "Nouveaux clients", value: "126", change: "84% de l'objectif" },
      { label: "Marge", value: "27%", change: "+2 pts" },
      { label: "Paiements encaisses", value: "386 000 EUR", change: "+11%" },
      { label: "Factures en retard", value: "12", change: "A relancer" },
      { label: "Prevision", value: "518 000 EUR", change: "30 jours" },
    ],
    rows: [
      { project: "Services PME", budget: "180 000 EUR", actual: "196 000 EUR", variance: "+8.8%", margin: "31%", status: "Bon" },
      { project: "Contrats annuels", budget: "240 000 EUR", actual: "228 000 EUR", variance: "-5.0%", margin: "24%", status: "A suivre" },
      { project: "Nouveaux comptes", budget: "90 000 EUR", actual: "102 000 EUR", variance: "+13.3%", margin: "29%", status: "Bon" },
    ],
    insights: [
      "12 factures arrivent a echeance cette semaine.",
      "8 clients n'ont pas commande depuis 60 jours.",
      "3 offres representent 41% du pipeline.",
    ],
  },
};

function getAnalyticsConfig(sectorKey: SectorKey) {
  if (sectorKey === "construction") return analyticsBySector.construction;
  if (sectorKey === "commerce") return analyticsBySector.retail;
  if (sectorKey === "restaurant") return analyticsBySector.restaurant;
  if (sectorKey === "sante") return analyticsBySector.sante;
  if (sectorKey === "education") return analyticsBySector.education;
  if (sectorKey === "transport") return analyticsBySector.transport;
  if (sectorKey === "industrie") return analyticsBySector.industrie;
  if (sectorKey === "hotel") return analyticsBySector.hotel;
  return analyticsBySector.general;
}

function SimpleLineChart({ title, values }: { title: string; values: number[] }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const max = Math.max(...values);

  return (
    <Widget title={title} eyebrow="BI">
      <div className="flex h-56 items-end gap-3 border-b border-l border-slate-200 px-4 pt-4">
        {values.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-xl bg-[#00C2A9]" style={{ height: `${Math.max(18, (value / max) * 180)}px` }} />
            <span className="text-xs font-bold text-slate-500">{tx(["Jan", "Fev", "Mar", "Avr", "Mai", "Juin"][index] ?? "")}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function AnalyticsTemplate({ sectorKey }: { sectorKey: SectorKey }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const config = getAnalyticsConfig(sectorKey);
  const [period, setPeriod] = useState("30 jours");
  const [savedView, setSavedView] = useState("Vue Direction");

  return (
    <>
      <section className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00A693]">{tx("EnterpriseERP Analytics Center")}</p>
            <h2 className="mt-2 text-2xl font-black text-night">{tx(config.title)}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Aujourd'hui", "7 jours", "30 jours", "Trimestre", "Annee", "Personnalise"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-full px-4 py-2 text-sm font-black ${period === item ? "bg-[#1E2A38] text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {tx(item)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {["Entreprise", "Site", "Projet", "Responsable", "Client", "Statut"].map((item) => (
            <select key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">
              <option>{tx(item)}</option>
            </select>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <MetricGrid items={config.kpis} />
      </div>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <SimpleLineChart title="Evolution du CA" values={[62, 74, 81, 94, 112, 128]} />
        <SimpleLineChart title={sectorKey === "construction" ? "Budget vs reel" : "Performance par equipe"} values={[48, 67, 52, 86, 71, 96]} />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Widget title={sectorKey === "construction" ? "Projets a risque" : "Analyse detaillee"} eyebrow="Drill-down">
          <DataGrid
            columns={[
              { key: "project", label: sectorKey === "construction" ? "Projet" : "Segment" },
              { key: "budget", label: "Budget" },
              { key: "actual", label: "Reel" },
              { key: "variance", label: "Ecart" },
              { key: "margin", label: "Marge" },
              { key: "status", label: "Statut", badge: true },
            ]}
            data={config.rows}
            actions={(row) => (
              <button type="button" className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-night">
                {tx(row.status === "Risque" ? "Voir causes" : "Explorer")}
              </button>
            )}
          />
        </Widget>

        <AIRecommendation
          text={config.insights.join(" ")}
          actions={["Voir details", "Creer action", "Planifier rapport"]}
        />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <Widget title="Vues enregistrees" eyebrow="Personnalisation">
          <div className="space-y-3">
            {["Vue Direction", "Vue Finance", "Vue Projet", "Ma vue"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSavedView(item)}
                className={`w-full rounded-xl p-4 text-left text-sm font-black ${savedView === item ? "bg-[#00C2A9]/10 text-[#008f7d]" : "bg-slate-50 text-slate-700"}`}
              >
                {tx(item)}
              </button>
            ))}
          </div>
        </Widget>

        <Widget title="Rapports favoris" eyebrow="Planification">
          <div className="space-y-3">
            {["Rapport direction hebdomadaire", "Suivi budget mensuel", "Performance equipe"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4">
                <p className="font-black text-night">{tx(item)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{tx("Envoyer chaque lundi a 08:00")}</p>
              </div>
            ))}
          </div>
        </Widget>

        <Widget title="Exports BI" eyebrow="CSV / Excel / PDF">
          <div className="grid gap-3">
            {["Exporter en PDF", "Exporter CSV", "Exporter Excel", "Programmer l'envoi"].map((item) => (
              <button key={item} type="button" className="rounded-xl border border-slate-200 px-4 py-3 text-left font-black text-night">
                {tx(item)}
              </button>
            ))}
          </div>
        </Widget>
      </section>

      <section className="mt-8">
        <FormModal
          title="Creer un rapport"
          fields={[
            { label: "Nom du rapport" },
            { label: "Source de donnees" },
            { label: "Mesures" },
            { label: "Dimensions" },
            { label: "Filtres" },
            { label: "Visualisation" },
            { label: "Frequence" },
          ]}
        />
      </section>
    </>
  );
}

function AdminTemplate({ module }: { module: ModuleView }) {
  return (
    <>
      <MetricGrid
        items={[
          { label: "Elements actifs", value: "0", change: "Referentiel" },
          { label: "A valider", value: "0", change: "Controle admin" },
          { label: "Import", value: "CSV", change: "Disponible" },
          { label: "Export", value: "Excel", change: "Pret" },
        ]}
      />
      <div className="mt-8">
        <FilterBar searchPlaceholder={`Rechercher dans ${module.name.toLowerCase()}...`} filters={[]} />
      </div>
      <section className="mt-8 rounded-2xl bg-white p-5 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-black text-night">Administration {module.name}</h2>
        <DataGrid
          columns={[
            { key: "reference", label: "Reference" },
            { key: "name", label: "Configuration" },
            { key: "owner", label: "Responsable" },
            { key: "amount", label: "Categorie" },
            { key: "status", label: "Statut", badge: true },
          ]}
          data={tableRows}
        />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <FormModal title="Creer une configuration" fields={[{ label: "Titre" }, { label: "Categorie" }, { label: "Responsable" }]} />
        <AttachmentManager attachments={[{ name: "Modele import.xlsx", type: "Excel", size: "84 KB" }]} />
      </section>
    </>
  );
}

function SecurityTemplate() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const [decision, setDecision] = useState("");

  return (
    <>
      <MetricGrid
        items={[
          { label: "Roles actifs", value: "5", change: "Owner, Manager, Comptable, RH, Employe" },
          { label: "Permissions", value: "29", change: "Seed global" },
          { label: "Demandes d'acces", value: "3", change: "A valider" },
          { label: "Risque securite", value: "Moyen", change: "1 export critique" },
        ]}
      />

      <section className="mt-8 rounded-3xl bg-gradient-to-br from-[#1E2A38] via-[#142235] to-[#00A990] p-7 text-white shadow-xl">
        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]">{tx("RBAC Control Center")}</p>
            <h2 className="mt-4 text-4xl font-black">{tx("Controlez qui peut voir, modifier, exporter et approuver.")}</h2>
            <p className="mt-4 leading-8 text-white/75">
              {tx("Cette page n'est pas un simple CRUD. Elle sert a piloter les roles, les permissions sensibles, les demandes d'acces, l'audit et la separation des responsabilites.")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Export financier", "1 demande critique"],
              ["Sessions actives", "8 utilisateurs"],
              ["Permissions admin", "2 roles autorises"],
              ["Audit", "Journal pret"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/65">{tx(label)}</p>
                <p className="mt-2 text-xl font-black">{tx(value)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Widget title="Matrice roles x permissions" eyebrow="Securite">
          <DataGrid
            columns={[
              { key: "role", label: "Role" },
              { key: "crm", label: "CRM" },
              { key: "finance", label: "Finance" },
              { key: "stock", label: "Stock" },
              { key: "rh", label: "RH" },
              { key: "security", label: "Securite" },
              { key: "risk", label: "Risque", badge: true },
            ]}
            data={permissionMatrix}
          />
        </Widget>

        <Widget title="Roles systeme" eyebrow="Acces">
          <div className="space-y-3">
            {[
              ["Owner", "Acces total, facturation, roles, export"],
              ["Manager", "Pilotage operations et validation"],
              ["Comptable", "Finance, paiements, exports comptables"],
              ["RH", "Employes, contrats, documents RH"],
              ["Employe", "Lecture limitee selon module"],
            ].map(([role, description]) => (
              <div key={role} className="rounded-xl bg-slate-50 p-4">
                <p className="font-black text-night">{tx(role)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{tx(description)}</p>
              </div>
            ))}
          </div>
        </Widget>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Widget title="Demandes d'acces" eyebrow="Validation">
          <DataGrid
            columns={[
              { key: "reference", label: "Reference" },
              { key: "name", label: "Demande" },
              { key: "owner", label: "Demandeur" },
              { key: "amount", label: "Module" },
              { key: "status", label: "Statut", badge: true },
            ]}
            data={accessRequests}
            actions={() => (
              <div className="flex gap-2">
                <button type="button" onClick={() => setDecision("Demande approuvee.")} className="rounded-lg bg-[#00C2A9]/10 px-3 py-1.5 text-xs font-black text-[#008f7d]">{tx("Approuver")}</button>
                <button type="button" onClick={() => setDecision("Demande refusee.")} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">{tx("Refuser")}</button>
              </div>
            )}
          />
          {decision && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-black text-[#00A693]">{tx(decision)}</p>}
        </Widget>

        <Widget title="Audit securite" eyebrow="Journal">
          <div className="space-y-3">
            {[
              "Owner a modifie le role Manager aujourd'hui.",
              "Comptable a exporte un journal de facturation.",
              "Invitation RH en attente de validation.",
              "Tentative d'acces refusee sur module securite.",
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{tx(item)}</div>
            ))}
          </div>
        </Widget>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <AlertPanel
          alerts={[
            { title: "Export sensible", description: "Une demande d'export comptable doit etre validee par un Owner.", level: "warning" },
            { title: "Separation des roles", description: "Aucun employe simple ne possede de permission securite.", level: "info" },
          ]}
        />
        <AIRecommendation
          text="L'IA recommande de limiter les exports financiers aux roles Owner et Comptable, puis de journaliser toute modification de permission."
          actions={["Appliquer recommandation", "Voir audit", "Reviser roles"]}
        />
        <FormModal
          title="Inviter ou modifier un role"
          fields={[
            { label: "Utilisateur", placeholder: "email@entreprise.com" },
            { label: "Role", placeholder: "Manager" },
            { label: "Module sensible", placeholder: "Finance" },
          ]}
        />
      </section>
    </>
  );
}

function CrmTemplate({ module }: { module: ModuleView }) {
  return (
    <>
      <MetricGrid
        items={[
          { label: "Contacts actifs", value: "1 208", change: "+12%" },
          { label: "CA", value: "482 300 EUR", change: "+18%" },
          { label: "Relances", value: "24", change: "Priorite" },
          { label: "Tickets", value: "6", change: "A traiter" },
        ]}
      />
      <section className="mt-8">
        <Kanban
          columns={["Nouveau", "Qualifie", "Proposition", "Negociation", "Gagne"].map((step, index) => ({
            title: step,
            cards: index < 4 ? [{ title: `${module.name} ${index + 1}`, subtitle: "Compte prioritaire", amount: "12 800 EUR", meta: "Relance" }] : [],
          }))}
        />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Client360Widget module={module} />
        <NotesWidget />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <MiniTimeline />
        <AttachmentManager attachments={[{ name: "Contrat client.pdf", type: "PDF", size: "220 KB" }]} />
        <AIRecommendation text="L'IA recommande de relancer les clients sans commande depuis 60 jours et de proposer une offre adaptee a leur historique." actions={["Relancer", "Creer email", "Voir historique"]} />
      </section>
    </>
  );
}

function CommerceTemplate({ module }: { module: ModuleView }) {
  return (
    <>
      <MetricGrid
        items={[
          { label: "References", value: "1 842", change: "+4%" },
          { label: "Stock critique", value: "17", change: "A commander" },
          { label: "Marge moyenne", value: "34%", change: "+3 pts" },
          { label: "Ventes", value: "124 800 EUR", change: "+21%" },
        ]}
      />
      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <CatalogWidget />
        <ReplenishmentWidget />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Widget title={`${module.name} - historique`} eyebrow="Achats / ventes">
          <DataGrid
            columns={[
              { key: "reference", label: "SKU" },
              { key: "name", label: "Produit" },
              { key: "amount", label: "Valeur" },
              { key: "status", label: "Statut", badge: true },
            ]}
            data={tableRows}
          />
        </Widget>
        <AIRecommendation text="L'IA predit une rupture sur 3 references et recommande de reapprovisionner selon les delais fournisseurs." actions={["Commander", "Voir marge", "Scanner code-barres"]} />
      </section>
    </>
  );
}

function FinanceTemplate({ module }: { module: ModuleView }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <>
      <MetricGrid
        items={[
          { label: "A encaisser", value: "48 200 EUR", change: "+11%" },
          { label: "En retard", value: "6", change: "Relance" },
          { label: "TVA", value: "24 600 EUR", change: "A declarer" },
          { label: "PDF signes", value: "18", change: "+5" },
        ]}
      />
      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <FinanceDocumentWidget module={module} />
        <Widget title="Paiements & relances" eyebrow="Tresorerie">
          <div className="space-y-3">
            {["Paiement partiel recu", "Relance automatique envoyee", "Signature digitale en attente", "Export comptable pret"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{tx(item)}</div>
            ))}
          </div>
        </Widget>
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <MiniTimeline />
        <AttachmentManager attachments={[{ name: "Facture PDF.pdf", type: "PDF", size: "128 KB" }, { name: "Export comptable.csv", type: "CSV", size: "44 KB" }]} />
        <AIRecommendation text="L'IA recommande de relancer les factures echeance J+7 et d'exporter les ecritures comptables cette semaine." actions={["Relancer", "Signer", "Exporter"]} />
      </section>
    </>
  );
}

function ProjectTemplate({ module }: { module: ModuleView }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <>
      <MetricGrid
        items={[
          { label: "Projets actifs", value: "18", change: "+3" },
          { label: "Budget engage", value: "940 000 EUR", change: "+11%" },
          { label: "Retards", value: "4", change: "Risque" },
          { label: "Equipe", value: "32", change: "Terrain" },
        ]}
      />
      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <GanttWidget />
        <Widget title="Budget & risques" eyebrow="Projet">
          <div className="space-y-3">
            {["Budget consomme: 72%", "Couts reels: 712 000 EUR", "Sous-traitants: 6 actifs", "Risques: 4 jalons en retard"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{tx(item)}</div>
            ))}
          </div>
        </Widget>
      </section>
      <section className="mt-8">
        <Kanban
          columns={["Planifie", "Preparation", "En cours", "Controle", "Termine"].map((step, index) => ({
            title: step,
            cards: index < 4 ? [{ title: `${module.name} ${index + 1}`, subtitle: "Equipe chantier", amount: "Budget", meta: "Semaine" }] : [],
          }))}
        />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <AttachmentManager attachments={[{ name: "Photos chantier.zip", type: "ZIP", size: "8 MB" }, { name: "Plan projet.pdf", type: "PDF", size: "2 MB" }]} />
        <MiniTimeline />
        <AIRecommendation text="L'IA signale un risque de retard et recommande de replanifier materiel, equipe et sous-traitants." actions={["Replanifier", "Voir budget", "Notifier equipe"]} />
      </section>
    </>
  );
}

function OperationsTemplate({ module, sectorKey }: { module: ModuleView; sectorKey: SectorKey }) {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const isHrFlow = module.key === "rh";
  const isRestaurantFlow = sectorKey === "restaurant" && ["commandes", "reservations", "cuisine"].includes(module.key);
  const isHotelRestaurantFlow = sectorKey === "hotel" && module.key === "restaurant-hotel";
  const isHotelFlow = sectorKey === "hotel" && ["reservations", "chambres", "housekeeping"].includes(module.key);
  const isCommerceOrderFlow = sectorKey === "commerce" && module.key === "commandes";
  const isEducationFlow = sectorKey === "education" && ["etudiants", "enseignants", "classes", "emploi-du-temps", "examens", "cours", "presences"].includes(module.key);
  const isHealthFlow = sectorKey === "sante" && ["patients", "medecins", "rendez-vous", "consultations"].includes(module.key);
  const isTransportFlow = sectorKey === "transport" && ["expeditions", "itineraires", "flotte", "conducteurs", "maintenance"].includes(module.key);
  const showPos = isRestaurantFlow || isHotelRestaurantFlow;
  const primaryLabel = isHrFlow
    ? "Employes"
    : showPos || isCommerceOrderFlow
      ? "Commandes"
      : isHotelFlow
        ? "Reservations"
        : isEducationFlow
          ? "Etudiants"
          : isHealthFlow
            ? "Patients"
            : isTransportFlow
              ? "Expeditions"
              : "Operations";
  const realtimeLabel = showPos
    ? "Temps attente"
    : isHrFlow || isEducationFlow
      ? "Planning"
      : isHealthFlow
        ? "Rendez-vous"
        : "Temps reel";
  const planningTitle = showPos
    ? "Tables, cuisine et service"
    : isHrFlow
      ? "Planning du personnel"
      : isHotelFlow
        ? "Reservations, chambres et service"
        : isEducationFlow
          ? "Emploi du temps et classes"
          : isHealthFlow
            ? "Rendez-vous et consultations"
            : "Calendrier operationnel";
  const workflowTitle = isHrFlow
    ? "Gestion RH"
    : isHotelFlow
      ? "Operations hotelieres"
      : isCommerceOrderFlow
        ? "Suivi des commandes"
        : isEducationFlow
          ? "Suivi academique"
          : isHealthFlow
            ? "Parcours patient"
            : "Workflow temps reel";
  const workflowItems = isHrFlow
    ? ["Presences", "Conges", "Contrats", "Fiches de paie", "Documents RH"]
    : isHotelFlow
      ? ["Reservation", "Check-in", "Housekeeping", "Service client", "Facturation"]
      : isCommerceOrderFlow
        ? ["Commande recue", "Preparation", "Expedition", "Paiement", "Facturation"]
        : isEducationFlow
    ? ["Cours", "Examens", "Presences", "Frais scolaires", "Documents"]
    : isHealthFlow
      ? ["Admission", "Consultation", "Prescription", "Facturation", "Dossier medical"]
      : ["Affectation", "En cours", "Validation", "Signature", "Facturation"];
  const cardSubtitle = showPos
    ? "Ticket service"
    : isHrFlow
      ? "Dossier employe"
      : isHotelFlow
        ? "Sejour client"
        : isCommerceOrderFlow
          ? "Commande client"
          : isEducationFlow
            ? "Dossier scolaire"
            : isHealthFlow
              ? "Dossier patient"
              : "Operation terrain";
  const cardAmount = showPos
    ? "Addition"
    : isHrFlow
      ? "Contrat"
      : isHotelFlow
        ? "Chambre"
        : isCommerceOrderFlow
          ? "Panier"
          : isEducationFlow
            ? "Classe"
            : isHealthFlow
              ? "Consultation"
              : "SLA";

  return (
    <>
      <MetricGrid
        items={[
          { label: primaryLabel, value: showPos || isCommerceOrderFlow ? "286" : isEducationFlow ? "1 280" : isHealthFlow ? "642" : isHrFlow ? "48" : "438", change: "+12%" },
          { label: realtimeLabel, value: showPos ? "14 min" : isEducationFlow ? "38" : isHealthFlow ? "186" : isHrFlow ? "42" : "Actif", change: "Live" },
          { label: isHrFlow ? "Presences" : "A traiter", value: isHrFlow ? "42/48" : "7", change: "Priorite" },
          { label: "Statistiques", value: "98%", change: "Suivi" },
        ]}
      />
      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        {isTransportFlow ? <MapWidget /> : <PlanningWidget title={planningTitle} />}
        {showPos ? <PosWidget /> : <Widget title={workflowTitle} eyebrow="Operations">
          <div className="space-y-3">
            {workflowItems.map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{tx(item)}</div>
            ))}
          </div>
        </Widget>}
      </section>
      <section className="mt-8">
        <Kanban
          columns={["Nouveau", "Affecte", "En cours", "Controle", "Termine"].map((step, index) => ({
            title: step,
            cards: index < 4 ? [{ title: `${module.name} ${index + 1}`, subtitle: cardSubtitle, amount: cardAmount, meta: "Live" }] : [],
          }))}
        />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <AlertPanel alerts={[{ title: "Suivi temps reel", description: "Les operations critiques sont visibles par statut, equipe et priorite.", level: "info" }, { title: "Retard possible", description: "L'IA detecte un risque sur les taches non affectees.", level: "warning" }]} />
        <AttachmentManager attachments={[{ name: "Signature client.png", type: "Image", size: "320 KB" }, { name: "Photo operation.jpg", type: "Image", size: "1 MB" }]} />
        <AIRecommendation text="L'IA recommande de traiter les operations en attente, d'affecter les responsables et de surveiller les temps reels." actions={["Affecter", "Voir carte", "Notifier"]} />
      </section>
    </>
  );
}

export default function GenericModulePage({ module }: { module: ModuleView }) {
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const { locale, t } = useI18n();
  const { sector, sectorKey, loading, company, error } = useSector();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const template = getTemplate(module.key);
  const sectorReady = !loading && Boolean(company || error);
  const moduleAllowed = !sectorReady || sector.modules.includes(module.key);
  const localizedModule = {
    ...module,
    name: sector.labels?.[module.key] ? tx(sector.labels[module.key]!) : t(`nav.${module.key}`),
  };
  const createDefinition =
    createForms[module.key] ?? {
      title: `${tx("Creer")} ${localizedModule.name}`,
      fields: [
        { key: "name", label: "Nom", required: true },
        { key: "description", label: "Description", type: "textarea" as const },
      ],
    };
  const templateLabel = {
    admin: "Administration",
    analytics: "Analytics / BI",
    crm: "CRM 360",
    commerce: "Commerce & stock",
    finance: "Finance",
    project: "Projet",
    operations: "Operations",
    security: "Securite & permissions",
  }[template];

  useEffect(() => {
    if (!moduleAllowed) {
      router.replace("/dashboard");
    }
  }, [moduleAllowed, router]);

  if (!sectorReady) {
    return (
      <ERPLayout
        title={t("common.loading")}
        subtitle={tx("Verification du secteur et des modules disponibles.")}
      >
        <section className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
          <p className="text-lg font-bold text-slate-600">
            {tx("Preparation de l'interface adaptee au secteur.")}
          </p>
        </section>
      </ERPLayout>
    );
  }

  if (!moduleAllowed) {
    return (
      <ERPLayout
        title={tx("Module indisponible")}
        subtitle={tx("Ce module n'appartient pas au secteur selectionne. Redirection vers le tableau de bord.")}
      >
        <section className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
          <p className="text-lg font-bold text-slate-600">
            {tx("Le module demande n'est pas disponible pour ce secteur.")}
          </p>
        </section>
      </ERPLayout>
    );
  }

  return (
    <ERPLayout
      title={`${module.icon} ${localizedModule.name}`}
      subtitle={`${tx(templateLabel)}: ${tx("une interface adaptee au metier, assemblee avec des widgets reutilisables.")}`}
      action={tx("Creer")}
      onAction={() => setCreateOpen(true)}
    >
      {template === "admin" && <AdminTemplate module={localizedModule} />}
      {template === "analytics" && <AnalyticsTemplate sectorKey={sectorKey} />}
      {template === "crm" && <CrmTemplate module={localizedModule} />}
      {template === "commerce" && <CommerceTemplate module={localizedModule} />}
      {template === "finance" && <FinanceTemplate module={localizedModule} />}
      {template === "project" && <ProjectTemplate module={localizedModule} />}
      {template === "operations" && <OperationsTemplate module={localizedModule} sectorKey={sectorKey} />}
      {template === "security" && <SecurityTemplate />}

      {createOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#00A693]">
                  EnterpriseERP Platform
                </p>

                <h2 className="mt-1 text-2xl font-black text-night">
                  {tx(createDefinition.title)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCreateOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-black text-slate-500 hover:bg-slate-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {createDefinition.fields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="text-sm font-bold text-slate-600">
                      {tx(field.label)}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        required={field.required}
                        placeholder={field.placeholder ? tx(field.placeholder) : undefined}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00C2A9]"
                      />
                    ) : field.type === "select" ? (
                      <select
                        required={field.required}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#00C2A9]"
                      >
                        <option value="">{tx("Selectionner")}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {tx(option)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        required={field.required}
                        placeholder={field.placeholder ? tx(field.placeholder) : undefined}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00C2A9]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setCreateOpen(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  {tx("Annuler")}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCreateOpen(false)
                  }
                  className="rounded-xl bg-[#1E2A38] px-5 py-2 font-bold text-white hover:opacity-90"
                >
                  {tx("Creer")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ERPLayout>
  );
}
