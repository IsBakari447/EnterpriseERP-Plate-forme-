import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moduleMeta } from "@/config/modules";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { colors } from "@/theme";
import type { ModuleKey } from "@/types/sector";

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: ModuleKey }>();
  const { sector } = useSector();
  const { t } = useLanguage();
  const moduleId = id && id in moduleMeta ? id : "dashboard";
  const module = moduleMeta[moduleId];
  const title = t(module.labelKey);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title }} />

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: `${sector.accent}18` }]}>
            <Ionicons name={module.icon as never} size={34} color={sector.accent} />
          </View>

          <Text style={styles.eyebrow}>{t(sector.labelKey)}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{t("module.readyText")}</Text>
        </View>

        <View style={styles.workflowCard}>
          <Text style={styles.cardTitle}>{t("module.workflow")}</Text>
          {[
            { icon: "create-outline", key: "module.workflow.capture" },
            { icon: "sync-outline", key: "module.workflow.sync" },
            { icon: "sparkles-outline", key: "module.workflow.ai" },
          ].map((item) => (
            <View key={item.key} style={styles.workflowRow}>
              <View style={[styles.workflowIcon, { backgroundColor: `${sector.accent}18` }]}>
                <Ionicons name={item.icon as never} size={19} color={sector.accent} />
              </View>
              <View style={styles.workflowCopy}>
                <Text style={styles.workflowTitle}>{title}</Text>
                <Text style={styles.workflowText}>{t(item.key)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          <View style={styles.tile}>
            <Ionicons name="cloud-done-outline" size={24} color={sector.accent} />
            <Text style={styles.tileTitle}>{t("module.openApi")}</Text>
            <Text style={styles.tileText}>{t("common.available")}</Text>
          </View>

          <View style={styles.tile}>
            <Ionicons name="phone-portrait-outline" size={24} color={sector.accent} />
            <Text style={styles.tileTitle}>{t("module.mobileFirst")}</Text>
            <Text style={styles.tileText}>{t("common.beta")}</Text>
          </View>

          <View style={styles.tile}>
            <Ionicons name="sync-outline" size={24} color={sector.accent} />
            <Text style={styles.tileTitle}>{t("module.offlineReady")}</Text>
            <Text style={styles.tileText}>{t("common.planned")}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("module.actions")}</Text>
          <View style={styles.actionButtons}>
            {[t("common.create"), t("common.see"), t("common.export"), t("common.notify")].map(
              (action) => (
                <View key={action} style={[styles.actionButton, { borderColor: sector.accent }]}>
                  <Text style={[styles.actionButtonText, { color: sector.accent }]}>
                    {action}
                  </Text>
                </View>
              ),
            )}
          </View>
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: { color: colors.text, fontWeight: "900", fontSize: 28, marginTop: 8 },
  subtitle: { color: colors.muted, lineHeight: 22, marginTop: 10 },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workflowCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workflowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workflowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  workflowCopy: { flex: 1 },
  workflowTitle: { color: colors.text, fontWeight: "900" },
  workflowText: { color: colors.muted, marginTop: 3, lineHeight: 18 },
  cardTitle: { color: colors.text, fontWeight: "900", fontSize: 18, marginBottom: 10 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: { color: colors.text, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 },
  tile: {
    width: "31%",
    minHeight: 118,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileTitle: { color: colors.text, fontWeight: "900", marginTop: 12, fontSize: 12 },
  tileText: { color: colors.muted, fontWeight: "700", marginTop: 6, fontSize: 11 },
  actionButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  actionButtonText: { fontWeight: "900", fontSize: 12 },
});
