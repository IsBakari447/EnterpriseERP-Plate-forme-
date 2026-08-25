import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KpiCard } from "@/components/KpiCard";
import { ModuleCard } from "@/components/ModuleCard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { locales } from "@/i18n";
import { checkApiHealth } from "@/services/api";
import { getModuleStatuses, type ModuleStatusMap } from "@/services/modules";
import { colors } from "@/theme";
import type { SectorKey } from "@/types/sector";

function normalizeSector(value?: string | null): SectorKey | null {
  if (!value) return null;

  const key = value.toLowerCase();

  if (key === "commerce") return "retail";
  if (key === "sante") return "health";
  if (key === "industrie") return "industry";

  if (
    key === "general" ||
    key === "retail" ||
    key === "restaurant" ||
    key === "health" ||
    key === "education" ||
    key === "transport" ||
    key === "industry" ||
    key === "hotel" ||
    key === "agriculture" ||
    key === "services" ||
    key === "construction"
  ) {
    return key;
  }

  return null;
}

export default function Dashboard() {
  const { authenticated, loading: authLoading, signOut, user } = useAuth();
  const { locale, ready: languageReady, setLocale, t } = useLanguage();
  const { sector, ready: sectorReady, setSector } = useSector();
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatusMap>({});
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.replace("/login");
    }
  }, [authLoading, authenticated]);

  useEffect(() => {
    const userSector = normalizeSector(user?.company?.sector);

    if (userSector) {
      setSector(userSector);
    }
  }, [setSector, user?.company?.sector]);

  useEffect(() => {
    if (!authenticated) return;

    getModuleStatuses()
      .then(setModuleStatuses)
      .catch(() => setModuleStatuses({}));

    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, [authenticated]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  if (authLoading || !sectorReady || !languageReady || !authenticated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const displayName =
    user?.firstName ?? user?.name?.split(" ")[0] ?? user?.email ?? "EnterpriseERP";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>E</Text>
            </View>

            <View>
              <Text style={styles.brand}>EnterpriseERP</Text>
              <Text style={styles.tagline}>{t("app.tagline")}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleSignOut}
            accessibilityLabel={t("common.logout")}
            style={styles.avatar}
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
          </Pressable>
        </View>

        <View style={styles.languageRow}>
          {locales.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setLocale(item.key)}
              style={[
                styles.languagePill,
                locale === item.key && styles.languagePillActive,
              ]}
            >
              <Text
                style={[
                  styles.languageText,
                  locale === item.key && styles.languageTextActive,
                ]}
              >
                {item.key.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.eyebrow}>ENTERPRISEERP CLOUD</Text>
          <Text style={styles.title}>
            {t("dashboard.hello")}, {displayName}
          </Text>
          <Text style={styles.subtitle}>
            {user?.company?.name ?? "EnterpriseERP"} - {t("dashboard.overview")}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/sectors")}
          style={[styles.sector, { backgroundColor: sector.accent }]}
        >
          <View>
            <Text style={styles.sectorHint}>{t("dashboard.activeSector")}</Text>
            <Text style={styles.sectorName}>{t(sector.labelKey)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </Pressable>

        <Text style={styles.section}>{t("dashboard.overview")}</Text>
        <View style={styles.grid}>
          {sector.kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              accent={sector.accent}
            />
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{t("dashboard.priorityActions")}</Text>
          {sector.priorityActions.map((action) => (
            <View key={action} style={styles.actionRow}>
              <Ionicons name="alert-circle-outline" size={18} color={sector.accent} />
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>{t("dashboard.modules")}</Text>
          <Text style={[styles.count, { color: sector.accent }]}>
            {sector.modules.length} {t("dashboard.activeModules")}
          </Text>
        </View>

        <View style={styles.moduleGrid}>
          {sector.modules.map((module) => (
            <ModuleCard
              key={module}
              module={module}
              accent={sector.accent}
              status={moduleStatuses[module]}
            />
          ))}
        </View>

        <View style={styles.split}>
          <View style={styles.panelHalf}>
            <Text style={styles.panelTitle}>{t("dashboard.recentActivity")}</Text>
            {sector.recentActivity.map((event) => (
              <Text key={event} style={styles.timelineItem}>
                {event}
              </Text>
            ))}
          </View>

          <View style={styles.panelHalf}>
            <Text style={styles.panelTitle}>{t("dashboard.apiStatus")}</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: apiOnline ? colors.success : colors.warning },
              ]}
            />
            <Text style={styles.statusText}>
              {apiOnline === null
                ? t("common.loading")
                : apiOnline
                  ? "Operational"
                  : "Offline"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  page: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  brandBlock: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark,
  },
  logoText: { color: "white", fontWeight: "900", fontSize: 18 },
  brand: { color: colors.text, fontWeight: "900", fontSize: 20 },
  tagline: { color: colors.primary, fontWeight: "800", fontSize: 12, marginTop: 2 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  languageRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  languagePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languagePillActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  languageText: { color: colors.text, fontWeight: "800", fontSize: 12 },
  languageTextActive: { color: "white" },
  welcomeCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "900", color: colors.primary },
  title: { fontSize: 27, fontWeight: "900", color: colors.text, marginTop: 6 },
  subtitle: { color: colors.muted, marginTop: 5 },
  sector: {
    padding: 20,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectorHint: { color: "#DBEAFE", fontSize: 12, fontWeight: "700" },
  sectorName: { color: "white", fontWeight: "900", fontSize: 22, marginTop: 4 },
  section: { color: colors.text, fontWeight: "900", fontSize: 18, marginTop: 24, marginBottom: 14 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  count: { fontWeight: "800", marginTop: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  moduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: "3.5%" },
  panel: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  panelTitle: { color: colors.text, fontWeight: "900", fontSize: 16, marginBottom: 12 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 9 },
  actionText: { flex: 1, color: colors.text, fontWeight: "700" },
  split: { flexDirection: "row", gap: 12, marginTop: 18 },
  panelHalf: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 142,
  },
  timelineItem: { color: colors.muted, fontWeight: "700", paddingVertical: 6 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
  statusText: { color: colors.text, fontWeight: "800" },
});
