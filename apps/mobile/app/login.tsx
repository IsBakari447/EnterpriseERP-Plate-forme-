import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { colors } from "@/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { t } = useLanguage();

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
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() => setShowPassword((value) => !value)}
              accessibilityLabel={t("login.password")}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleLogin}
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
              <Text style={styles.buttonText}>{t("login.submit")}</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push("/register")} style={styles.linkButton}>
            <Text style={styles.linkText}>{t("login.createAccount")}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
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
  form: {
    marginTop: 30,
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
  linkButton: {
    alignItems: "center",
    marginTop: 18,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "800",
  },
});
