import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export function KpiCard({ label, value, trend, accent }: { label: string; value: string; trend: string; accent: string }) {
  return <View style={[styles.card, { borderTopColor: accent }]}>
    <Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text>
    <Text style={[styles.trend, { color: accent }]}>{trend}</Text>
  </View>;
}
const styles = StyleSheet.create({ card: { width: "48%", minHeight: 124, padding: 16, marginBottom: 12, borderRadius: 18, borderTopWidth: 4, backgroundColor: colors.surface }, label: { color: colors.muted, fontSize: 13 }, value: { color: colors.text, fontWeight: "800", fontSize: 21, marginTop: 12 }, trend: { fontWeight: "700", fontSize: 12, marginTop: 8 } });
