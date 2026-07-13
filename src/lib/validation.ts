import { z } from "zod";
import { CREDENTIAL_TYPES } from "./constants";

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\s]+$/;
const NIT_REGEX = /^[A-Za-z0-9-]{1,10}$/;
const PHONE_REGEX = /^[0-9+\-()\s]{1,16}$/;

const nameField = z
  .string()
  .trim()
  .min(1, "El nombre es requerido.")
  .max(60, "Máximo 60 caracteres.")
  .regex(NAME_REGEX, "El nombre solo puede contener letras del alfabeto español.");

const addressField = z.string().trim().min(1, "La dirección es requerida.").max(100, "Máximo 100 caracteres.");

const phoneField = z
  .string()
  .trim()
  .min(1, "El número de teléfono es requerido.")
  .max(16, "Máximo 16 caracteres.")
  .regex(PHONE_REGEX, "El número de teléfono no es válido.");

export function buildPersonSchema(mode: "create" | "edit" | "view") {
  return z.object({
    nit:
      mode === "create"
        ? z
            .string()
            .trim()
            .min(1, "El NIT es requerido.")
            .max(10, "Máximo 10 caracteres.")
            .regex(NIT_REGEX, "El NIT no es válido.")
        : z.string(),
    name: nameField,
    address: addressField,
    phoneNumber: phoneField,
  });
}

export type PersonFormValues = z.infer<ReturnType<typeof buildPersonSchema>>;

export const credentialFormSchema = z.object({
  type: z.enum(CREDENTIAL_TYPES, {
    message: "El tipo de credencial no es válido.",
  }),
  organization: z.string().trim().min(1, "La organización es requerida.").max(60, "Máximo 60 caracteres."),
  acquiredCredential: z.string().trim().min(1, "El título es requerido.").max(100, "Máximo 100 caracteres."),
  year: z
    .number({ message: "El año es requerido." })
    .int("El año debe ser un número entero.")
    .min(1900, "Año inválido.")
    .max(2100, "Año inválido."),
});

export type CredentialFormValues = z.infer<typeof credentialFormSchema>;
