import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { sectorList } from "@/config/sectors";
import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { colors } from "@/theme";

export default function SectorPicker() {
  const { sectorKey, setSector } = useSector();
  const { t } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.help}>{t("sectors.help")}</Text>

      {sectorList.map((item) => (
        <Pressable
          key={item.key}
          onPress={async () => {
            await setSector(item.key);
            router.back();
          }}
          style={[
            styles.item,
            sectorKey === item.key && {
              borderColor: item.accent,
              borderWidth: 2,
            },
          ]}
        >
          <View style={[styles.icon, { backgroundColor: `${item.accent}18` }]}>
            <Ionicons name={item.icon as never} size={26} color={item.accent} />
          </View>

          <View style={styles.copy}>
            <Text style={styles.label}>{t(item.labelKey)}</Text>
            <Text style={styles.meta}>
              {item.modules.length} {t("sectors.modulesConfigured")}
            </Text>
          </View>

          {sectorKey === item.key && (
            <Ionicons name="checkmark-circle" size={24} color={item.accent} />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  help: { color: colors.muted, lineHeight: 21, marginBottom: 18 },
  item: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, marginLeft: 14 },
  label: { fontSize: 16, fontWeight: "800", color: colors.text },
  meta: { color: colors.muted, marginTop: 4, fontSize: 12 },
});
