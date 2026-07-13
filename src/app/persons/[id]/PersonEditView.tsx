"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { PersonForm, PersonFormSubmitPayload } from "@/components/PersonForm";
import { SuccessModal } from "@/components/SuccessModal";
import { api, ApiError } from "@/lib/api";
import { PersonWithCredentials } from "@/types";

interface PersonEditViewProps {
  id: string;
  readOnly: boolean;
}

function hasChanges(person: PersonWithCredentials, payload: PersonFormSubmitPayload): boolean {
  if (
    payload.name !== person.name ||
    payload.address !== person.address ||
    payload.phoneNumber !== person.phoneNumber ||
    payload.credentials.length !== person.credentials.length
  ) {
    return true;
  }
  return payload.credentials.some((credential, index) => {
    const original = person.credentials[index];
    return (
      credential.type !== original.type ||
      credential.organization !== original.organization ||
      credential.acquiredCredential !== original.acquiredCredential ||
      credential.year !== original.year
    );
  });
}

export function PersonEditView({ id, readOnly }: PersonEditViewProps) {
  const router = useRouter();
  const [person, setPerson] = useState<PersonWithCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<PersonWithCredentials>(`/api/persons/${id}`)
      .then((data) => {
        if (!cancelled) {
          setPerson(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "No se pudo cargar el registro.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(payload: PersonFormSubmitPayload) {
    if (person && !hasChanges(person, payload)) {
      router.push("/persons");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.put<PersonWithCredentials>(`/api/persons/${id}`, payload);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudo actualizar el registro.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="mx-auto w-full max-w-4xl flex-1 p-6">Cargando...</main>;
  }

  if (loadError || !person) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <Alert>{loadError ?? "Registro no encontrado."}</Alert>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <h1 className="mb-4 text-xl font-semibold">{readOnly ? "Ver persona" : "Editar persona"}</h1>
      <PersonForm
        mode={readOnly ? "view" : "edit"}
        initialPerson={person}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/persons")}
        submitting={submitting}
        submitError={submitError}
      />
      <SuccessModal
        open={showSuccess}
        title="Persona actualizada"
        message="Los cambios se guardaron correctamente."
        onClose={() => router.push("/persons")}
      />
    </main>
  );
}
