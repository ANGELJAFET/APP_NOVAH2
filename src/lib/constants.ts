import { CredentialType } from "@/types";

export const CREDENTIAL_TYPES = [
  "GED",
  "BACHELORS",
  "MASTERS",
  "PHD",
  "CERTIFICATION",
] as const satisfies readonly CredentialType[];

export const CREDENTIAL_TYPE_LABELS: Record<CredentialType, string> = {
  GED: "Diversificado",
  BACHELORS: "Licenciatura",
  MASTERS: "Maestría",
  PHD: "Doctorado",
  CERTIFICATION: "Certificación",
};
