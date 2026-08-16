"use client";

import { useState } from "react";
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
import type { ModuleKey } from "@shared/sector/types";

type ModuleView = {
  key: ModuleKey;
  name: string;
  icon: string;
};

type BusinessTemplate = "admin" | "crm" | "commerce" | "finance" | "project" | "operations" | "security";

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
  "chambres",
  "housekeeping",
  "restaurant-hotel",
  "cuisine",
  "rh",
];

function getTemplate(module: ModuleKey): BusinessTemplate {
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
  return (
    <Widget title="Notes & emails" eyebrow="Collaboration">
      <div className="space-y-3">
        {["Email de suivi prepare", "Note interne ajoutee", "Appel a planifier"].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </Widget>
  );
}

function Client360Widget({ module }: { module: ModuleView }) {
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
            <p className="text-xs font-black uppercase text-slate-400">{label}</p>
            <p className="mt-2 font-bold text-night">{value}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function CatalogWidget() {
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
            ["Code-barres", "EAN-ERP-001"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">{label}</p>
              <p className="mt-2 font-bold text-night">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}

function FinanceDocumentWidget({ module }: { module: ModuleView }) {
  return (
    <Widget title={`${module.name} operationnel`} eyebrow="Finance">
      <div className="grid gap-4 md:grid-cols-3">
        {["Statut", "Paiement", "PDF", "Historique", "TVA", "Signature", "Export", "Relances", "Lettrage"].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-black text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </Widget>
  );
}

function PlanningWidget({ title = "Planning" }: { title?: string }) {
  return (
    <Widget title={title} eyebrow="Temps reel">
      <div className="grid gap-3 md:grid-cols-7">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
          <div key={day} className="min-h-28 rounded-xl bg-slate-50 p-3">
            <p className="font-black text-night">{day}</p>
            <div className="mt-3 rounded-lg bg-white p-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              {index % 2 === 0 ? "Equipe terrain" : "Controle"}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function GanttWidget() {
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
              <span>{label}</span>
              <span>En cours</span>
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
            <p className="mt-1 text-sm font-semibold text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

function MapWidget() {
  return (
    <Widget title="Carte operationnelle" eyebrow="Terrain">
      <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-50">
        <div className="absolute left-8 top-8 rounded-full bg-[#1E2A38] px-3 py-2 text-xs font-black text-white">Site A</div>
        <div className="absolute right-12 top-20 rounded-full bg-[#00A693] px-3 py-2 text-xs font-black text-white">Equipe</div>
        <div className="absolute bottom-10 left-1/2 rounded-full bg-[#FF7A00] px-3 py-2 text-xs font-black text-white">Livraison</div>
        <div className="absolute left-16 top-32 h-1 w-72 rotate-12 rounded-full bg-[#00C2A9]/40" />
      </div>
    </Widget>
  );
}

function PosWidget() {
  const [selected, setSelected] = useState("Ticket #128");

  return (
    <Widget title="POS / Tickets" eyebrow="Encaissement">
      <div className="grid gap-3 sm:grid-cols-3">
        {["Table 4", "Ticket #128", "Paiement CB", "Livraison", "Click & Collect", "Addition"].map((item) => (
          <button key={item} type="button" onClick={() => setSelected(item)} className="rounded-2xl bg-[#1E2A38] p-4 text-left font-black text-white transition hover:bg-[#00A693]">
            {selected === item ? `${item} - actif` : item}
          </button>
        ))}
      </div>
    </Widget>
  );
}

const tableRows = [
  { reference: "ERP-001", name: "Element exemple", owner: "Equipe", amount: "0 EUR", status: "En attente" },
  { reference: "ERP-002", name: "Suivi operationnel", owner: "Manager", amount: "0 EUR", status: "Actif" },
  { reference: "ERP-003", name: "Rapport automatique", owner: "Assistant IA", amount: "0 EUR", status: "Valide" },
];

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
            { key: "name", label: "Nom" },
            { key: "owner", label: "Responsable" },
            { key: "status", label: "Statut", badge: true },
          ]}
          data={tableRows}
        />
      </section>
      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <FormModal title={`Formulaire ${module.name}`} fields={[{ label: "Nom" }, { label: "Code" }, { label: "Statut" }]} />
        <AttachmentManager attachments={[{ name: "Import exemple.xlsx", type: "Excel", size: "84 KB" }]} />
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
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>
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
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>
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

function OperationsTemplate({ module }: { module: ModuleView }) {
  const isRestaurantFlow = ["commandes", "reservations", "cuisine", "restaurant-hotel"].includes(module.key);
  const isTransportFlow = ["expeditions", "itineraires", "flotte", "conducteurs"].includes(module.key);
  const isHrFlow = module.key === "rh";

  return (
    <>
      <MetricGrid
        items={[
          { label: isRestaurantFlow ? "Commandes" : "Operations", value: isRestaurantFlow ? "286" : "438", change: "+12%" },
          { label: isRestaurantFlow ? "Temps attente" : "Temps reel", value: isRestaurantFlow ? "14 min" : "Actif", change: "Live" },
          { label: isHrFlow ? "Presences" : "A traiter", value: isHrFlow ? "42/48" : "7", change: "Priorite" },
          { label: "Statistiques", value: "98%", change: "Suivi" },
        ]}
      />
      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        {isTransportFlow ? <MapWidget /> : <PlanningWidget title={isRestaurantFlow ? "Tables, cuisine et service" : "Calendrier operationnel"} />}
        {isRestaurantFlow ? <PosWidget /> : <Widget title="Workflow temps reel" eyebrow="Operations">
          <div className="space-y-3">
            {["Affectation", "En cours", "Validation", "Signature", "Facturation"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>
            ))}
          </div>
        </Widget>}
      </section>
      <section className="mt-8">
        <Kanban
          columns={["Nouveau", "Affecte", "En cours", "Controle", "Termine"].map((step, index) => ({
            title: step,
            cards: index < 4 ? [{ title: `${module.name} ${index + 1}`, subtitle: isRestaurantFlow ? "Ticket service" : "Operation terrain", amount: isRestaurantFlow ? "Addition" : "SLA", meta: "Live" }] : [],
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
  const { locale, t } = useI18n();
  const tx = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);
  const template = getTemplate(module.key);
  const localizedModule = { ...module, name: t(`nav.${module.key}`) };
  const templateLabel = {
    admin: "Administration",
    crm: "CRM 360",
    commerce: "Commerce & stock",
    finance: "Finance",
    project: "Projet",
    operations: "Operations",
    security: "Securite & permissions",
  }[template];

  return (
    <ERPLayout
      title={`${module.icon} ${localizedModule.name}`}
      subtitle={`${tx(templateLabel)}: ${tx("une interface adaptee au metier, assemblee avec des widgets reutilisables.")}`}
      action={tx("Creer")}
    >
      {template === "admin" && <AdminTemplate module={localizedModule} />}
      {template === "crm" && <CrmTemplate module={localizedModule} />}
      {template === "commerce" && <CommerceTemplate module={localizedModule} />}
      {template === "finance" && <FinanceTemplate module={localizedModule} />}
      {template === "project" && <ProjectTemplate module={localizedModule} />}
      {template === "operations" && <OperationsTemplate module={localizedModule} />}
      {template === "security" && <SecurityTemplate />}
    </ERPLayout>
  );
}
