import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/context/LanguageContext";
import { useSector } from "@/context/SectorContext";
import { createProduct, getProducts, type Product } from "@/services/products";
import { colors } from "@/theme";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("fr-FR")} EUR`;
}

function normalizeStatus(status: string | null | undefined, t: (key: string) => string) {
  const value = String(status ?? "").toLowerCase();

  if (value.includes("available") || value.includes("disponible") || value.includes("tillganglig")) {
    return t("status.available");
  }

  if (value.includes("active") || value.includes("actif") || value.includes("aktiv")) {
    return t("status.active");
  }

  if (value.includes("pending") || value.includes("attente") || value.includes("vantar")) {
    return t("status.pending");
  }

  return status || t("status.available");
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricHint}>{hint}</Text>
    </View>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const quantity = toNumber(product.quantity);
  const value = toNumber(product.value);
  const lowStock = quantity <= 5;

  return (
    <View style={styles.itemCard}>
      <View style={styles.itemIcon}>
        <Ionicons name={lowStock ? "warning-outline" : "cube-outline"} size={22} color={lowStock ? colors.warning : colors.primary} />
      </View>

      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{product.name}</Text>
        <Text style={styles.itemMeta}>{product.sku || t("stock.noSku")}</Text>
        <Text style={styles.itemMeta}>
          {t("stock.quantity")}: {quantity}
        </Text>
      </View>

      <View style={styles.itemRight}>
        <View style={[styles.statusBadge, lowStock ? styles.warningBadge : styles.successBadge]}>
          <Text style={[styles.statusText, lowStock ? styles.warningText : styles.successText]}>
            {lowStock ? t("stock.lowStock") : normalizeStatus(product.status, t)}
          </Text>
        </View>
        <Text style={styles.itemValue}>{formatMoney(value)}</Text>
      </View>
    </View>
  );
}

export default function StockScreen() {
  const { t } = useLanguage();
  const { sector } = useSector();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "0",
    status: "Available",
    value: "0",
  });

  const loadProducts = useCallback(async () => {
    try {
      setError("");
      const result = await getProducts();
      setProducts(result);
    } catch {
      setError(t("stock.apiError"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.sku, product.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [products, search]);

  const metrics = useMemo(() => {
    const totalQuantity = products.reduce((sum, product) => sum + toNumber(product.quantity), 0);
    const stockValue = products.reduce((sum, product) => sum + toNumber(product.value), 0);
    const alerts = products.filter((product) => toNumber(product.quantity) <= 5).length;

    return { totalQuantity, stockValue, alerts };
  }, [products]);

  const refresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveProduct = async () => {
    if (!form.name.trim() || !form.sku.trim()) {
      setSaveMessage(t("common.error.requiredFields"));
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");
      await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        quantity: Number(form.quantity) || 0,
        status: form.status.trim() || "Available",
        value: Number(form.value) || 0,
      });
      setForm({ name: "", sku: "", quantity: "0", status: "Available", value: "0" });
      setShowForm(false);
      setSaveMessage(t("common.saved"));
      await loadProducts();
    } catch {
      setSaveMessage(t("common.error.save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: t("stock.title") }} />

      <ScrollView
        contentContainerStyle={styles.page}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
      >
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: `${sector.accent}18` }]}>
            <Ionicons name="cube-outline" size={28} color={sector.accent} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{t("stock.title")}</Text>
            <Text style={styles.subtitle}>{t("stock.subtitle")}</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label={t("stock.products")} value={String(products.length)} hint={t("common.available")} />
          <MetricCard label={t("stock.totalQuantity")} value={String(metrics.totalQuantity)} hint={t("stock.quantity")} />
          <MetricCard label={t("stock.alerts")} value={String(metrics.alerts)} hint={t("stock.lowStock")} />
          <MetricCard label={t("stock.value")} value={formatMoney(metrics.stockValue)} hint={t("trend.live")} />
        </View>

        {error ? (
          <View style={styles.errorPanel}>
            <Ionicons name="cloud-offline-outline" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadProducts} style={styles.retryButton}>
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("stock.quickActions")}</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: "add-circle-outline", label: t("stock.newProduct"), action: () => setShowForm((value) => !value) },
              { icon: "scan-outline", label: t("stock.scanQr"), action: () => setSaveMessage(t("module.pending.status")) },
              { icon: "cart-outline", label: t("stock.replenish"), action: () => setShowForm(true) },
            ].map((action) => (
              <Pressable key={action.label} onPress={action.action} style={[styles.actionButton, { borderColor: sector.accent }]}>
                <Ionicons name={action.icon as never} size={20} color={sector.accent} />
                <Text style={[styles.actionText, { color: sector.accent }]}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {showForm ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("stock.newProduct")}</Text>
            <TextInput
              value={form.name}
              onChangeText={(value) => updateForm("name", value)}
              placeholder={t("stock.name")}
              placeholderTextColor={colors.muted}
              style={styles.formInput}
            />
            <TextInput
              value={form.sku}
              onChangeText={(value) => updateForm("sku", value)}
              placeholder={t("stock.sku")}
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              style={styles.formInput}
            />
            <View style={styles.formRow}>
              <TextInput
                value={form.quantity}
                onChangeText={(value) => updateForm("quantity", value)}
                placeholder={t("stock.quantity")}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={[styles.formInput, styles.formHalf]}
              />
              <TextInput
                value={form.value}
                onChangeText={(value) => updateForm("value", value)}
                placeholder={t("stock.unitValue")}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={[styles.formInput, styles.formHalf]}
              />
            </View>
            <TextInput
              value={form.status}
              onChangeText={(value) => updateForm("status", value)}
              placeholder={t("stock.status")}
              placeholderTextColor={colors.muted}
              style={styles.formInput}
            />
            <Pressable disabled={saving} onPress={saveProduct} style={[styles.saveButton, saving && styles.disabledButton]}>
              <Text style={styles.saveText}>{saving ? t("common.saving") : t("stock.save")}</Text>
            </Pressable>
          </View>
        ) : null}

        {saveMessage ? (
          <Text style={[styles.saveMessage, saveMessage === t("common.saved") ? styles.successMessage : styles.errorMessage]}>
            {saveMessage}
          </Text>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("stock.tableTitle")}</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("stock.search")}
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.centerText}>{t("common.loading")}</Text>
            </View>
          ) : filteredProducts.length ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <View style={styles.center}>
              <Ionicons name="cube-outline" size={40} color={colors.muted} />
              <Text style={styles.emptyTitle}>{t("stock.emptyTitle")}</Text>
              <Text style={styles.emptyText}>{t("stock.emptyText")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  page: { padding: 20, paddingBottom: 34 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.primaryDark,
  },
  headerIcon: { width: 58, height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1 },
  title: { color: "white", fontSize: 28, fontWeight: "900" },
  subtitle: { color: "#D6E4F3", lineHeight: 21, marginTop: 5 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 },
  metricCard: {
    width: "48%",
    minHeight: 116,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: { color: colors.muted, fontWeight: "700" },
  metricValue: { color: colors.text, fontSize: 25, fontWeight: "900", marginTop: 12 },
  metricHint: { color: colors.primary, fontWeight: "900", marginTop: 8 },
  errorPanel: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorText: { flex: 1, color: colors.danger, fontWeight: "800", lineHeight: 19 },
  retryButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.danger },
  retryText: { color: "white", fontWeight: "900", fontSize: 12 },
  card: {
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: "900", marginBottom: 14 },
  actionGrid: { gap: 10 },
  actionButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#F8FAFC",
  },
  actionText: { fontWeight: "900" },
  formRow: { flexDirection: "row", gap: 10 },
  formHalf: { flex: 1 },
  formInput: {
    minHeight: 50,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: "#F8FAFC",
  },
  saveButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  disabledButton: { opacity: 0.65 },
  saveText: { color: "white", fontWeight: "900" },
  saveMessage: { marginTop: 12, color: colors.text, fontWeight: "900" },
  successMessage: { color: colors.success },
  errorMessage: { color: colors.danger },
  searchBox: {
    height: 50,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    marginBottom: 14,
  },
  searchInput: { flex: 1, marginLeft: 9, color: colors.text },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: 10,
  },
  itemIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9" },
  itemBody: { flex: 1 },
  itemTitle: { color: colors.text, fontWeight: "900", fontSize: 15 },
  itemMeta: { color: colors.muted, marginTop: 3, fontSize: 12 },
  itemRight: { alignItems: "flex-end", maxWidth: 120 },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  successBadge: { backgroundColor: "#DCFCE7" },
  warningBadge: { backgroundColor: "#FEF3C7" },
  statusText: { fontWeight: "900", fontSize: 10 },
  successText: { color: colors.success },
  warningText: { color: "#B45309" },
  itemValue: { color: colors.text, fontWeight: "900", marginTop: 7, fontSize: 12 },
  center: { minHeight: 180, alignItems: "center", justifyContent: "center", padding: 24 },
  centerText: { color: colors.muted, marginTop: 10 },
  emptyTitle: { color: colors.text, fontWeight: "900", marginTop: 12, fontSize: 17 },
  emptyText: { color: colors.muted, textAlign: "center", marginTop: 6, lineHeight: 20 },
});
