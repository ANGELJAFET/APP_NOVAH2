"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildPersonSchema, CredentialFormValues, PersonFormValues } from "@/lib/validation";
import { CredentialInput, PersonWithCredentials } from "@/types";
import { Alert } from "./Alert";
import { CredentialDialog } from "./CredentialDialog";
import { CredentialsGrid, CredentialRow } from "./CredentialsGrid";

export type PersonFormMode = "create" | "edit" | "view";

export interface PersonFormSubmitPayload {
  nit: string;
  name: string;
  address: string;
  phoneNumber: string;
  credentials: CredentialInput[];
}

interface PersonFormProps {
  mode: PersonFormMode;
  initialPerson?: PersonWithCredentials;
  onSubmit: (payload: PersonFormSubmitPayload) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

let keyCounter = 0;
function nextKey(): string {
  keyCounter += 1;
  return `row-${keyCounter}`;
}

interface DialogState {
  open: boolean;
  index: number | null;
  readOnly: boolean;
}

const CLOSED_DIALOG: DialogState = { open: false, index: null, readOnly: false };

export function PersonForm({ mode, initialPerson, onSubmit, onCancel, submitting, submitError }: PersonFormProps) {
  const readOnly = mode === "view";
  const schema = useMemo(() => buildPersonSchema(mode), [mode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nit: initialPerson?.nit ?? "",
      name: initialPerson?.name ?? "",
      address: initialPerson?.address ?? "",
      phoneNumber: initialPerson?.phoneNumber ?? "",
    },
  });

  const [rows, setRows] = useState<CredentialRow[]>(
    () =>
      initialPerson?.credentials.map((credential) => ({
        key: nextKey(),
        id: credential.id,
        type: credential.type,
        organization: credential.organization,
        acquiredCredential: credential.acquiredCredential,
        year: credential.year,
      })) ?? []
  );
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(CLOSED_DIALOG);

  function openNewDialog() {
    setDialogState({ open: true, index: null, readOnly: false });
  }

  function openEditDialog(index: number) {
    setDialogState({ open: true, index, readOnly: false });
  }

  function openViewDialog(index: number) {
    setDialogState({ open: true, index, readOnly: true });
  }

  function closeDialog() {
    setDialogState(CLOSED_DIALOG);
  }

  function handleDialogConfirm(values: CredentialFormValues) {
    setCredentialsError(null);
    setRows((prev) => {
      if (dialogState.index === null) {
        return [...prev, { key: nextKey(), ...values }];
      }
      return prev.map((row, i) => (i === dialogState.index ? { ...row, ...values } : row));
    });
    closeDialog();
  }

  function handleDeleteRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const submitHandler = handleSubmit(async (values) => {
    if (rows.length === 0) {
      setCredentialsError("Debe existir al menos un registro de detalle.");
      return;
    }
    await onSubmit({
      nit: values.nit,
      name: values.name,
      address: values.address,
      phoneNumber: values.phoneNumber,
      credentials: rows.map(({ type, organization, acquiredCredential, year }) => ({
        type,
        organization,
        acquiredCredential,
        year,
      })),
    });
  });

  const dialogInitialValues: CredentialFormValues | undefined =
    dialogState.index !== null
      ? {
          type: rows[dialogState.index].type,
          organization: rows[dialogState.index].organization,
          acquiredCredential: rows[dialogState.index].acquiredCredential,
          year: rows[dialogState.index].year,
        }
      : undefined;

  return (
    <>
      <form onSubmit={submitHandler} className="space-y-6">
        <section className="space-y-4 rounded border border-gray-200 bg-white p-4">
          <h2 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-700">Persona</h2>

          {mode !== "create" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">ID</label>
              <input
                value={initialPerson?.id ?? ""}
                disabled
                className="w-full max-w-xs rounded border border-gray-300 bg-gray-100 px-3 py-2"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">NIT</label>
              <input
                {...register("nit")}
                disabled={mode !== "create"}
                className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              />
              {errors.nit && <p className="text-xs text-red-600">{errors.nit.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre</label>
              <input
                {...register("name")}
                disabled={readOnly}
                className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Dirección</label>
              <input
                {...register("address")}
                disabled={readOnly}
                className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              />
              {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Número de teléfono</label>
              <input
                {...register("phoneNumber")}
                disabled={readOnly}
                className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
              />
              {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <CredentialsGrid
            rows={rows}
            readOnly={readOnly}
            onAdd={openNewDialog}
            onEdit={openEditDialog}
            onView={openViewDialog}
            onDelete={handleDeleteRow}
          />
          {credentialsError && <Alert>{credentialsError}</Alert>}
        </section>

        {submitError && <Alert>{submitError}</Alert>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          {!readOnly && (
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Confirmar"}
            </button>
          )}
        </div>
      </form>

      <CredentialDialog
        open={dialogState.open}
        readOnly={dialogState.readOnly}
        initialValues={dialogInitialValues}
        onConfirm={handleDialogConfirm}
        onClose={closeDialog}
      />
    </>
  );
}
