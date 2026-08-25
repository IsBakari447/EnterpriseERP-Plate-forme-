import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sectorList } from "@/config/sectors";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { RegisterPayload } from "@/services/auth";
import { colors } from "@/theme";
import type { SectorKey } from "@/types/sector";

const apiSectorMap: Record<SectorKey, RegisterPayload["sector"]> = {
  general: "general",
  commerce: "commerce",
  restaurant: "restaurant",
  construction: "construction",
  sante: "sante",
  education: "education",
  transport: "transport",
  industrie: "industrie",
  hotel: "hotel",
};

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { locale, t } = useLanguage();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState<SectorKey>("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!companyName.trim() || !name.trim() || !email.trim() || password.length < 8) {
      setError(t("common.error.requiredLogin"));
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await signUp({
        companyName: companyName.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        sector: apiSectorMap[sector],
        language: locale,
      });

      router.replace("/");
    } catch {
      setError(t("common.error.api"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logo}>
            <Ionicons name="business-outline" size={34} color="white" />
          </View>

          <Text style={styles.brand}>EnterpriseERP Cloud</Text>
          <Text style={styles.title}>{t("register.title")}</Text>
          <Text style={styles.subtitle}>{t("register.subtitle")}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t("register.companyName")}</Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="EnterpriseERP"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>{t("register.fullName")}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Issa Bakari"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>{t("login.email")}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nom@entreprise.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <Text style={styles.label}>{t("login.password")}</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("login.passwordPlaceholder")}
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>{t("dashboard.activeSector")}</Text>
            <View style={styles.sectorGrid}>
              {sectorList.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setSector(item.key)}
                  style={[
                    styles.sectorPill,
                    sector === item.key && {
                      backgroundColor: item.accent,
                      borderColor: item.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sectorText,
                      sector === item.key && styles.sectorTextActive,
                    ]}
                  >
                    {t(item.labelKey)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={handleRegister}
              disabled={submitting}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                submitting && styles.buttonDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{t("register.submit")}</Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.replace("/login")} style={styles.linkButton}>
              <Text style={styles.linkText}>{t("register.haveAccount")}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { padding: 24, paddingBottom: 42 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.primary,
  },
  brand: {
    marginTop: 18,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  title: { marginTop: 28, color: colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { marginTop: 8, color: colors.muted, fontSize: 15, lineHeight: 22 },
  form: { marginTop: 28 },
  label: { marginBottom: 8, color: colors.text, fontWeight: "800" },
  input: {
    height: 54,
    marginBottom: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  sectorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  sectorPill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectorText: { color: colors.text, fontWeight: "800", fontSize: 12 },
  sectorTextActive: { color: "white" },
  error: { marginTop: 10, color: colors.danger, fontWeight: "700" },
  button: {
    height: 56,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "900" },
  linkButton: { alignItems: "center", marginTop: 18 },
  linkText: { color: colors.primary, fontWeight: "800" },
});
