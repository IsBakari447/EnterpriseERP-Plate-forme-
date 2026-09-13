import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { colors } from "@/theme";

export default function RegisterDisabledScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/enterpriseerp-icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="shield-checkmark-outline" size={34} color={colors.primary} />
          </View>

          <Text style={styles.title}>{t("mobileProvisioning.title")}</Text>
          <Text style={styles.subtitle}>{t("mobileProvisioning.subtitle")}</Text>

          <View style={styles.steps}>
            <Text style={styles.step}>{t("mobileProvisioning.step.web")}</Text>
            <Text style={styles.step}>{t("mobileProvisioning.step.admin")}</Text>
            <Text style={styles.step}>{t("mobileProvisioning.step.login")}</Text>
          </View>

          <Pressable
            onPress={() => router.replace("/login")}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>{t("mobileProvisioning.backToLogin")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  logoImage: { width: 60, height: 60 },
  card: {
    marginTop: 26,
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    marginBottom: 18,
  },
  title: { color: colors.text, fontSize: 25, fontWeight: "900", lineHeight: 31 },
  subtitle: { color: colors.muted, marginTop: 10, fontSize: 15, lineHeight: 22 },
  steps: { marginTop: 18, gap: 10 },
  step: {
    color: colors.text,
    fontWeight: "800",
    lineHeight: 21,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  button: {
    height: 54,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  buttonPressed: { opacity: 0.82 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
});
