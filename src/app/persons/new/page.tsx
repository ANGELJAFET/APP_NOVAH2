"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PersonForm, PersonFormSubmitPayload } from "@/components/PersonForm";
import { api, ApiError } from "@/lib/api";
import { PersonWithCredentials } from "@/types";

export default function NewPersonPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(payload: PersonFormSubmitPayload) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post<PersonWithCredentials>("/api/persons", payload);
      router.push("/persons");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudo guardar el registro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <h1 className="mb-4 text-xl font-semibold">Nueva persona</h1>
      <PersonForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/persons")}
        submitting={submitting}
        submitError={submitError}
      />
    </main>
  );
}
