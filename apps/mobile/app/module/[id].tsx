import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { moduleMeta } from "../../src/config/modules";
import type { ModuleKey } from "../../src/types/sector";
import { useLanguage } from "../../src/context/LanguageContext";
import { useSector } from "../../src/context/SectorContext";
import { colors } from "../../src/theme";

export default function GenericModuleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { sector } = useSector();
  const { t } = useLanguage();

  const moduleId: ModuleKey =
    id && id in moduleMeta ? (id as ModuleKey) : "dashboard";

  const module = moduleMeta[moduleId];
  const title = t(module.labelKey);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons
            name={module.icon as keyof typeof Ionicons.glyphMap}
            size={42}
            color={colors.primary}
          />
        </View>

        <Text style={styles.sector}>{t(sector.labelKey)}</Text>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t("module.pending.status")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("module.pending.title")}</Text>

          <Text style={styles.cardText}>
            {t("module.pending.description")}
          </Text>

          <Text style={styles.cardText}>
            {t("module.pending.next")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            {t("module.pending.noFakeData")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 46,
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },
  sector: {
    marginTop: 26,
    color: colors.accent,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF4D6",
  },
  statusDot: {
    width: 8,
    height: 8,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#D98B00",
  },
  statusText: {
    color: "#8A5900",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    marginTop: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },
  cardText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.65,
  },
});
