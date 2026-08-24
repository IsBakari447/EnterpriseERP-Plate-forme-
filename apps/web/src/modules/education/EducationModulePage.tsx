"use client";

import { useEffect, useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import AIRecommendation from "@shared/components/ui/AIRecommendation";
import AlertPanel from "@shared/components/ui/AlertPanel";
import DataGrid from "@shared/components/ui/DataGrid";
import FormModal, { type FormField } from "@shared/components/ui/FormModal";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import type { ModuleKey } from "@shared/sector/types";
import { educationService, type EducationRecord } from "./education.service";

type ModuleView = {
  key: ModuleKey;
  name: string;
  icon: string;
};

type Metric = {
  label: string;
  value: string;
  change?: string;
};

type GridRow = Record<string, string | number | undefined>;

type EducationApiRecord = Record<string, string | number | boolean | null | undefined | string[]>;

type EducationStudentApiRecord = EducationApiRecord & {
  id?: string;
  matricule?: string;
  firstName?: string;
  lastName?: string;
  className?: string | null;
  level?: string | null;
  guardianName?: string | null;
  phone?: string | null;
  balance?: number | null;
  status?: string | null;
};

const moduleResourceMap: Partial<Record<ModuleKey, "students" | "teachers" | "classes" | "courses" | "schedule" | "exams" | "attendance" | "fees">> = {
  etudiants: "students",
  enseignants: "teachers",
  classes: "classes",
  cours: "courses",
  "emploi-du-temps": "schedule",
  examens: "exams",
  presences: "attendance",
  "frais-scolaires": "fees",
};

type EducationModuleConfig = {
  title: string;
  subtitle: string;
  action: string;
  metrics: Metric[];
  columns: { key: string; label: string; badge?: boolean }[];
  rows: GridRow[];
  fields: FormField[];
  insight: string;
  alertTitle: string;
  alerts: { title: string; description: string; level?: "info" | "warning" | "critical" }[];
  custom?: "classes" | "schedule" | "attendance" | "fees";
};

const educationConfigs: Record<string, EducationModuleConfig> = {
  etudiants: {
    title: "Gestion des etudiants",
    subtitle: "Vue 360 des inscriptions, classes, responsables, soldes et documents.",
    action: "Ajouter un etudiant",
    metrics: [
      { label: "Total etudiants", value: "1 280", change: "+6%" },
      { label: "Nouvelles inscriptions", value: "48", change: "30 jours" },
      { label: "Etudiants actifs", value: "1 214", change: "Actif" },
      { label: "Absences", value: "37", change: "A suivre" },
      { label: "Frais impayes", value: "27", change: "Relance" },
    ],
    columns: [
      { key: "matricule", label: "Matricule" },
      { key: "name", label: "Nom" },
      { key: "className", label: "Classe" },
      { key: "level", label: "Niveau" },
      { key: "guardian", label: "Parent / responsable" },
      { key: "phone", label: "Telephone" },
      { key: "balance", label: "Solde" },
      { key: "status", label: "Statut", badge: true },
    ],
    rows: [
      { matricule: "STU-1001", name: "Anna Svensson", className: "6A", level: "Secondaire", guardian: "Maria Svensson", phone: "+46 70 110 22 33", balance: "0 EUR", status: "Actif" },
      { matricule: "STU-1002", name: "David Martin", className: "6A", level: "Secondaire", guardian: "Lucas Martin", phone: "+46 70 330 44 55", balance: "420 EUR", status: "A relancer" },
      { matricule: "STU-1003", name: "Sara Lindstrom", className: "7B", level: "College", guardian: "Emma Lindstrom", phone: "+46 70 660 77 88", balance: "120 EUR", status: "Actif" },
    ],
    fields: [
      { label: "Prenom" },
      { label: "Nom" },
      { label: "Date de naissance", type: "date" },
      { label: "Sexe" },
      { label: "Matricule" },
      { label: "Classe" },
      { label: "Niveau" },
      { label: "Parent / tuteur" },
      { label: "Telephone" },
      { label: "Email", type: "email" },
      { label: "Date d'inscription", type: "date" },
      { label: "Statut" },
    ],
    insight: "L'IA signale 12 etudiants avec un taux d'absence inhabituel et 27 frais scolaires a relancer.",
    alertTitle: "Alertes etudiants",
    alerts: [
      { title: "Absences inhabituelles", description: "12 etudiants depassent le seuil d'absence mensuel.", level: "warning" },
      { title: "Frais impayes", description: "27 soldes doivent etre relances cette semaine.", level: "critical" },
    ],
  },
  enseignants: {
    title: "Gestion des enseignants",
    subtitle: "Suivez les enseignants, specialites, matieres, contrats et disponibilites.",
    action: "Ajouter un enseignant",
    metrics: [
      { label: "Enseignants actifs", value: "84", change: "+4" },
      { label: "Temps plein", value: "62", change: "Stable" },
      { label: "Temps partiel", value: "22", change: "+2" },
      { label: "Cours attribues", value: "146", change: "A jour" },
      { label: "Absences", value: "5", change: "A suivre" },
    ],
    columns: [
      { key: "teacherId", label: "ID" },
      { key: "name", label: "Nom" },
      { key: "specialty", label: "Specialite" },
      { key: "subjects", label: "Matieres" },
      { key: "classes", label: "Classes" },
      { key: "phone", label: "Telephone" },
      { key: "email", label: "Email" },
      { key: "status", label: "Statut", badge: true },
    ],
    rows: [
      { teacherId: "TEA-021", name: "Anna Karlsson", specialty: "Mathematiques", subjects: "Maths, Physique", classes: "6A, 7B", phone: "+46 70 100 10 10", email: "anna@school.test", status: "Actif" },
      { teacherId: "TEA-022", name: "Jean Morel", specialty: "Langues", subjects: "Francais, Anglais", classes: "6A", phone: "+46 70 200 20 20", email: "jean@school.test", status: "Actif" },
      { teacherId: "TEA-023", name: "Sara Ahmed", specialty: "Sciences", subjects: "Biologie", classes: "8C", phone: "+46 70 300 30 30", email: "sara@school.test", status: "Conge" },
    ],
    fields: [
      { label: "Nom" },
      { label: "Prenom" },
      { label: "Email", type: "email" },
      { label: "Telephone" },
      { label: "Specialite" },
      { label: "Matieres" },
      { label: "Type de contrat" },
      { label: "Date d'embauche", type: "date" },
      { label: "Salaire", type: "number" },
      { label: "Classes" },
      { label: "Disponibilites" },
    ],
    insight: "L'IA recommande de redistribuer deux cours pour eviter une surcharge sur les enseignants de sciences.",
    alertTitle: "Alertes enseignants",
    alerts: [
      { title: "Disponibilites incompletes", description: "3 enseignants n'ont pas valide leur disponibilite.", level: "warning" },
      { title: "Remplacement a planifier", description: "Une absence enseignant est prevue vendredi.", level: "info" },
    ],
  },
  classes: {
    title: "Gestion des classes",
    subtitle: "Pilotez les classes, capacites, responsables, salles et taux d'occupation.",
    action: "Creer une classe",
    custom: "classes",
    metrics: [
      { label: "Nombre de classes", value: "42", change: "+2" },
      { label: "Etudiants", value: "1 280", change: "91% occupation" },
      { label: "Capacite totale", value: "1 420", change: "+80 places" },
      { label: "Taux d'occupation", value: "90%", change: "Bon" },
      { label: "Classes sans enseignant", value: "3", change: "A affecter" },
    ],
    columns: [],
    rows: [],
    fields: [
      { label: "Nom de la classe" },
      { label: "Niveau" },
      { label: "Capacite", type: "number" },
      { label: "Responsable" },
      { label: "Salle" },
    ],
    insight: "L'IA suggere d'ouvrir une classe supplementaire en niveau secondaire pour reduire la surcharge.",
    alertTitle: "Alertes classes",
    alerts: [
      { title: "Classes sans enseignant", description: "3 classes attendent un responsable pedagogique.", level: "warning" },
    ],
  },
  "emploi-du-temps": {
    title: "Calendrier academique",
    subtitle: "Organisez les cours par jour, semaine, mois, classe, enseignant et salle.",
    action: "Ajouter un cours au planning",
    custom: "schedule",
    metrics: [
      { label: "Cours cette semaine", value: "214", change: "+8" },
      { label: "Conflits detectes", value: "3", change: "A corriger" },
      { label: "Salles occupees", value: "78%", change: "Temps reel" },
      { label: "Enseignants planifies", value: "82", change: "A jour" },
    ],
    columns: [],
    rows: [],
    fields: [
      { label: "Cours" },
      { label: "Classe" },
      { label: "Enseignant" },
      { label: "Salle" },
      { label: "Date", type: "date" },
      { label: "Heure debut" },
      { label: "Heure fin" },
      { label: "Recurrence" },
    ],
    insight: "L'IA detecte 3 conflits possibles entre enseignants, salles et classes sur la semaine.",
    alertTitle: "Conflits planning",
    alerts: [
      { title: "Enseignant deja affecte", description: "Anna Karlsson est affectee a deux cours lundi a 08:00.", level: "critical" },
      { title: "Salle occupee", description: "La salle B204 est occupee mercredi a 10:00.", level: "warning" },
    ],
  },
  examens: {
    title: "Examens et resultats",
    subtitle: "Planifiez les evaluations, saisissez les notes et publiez les resultats.",
    action: "Creer un examen",
    metrics: [
      { label: "Examens programmes", value: "42", change: "8 a valider" },
      { label: "Examens termines", value: "18", change: "+6" },
      { label: "Resultats publies", value: "14", change: "A jour" },
      { label: "Moyenne generale", value: "14.8/20", change: "+0.7" },
      { label: "Taux de reussite", value: "87%", change: "+5 pts" },
    ],
    columns: [
      { key: "exam", label: "Examen" },
      { key: "subject", label: "Matiere" },
      { key: "className", label: "Classe" },
      { key: "date", label: "Date" },
      { key: "teacher", label: "Enseignant" },
      { key: "participants", label: "Participants" },
      { key: "average", label: "Moyenne" },
      { key: "status", label: "Statut", badge: true },
    ],
    rows: [
      { exam: "EX-041", subject: "Mathematiques", className: "6A", date: "2026-08-27", teacher: "Anna Karlsson", participants: 28, average: "15.2/20", status: "Programme" },
      { exam: "EX-042", subject: "Anglais", className: "7B", date: "2026-08-30", teacher: "Jean Morel", participants: 31, average: "14.1/20", status: "Brouillon" },
    ],
    fields: [
      { label: "Examen" },
      { label: "Matiere" },
      { label: "Classe" },
      { label: "Date", type: "date" },
      { label: "Enseignant" },
      { label: "Bareme" },
    ],
    insight: "L'IA recommande de publier les resultats valides et de relancer les enseignants qui n'ont pas saisi les notes.",
    alertTitle: "Alertes examens",
    alerts: [
      { title: "Notes manquantes", description: "2 examens attendent la saisie des notes.", level: "warning" },
    ],
  },
  cours: {
    title: "Catalogue des cours",
    subtitle: "Structurez les matieres, niveaux, volumes horaires et enseignants affectes.",
    action: "Creer un cours",
    metrics: [
      { label: "Cours actifs", value: "96", change: "+4" },
      { label: "Matieres", value: "18", change: "Stable" },
      { label: "Heures par semaine", value: "640", change: "+32" },
      { label: "Enseignants affectes", value: "82", change: "A jour" },
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "course", label: "Cours" },
      { key: "subject", label: "Matiere" },
      { key: "level", label: "Niveau" },
      { key: "teacher", label: "Enseignant" },
      { key: "hours", label: "Heures" },
      { key: "status", label: "Statut", badge: true },
    ],
    rows: [
      { code: "MAT-6A", course: "Mathematiques 6A", subject: "Mathematiques", level: "Secondaire", teacher: "Anna Karlsson", hours: "6h", status: "Actif" },
      { code: "ENG-7B", course: "Anglais 7B", subject: "Langues", level: "College", teacher: "Jean Morel", hours: "4h", status: "Actif" },
    ],
    fields: [
      { label: "Nom" },
      { label: "Code" },
      { label: "Description" },
      { label: "Niveau" },
      { label: "Matiere" },
      { label: "Enseignant" },
      { label: "Volume horaire" },
      { label: "Programme" },
    ],
    insight: "L'IA suggere d'equilibrer les volumes horaires entre classes 6A et 7B.",
    alertTitle: "Alertes cours",
    alerts: [
      { title: "Programme incomplet", description: "4 cours n'ont pas encore de programme attache.", level: "info" },
    ],
  },
  presences: {
    title: "Presences et retards",
    subtitle: "Saisissez rapidement les presences par classe, jour et periode.",
    action: "Saisir les presences",
    custom: "attendance",
    metrics: [
      { label: "Presence", value: "94.8%", change: "+3 pts" },
      { label: "Absences", value: "37", change: "A justifier" },
      { label: "Retards", value: "18", change: "Aujourd'hui" },
      { label: "Absences non justifiees", value: "9", change: "Priorite" },
    ],
    columns: [],
    rows: [],
    fields: [
      { label: "Classe" },
      { label: "Date", type: "date" },
      { label: "Etudiant" },
      { label: "Statut" },
      { label: "Justification" },
    ],
    insight: "L'IA signale une hausse des retards le lundi matin et recommande une notification aux parents.",
    alertTitle: "Alertes presences",
    alerts: [
      { title: "Absences non justifiees", description: "9 absences doivent etre justifiees avant vendredi.", level: "critical" },
    ],
  },
  "frais-scolaires": {
    title: "Frais scolaires et paiements",
    subtitle: "Suivez les frais attendus, encaissements, soldes et relances familles.",
    action: "Enregistrer un paiement",
    custom: "fees",
    metrics: [
      { label: "Frais attendus", value: "940 000 EUR", change: "Annee scolaire" },
      { label: "Frais encaisses", value: "714 000 EUR", change: "76%" },
      { label: "Impayes", value: "126 000 EUR", change: "A relancer" },
      { label: "Paiements aujourd'hui", value: "18", change: "+7" },
      { label: "Etudiants en retard", value: "27", change: "Priorite" },
    ],
    columns: [
      { key: "student", label: "Etudiant" },
      { key: "className", label: "Classe" },
      { key: "fee", label: "Frais" },
      { key: "amount", label: "Montant" },
      { key: "paid", label: "Paye" },
      { key: "balance", label: "Solde" },
      { key: "dueDate", label: "Echeance" },
      { key: "status", label: "Statut", badge: true },
    ],
    rows: [
      { student: "Anna Svensson", className: "6A", fee: "Trimestre 1", amount: "1 200 EUR", paid: "1 200 EUR", balance: "0 EUR", dueDate: "2026-09-01", status: "Paye" },
      { student: "David Martin", className: "6A", fee: "Trimestre 1", amount: "1 200 EUR", paid: "780 EUR", balance: "420 EUR", dueDate: "2026-09-01", status: "A relancer" },
    ],
    fields: [
      { label: "Etudiant" },
      { label: "Classe" },
      { label: "Frais" },
      { label: "Montant", type: "number" },
      { label: "Paiement", type: "number" },
      { label: "Echeance", type: "date" },
      { label: "Mode de paiement" },
    ],
    insight: "L'IA recommande d'envoyer un rappel aux 27 familles en retard et de generer les recus automatiquement.",
    alertTitle: "Alertes frais scolaires",
    alerts: [
      { title: "Relances familles", description: "27 familles doivent recevoir un rappel de paiement.", level: "warning" },
    ],
  },
};

