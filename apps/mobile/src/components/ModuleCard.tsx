import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { moduleMeta } from "@/config/modules";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiModuleStatus } from "@/services/modules";
import { colors } from "@/theme";
import type { ModuleKey } from "@/types/sector";

export function ModuleCard({
  module,
  accent,
  status,
}: {
  module: ModuleKey;
  accent: string;
  status?: ApiModuleStatus;
}) {
  const meta = moduleMeta[module];
  const { t } = useLanguage();

  return (
    <Pressable
      onPress={() => router.push(meta.route as never)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {status ? (
        <View
          style={[
            styles.badge,
            status === "available" &&
              module === "crm" &&
              styles.available,
            status === "available" &&
              module !== "crm" &&
              styles.beta,
            status === "beta" && styles.beta,
            status === "planned" && styles.planned,
          ]}
        >
          <Text style={styles.badgeText}>
            {status === "available"
              ? module === "crm"
                ? t("common.connected")
                : t("common.toConnect")
              : t(status === "beta" ? "common.beta" : "common.planned")}
          </Text>
        </View>
      ) : null}

      <Ionicons
        name={meta.icon as never}
        size={25}
        color={accent}
      />

      <Text style={styles.text}>{t(meta.labelKey)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",
    minHeight: 118,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    padding: 8,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: "absolute",
    top: 7,
    right: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  available: {
    backgroundColor: "#DCFCE7",
  },
  beta: {
    backgroundColor: "#FEF3C7",
  },
  planned: {
    backgroundColor: "#E5E7EB",
  },
  badgeText: {
    color: colors.text,
    fontSize: 8,
    fontWeight: "800",
  },
  text: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
