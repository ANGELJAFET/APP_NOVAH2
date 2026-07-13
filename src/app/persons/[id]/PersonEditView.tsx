"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { PersonForm, PersonFormSubmitPayload } from "@/components/PersonForm";
import { api, ApiError } from "@/lib/api";
import { PersonWithCredentials } from "@/types";

interface PersonEditViewProps {
  id: string;
  readOnly: boolean;
}

export function PersonEditView({ id, readOnly }: PersonEditViewProps) {
  const router = useRouter();
  const [person, setPerson] = useState<PersonWithCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.put<PersonWithCredentials>(`/api/persons/${id}`, payload);
      router.push("/persons");
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
    </main>
  );
}