function tx(locale: ReturnType<typeof useI18n>["locale"], value: string) {
  return translateContentText(translateFixedLabel(value, locale), locale);
}

function studentToGridRow(student: EducationStudentApiRecord): GridRow {
  const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ").trim();

  return {
    id: student.id,
    matricule: student.matricule,
    name: fullName || student.matricule,
    className: student.className ?? "",
    level: student.level ?? "",
    guardian: student.guardianName ?? "",
    phone: student.phone ?? "",
    balance: `${student.balance ?? 0} EUR`,
    status: student.status ?? "Actif",
  };
}

function apiRecordToGridRow(resource: string, record: EducationApiRecord): GridRow {
  if (resource === "students") {
    return studentToGridRow(record as EducationStudentApiRecord);
  }

  if (resource === "teachers") {
    const name = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();

    return {
      id: String(record.id ?? ""),
      teacherId: String(record.teacherCode ?? ""),
      name,
      specialty: String(record.specialty ?? ""),
      subjects: Array.isArray(record.subjects) ? record.subjects.join(", ") : String(record.subjects ?? ""),
      classes: Array.isArray(record.classes) ? record.classes.join(", ") : String(record.classes ?? ""),
      phone: String(record.phone ?? ""),
      email: String(record.email ?? ""),
      status: String(record.status ?? "Actif"),
    };
  }

  if (resource === "courses") {
    return {
      id: String(record.id ?? ""),
      code: String(record.code ?? ""),
      course: String(record.name ?? ""),
      subject: String(record.subject ?? ""),
      level: String(record.level ?? ""),
      teacher: String(record.teacherName ?? ""),
      hours: record.weeklyHours ? `${record.weeklyHours}h` : "",
      status: String(record.status ?? "Actif"),
    };
  }

  if (resource === "classes") {
    return {
      id: String(record.id ?? ""),
      name: String(record.name ?? ""),
      students: "0 etudiants",
      capacity: `${record.capacity ?? 0} places`,
      owner: String(record.teacherName ?? ""),
      room: String(record.room ?? ""),
      level: String(record.level ?? ""),
      status: String(record.status ?? "Actif"),
    };
  }

  if (resource === "schedule") {
    return {
      id: String(record.id ?? ""),
      time: String(record.startTime ?? ""),
      monday: `${record.courseName ?? ""} - ${record.className ?? ""}`,
      teacher: String(record.teacherName ?? ""),
      room: String(record.room ?? ""),
      status: String(record.status ?? "Planifie"),
    };
  }

  if (resource === "attendance") {
    return {
      id: String(record.id ?? ""),
      student: String(record.studentName ?? ""),
      className: String(record.className ?? ""),
      date: String(record.date ?? "").slice(0, 10),
      status: String(record.status ?? ""),
      justification: String(record.justification ?? ""),
      teacher: String(record.teacherName ?? ""),
    };
  }

  if (resource === "exams") {
    return {
      id: String(record.id ?? ""),
      exam: String(record.title ?? ""),
      subject: String(record.subject ?? ""),
      className: String(record.className ?? ""),
      date: String(record.date ?? "").slice(0, 10),
      teacher: String(record.teacherName ?? ""),
      participants: Number(record.participants ?? 0),
      average: record.average ? `${record.average}/20` : "",
      status: String(record.status ?? "Programme"),
    };
  }

  if (resource === "fees") {
    const amount = Number(record.amount ?? 0);
    const paid = Number(record.paid ?? 0);

    return {
      id: String(record.id ?? ""),
      student: String(record.studentName ?? ""),
      className: String(record.className ?? ""),
      fee: String(record.feeName ?? ""),
      amount: `${amount} EUR`,
      paid: `${paid} EUR`,
      balance: `${Math.max(amount - paid, 0)} EUR`,
      dueDate: String(record.dueDate ?? "").slice(0, 10),
      status: String(record.status ?? "A relancer"),
    };
  }

  return {
    id: String(record.id ?? ""),
    name: String(record.name ?? ""),
    status: String(record.status ?? "Actif"),
  };
}

