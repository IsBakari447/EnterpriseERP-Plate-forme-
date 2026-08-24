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

export const educationService = {
  async list<T = EducationRecord>(resource: EducationResource): Promise<T[]> {
    try {
      const { data } = await apiClient.get<T[]>(`/education/${resource}`);
      return data;
    } catch (error) {
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
    try {
      const { data } = await apiClient.post<T>(`/education/${resource}`, payload);
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
    }
  },

  async update<T = EducationRecord>(resource: EducationResource, id: string, payload: EducationRecord): Promise<T> {
    try {
      const { data } = await apiClient.put<T>(`/education/${resource}/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
    }
  },

  async remove(resource: EducationResource, id: string): Promise<void> {
    try {
      await apiClient.delete(`/education/${resource}/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to save. Check the information."));
    }
  },
};
