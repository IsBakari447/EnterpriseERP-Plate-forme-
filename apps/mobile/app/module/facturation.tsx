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
import { createInvoice, getInvoices, type Invoice } from "@/services/invoices";
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

  if (value.includes("paid") || value.includes("pay") || value.includes("betald")) {
    return t("status.paid");
  }

  if (value.includes("overdue") || value.includes("retard") || value.includes("forsen")) {
    return t("status.overdue");
  }

  if (value.includes("cancel") || value.includes("annul") || value.includes("avbr")) {
    return t("status.cancelled");
  }

  return status || t("status.pending");
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

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { t } = useLanguage();
  const status = normalizeStatus(invoice.status, t);
  const isPaid = status === t("status.paid");
  const dueLabel = invoice.due ? new Date(invoice.due).toLocaleDateString() : "-";

  return (
    <View style={styles.itemCard}>
      <View style={[styles.itemIcon, isPaid ? styles.paidIcon : styles.pendingIcon]}>
        <Ionicons name={isPaid ? "checkmark-done-outline" : "receipt-outline"} size={22} color={isPaid ? colors.success : colors.warning} />
      </View>

      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{invoice.number}</Text>
        <Text style={styles.itemMeta}>{invoice.customer || t("billing.noCustomer")}</Text>
        <Text style={styles.itemMeta}>
          {t("billing.due")}: {dueLabel}
        </Text>
      </View>

      <View style={styles.itemRight}>
        <Text style={styles.itemValue}>{formatMoney(toNumber(invoice.amount))}</Text>
        <View style={[styles.statusBadge, isPaid ? styles.successBadge : styles.warningBadge]}>
          <Text style={[styles.statusText, isPaid ? styles.successText : styles.warningText]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function FacturationScreen() {
  const { t } = useLanguage();
  const { sector } = useSector();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [form, setForm] = useState({
    number: "",
    customer: "",
    amount: "0",
    due: new Date().toISOString().slice(0, 10),
    status: "Pending",
  });

  const loadInvoices = useCallback(async () => {
    try {
      setError("");
      const result = await getInvoices();
      setInvoices(result);
    } catch {
      setError(t("billing.apiError"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      [invoice.number, invoice.customer, invoice.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [invoices, search]);

  const metrics = useMemo(() => {
    const now = new Date();
    const revenue = invoices.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const toCollect = invoices
      .filter((invoice) => !String(invoice.status ?? "").toLowerCase().includes("paid"))
      .reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const overdue = invoices.filter((invoice) => {
      if (!invoice.due || String(invoice.status ?? "").toLowerCase().includes("paid")) {
        return false;
      }

      return new Date(invoice.due) < now;
    }).length;

    return { revenue, toCollect, overdue };
  }, [invoices]);

  const refresh = () => {
    setRefreshing(true);
    loadInvoices();
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveInvoice = async () => {
    if (!form.number.trim() || !form.customer.trim() || !form.due.trim()) {
      setSaveMessage(t("common.error.requiredFields"));
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");
      await createInvoice({
        number: form.number.trim(),
        customer: form.customer.trim(),
        amount: Number(form.amount) || 0,
        due: form.due.trim(),
        status: form.status.trim() || "Pending",
      });
      setForm({
        number: "",
        customer: "",
        amount: "0",
        due: new Date().toISOString().slice(0, 10),
        status: "Pending",
      });
      setShowForm(false);
      setSaveMessage(t("common.saved"));
      await loadInvoices();
    } catch {
      setSaveMessage(t("common.error.save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: t("billing.title") }} />

      <ScrollView
        contentContainerStyle={styles.page}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
      >
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: `${sector.accent}18` }]}>
            <Ionicons name="receipt-outline" size={28} color={sector.accent} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{t("billing.title")}</Text>
            <Text style={styles.subtitle}>{t("billing.subtitle")}</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label={t("billing.revenue")} value={formatMoney(metrics.revenue)} hint={t("trend.month")} />
          <MetricCard label={t("billing.invoices")} value={String(invoices.length)} hint={t("common.available")} />
          <MetricCard label={t("billing.toCollect")} value={formatMoney(metrics.toCollect)} hint={t("trend.follow")} />
          <MetricCard label={t("billing.overdue")} value={String(metrics.overdue)} hint={t("trend.urgent")} />
        </View>

        {error ? (
          <View style={styles.errorPanel}>
            <Ionicons name="cloud-offline-outline" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadInvoices} style={styles.retryButton}>
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("billing.quickActions")}</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: "add-circle-outline", label: t("billing.createInvoice"), action: () => setShowForm((value) => !value) },
              { icon: "document-attach-outline", label: t("billing.sendPdf"), action: () => setSaveMessage(t("module.pending.status")) },
              { icon: "card-outline", label: t("billing.recordPayment"), action: () => setSaveMessage(t("module.pending.status")) },
              { icon: "notifications-outline", label: t("billing.remind"), action: () => setSaveMessage(t("module.pending.status")) },
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
            <Text style={styles.cardTitle}>{t("billing.newInvoice")}</Text>
            <TextInput
              value={form.number}
              onChangeText={(value) => updateForm("number", value)}
              placeholder={t("billing.number")}
              placeholderTextColor={colors.muted}
              style={styles.formInput}
            />
            <TextInput
              value={form.customer}
              onChangeText={(value) => updateForm("customer", value)}
              placeholder={t("billing.customer")}
              placeholderTextColor={colors.muted}
              style={styles.formInput}
            />
            <View style={styles.formRow}>
              <TextInput
                value={form.amount}
                onChangeText={(value) => updateForm("amount", value)}
                placeholder={t("billing.amount")}
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={[styles.formInput, styles.formHalf]}
              />
              <TextInput
                value={form.due}
                onChangeText={(value) => updateForm("due", value)}
                placeholder={t("billing.due")}
                placeholderTextColor={colors.muted}
                style={[styles.formInput, styles.formHalf]}
              />
            </View>
            <TextInput
              value={form.status}
              onChangeText={(value) => updateForm("status", value)}
              placeholder={t("billing.status")}
              placeholderTextColor={colors.muted}
              style={styles.formInput}
            />
            <Pressable disabled={saving} onPress={saveInvoice} style={[styles.saveButton, saving && styles.disabledButton]}>
              <Text style={styles.saveText}>{saving ? t("common.saving") : t("billing.save")}</Text>
            </Pressable>
          </View>
        ) : null}

        {saveMessage ? (
          <Text style={[styles.saveMessage, saveMessage === t("common.saved") ? styles.successMessage : styles.errorMessage]}>
            {saveMessage}
          </Text>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("billing.tableTitle")}</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("billing.search")}
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.centerText}>{t("common.loading")}</Text>
            </View>
          ) : filteredInvoices.length ? (
            filteredInvoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} />)
          ) : (
            <View style={styles.center}>
              <Ionicons name="receipt-outline" size={40} color={colors.muted} />
              <Text style={styles.emptyTitle}>{t("billing.emptyTitle")}</Text>
              <Text style={styles.emptyText}>{t("billing.emptyText")}</Text>
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
  itemIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  paidIcon: { backgroundColor: "#DCFCE7" },
  pendingIcon: { backgroundColor: "#FEF3C7" },
  itemBody: { flex: 1 },
  itemTitle: { color: colors.text, fontWeight: "900", fontSize: 15 },
  itemMeta: { color: colors.muted, marginTop: 3, fontSize: 12 },
  itemRight: { alignItems: "flex-end", maxWidth: 120 },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, marginTop: 7 },
  successBadge: { backgroundColor: "#DCFCE7" },
  warningBadge: { backgroundColor: "#FEF3C7" },
  statusText: { fontWeight: "900", fontSize: 10 },
  successText: { color: colors.success },
  warningText: { color: "#B45309" },
  itemValue: { color: colors.text, fontWeight: "900", fontSize: 12 },
  center: { minHeight: 180, alignItems: "center", justifyContent: "center", padding: 24 },
  centerText: { color: colors.muted, marginTop: 10 },
  emptyTitle: { color: colors.text, fontWeight: "900", marginTop: 12, fontSize: 17 },
  emptyText: { color: colors.muted, textAlign: "center", marginTop: 6, lineHeight: 20 },
});
