import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SectorProvider } from "@/context/SectorContext";
import { colors } from "@/theme";

function AppStack() {
  const { t } = useLanguage();

  return (
    <AuthProvider>
      <SectorProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerTintColor: colors.primaryDark,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="register"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="sectors"
            options={{
              title: t("sectors.title"),
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="module/[id]"
            options={{ title: t("dashboard.modules") }}
          />
        </Stack>
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