function formToPayload(moduleKey: ModuleKey, values: Record<string, string>): EducationRecord {
  if (moduleKey === "etudiants") {
    return {
      firstName: values.Prenom,
      lastName: values.Nom,
      birthDate: values["Date de naissance"] || undefined,
      gender: values.Sexe,
      matricule: values.Matricule || `STU-${Date.now()}`,
      className: values.Classe,
      level: values.Niveau,
      guardianName: values["Parent / tuteur"],
      phone: values.Telephone,
      email: values.Email,
      enrollmentDate: values["Date d'inscription"] || undefined,
      status: values.Statut || "Actif",
      balance: 0,
    };
  }

  if (moduleKey === "enseignants") {
    return {
      teacherCode: `TEA-${Date.now()}`,
      firstName: values.Prenom,
      lastName: values.Nom,
      email: values.Email,
      phone: values.Telephone,
      specialty: values.Specialite,
      subjects: values.Matieres,
      contractType: values["Type de contrat"],
      hireDate: values["Date d'embauche"] || undefined,
      salary: values.Salaire ? Number(values.Salaire) : undefined,
      classes: values.Classes,
      status: "Actif",
    };
  }

  if (moduleKey === "cours") {
    return {
      code: values.Code || `CRS-${Date.now()}`,
      name: values.Nom,
      description: values.Description,
      level: values.Niveau,
      subject: values.Matiere,
      teacherName: values.Enseignant,
      weeklyHours: values["Volume horaire"] ? Number(values["Volume horaire"]) : undefined,
      program: values.Programme,
      status: "Actif",
    };
  }

  if (moduleKey === "examens") {
    return {
      title: values.Examen,
      subject: values.Matiere,
      className: values.Classe,
      date: values.Date || new Date().toISOString(),
      teacherName: values.Enseignant,
      participants: 0,
      status: "Programme",
    };
  }

  if (moduleKey === "classes") {
    return {
      name: values["Nom de la classe"] || values.Classe || `Classe-${Date.now()}`,
      level: values.Niveau,
      capacity: values.Capacite ? Number(values.Capacite) : 0,
      teacherName: values.Responsable,
      room: values.Salle,
      status: "Actif",
    };
  }

  if (moduleKey === "emploi-du-temps") {
    return {
      courseName: values.Cours,
      className: values.Classe,
      teacherName: values.Enseignant,
      room: values.Salle,
      date: values.Date || new Date().toISOString(),
      startTime: values["Heure debut"] || "08:00",
      endTime: values["Heure fin"] || "09:00",
      recurrence: values.Recurrence,
      status: "Planifie",
    };
  }

  if (moduleKey === "presences") {
    return {
      className: values.Classe,
      date: values.Date || new Date().toISOString(),
      studentName: values.Etudiant,
      status: values.Statut || "Present",
      justification: values.Justification,
    };
  }

  if (moduleKey === "frais-scolaires") {
    return {
      studentName: values.Etudiant,
      className: values.Classe,
      feeName: values.Frais,
      amount: values.Montant ? Number(values.Montant) : 0,
      paid: values.Paiement ? Number(values.Paiement) : 0,
      dueDate: values.Echeance || undefined,
      paymentMethod: values["Mode de paiement"],
      status: "A relancer",
    };
  }

  return {
    name: values.Nom || values.Titre || values.Classe || `EDU-${Date.now()}`,
    status: "Actif",
  };
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <KPICard key={metric.label} {...metric} />
      ))}
    </section>
  );
}

