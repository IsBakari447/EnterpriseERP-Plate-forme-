import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function AppointmentsScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rendez-vous"
      subtitleKey="screen.appointments.subtitle"
      icon="calendar-number-outline"
      aiKey="screen.appointments.ai"
      apiModule="appointments"
    />
  );
}
