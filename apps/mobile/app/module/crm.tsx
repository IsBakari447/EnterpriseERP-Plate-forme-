import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  createClient,
  getClients,
  type Client,
} from "@/services/clients";
import { useLanguage } from "@/context/LanguageContext";
import { colors } from "@/theme";

function ClientCard({ client }: { client: Client }) {
  const { t } = useLanguage();
  const initial = client.name?.charAt(0).toUpperCase() || "?";

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.clientContent}>
        <Text style={styles.clientName}>{client.name}</Text>

        <Text style={styles.clientMeta}>
          {client.email || t("crm.noEmail")}
        </Text>

        <Text style={styles.clientMeta}>
          {client.country || t("crm.noCountry")}
        </Text>
      </View>

      <View style={styles.clientRight}>
        {client.status ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{client.status}</Text>
          </View>
        ) : null}

        {client.revenue !== undefined &&
        client.revenue !== null ? (
          <Text style={styles.revenue}>
            {String(client.revenue)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function CrmScreen() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    status: "Active",
    revenue: "0",
  });

  const loadClients = useCallback(async () => {
    try {
      setError("");
      const result = await getClients();
      setClients(result);
    } catch {
      setError(t("common.error.api"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) =>
      [
        client.name,
        client.email,
        client.country,
        client.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [clients, search]);

  const refresh = () => {
    setRefreshing(true);
    loadClients();
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveClient = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setSaveMessage(t("common.error.requiredFields"));
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");
      await createClient({
        name: form.name.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        status: form.status.trim() || "Active",
        revenue: Number(form.revenue) || 0,
      });
      setForm({ name: "", email: "", country: "", status: "Active", revenue: "0" });
      setShowForm(false);
      setSaveMessage(t("common.saved"));
      await loadClients();
    } catch {
      setSaveMessage(t("common.error.save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: t("crm.title") }} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t("crm.title")}</Text>
          <Text style={styles.subtitle}>
            {clients.length} {t("crm.subtitle")}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowForm((value) => !value)}
          accessibilityLabel={t("crm.add")}
          style={styles.addButton}
        >
          <Ionicons name={showForm ? "close" : "add"} size={24} color="white" />
        </Pressable>
      </View>

      {showForm ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t("crm.add")}</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => updateForm("name", value)}
            placeholder={t("crm.name")}
            placeholderTextColor={colors.muted}
            style={styles.formInput}
          />
          <TextInput
            value={form.email}
            onChangeText={(value) => updateForm("email", value)}
            placeholder={t("login.email")}
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.formInput}
          />
          <View style={styles.formRow}>
            <TextInput
              value={form.country}
              onChangeText={(value) => updateForm("country", value)}
              placeholder={t("crm.country")}
              placeholderTextColor={colors.muted}
              style={[styles.formInput, styles.formHalf]}
            />
            <TextInput
              value={form.revenue}
              onChangeText={(value) => updateForm("revenue", value)}
              placeholder={t("crm.revenue")}
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={[styles.formInput, styles.formHalf]}
            />
          </View>
          <Pressable disabled={saving} onPress={saveClient} style={[styles.saveButton, saving && styles.disabledButton]}>
            <Text style={styles.saveText}>{saving ? t("common.saving") : t("crm.save")}</Text>
          </Pressable>
        </View>
      ) : null}

      {saveMessage ? (
        <Text style={[styles.saveMessage, saveMessage === t("common.saved") ? styles.successMessage : styles.errorMessage]}>
          {saveMessage}
        </Text>
      ) : null}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("crm.search")}
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {t("common.loading")}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={42}
            color={colors.danger}
          />
          <Text style={styles.error}>{error}</Text>

          <Pressable onPress={loadClients} style={styles.retryButton}>
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          keyExtractor={(client) => client.id}
          renderItem={({ item }) => <ClientCard client={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons
                name="people-outline"
                size={48}
                color={colors.muted}
              />
              <Text style={styles.emptyTitle}>
                {t("crm.emptyTitle")}
              </Text>
              <Text style={styles.emptyText}>
                {t("crm.emptyText")}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
  },
  addButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  searchContainer: {
    height: 52,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  formTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
  },
  formHalf: {
    flex: 1,
  },
  formInput: {
    minHeight: 48,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: "#F8FAFC",
  },
  saveButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveText: {
    color: "white",
    fontWeight: "900",
  },
  saveMessage: {
    marginHorizontal: 20,
    marginBottom: 12,
    fontWeight: "900",
  },
  successMessage: {
    color: colors.success,
  },
  errorMessage: {
    color: colors.danger,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.text,
  },
  list: {
    padding: 20,
    paddingTop: 8,
    flexGrow: 1,
  },
  card: {
    marginBottom: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#DBEAFE",
  },
  avatarText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "800",
  },
  clientContent: {
    flex: 1,
    marginLeft: 13,
  },
  clientName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  clientMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  clientRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "800",
  },
  revenue: {
    marginTop: 7,
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    minHeight: 280,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
  },
  error: {
    marginTop: 14,
    color: colors.danger,
    textAlign: "center",
    lineHeight: 21,
  },
  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: "white",
    fontWeight: "800",
  },
  emptyTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 7,
    color: colors.muted,
    textAlign: "center",
  },
});
