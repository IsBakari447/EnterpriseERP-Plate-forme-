import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SectorProvider } from "@/context/SectorContext";
import { colors } from "@/theme";

function RootNavigator() {
  const { t } = useLanguage();
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const publicRoute = segments[0] === "login" || segments[0] === "register";

  useEffect(() => {
    if (loading) return;

    if (!authenticated && !publicRoute) {
      router.replace("/login");
    } else if (authenticated && publicRoute) {
      router.replace("/");
    }
  }, [authenticated, loading, publicRoute, router]);

  if (loading || (!authenticated && !publicRoute)) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primaryDark,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="sectors"
          options={{ title: t("sectors.title"), presentation: "modal" }}
        />
        <Stack.Screen
          name="module/[id]"
          options={{ title: t("dashboard.modules") }}
        />
      </Stack>
    </>
  );
}

function AppStack() {
  return (
    <AuthProvider>
      <SectorProvider>
        <RootNavigator />
      </SectorProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppStack />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
