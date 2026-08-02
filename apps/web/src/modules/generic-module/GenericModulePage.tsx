"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import AIRecommendation from "@shared/components/ui/AIRecommendation";
import ActivityTimeline from "@shared/components/ui/ActivityTimeline";
import AlertPanel from "@shared/components/ui/AlertPanel";
import AttachmentManager from "@shared/components/ui/AttachmentManager";
import DataGrid from "@shared/components/ui/DataGrid";
import DetailsDrawer from "@shared/components/ui/DetailsDrawer";
import FilterBar from "@shared/components/ui/FilterBar";
import FormModal from "@shared/components/ui/FormModal";
import Kanban from "@shared/components/ui/Kanban";
import KPICard from "@shared/components/ui/KPICard";
import type { ModuleKey } from "@shared/sector/types";

type ModuleView = {
  key: ModuleKey;
  name: string;
  icon: string;
};

const workflowByModule: Partial<Record<ModuleKey, string[]>> = {
  crm: ["Nouveau prospect", "Qualifie", "Proposition envoyee", "Negociation", "Gagne", "Perdu"],
  commandes: ["Nouvelle", "Confirmee", "Preparation", "Expediee", "Livree", "Annulee"],
  reservations: ["En attente", "Confirmee", "Arrivee", "Terminee", "Annulee", "Absent"],
  devis: ["Brouillon", "Envoye", "Accepte", "Refuse", "Expire", "Converti"],
  paiements: ["A encaisser", "Relance", "Recu", "Lettrage"],
  achats: ["Demande", "Validee", "Commandee", "Recue", "Facturee", "Payee"],
  chantiers: ["Planifie", "Preparation", "En cours", "Suspendu", "Termine", "Cloture"],
  consultations: ["Rendez-vous", "Diagnostic", "Prescription", "Suivi"],
  expeditions: ["Planifiee", "Affectee", "Chargement", "Transit", "Livree"],
  production: ["Planifie", "Lance", "En cours", "Controle", "Termine"],
};

const tableRows = [
  { reference: "ERP-001", name: "Element exemple", owner: "Equipe", amount: "0 EUR", status: "En attente" },
  { reference: "ERP-002", name: "Suivi operationnel", owner: "Manager", amount: "0 EUR", status: "Actif" },
  { reference: "ERP-003", name: "Rapport automatique", owner: "Assistant IA", amount: "0 EUR", status: "Valide" },
];

export default function GenericModulePage({ module }: { module: ModuleView }) {
  const workflow = workflowByModule[module.key] ?? ["Creation", "Traitement", "Validation", "Archivage"];

  return (
    <ERPLayout
      title={`${module.icon} ${module.name}`}
      subtitle="Page metier standardisee avec KPI, filtres, tableau, Kanban, fiche detaillee, documents, alertes et recommandation IA."
      action="Creer"
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Elements actifs", value: "0", change: "Suivi centralise" },
          { label: "A traiter", value: "0", change: "Priorite IA" },
          { label: "Alertes", value: "0", change: "Aucun risque critique" },
          { label: "Documents", value: "0", change: "Pieces jointes" },
        ].map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <div className="mt-8">
        <FilterBar
          searchPlaceholder={`Rechercher dans ${module.name.toLowerCase()}...`}
          filters={[
            { label: "Statut", options: [{ label: "Tous", value: "all" }, { label: "Actif", value: "active" }, { label: "En attente", value: "pending" }] },
            { label: "Responsable", options: [{ label: "Tous", value: "all" }, { label: "Equipe", value: "team" }, { label: "Manager", value: "manager" }] },
          ]}
          actions={
            <>
              <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-night">Exporter</button>
              <button className="rounded-xl bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">Archiver</button>
            </>
          }
        />
      </div>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-black text-night">Tableau {module.name}</h2>
          <DataGrid
            columns={[
              { key: "reference", label: "Reference" },
              { key: "name", label: "Nom" },
              { key: "owner", label: "Responsable" },
              { key: "amount", label: "Montant" },
              { key: "status", label: "Statut", badge: true },
            ]}
            data={tableRows}
            actions={() => (
              <div className="flex gap-2">
                <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">Consulter</button>
                <button className="rounded-lg bg-[#00C2A9]/10 px-3 py-1.5 text-xs font-black text-[#008f7d]">Modifier</button>
              </div>
            )}
          />
        </div>

        <DetailsDrawer
          title={`Fiche ${module.name}`}
          description="La fiche detaillee regroupe les informations, documents, activites, paiements et notes du module."
          details={[
            { label: "Statut", value: "Actif" },
            { label: "Responsable", value: "Manager" },
            { label: "Derniere activite", value: "Aujourd'hui" },
            { label: "Permissions", value: "Controlees par role" },
          ]}
        />
      </section>

      <section className="mt-8">
        <Kanban
          columns={workflow.map((step, index) => ({
            title: step,
            cards: index < 3 ? [{ title: `${module.name} ${index + 1}`, subtitle: "Element de demonstration", amount: "0 EUR", meta: "Aujourd'hui" }] : [],
          }))}
        />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <AlertPanel
          alerts={[
            { title: "Controle des donnees", description: "Aucune anomalie critique detectee pour ce module.", level: "info" },
            { title: "Workflow incomplet", description: "Configurez les statuts et validations selon le secteur.", level: "warning" },
          ]}
        />
        <AIRecommendation
          text="L'IA recommande de configurer les champs obligatoires, les statuts et les alertes automatiques avant la mise en production."
          actions={["Configurer workflow", "Creer modele", "Planifier rapport"]}
        />
        <AttachmentManager
          attachments={[
            { name: "Modele document.pdf", type: "PDF", size: "120 KB" },
            { name: "Export exemple.xlsx", type: "Excel", size: "84 KB" },
          ]}
        />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <FormModal
          title={`Formulaire ${module.name}`}
          fields={[
            { label: "Nom", placeholder: "Nom de l'element" },
            { label: "Responsable", placeholder: "Responsable" },
            { label: "Date", type: "date" },
            { label: "Montant", type: "number", placeholder: "0" },
          ]}
        />
        <ActivityTimeline
          items={[
            { title: "Creation du module", description: "Structure standard appliquee a la page metier.", date: "Aujourd'hui" },
            { title: "Controle des permissions", description: "Les roles pourront limiter creation, lecture, modification et archivage.", date: "Aujourd'hui" },
            { title: "Preparation reporting", description: "Les exports PDF, Excel et CSV seront branches sur ce module.", date: "A planifier" },
          ]}
        />
      </section>
    </ERPLayout>
  );
}
