import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { colors } from "@/theme";

type Metric = {
  labelKey: string;
  value: string;
  hintKey: string;
};

type ModuleSection = {
  titleKey: string;
  items: string[];
};

type MobileModuleWorkspaceProps = {
  titleKey: string;
  subtitleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  metrics: Metric[];
  sections: ModuleSection[];
  aiKey: string;
};

export function MobileModuleWorkspace({
  titleKey,
  subtitleKey,
  icon,
  metrics,
  sections,
  aiKey,
}: MobileModuleWorkspaceProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { sector } = useSector();
  const title = t(titleKey);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <View style={[styles.iconBox, { backgroundColor: `${sector.accent}18` }]}>
            <Ionicons name={icon} size={36} color={sector.accent} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: sector.accent }]}>{t(sector.labelKey)}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{t(subtitleKey)}</Text>
          </View>
        </View>

        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <View key={metric.labelKey} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{t(metric.labelKey)}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={[styles.metricHint, { color: sector.accent }]}>{t(metric.hintKey)}</Text>
            </View>
          ))}
        </View>

        {sections.map((section) => (
          <View key={section.titleKey} style={styles.card}>
            <Text style={styles.cardTitle}>{t(section.titleKey)}</Text>
            {section.items.map((itemKey) => (
              <View key={itemKey} style={styles.itemRow}>
                <View style={[styles.itemDot, { backgroundColor: sector.accent }]} />
                <Text style={styles.itemText}>{t(itemKey)}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.aiCard}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>IA</Text>
          </View>
          <Text style={styles.aiTitle}>{t("module.aiTitle")}</Text>
          <Text style={styles.aiText}>{t(aiKey)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, marginLeft: 10, color: colors.text, fontSize: 22, fontWeight: "900" },
  page: { padding: 20, paddingBottom: 36 },
  hero: {
    padding: 20,
    borderRadius: 26,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: "#31445C",
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroCopy: { gap: 7 },
  eyebrow: { fontSize: 12, fontWeight: "900", letterSpacing: 1.5, textTransform: "uppercase" },
  title: { color: "white", fontSize: 30, lineHeight: 37, fontWeight: "900" },
  subtitle: { color: "#D6E4F3", fontSize: 15, lineHeight: 22 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 },
  metricCard: {
    width: "31%",
    minHeight: 112,
    padding: 13,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: "900" },
  metricValue: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 13 },
  metricHint: { fontSize: 11, fontWeight: "900", marginTop: 8 },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 23,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: 12 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#EEF3F8",
  },
  itemDot: { width: 9, height: 9, borderRadius: 5, marginRight: 12 },
  itemText: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 21, fontWeight: "800" },
  aiCard: {
    marginTop: 16,
    padding: 19,
    borderRadius: 24,
    backgroundColor: colors.primaryDark,
  },
  aiBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#0F766E",
  },
  aiBadgeText: { color: "#BFFCF1", fontWeight: "900", fontSize: 12 },
  aiTitle: { color: "white", fontSize: 21, fontWeight: "900", marginTop: 14 },
  aiText: { color: "#D6E4F3", marginTop: 9, lineHeight: 22, fontWeight: "700" },
  pressed: { opacity: 0.65 },
});
