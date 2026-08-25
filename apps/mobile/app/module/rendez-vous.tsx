import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function AppointmentsScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rendez-vous"
      subtitleKey="screen.appointments.subtitle"
      icon="calendar-number-outline"
      metrics={[
        { labelKey: "screen.appointments.today", value: "24", hintKey: "trend.today" },
        { labelKey: "screen.appointments.available", value: "8", hintKey: "common.available" },
        { labelKey: "screen.appointments.waiting", value: "5", hintKey: "trend.priority" },
      ]}
      sections={[
        { titleKey: "screen.appointments.agendaTitle", items: ["screen.appointments.agenda.1", "screen.appointments.agenda.2", "screen.appointments.agenda.3", "screen.appointments.agenda.4"] },
        { titleKey: "screen.appointments.followTitle", items: ["screen.appointments.follow.1", "screen.appointments.follow.2", "screen.appointments.follow.3"] },
      ]}
      aiKey="screen.appointments.ai"
      apiModule="appointments"
    />
  );
}
