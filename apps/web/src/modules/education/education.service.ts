import { apiClient } from "@shared/api/client";

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
    const { data } = await apiClient.get<T[]>(`/education/${resource}`);
    return data;
  },

  async get<T = EducationRecord>(resource: EducationResource, id: string): Promise<T> {
    const { data } = await apiClient.get<T>(`/education/${resource}/${id}`);
    return data;
  },

  async create<T = EducationRecord>(resource: EducationResource, payload: EducationRecord): Promise<T> {
    const { data } = await apiClient.post<T>(`/education/${resource}`, payload);
    return data;
  },

  async update<T = EducationRecord>(resource: EducationResource, id: string, payload: EducationRecord): Promise<T> {
    const { data } = await apiClient.put<T>(`/education/${resource}/${id}`, payload);
    return data;
  },

  async remove(resource: EducationResource, id: string): Promise<void> {
    await apiClient.delete(`/education/${resource}/${id}`);
  },
};
