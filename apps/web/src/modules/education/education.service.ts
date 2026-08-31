import { apiClient } from "@shared/api/client";
import { getApiErrorMessage } from "@shared/api/errors";

export type EducationResource =
  | "students"
  | "teachers"
  | "classes"
  | "courses"
  | "schedule"
  | "exams"
  | "attendance"
  | "fees";

export type EducationRecord = Record<string, string | number | boolean | null | undefined>;

const STORAGE_PREFIX = "enterpriseerp-cloud.education";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function storageKey(resource: EducationResource) {
  return `${STORAGE_PREFIX}.${resource}`;
}

function normalizeRecord(record: EducationRecord): EducationRecord {
  return {
    ...record,
    id: String(record.id ?? createLocalId()),
  };
}

function readLocalRecords(resource: EducationResource): EducationRecord[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(storageKey(resource));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeRecord) : [];
  } catch {
    return [];
  }
}

function writeLocalRecords(resource: EducationResource, records: EducationRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(storageKey(resource), JSON.stringify(records.map(normalizeRecord)));
}

export const educationService = {
  async list<T = EducationRecord>(resource: EducationResource): Promise<T[]> {
    try {
      const { data } = await apiClient.get<T[]>(`/education/${resource}`);
      if (Array.isArray(data)) {
        writeLocalRecords(resource, data as EducationRecord[]);
      }
      return data;
    } catch (error) {
      const fallbackRecords = readLocalRecords(resource);
      if (fallbackRecords.length > 0) {
        return fallbackRecords as T[];
      }

      throw new Error(getApiErrorMessage(error, "Unable to load data from the API."));
    }
  },

  async get<T = EducationRecord>(resource: EducationResource, id: string): Promise<T> {
    try {
      const { data } = await apiClient.get<T>(`/education/${resource}/${id}`);
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to load data from the API."));
    }
  },

  async create<T = EducationRecord>(resource: EducationResource, payload: EducationRecord): Promise<T> {
    const localRecord = normalizeRecord(payload);

    try {
      const { data } = await apiClient.post<T>(`/education/${resource}`, localRecord);
      const savedRecord = normalizeRecord(data as EducationRecord);
      const records = readLocalRecords(resource);
      writeLocalRecords(resource, [savedRecord, ...records.filter((record) => record.id !== savedRecord.id)]);
      return data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to save. Check the information.");
      if (message !== "Unable to save. Check the information.") {
        throw new Error(message);
      }

      const records = readLocalRecords(resource);
      writeLocalRecords(resource, [localRecord, ...records]);
      return localRecord as T;
    }
  },

  async update<T = EducationRecord>(resource: EducationResource, id: string, payload: EducationRecord): Promise<T> {
    const records = readLocalRecords(resource);
    const updatedRecord = normalizeRecord({
      ...records.find((record) => record.id === id),
      ...payload,
      id,
    });

    try {
      const { data } = await apiClient.put<T>(`/education/${resource}/${id}`, updatedRecord);
      const savedRecord = normalizeRecord(data as EducationRecord);
      writeLocalRecords(resource, records.map((record) => (record.id === id ? savedRecord : record)));
      return data;
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to save. Check the information.");
      if (message !== "Unable to save. Check the information.") {
        throw new Error(message);
      }

      writeLocalRecords(resource, records.map((record) => (record.id === id ? updatedRecord : record)));
      return updatedRecord as T;
    }
  },

  async remove(resource: EducationResource, id: string): Promise<void> {
    try {
      await apiClient.delete(`/education/${resource}/${id}`);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to save. Check the information.");
      if (message !== "Unable to save. Check the information.") {
        throw new Error(message);
      }
    }

    writeLocalRecords(resource, readLocalRecords(resource).filter((record) => record.id !== id));
  },
};
