export type ClientStatus = "Actif" | "Prospect" | "En attente";

export type Client = {
  name: string;
  email: string;
  country: string;
  status: ClientStatus;
  revenue: string;
};
