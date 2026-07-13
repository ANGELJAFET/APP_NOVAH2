"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { credentialFormSchema, CredentialFormValues } from "@/lib/validation";
import { CREDENTIAL_TYPES, CREDENTIAL_TYPE_LABELS } from "@/lib/constants";

interface CredentialDialogProps {
  open: boolean;
  readOnly?: boolean;
  initialValues?: CredentialFormValues;
  onConfirm: (values: CredentialFormValues) => void;
  onClose: () => void;
}

const EMPTY_VALUES: CredentialFormValues = {
  type: "GED",
  organization: "",
  acquiredCredential: "",
  year: new Date().getFullYear(),
};

export function CredentialDialog({ open, readOnly = false, initialValues, onConfirm, onClose }: CredentialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? EMPTY_VALUES);
    }
  }, [open, initialValues, reset]);

  if (!open) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} title="Credencial">
      <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Tipo</label>
            <select
              {...register("type")}
              disabled={readOnly}
              className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            >
              {CREDENTIAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {CREDENTIAL_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-xs text-red-600">{errors.type.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Organización</label>
            <input
              {...register("organization")}
              disabled={readOnly}
              className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            />
            {errors.organization && <p className="text-xs text-red-600">{errors.organization.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Título</label>
            <input
              {...register("acquiredCredential")}
              disabled={readOnly}
              className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            />
            {errors.acquiredCredential && <p className="text-xs text-red-600">{errors.acquiredCredential.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Año</label>
            <input
              type="number"
              {...register("year", { valueAsNumber: true })}
              disabled={readOnly}
              className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
            />
            {errors.year && <p className="text-xs text-red-600">{errors.year.message}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          {!readOnly && (
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Confirmar
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
