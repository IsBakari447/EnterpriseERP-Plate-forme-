import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KpiCard } from "@/components/KpiCard";
import { ModuleCard } from "@/components/ModuleCard";
import { normalizeSectorKey } from "@/config/sectors";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";
import { checkApiHealth } from "@/services/api";
import {
  getCompanyEnabledModules,
  getModuleStatuses,
  type ModuleStatusMap,
} from "@/services/modules";
import { colors } from "@/theme";
import type { ModuleKey } from "@/types/sector";

export default function Dashboard() {
  const { authenticated, loading: authLoading, signOut, user } = useAuth();
  const { locale, ready: languageReady, setLocale, t } = useLanguage();
  const { sector, sectorKey, ready: sectorReady, setAccountSector, clearAccountSector } = useSector();
  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatusMap>({});
  const [enabledModules, setEnabledModules] = useState<ModuleKey[] | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.replace("/login");
    }
  }, [authLoading, authenticated]);

  useEffect(() => {
    const userSector = normalizeSectorKey(user?.company?.sector);

    if (userSector && userSector !== sectorKey) {
      void setAccountSector(userSector);
    }
  }, [sectorKey, setAccountSector, user?.company?.sector]);

  useEffect(() => {
    const accountLanguage = user?.company?.language;

    if (
      (accountLanguage === "fr" || accountLanguage === "en" || accountLanguage === "sv") &&
      accountLanguage !== locale
    ) {
      void setLocale(accountLanguage as Locale);
    }
  }, [locale, setLocale, user?.company?.language]);

  useEffect(() => {
    if (!authenticated) return;

    Promise.all([
      getModuleStatuses()
        .then(setModuleStatuses)
        .catch(() => setModuleStatuses({})),
      getCompanyEnabledModules()
        .then(setEnabledModules)
        .catch(() => setEnabledModules(null)),
    ]);

    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, [authenticated]);

  const handleSignOut = async () => {
    await signOut();
    await clearAccountSector();
    router.replace("/login");
  };

  const visibleModules =
    enabledModules && enabledModules.length > 0
      ? sector.modules.filter((module) => enabledModules.includes(module))
      : sector.modules;

  if (authLoading || !sectorReady || !languageReady || !authenticated || !user?.company) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <View style={styles.logo}>
              <Image
                source={require("../assets/enterpriseerp-icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
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
          <Text style={styles.title}>{t("app.heroTitle")}</Text>
          <Text style={styles.subtitle}>{t("app.heroText")}</Text>
          <Text style={styles.companyLine}>
            {t("dashboard.hello")}, {user?.firstName ?? user?.name?.split(" ")[0] ?? user?.email ?? "EnterpriseERP"} -{" "}
            {user?.company?.name ?? "EnterpriseERP"}
          </Text>

          <View style={styles.valueRow}>
            {["app.value.time", "app.value.errors", "app.value.cash", "app.value.automation"].map(
              (key) => (
                <View key={key} style={styles.valuePill}>
                  <Text style={styles.valueText}>{t(key)}</Text>
                </View>
              ),
            )}
          </View>
        </View>

        <View style={[styles.sector, { backgroundColor: sector.accent }]}>
          <View>
            <Text style={styles.sectorHint}>{t("dashboard.activeSector")}</Text>
            <Text style={styles.sectorName}>{t(sector.labelKey)}</Text>
            <Text style={styles.sectorSource}>{t("dashboard.sectorFromAccount")}</Text>
          </View>
          <Ionicons name="lock-closed-outline" size={22} color="white" />
        </View>

        <Text style={styles.section}>{t("dashboard.overview")}</Text>
        <View style={styles.grid}>
          <KpiCard
            label={t("accountProfile.companyName")}
            value={user.company.name ?? "EnterpriseERP"}
            trend={t("dashboard.sectorFromAccount")}
            accent={sector.accent}
          />
          <KpiCard
            label={t("dashboard.activeSector")}
            value={t(sector.labelKey)}
            trend={user.company.country ?? t("accountProfile.companyContext")}
            accent={sector.accent}
          />
          <KpiCard
            label={t("accountProfile.currency")}
            value={user.company.currency ?? "-"}
            trend={user.company.language ?? locale}
            accent={sector.accent}
          />
          <KpiCard
            label={t("dashboard.modules")}
            value={String(visibleModules.length)}
            trend={enabledModules ? t("dashboard.modulesFromAccount") : t("dashboard.modulesFromSector")}
            accent={sector.accent}
          />
        </View>

        <View style={styles.commandCenter}>
          <Text style={styles.commandTitle}>{t("dashboard.commandCenter")}</Text>
          <Text style={styles.commandText}>{t("dashboard.commandCenterText")}</Text>
          <View style={styles.commandModules}>
            {["nav.clients", "nav.stock", "nav.facturation", "nav.assistant", "app.tagline"].map(
              (key) => (
                <Text key={key} style={styles.commandChip}>
                  {t(key)}
                </Text>
              ),
            )}
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>{t("dashboard.modules")}</Text>
          <Text style={[styles.count, { color: sector.accent }]}>
            {visibleModules.length} {t("dashboard.activeModules")}
          </Text>
        </View>

        <View style={styles.moduleGrid}>
          {visibleModules.map((module) => (
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
            <Text style={styles.panelTitle}>{t("accountProfile.companyContext")}</Text>
            <Text style={styles.timelineItem}>{user.company.name ?? "EnterpriseERP"}</Text>
            <Text style={styles.timelineItem}>{t(sector.labelKey)}</Text>
            <Text style={styles.timelineItem}>{user.company.timezone ?? "-"}</Text>
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
                  ? t("common.operational")
                  : t("common.offline")}
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
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  logoImage: { width: 38, height: 38 },
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
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: "#31445C",
    marginBottom: 14,
  },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: "900", color: colors.primary },
  title: { fontSize: 28, fontWeight: "900", color: "white", marginTop: 8, lineHeight: 35 },
  subtitle: { color: "#DDE7F4", marginTop: 8, lineHeight: 22 },
  companyLine: { color: "#AFC0D5", marginTop: 14, fontWeight: "800" },
  valueRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  valuePill: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#24364B",
    borderWidth: 1,
    borderColor: "#38506B",
  },
  valueText: { color: "white", fontWeight: "800", fontSize: 11 },
  sector: {
    padding: 20,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectorHint: { color: "#DBEAFE", fontSize: 12, fontWeight: "700" },
  sectorName: { color: "white", fontWeight: "900", fontSize: 22, marginTop: 4 },
  sectorSource: { color: "#E0F2FE", fontWeight: "800", fontSize: 12, marginTop: 8 },
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
  commandCenter: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 14,
  },
  commandTitle: { color: colors.text, fontWeight: "900", fontSize: 18 },
  commandText: { color: colors.muted, lineHeight: 21, marginTop: 6 },
  commandModules: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  commandChip: {
    backgroundColor: "#ECFDF5",
    color: colors.primaryDark,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontWeight: "900",
    fontSize: 11,
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
