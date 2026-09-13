import { apiClient } from "@shared/api/client";
import { getApiErrorMessage } from "@shared/api/errors";

export type OperationKpi = {
  label?: string;
  labelKey?: string;
  value: string;
  change?: string;
  changeKey?: string;
};

export type OperationRow = Record<string, string | number | undefined> & {
  id?: string;
};

export type OperationField = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "datetime-local";
  required?: boolean;
  defaultValue?: string | number;
};

export type OperationCrudConfig = {
  kpisPath: string;
  listPath: string;
  createPath: string;
  updatePath?: (id: string) => string;
  deletePath?: (id: string) => string;
};

function normalizeRow(row: OperationRow): OperationRow {
  return {
    ...row,
    id: row.id ?? String(row.number ?? row.reference ?? row.name ?? row.title ?? crypto.randomUUID()),
  };
}

export function createOperationCrud(config: OperationCrudConfig) {
  return {
    async getKpis(fallback: OperationKpi[]) {
      try {
        const { data } = await apiClient.get<OperationKpi[]>(config.kpisPath);
        return Array.isArray(data) ? data : fallback;
      } catch {
        return fallback;
      }
    },

    async findAll(fallback: OperationRow[]) {
      try {
        const { data } = await apiClient.get<OperationRow[]>(config.listPath);
        return Array.isArray(data) ? data.map(normalizeRow) : fallback;
      } catch {
        return fallback;
      }
    },

    async create(payload: OperationRow) {
      try {
        const { data } = await apiClient.post<OperationRow>(config.createPath, payload);
        return normalizeRow(data);
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
      }
    },

    async update(id: string, payload: OperationRow) {
      if (!config.updatePath) return normalizeRow({ ...payload, id });

      try {
        const { data } = await apiClient.put<OperationRow>(config.updatePath(id), payload);
        return normalizeRow(data);
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
      }
    },

    async remove(id: string) {
      if (!config.deletePath) return;

      try {
        await apiClient.delete(config.deletePath(id));
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
      }
    },
  };
}
