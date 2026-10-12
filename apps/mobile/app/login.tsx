import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
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

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { locales } from "@/i18n";
import { colors } from "@/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { locale, setLocale, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError(t("login.required"));
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await signIn({
        email: email.trim().toLowerCase(),
        password,
      });

      router.replace("/");
    } catch {
      setError(t("common.error.credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.logo}>
          <Image
            source={require("../assets/enterpriseerp-icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.brand}>EnterpriseERP Cloud</Text>
        <Text style={styles.title}>{t("login.title")}</Text>
        <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

        <View style={styles.languageRow} accessibilityRole="radiogroup">
          {locales.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setLocale(item.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: locale === item.key }}
              accessibilityLabel={item.label}
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

        <View style={styles.form}>
          <Text style={styles.label}>{t("login.email")}</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="nom@entreprise.com"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t("login.email")}
            style={styles.input}
          />

          <Text style={styles.label}>{t("login.password")}</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("login.passwordPlaceholder")}
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel={t("login.password")}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() => setShowPassword((value) => !value)}
              accessibilityLabel={t("login.password")}
              accessibilityRole="button"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityState={{ disabled: submitting, busy: submitting }}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              submitting && styles.buttonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>{t("login.submit")}</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            accessibilityRole="button"
            accessibilityLabel={t("login.mobileAccess")}
            style={styles.accessNotice}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={styles.accessNoticeText}>{t("login.mobileAccess")}</Text>
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingVertical: 28,
  },
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
  brand: {
    marginTop: 18,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  title: {
    marginTop: 28,
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },
  languagePill: {
    minWidth: 48,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  languagePillActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark,
  },
  languageText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  languageTextActive: {
    color: "white",
  },
  form: {
    marginTop: 22,
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: "700",
  },
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
  passwordContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    color: colors.text,
  },
  error: {
    marginTop: 14,
    color: colors.danger,
    fontWeight: "600",
  },
  button: {
    height: 56,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  accessNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    padding: 13,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
  },
  accessNoticeText: {
    flex: 1,
    color: colors.primaryDark,
    fontWeight: "800",
    lineHeight: 19,
  },
});
