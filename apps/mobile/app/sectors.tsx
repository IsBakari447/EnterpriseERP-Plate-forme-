import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { colors } from "@/theme";

export default function AccountSectorScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { sector } = useSector();

  const company = user?.company;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={[styles.hero, { backgroundColor: sector.accent }]}>
        <View>
          <Text style={styles.eyebrow}>{t("accountProfile.companyContext")}</Text>
          <Text style={styles.title}>{t(sector.labelKey)}</Text>
          <Text style={styles.subtitle}>{t("accountProfile.sectorLocked")}</Text>
        </View>

        <View style={styles.lock}>
          <Ionicons name="lock-closed-outline" size={25} color="white" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("accountProfile.company")}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t("accountProfile.companyName")}</Text>
          <Text style={styles.value}>{company?.name ?? "EnterpriseERP"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t("dashboard.activeSector")}</Text>
          <Text style={styles.value}>{t(sector.labelKey)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t("accountProfile.language")}</Text>
          <Text style={styles.value}>{company?.language ?? "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t("accountProfile.currency")}</Text>
          <Text style={styles.value}>{company?.currency ?? "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t("accountProfile.timezone")}</Text>
          <Text style={styles.value}>{company?.timezone ?? "-"}</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
        <Text style={styles.noticeText}>{t("accountProfile.adminManaged")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  hero: {
    minHeight: 150,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  eyebrow: { color: "#DBEAFE", fontSize: 12, fontWeight: "900", letterSpacing: 1.2 },
  title: { color: "white", fontSize: 30, lineHeight: 36, fontWeight: "900", marginTop: 8 },
  subtitle: { color: "#E0F2FE", fontWeight: "800", lineHeight: 21, marginTop: 10 },
  lock: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: "900", marginBottom: 12 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { color: colors.muted, fontWeight: "800", fontSize: 12 },
  value: { color: colors.text, fontWeight: "900", fontSize: 16, marginTop: 4 },
  notice: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    flexDirection: "row",
    gap: 10,
  },
  noticeText: { flex: 1, color: colors.primaryDark, fontWeight: "800", lineHeight: 21 },
});
