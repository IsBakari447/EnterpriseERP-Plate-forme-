import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moduleMeta } from "@/config/modules";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { colors } from "@/theme";
import type { ModuleKey, SectorKey } from "@/types/sector";

const sectorWorkspaceKeys: Record<SectorKey, string[]> = {
  general: ["workspace.general.pipeline", "workspace.general.cash", "workspace.general.team", "workspace.general.support"],
  restaurant: ["workspace.restaurant.tables", "workspace.restaurant.kitchen", "workspace.restaurant.orders", "workspace.restaurant.cash"],
  commerce: ["workspace.commerce.pos", "workspace.commerce.catalog", "workspace.commerce.stock", "workspace.commerce.returns"],
  construction: ["workspace.construction.sites", "workspace.construction.budget", "workspace.construction.materials", "workspace.construction.team"],
  sante: ["workspace.sante.appointments", "workspace.sante.records", "workspace.sante.billing", "workspace.sante.pharmacy"],
  education: ["workspace.education.students", "workspace.education.schedule", "workspace.education.fees", "workspace.education.attendance"],
  transport: ["workspace.transport.shipments", "workspace.transport.fleet", "workspace.transport.routes", "workspace.transport.proofs"],
  industrie: ["workspace.industrie.production", "workspace.industrie.machines", "workspace.industrie.materials", "workspace.industrie.quality"],
  hotel: ["workspace.hotel.bookings", "workspace.hotel.rooms", "workspace.hotel.housekeeping", "workspace.hotel.billing"],
};

const flowKeys = ["flow.capture", "flow.validate", "flow.assign", "flow.close"];

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: ModuleKey }>();
  const { sector } = useSector();
  const { t } = useLanguage();
  const moduleId = id && id in moduleMeta ? id : "dashboard";
  const module = moduleMeta[moduleId];
  const title = t(module.labelKey);
  const workspaceKeys = sectorWorkspaceKeys[sector.key];

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title }} />

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={[styles.icon, { backgroundColor: `${sector.accent}22` }]}>
              <Ionicons name={module.icon as never} size={32} color={sector.accent} />
            </View>

            <View style={styles.liveBadge}>
              <View style={[styles.liveDot, { backgroundColor: sector.accent }]} />
              <Text style={styles.liveText}>{t("module.statusLive")}</Text>
            </View>
          </View>

          <Text style={[styles.eyebrow, { color: sector.accent }]}>{t(sector.labelKey)}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{t("module.businessSubtitle")}</Text>
        </View>

        <View style={styles.kpiGrid}>
          {sector.kpis.map((kpi) => (
            <View key={kpi.key} style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{t(kpi.labelKey)}</Text>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={[styles.kpiTrend, { color: sector.accent }]}>{t(kpi.trendKey)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>{t("module.workspaceLabel")}</Text>
          <Text style={styles.cardTitle}>{t("module.workspaceTitle")}</Text>

          <View style={styles.workspaceGrid}>
            {workspaceKeys.map((key, index) => (
              <View key={key} style={styles.workspaceTile}>
                <View style={[styles.workspaceIcon, { backgroundColor: `${sector.accent}18` }]}>
                  <Text style={[styles.workspaceIndex, { color: sector.accent }]}>0{index + 1}</Text>
                </View>
                <Text style={styles.workspaceText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>{t("module.workflow")}</Text>
          <View style={styles.flowLine}>
            {flowKeys.map((key, index) => (
              <View key={key} style={styles.flowStep}>
                <View style={[styles.flowNumber, { backgroundColor: index === 0 ? sector.accent : "#EEF3F8" }]}>
                  <Text style={[styles.flowNumberText, index === 0 ? styles.flowNumberTextActive : null]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.flowText}>{t(key)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("module.priorityTitle")}</Text>
          {sector.priorityActionKeys.map((actionKey) => (
            <View key={actionKey} style={styles.actionRow}>
              <View style={[styles.actionIcon, { backgroundColor: `${sector.accent}18` }]}>
                <Ionicons name="flash-outline" size={18} color={sector.accent} />
              </View>
              <Text style={styles.actionText}>{t(actionKey)}</Text>
              <Text style={[styles.actionCta, { color: sector.accent }]}>{t("common.see")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.split}>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("module.recentTitle")}</Text>
            {sector.recentActivityKeys.map((activityKey) => (
              <View key={activityKey} style={styles.timelineRow}>
                <View style={[styles.timelineDot, { backgroundColor: sector.accent }]} />
                <Text style={styles.timelineText}>{t(activityKey)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.aiPanel}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>IA</Text>
            </View>
            <Text style={styles.aiTitle}>{t("module.aiTitle")}</Text>
            <Text style={styles.aiText}>{t(`module.ai.${sector.key}`)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("module.documentsTitle")}</Text>
          {["module.document.report", "module.document.photo", "module.document.signature"].map((documentKey) => (
            <View key={documentKey} style={styles.documentRow}>
              <Ionicons name="document-text-outline" size={19} color={colors.muted} />
              <Text style={styles.documentText}>{t(documentKey)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { padding: 20, paddingBottom: 34 },
  hero: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: "#31445C",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#24364B",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    color: "white",
    fontSize: 11,
    fontWeight: "900",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 18,
  },
  title: { color: "white", fontWeight: "900", fontSize: 31, marginTop: 8, lineHeight: 38 },
  subtitle: { color: "#D6E4F3", lineHeight: 22, marginTop: 10 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 },
  kpiCard: {
    width: "31%",
    minHeight: 108,
    padding: 13,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: { color: colors.muted, fontWeight: "800", fontSize: 11 },
  kpiValue: { color: colors.text, fontWeight: "900", fontSize: 20, marginTop: 12 },
  kpiTrend: { fontWeight: "900", fontSize: 11, marginTop: 8 },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardEyebrow: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  cardTitle: { color: colors.text, fontWeight: "900", fontSize: 20, marginBottom: 12 },
  workspaceGrid: { gap: 10 },
  workspaceTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 58,
    padding: 13,
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
  },
  workspaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  workspaceIndex: { fontWeight: "900", fontSize: 12 },
  workspaceText: { flex: 1, color: colors.text, fontWeight: "900", lineHeight: 20 },
  flowLine: { gap: 10 },
  flowStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  flowNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  flowNumberText: { color: colors.muted, fontWeight: "900" },
  flowNumberTextActive: { color: "white" },
  flowText: { color: colors.text, fontWeight: "800" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#EEF3F8",
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { flex: 1, color: colors.text, fontWeight: "800", lineHeight: 19 },
  actionCta: { fontWeight: "900", fontSize: 12 },
  split: { gap: 16, marginTop: 16 },
  panel: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  timelineDot: { width: 10, height: 10, borderRadius: 5 },
  timelineText: { flex: 1, color: colors.muted, fontWeight: "800" },
  aiPanel: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: "#31445C",
  },
  aiBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#0F766E",
    marginBottom: 12,
  },
  aiBadgeText: { color: "#BFFCF1", fontWeight: "900", fontSize: 12 },
  aiTitle: { color: "white", fontWeight: "900", fontSize: 20 },
  aiText: { color: "#D6E4F3", lineHeight: 22, marginTop: 8, fontWeight: "700" },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    marginTop: 8,
  },
  documentText: { color: colors.text, fontWeight: "800" },
});