function ClassCards({ rows }: { rows?: GridRow[] }) {
  const { locale } = useI18n();
  const fallbackClasses = [
    { name: "Class 6A", students: "28 etudiants", capacity: "30 places", owner: "Anna Svensson", room: "B204" },
    { name: "Class 7B", students: "31 etudiants", capacity: "32 places", owner: "Jean Morel", room: "C108" },
    { name: "Class 8C", students: "26 etudiants", capacity: "30 places", owner: "Sara Ahmed", room: "A112" },
  ];
  const classes = rows
    ? rows.map((row) => ({
        name: String(row.name ?? ""),
        students: String(row.students ?? "0 etudiants"),
        capacity: String(row.capacity ?? "0 places"),
        owner: String(row.owner ?? ""),
        room: String(row.room ?? ""),
      }))
    : fallbackClasses;

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {classes.map((classItem) => (
        <article key={classItem.name} className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h3 className="text-2xl font-black text-night">{tx(locale, classItem.name)}</h3>
          <p className="mt-3 font-bold text-slate-600">{tx(locale, classItem.students)} / {tx(locale, classItem.capacity)}</p>
          <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
            <p>{tx(locale, "Responsable")}: <span className="text-night">{classItem.owner}</span></p>
            <p>{tx(locale, "Salle")}: <span className="text-night">{classItem.room}</span></p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Voir etudiants", "Affecter enseignant", "Emploi du temps", "Modifier"].map((action) => (
              <button key={action} type="button" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-cyan-50">
                {tx(locale, action)}
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function ScheduleGrid({ rows }: { rows?: GridRow[] }) {
  const { locale } = useI18n();
  const fallbackTimes = [
    { time: "08:00", monday: "Maths - Class 6A", tuesday: "English - Class 6A", wednesday: "Physics - Class 7B" },
    { time: "10:00", monday: "French - Class 6A", tuesday: "Maths - Class 7B", wednesday: "Chemistry - Class 8C" },
    { time: "13:00", monday: "History - Class 7B", tuesday: "Sport - Class 6A", wednesday: "English - Class 8C" },
  ];
  const times = rows
    ? rows.map((row) => ({
        time: String(row.time ?? ""),
        monday: String(row.monday ?? ""),
        tuesday: String(row.teacher ?? ""),
        wednesday: String(row.room ?? ""),
      }))
    : fallbackTimes;

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="mb-5 flex flex-wrap gap-2">
        {["Jour", "Semaine", "Mois", "Classe", "Enseignant", "Salle"].map((view, index) => (
          <button key={view} type="button" className={`rounded-full px-4 py-2 text-sm font-black ${index === 1 ? "bg-[#1E2A38] text-white" : "bg-slate-100 text-slate-700"}`}>
            {tx(locale, view)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="text-sm text-slate-500">
            <tr>
              {["Heure", "Lundi", "Mardi", "Mercredi"].map((head) => <th key={head} className="p-4">{tx(locale, head)}</th>)}
            </tr>
          </thead>
          <tbody>
            {times.map((entry) => (
              <tr key={entry.time} className="border-t border-slate-100">
                <td className="p-4 font-black text-night">{entry.time}</td>
                <td className="p-4 font-bold text-slate-700">{tx(locale, entry.monday)}</td>
                <td className="p-4 font-bold text-slate-700">{tx(locale, entry.tuesday)}</td>
                <td className="p-4 font-bold text-slate-700">{tx(locale, entry.wednesday)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttendanceBoard({ rows: apiRows }: { rows?: GridRow[] }) {
  const { locale } = useI18n();
  const fallbackRows = [
    ["Anna Svensson", "Present"],
    ["David Martin", "Absent"],
    ["Maria Nilsson", "Late"],
    ["John Eriksson", "Present"],
  ];
  const rows = apiRows
    ? apiRows.map((row) => [String(row.student ?? ""), String(row.status ?? "")])
    : fallbackRows;

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-night">{tx(locale, "Class 6A")}</h2>
          <p className="text-sm font-semibold text-slate-500">24 August 2026</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Aujourd'hui", "7 jours", "30 jours", "Trimestre", "Annee"].map((filter) => (
            <button key={filter} type="button" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">
              {tx(locale, filter)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {rows.map(([student, status]) => (
          <div key={student} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 font-bold">
            <span>{student}</span>
            <span className={status === "Present" ? "text-emerald-600" : status === "Late" ? "text-amber-600" : "text-red-600"}>
              {tx(locale, status)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function EducationModulePage({ module }: { module: ModuleView }) {
  const { locale } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [apiRows, setApiRows] = useState<GridRow[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const config = educationConfigs[module.key] ?? educationConfigs.etudiants;
  const resource = moduleResourceMap[module.key];
  const displayedRows = resource && apiRows ? apiRows : config.rows;
  const translatedColumns = useMemo(
    () => config.columns.map((column) => ({ ...column, key: column.key as keyof GridRow })),
    [config.columns]
  );

  async function loadResource() {
    if (!resource) return;

    try {
      const records = await educationService.list<EducationApiRecord>(resource);
      setApiRows(records.map((record) => apiRecordToGridRow(resource, record)));
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load data from the API.");
    }
  }

  useEffect(() => {
    if (resource) {
      void loadResource();
    }
  }, [module.key, resource]);

  async function submitEducationForm(values: Record<string, string>) {
    if (!resource) {
      return;
    }

    const created = await educationService.create<EducationApiRecord>(resource, formToPayload(module.key, values));
    setApiRows((currentRows) => [apiRecordToGridRow(resource, created), ...(currentRows ?? [])]);
  }

  return (
    <ERPLayout
      title={`${module.icon} ${tx(locale, config.title)}`}
      subtitle={tx(locale, config.subtitle)}
      action={tx(locale, config.action)}
      onAction={() => setShowForm((value) => !value)}
    >
      <MetricGrid metrics={config.metrics} />

      <section className="mt-8">
        {loadError && resource && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-600">
            {tx(locale, loadError)}
          </p>
        )}
        {config.custom === "classes" && <ClassCards rows={apiRows ?? undefined} />}
        {config.custom === "schedule" && <ScheduleGrid rows={apiRows ?? undefined} />}
        {config.custom === "attendance" && <AttendanceBoard rows={apiRows ?? undefined} />}
        {config.custom !== "classes" && config.custom !== "schedule" && config.custom !== "attendance" && (
          <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="mb-5 text-xl font-black text-night">{tx(locale, config.title)}</h2>
            <DataGrid columns={translatedColumns} data={displayedRows} actions={() => (
              <div className="flex flex-wrap gap-2">
                {["Voir", "Modifier", "Documents"].map((action) => (
                  <button key={action} type="button" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-cyan-50">
                    {tx(locale, action)}
                  </button>
                ))}
              </div>
            )} />
          </section>
        )}
      </section>

      {showForm && (
        <section className="mt-8">
          <FormModal title={config.action} fields={config.fields} submitLabel={config.action} onSubmit={submitEducationForm} />
        </section>
      )}

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <AlertPanel title={config.alertTitle} alerts={config.alerts} />
        <AIRecommendation text={config.insight} actions={["Voir", "Notifier", "Exporter PDF"]} />
      </section>
    </ERPLayout>
  );
}
